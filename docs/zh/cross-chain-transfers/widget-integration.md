# 技术集成指南：兑换与桥接小部件

本指南为社区开发者提供了技术规范、架构设计以及实现步骤，帮助他们在自定义仪表板中重新创建兑换与桥接小部件。

---

## 1. 架构概述

为避免结构混乱，存款和取款的资产流向被分为两个独立的流程。

### A. 存款流程（EVM 到 Gonka）与地址派生
在存款过程中，代币被锁定在以太坊上，并基于发送方 EVM 公钥派生的 Cosmos 地址在 Gonka 上铸造等值的封装代币。此处可能出现地址派生不匹配的问题：

```mermaid
%%{init: { 'themeVariables': { 'signalColor': 'var(--md-default-fg-color)', 'signalTextColor': 'var(--md-default-fg-color)' } } }%%
sequenceDiagram
    autonumber
    actor User as User (EVM Wallet)
    participant EthBridge as Ethereum Bridge Contract
    participant Orch as Validators / Orchestrator
    participant Gonka as Gonka Chain

    User->>EthBridge: Send ERC-20 (transfer to Bridge Address)
    Note over EthBridge: Tokens Locked in Contract
    EthBridge-->>Orch: Emit Deposit Event
    Note over Orch: Extracts Sender's EVM Public Key
    Note over Orch: Converts Public Key to Cosmos Address (prefix 'gonka')
    Orch->>Gonka: Mint wrapped tokens to Derived Cosmos Address
```

### B. 提现/解包流程（从Gonka到EVM）
在提现过程中，代币在Cosmos端被销毁，轮询验证者的BLS签名，然后在以太坊端申领（铸币）：

```mermaid
%%{init: { 'themeVariables': { 'signalColor': 'var(--md-default-fg-color)', 'signalTextColor': 'var(--md-default-fg-color)' } } }%%
sequenceDiagram
    autonumber
    actor User as User Wallet
    participant Gonka as Gonka Chain
    participant Orch as BLS Orchestrator
    participant EthBridge as Ethereum Bridge Contract

    User->>Gonka: Burn/Wrap tokens (Cosmos Tx)
    Gonka-->>Orch: Emit Burn Event (Request ID)
    Note over Orch: Decodes Base64 Request ID into Hex
    Note over Orch: Validators sign & generate BLS Signature
    
    loop Polling
        User->>Orch: Poll Signature status by Hex Request ID
    end
    Orch-->>User: Return Validator BLS Signature
    
    User->>EthBridge: Submit mintWithSignature(signature)
    Note over EthBridge: Verify Signature & Mint Tokens
    EthBridge-->>User: Tokens Received in EVM Account
```

---

## 2. 存款功能

### A. IBC 存款（Cosmos 到 Gonka）
IBC 存款通过 IBC 将资产直接从 Cosmos 源链（例如 Osmosis、Cosmos Hub、Injective）转移到 Gonka。

1. **启用并连接源链**：向 Keplr 查询源链的凭证。
    ```typescript
    async function connectSourceChain(chainId: string) {
      const walletProvider = (window as any).keplr;
      if (!walletProvider) throw new Error("Cosmos wallet extension not found.");
      
      await walletProvider.enable(chainId);
      const offlineSigner = walletProvider.getOfflineSigner(chainId);
      const accounts = await offlineSigner.getAccounts();
      return { address: accounts[0].address, offlineSigner };
    }
    ```

2. **解决通道路由**：查询 Gonka RPC 通道元数据（`/ibc/core/channel/v1/channels`）以解决对手方路径。
    ```typescript
    async function resolveIbcChannel(nodeUrl: string, targetChainId: string): Promise<string | null> {
      const response = await fetch(`${nodeUrl}/ibc/core/channel/v1/channels`).then(r => r.json());
      const channels = response?.channels || [];

      for (const channel of channels) {
        if (channel.state !== 'STATE_OPEN' || channel.port_id !== 'transfer') continue;

        const clientData = await fetch(
          `${nodeUrl}/ibc/core/channel/v1/channels/${channel.channel_id}/ports/transfer/client_state`
        ).then(r => r.json());
        
        const clientChainId = clientData?.identified_client_state?.client_state?.chain_id || 
                              clientData?.client_state?.chain_id;

        if (clientChainId === targetChainId) {
          return channel.counterparty?.channel_id || null;
        }
      }
      return null;
    }
    ```

3. **执行IBC转账**：从源链发送一个标准的CosmJS `MsgTransfer`。
    ```typescript
    import { SigningStargateClient } from '@cosmjs/stargate';

    async function initiateIbcDeposit(
      sourceChainId: string,
      sourcePort: string,    // e.g., 'transfer'
      sourceChannel: string, // e.g., 'channel-0'
      denom: string,         // e.g., 'uusdt'
      amount: string,        // In base units
      senderSourceAddress: string,
      receiverGonkaAddress: string,
      offlineSigner: any,
      rpcUrl: string
    ) {
      const client = await SigningStargateClient.connectWithSigner(rpcUrl, offlineSigner);
      
      const timeoutTimestamp = (BigInt(Date.now()) + 600_000n) * 1_000_000n; // 10 minutes timeout in nanoseconds

      const response = await client.sendIbcTokens(
        senderSourceAddress,  // Sender on source chain (e.g. Osmosis address)
        receiverGonkaAddress, // Receiver on Gonka chain
        { denom, amount },
        sourcePort,
        sourceChannel,
        undefined, // timeoutHeight
        Number(timeoutTimestamp) / 1_000_000_000, // timeoutTimestamp in seconds
        { amount: [], gas: '200000' } // Fee
      );
      
      return response.transactionHash;
    }
    ```

### B. EVM 桥接存款（EVM 到 Gonka）
EVM 存款涉及在 EVM 源链上锁定 ERC-20 资产，以在 Gonka 上铸造相应的代币。交易流程需要以下步骤：

1. **验证 EVM 地址密钥不匹配**：验证活动的 EVM 地址派生出的 Cosmos 地址与连接的 Keplr 公钥匹配。

    > **警告：EVM 地址密钥不匹配**  
    > 当用户通过标准软件助记词种子短语连接时，其 EVM 钱包（MetaMask）使用币种类型 `60` 派生地址，而其 Cosmos 钱包（Keplr）使用币种类型 `118` 或 `1200` 派生地址。
    > * 由于这些派生路径不同，其 EVM 公钥和 Cosmos 公钥**不**匹配。
    > * 以太坊桥接合约会捕获存款 EVM 地址的公钥，并在由该 EVM 公钥直接派生的 Bech32 地址上铸造 Gonka 代币。
    > * 如果发生由助记词派生的不匹配情况，代币将被铸造到与其活动 Keplr 钱包完全**不同**的 Cosmos 地址上。资金不会永久丢失——用户仍可以从其助记词（币种类型 `60`）派生以太坊私钥，并使用它访问接收方的 Gonka 账户——但这需要手动密钥派生步骤，大多数用户不会预料到这一点。

    **解决方案：密钥验证清单**  
    在允许用户存款之前，请执行以下验证：

    ```typescript
    import { toBech32 } from '@cosmjs/encoding';
    import { ethers } from 'ethers';

    async function verifyAddressMismatch(
      activeEvmAddress: string,
      cosmosChainId: string,
      currentCosmosAddress: string,
      bech32Prefix: string = 'gonka'
    ) {
      // 1. Resolve active wallet provider (Keplr)
      const walletProvider = (window as any).keplr;
      if (!walletProvider) return { isMismatch: false };

      // 2. Fetch key properties from Cosmos wallet
      const key = await walletProvider.getKey(cosmosChainId);
      const pubKeyBytes = key.pubKey;
      if (!pubKeyBytes || pubKeyBytes.length === 0) {
        console.warn("Public key not available from provider.");
        return { isMismatch: false };
      }

      // 3. Derive the REAL Ethereum address from the Cosmos public key (keccak256-based)
      // NOTE: key.ethereumHexAddress is NOT the real EVM address — it is just the Cosmos 
      // address bytes (sha256+ripemd160) represented as hex, which will mismatch.
      const pubKeyHex = '0x' + Array.from(pubKeyBytes, (b) => b.toString(16).padStart(2, '0')).join('');
      const derivedEvmAddress = ethers.computeAddress(pubKeyHex);

      // 4. Compare active EVM address with derived EVM address
      const isMismatch = activeEvmAddress.toLowerCase() !== derivedEvmAddress.toLowerCase();

      if (isMismatch) {
        // 5. Derive where the tokens will land by decoding EVM hex and encoding as Bech32
        const rawHex = activeEvmAddress.startsWith('0x') ? activeEvmAddress.substring(2) : activeEvmAddress;
        const hexBytes = new Uint8Array(
          rawHex.match(/.{1,2}/g)?.map((byte: string) => parseInt(byte, 16)) || []
        );
        const targetCosmosAddress = toBech32(bech32Prefix, hexBytes);

        return {
          isMismatch: true,
          targetCosmosAddress,      // Tokens will mint here
          expectedEvmAddress: derivedEvmAddress // User must switch EVM wallet to this address
        };
      }

      return { isMismatch: false };
    }
    ```

2. **解析桥接合约地址**：从注册表API获取目标代币的已批准桥接合约地址。
    ```typescript
    async function resolveBridgeAddress(nodeUrl: string, chainId: string): Promise<string> {
      const response = await fetch(
        `${nodeUrl}/productscience/inference/inference/bridge_addresses/${chainId}`
      ).then(r => r.json());
      
      const address = response?.bridge_address || response?.address || response?.approved_bridge_address;
      if (!address) {
        throw new Error(`Failed to resolve bridge address for chain: ${chainId}`);
      }
      return address;
    }
    ```

3. **切换EVM网络**：验证并请求切换（`wallet_switchEthereumChain`）到正确的以太坊网络（主网或Sepolia测试网）。
    ```typescript
    async function switchEvmNetwork(ethProvider: any, isTestnet: boolean) {
      const targetChainIdHex = isTestnet ? '0xaa36a7' : '0x1'; // Sepolia or Mainnet
      try {
        await ethProvider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: targetChainIdHex }],
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          throw new Error(`Please add the ${isTestnet ? 'Sepolia' : 'Ethereum'} network to your EVM wallet first.`);
        }
        throw switchError;
      }
    }
    ```

4. **执行ERC-20转账**：生成ERC-20 `transfer(bridgeAddress, amount)` ABI调用负载，并通过EVM提供程序将其发送至ERC-20代币合约地址。

    > **警告：**  
    > 存入ERC-20代币时，切勿直接向桥接合约地址发送原始交易。相反，您必须将**ERC-20代币合约地址**（`to`）作为接收方，并传递代表`transfer(bridgeContractAddress, amount)`函数调用的编码数据负载。

    ```typescript
    // 1. Manually encode the ERC-20 transfer(address to, uint256 value) function call
    // Method selector for transfer(address,uint256) is 0xa9059cbb
    const methodId = '0xa9059cbb';
    const toPadding = bridgeContractAddress.replace(/^0x/i, '').padStart(64, '0');
    const amountHex = amountInBaseUnits.toString(16).padStart(64, '0');
    const data = methodId + toPadding + amountHex;

    // 2. Dispatch transaction targeting the ERC-20 Token Contract address
    // (Resolves either Keplr's injected EVM provider or standard window.ethereum)
    const ethProvider = (window as any).keplr?.ethereum || (window as any).ethereum;
    if (!ethProvider) throw new Error("No EVM provider found.");

    await ethProvider.request({
      method: 'eth_sendTransaction',
      params: [{
        from: activeEvmAddress,
        to: erc20ContractAddress, // Target the ERC-20 contract
        data: data                // Encoded call to transfer tokens to bridgeContractAddress
      }],
    });
    ```

---

## 3. 提现功能

### A. IBC 提现（从 Gonka 到 Cosmos）
IBC 提现将资产直接从 Gonka 转移回 Cosmos 目标链（例如 Osmosis、Cosmos Hub、Injective）

1. **解析本地通道**：查询 Gonka RPC 通道列表元数据（`/ibc/core/channel/v1/channels`）以解析指向目标链的通道。
2. **执行 IBC 转账**：在 Gonka 链上发送标准的 CosmJS `MsgTransfer`。

    ```typescript
    import { SigningStargateClient } from '@cosmjs/stargate';

    async function initiateIbcWithdraw(
      gonkaChainId: string,
      localChannel: string,   // e.g., 'channel-0'
      denom: string,          // e.g., 'ibc/...' or native denom
      amount: string,         // In base units
      senderGonkaAddress: string,
      receiverCosmosAddress: string,
      offlineSigner: any,
      rpcUrl: string
    ) {
      const client = await SigningStargateClient.connectWithSigner(rpcUrl, offlineSigner);
      
      const timeoutTimestamp = (BigInt(Date.now()) + 600_000n) * 1_000_000n; // 10 minutes timeout in nanoseconds

      const response = await client.sendIbcTokens(
        senderGonkaAddress,    // Sender on Gonka chain
        receiverCosmosAddress, // Receiver on destination chain
        { denom, amount },
        'transfer',
        localChannel,
        undefined, // timeoutHeight
        Number(timeoutTimestamp) / 1_000_000_000, // timeoutTimestamp in seconds
        { amount: [], gas: '200000' } // Fee
      );
      
      return response.transactionHash;
    }
    ```

---

### B. EVM 桥提现（多阶段解包）
从 Gonka 提现代币回到以太坊是一个异步过程，包含三个独立步骤，且必须在开始解包交易流程之前完成一个关键的验证检查：

#### 前提条件：桥接纪元同步验证
为确保提现能够成功处理，在启动解包交易流程之前，请确认以太坊桥接合约的纪元与当前 Gonka 链的纪元同步。如果桥接合约落后，您必须提示用户在桥接合约上注册缺失的纪元。

```typescript
import { ethers } from 'ethers';

const BRIDGE_ABI = [
  'function getLatestEpochInfo() view returns (uint64 epochId, uint64 timestamp, bytes groupKey)',
  'function getCurrentState() view returns (uint8)',
  'function isValidEpoch(uint64 epochId) view returns (bool)',
  'function submitGroupKey(uint64 epochId, bytes groupPublicKey, bytes validationSig) external',
];

// 1. Fetch current bridge epoch status
async function checkBridgeEpochStatus(
  bridgeAddress: string,
  chainEpoch: number,
  ethProvider: any
): Promise<{ isSynced: boolean; bridgeEpoch: number }> {
  const provider = new ethers.BrowserProvider(ethProvider);
  const contract = new ethers.Contract(bridgeAddress, BRIDGE_ABI, provider);

  const latestInfo = await contract.getLatestEpochInfo();
  const bridgeEpoch = Number(latestInfo.epochId);

  return {
    bridgeEpoch,
    isSynced: bridgeEpoch >= chainEpoch,
  };
}

// 2. Fetch missing BLS epoch registration data from Orchestrator API
async function fetchEpochBLSData(orchestratorUrl: string, epochId: number) {
  const data = await fetch(`${orchestratorUrl}/bls/epochs/${epochId}`).then(r => r.json());
  
  // Helper to convert base64 to hex
  const base64ToHex = (b64: string) => {
    const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    return '0x' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  };

  return {
    groupPublicKeyHex: base64ToHex(data.group_public_key_uncompressed_256),
    validationSignatureHex: base64ToHex(data.validation_signature_uncompressed_128),
  };
}

// 3. Sequentially register missing epochs on the Ethereum Bridge
async function syncMissingEpochs(
  bridgeAddress: string,
  targetEpochId: number,
  orchestratorUrl: string,
  ethProvider: any
) {
  const provider = new ethers.BrowserProvider(ethProvider);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(bridgeAddress, BRIDGE_ABI, signer);

  // Check if target epoch is already valid
  const isValid = await contract.isValidEpoch(targetEpochId);
  if (isValid) return;

  const latestInfo = await contract.getLatestEpochInfo();
  const latestContractEpoch = Number(latestInfo.epochId);

  // Sequentially submit group keys for each missing epoch
  for (let epoch = latestContractEpoch + 1; epoch <= targetEpochId; epoch++) {
    const epochData = await fetchEpochBLSData(orchestratorUrl, epoch);
    const tx = await contract.submitGroupKey(
      epoch,
      epochData.groupPublicKeyHex,
      epochData.validationSignatureHex
    );
    await tx.wait();
  }
}
```

如果桥接器位于（`chainEpoch > bridgeEpoch`）之后，应提示用户在允许进入第1阶段（燃烧资产）之前触发顺序纪元同步（`syncMissingEpochs`）。

---

#### 第1阶段：在Gonka上燃烧/封装代币
执行一个Cosmos SDK交易以请求桥接解封装。这可以是一个标准的CW-20合约执行消息（燃烧/解封装封装代币），或者是一个自定义的原生桥接解封装交易类型（将原生GNK解封装为WGNK）。

##### **A. 自定义注册表设置**

如果你使用自定义注册表来签名自定义消息类型（如`MsgRequestBridgeMint`），则**必须**同时注册标准的CosmWasm类型（例如包含`/cosmwasm.wasm.v1.MsgExecuteContract`的`wasmTypes`）。否则，在CW-20交易期间将出现“未注册的类型URL”错误。

```typescript
import { Registry } from '@cosmjs/proto-signing';
import { defaultRegistryTypes } from '@cosmjs/stargate';
import { wasmTypes } from '@cosmjs/cosmwasm-stargate';

// Custom bridge burn / unwrap Msg type registration (for native GNK -> WGNK unwrap)
export const MsgRequestBridgeMintType = {
  typeUrl: '/inference.inference.MsgRequestBridgeMint',
  create(message: any) { return message; },
  fromPartial(message: any) { return message; },
  encode(message: any, writer: any) {
    // Requires standard fields: creator, amount, destinationAddress, chainId, destinationBridgeAddress
    return writer;
  },
  decode() { return {}; }
};

const customRegistry = new Registry([
  ...defaultRegistryTypes,
  ...wasmTypes, // Crucial for /cosmwasm.wasm.v1.MsgExecuteContract
  ['/inference.inference.MsgRequestBridgeMint', MsgRequestBridgeMintType as any]
]);
```

##### **B. 消息构造**
根据要解包的资产，构造原生解包消息或CW-20执行消息：

```typescript
// 1. For Native GNK -> WGNK:
const msg = {
  typeUrl: '/inference.inference.MsgRequestBridgeMint',
  value: {
    creator: senderAddress,
    amount: amountInBaseUnits,
    destinationAddress: recipientEthAddress,
    chainId: 'ethereum',
    destinationBridgeAddress: bridgeContractAddress,
  },
};

// 2. For CW-20 Wrapped Tokens (e.g. USDT, USDC):
const withdrawMsg = {
  withdraw: {
    amount: amountInBaseUnits,
    destination_bridge_address: bridgeContractAddress,
    destination_address: recipientEthAddress,
  },
};

const msg = {
  typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
  value: {
    sender: senderAddress,
    contract: cw20ContractAddress,
    msg: new TextEncoder().encode(JSON.stringify(withdrawMsg)),
    funds: [],
  },
};
```

##### **C. 本地交易哈希计算与索引器回退**
在禁用交易索引的Cosmos节点上（`tx_index = "off"`），通过`client.broadcastTx()`广播交易可能会抛出`transaction indexing is disabled`错误，即使交易已成功提交。

为了支持这些节点，需手动签署交易，预先在本地生成交易哈希（对已签名的`TxRaw`字节进行SHA-256运算），并捕获索引器错误：

```typescript
import { toHex } from '@cosmjs/encoding';
import { sha256 } from '@cosmjs/crypto';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';

async function signAndBroadcastWithIndexerFallback(
  client: SigningCosmWasmClient,
  senderAddress: string,
  messages: any[]
): Promise<{ transactionHash: string; hasEvents: boolean }> {
  // Sign manually using customRegistry
  const txRaw = await client.sign(senderAddress, messages, 'auto', '');
  const txBytes = TxRaw.encode(txRaw).finish();
  
  // Pre-calculate Tx Hash (SHA-256)
  const txHash = toHex(sha256(txBytes)).toUpperCase();

  try {
    const result = await client.broadcastTx(txBytes);
    return { transactionHash: result.transactionHash, hasEvents: true };
  } catch (error: any) {
    if (error.message.includes('transaction indexing is disabled')) {
      // The transaction was broadcast successfully, but the node will not return events
      return { transactionHash: txHash, hasEvents: false };
    }
    throw error;
  }
}
```

---

#### 第二阶段：请求ID解析与BLS签名轮询
当Gonka上的燃烧交易完成后，你需要提取`request_id`和`epoch_id`以轮询验证者的签名。

##### **A. 获取请求详情（基于事件与历史回退）**
如果RPC节点启用了交易索引，你可以直接从交易事件中读取`request_id`。否则，你必须查询编排器的状态历史端点来查找该请求。

```typescript
// 1. Event-based Resolution (Indexing Enabled)
function parseUnwrapEvents(txResult: any): { requestId: string; epochId: number } {
  const blsEvent = txResult.events?.find((e: any) => e.type.includes('EventThresholdSigningRequested'));
  if (!blsEvent) throw new Error('BLS signing request event not found.');

  const getAttr = (key: string) => blsEvent.attributes.find((a: any) => a.key === key).value.replace(/^"|"$/g, '');
  return {
    requestId: getAttr('request_id'),
    epochId: parseInt(getAttr('current_epoch_id'), 10),
  };
}

// 2. State History Fallback (Indexing Disabled / tx_index = "off")
// Query the Cosmos node's state history registry: `GET {nodeUrl}/productscience/inference/bls/signing_history?pagination.limit=100&pagination.reverse=true`
// 
// Example Response:
// {
//   "signing_requests": [
//     {
//       "request_id": "9/Pl3Hztt0KrZTMOQvXv87lNSM+SC4wjuUbJbZU3z8Y=",
//       "current_epoch_id": "287",
//       "status": "THRESHOLD_SIGNING_STATUS_COMPLETED",
//       "created_block_height": "4438273",
//       "data": [
//         "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE=",
//         "CsXlVAEeF4b1Bz8kMHvW1ii+NAmDSyqIoH38Wvmzcu4="
//       ]
//     }
//   ]
// }
async function resolveRequestFromHistory(
  nodeUrl: string,
  recipientEthAddress: string,
  amount: string
): Promise<{ requestId: string; epochId: number }> {
  // Convert EVM hex address to Base64 (orchestrator storage format)
  const recipientHex = recipientEthAddress.toLowerCase().replace(/^0x/, '');
  const bytes = new Uint8Array(recipientHex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(recipientHex.substring(i * 2, i * 2 + 2), 16);
  }
  const recipientB64 = btoa(String.fromCharCode(...Array.from(bytes)));

  // Query signing history registry
  const url = `${nodeUrl}/productscience/inference/bls/signing_history?pagination.limit=100&pagination.reverse=true`;
  const res = await fetch(url).then(r => r.json());
  const requests = res.signing_requests || [];

  // Match recipient and amount
  const matches = requests.filter((r: any) => r.data && r.data.some((d: string) => d === recipientB64));
  if (matches.length === 0) throw new Error('Transaction not found in signing history');

  // Sort descending by block height to get the latest
  matches.sort((a: any, b: any) => parseInt(b.created_block_height) - parseInt(a.created_block_height));
  const matched = matches[0];

  // Convert Base64 request_id to hex
  const reqIdBytes = Uint8Array.from(atob(matched.request_id), c => c.charCodeAt(0));
  const reqIdHex = '0x' + Array.from(reqIdBytes).map(b => b.toString(16).padStart(2, '0')).join('');

  return {
    requestId: reqIdHex,
    epochId: parseInt(matched.current_epoch_id, 10),
  };
}
```

##### **B. BLS 签名轮询**
> **重要提示：**  
> **Base64 到十六进制的转换**：  
> 如果您通过事件属性解析了 `request_id`（Base64 编码，例如 `YIDIsA...`），则**必须**将 Base64 字符串直接解码为字节，然后将其表示为**32 字节的十六进制字符串**（例如 `0x6080c8...`）。请**不要**对 Base64 字符串应用 Keccak256 或 SHA-256 等哈希函数。

```typescript
function base64ToHex(base64Str: string): string {
  const binary = atob(base64Str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return '0x' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}
```

轮询BLS签名端点（`{orchestratorUrl}/bls/signatures/{hexRequestId}`），直到验证者生成有效的签名。

**示例响应**：
```json
{
  "signing_request": {
    "request_id": "9/Pl3Hztt0KrZTMOQvXv87lNSM+SC4wjuUbJbZU3z8Y=",
    "current_epoch_id": 287,
    "status": 3
  },
  "uncompressed_signature_128": "AAAAAAAAAAAAAAAAAAAAABii5ArDtPtnmRw87QXJJRLlMohL3+fEWhuVKJqrh..."
}
```

```typescript
// Watch out for backend enum representations (integers vs strings)
// e.g. status 3 or 'THRESHOLD_SIGNING_STATUS_COMPLETED' represents success
const COMPLETED_STATUSES = new Set([3, '3', 'THRESHOLD_SIGNING_STATUS_COMPLETED']);
const FAILED_STATUSES = new Set([4, '4', 'THRESHOLD_SIGNING_STATUS_FAILED']);

async function pollBlsSignature(orchestratorUrl: string, hexRequestId: string): Promise<string> {
  const url = `${orchestratorUrl}/bls/signatures/${hexRequestId.replace(/^0x/, '')}`;
  
  while (true) {
    const data = await fetch(url).then(r => r.json());
    const status = data?.signing_request?.status;
    
    if (COMPLETED_STATUSES.has(status)) {
      const sigBase64 = data?.uncompressed_signature_128;
      if (!sigBase64) {
        throw new Error('Signature completed but uncompressed_signature_128 is missing.');
      }
      
      // Convert 128-byte Base64 signature to Hex format for EVM submission
      const sigBytes = Uint8Array.from(atob(sigBase64), c => c.charCodeAt(0));
      const sigHex = '0x' + Array.from(sigBytes).map(b => b.toString(16).padStart(2, '0')).join('');
      return sigHex;
    }
    
    if (FAILED_STATUSES.has(status)) {
      throw new Error('BLS signature generation failed.');
    }
    
    await new Promise(resolve => setTimeout(resolve, 3000)); // Poll every 3 seconds
  }
}
```

#### 第3阶段：在以太坊合约上铸币
在以太坊桥接合约上调用`mintWithSignature`，提交验证者的签名数据。

```typescript
import { ethers } from 'ethers';

const BRIDGE_ABI = [
  'function withdraw((uint64 epochId, bytes32 requestId, address recipient, address tokenContract, uint256 amount, bytes signature) cmd) external',
  'function mintWithSignature((uint64 epochId, bytes32 requestId, address recipient, uint256 amount, bytes signature) cmd) external',
];

async function mintOnEthereum(
  ethProvider: any,
  bridgeAddress: string,
  mintParams: {
    epochId: number;
    requestId: string; // 32-byte hex string (0x...)
    recipient: string;
    amount: string;
    signature: string; // 128-byte hex signature
    tokenContract?: string; // Required for ERC-20 unwraps
    isNativeGNK?: boolean;
  }
) {
  const provider = new ethers.BrowserProvider(ethProvider);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(bridgeAddress, BRIDGE_ABI, signer);

  let tx;
  if (mintParams.isNativeGNK) {
    const cmd = {
      epochId: mintParams.epochId,
      requestId: mintParams.requestId,
      recipient: mintParams.recipient,
      amount: mintParams.amount,
      signature: mintParams.signature,
    };
    tx = await contract.mintWithSignature(cmd);
  } else {
    const cmd = {
      epochId: mintParams.epochId,
      requestId: mintParams.requestId,
      recipient: mintParams.recipient,
      tokenContract: mintParams.tokenContract,
      amount: mintParams.amount,
      signature: mintParams.signature,
    };
    tx = await contract.withdraw(cmd);
  }

  const receipt = await tx.wait();
  if (!receipt || receipt.status === 0) {
    throw new Error('Transaction reverted on-chain');
  }
  return receipt.hash;
}
```

---

## 4. 弹性恢复系统（恢复/缓存）（推荐 / 可选）

为防止用户在浏览器崩溃、网络断开或标签页关闭时丢失交易状态，强烈建议（尽管可选）实现**弹性缓存模式**：

1. **在广播第一阶段之前立即写入缓存**：
    ```typescript
    const cacheKey = `pending_unwrap_${userCosmosAddress}`;
    localStorage.setItem(cacheKey, JSON.stringify({
      status: 'burning',
      gonkaTxHash: '',
      amount: amountInBaseUnits,
      destinationEthAddress,
      step: 1
    }));
    ```
2. **更新缓存** 当 Gonka TX 正在广播且 `request_id` 被解决时。
3. **挂载时**：检查 `localStorage.getItem(cacheKey)` 是否存在。如果找到，则显示 **"检测到待处理交易"** 卡片，允许用户选择：
    * **恢复交易**：恢复状态并直接跳转到第 2 阶段（轮询 BLS 签名）或第 3 阶段（EVM 铸币）。
    * **丢弃**：清除 `localStorage` 键。

---
## 5. 代币列表解析与元数据收集

为确保流畅的用户体验，该组件会动态查询并解析 Cosmos 和以太坊链上的可用资产及其元数据（符号、小数位数）。

### A. 存款代币列表 (`allDepositTokens`)

存款下拉列表显示用户可桥接到 Gonka 的资产列表。该列表通过合并和解析已批准代币及 WGNK 的元数据构建而成：

* **已批准代币注册表**：从后端注册表中获取可交易/可桥接代币列表：`GET {nodeUrl}/productscience/inference/inference/approved_tokens_for_trade`。
* **动态注入 WGNK**：获取当前桥接合约地址 (`GET {nodeUrl}/productscience/inference/inference/bridge_addresses/ethereum`)。如果解析出的桥接合约地址 (WGNK) 不在已批准代币列表中，则动态添加 `WGNK`（含 9 位小数），以允许用户封装原生 GNK。
* **符号与小数位解析**：
    * **Cosmos (IBC)**：将资产与离线元数据映射匹配，或查询 Cosmos 链的银行元数据：`GET {nodeUrl}/cosmos/bank/v1beta1/denoms_metadata/{denom}`。
    * **Ethereum (Bridge)**：通过原始 `eth_call` 操作查询公共 EVM RPC 节点（`0x95d89b41` 用于 `symbol()`，`0x313ce567` 用于 `decimals()`）。

#### 实现示例
```typescript
// Inject WGNK dynamically if missing from the approved tokens list
const allDepositTokens = computed(() => {
  const list = [...supportedIbcTokens.value, ...supportedEthTokens.value];
  if (resolvedBridgeAddress.value && resolvedBridgeAddress.value.startsWith('0x')) {
    const hasWgnk = list.some(
      t => t.symbol === 'WGNK' || 
      String(t.contractAddress).toLowerCase() === resolvedBridgeAddress.value.toLowerCase()
    );
    if (!hasWgnk) {
      list.push({
        chainId: 'ethereum',
        contractAddress: resolvedBridgeAddress.value,
        symbol: 'WGNK',
        decimals: 9,
        type: 'eth',
      });
    }
  }
  return list;
});

// Direct ERC-20 metadata queries via JSON-RPC eth_call
async function queryEvmRpc(to: string, data: string, rpcUrl: string): Promise<string> {
  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_call',
      params: [{ to, data }, 'latest'],
      id: 1
    })
  }).then(r => r.json());
  return response?.result || '0x';
}

// Parsing ERC-20 Symbol name from hex string
function parseBytes32OrString(hex: string): string {
  if (!hex || hex === '0x') return '';
  const clean = hex.replace(/^0x/i, '');
  if (clean.length < 64) return '';

  const offset = parseInt(clean.substring(0, 64), 16);
  if (offset === 32 && clean.length >= 128) {
    const length = parseInt(clean.substring(64, 128), 16);
    if (length > 0 && length <= 1000) {
      const dataHex = clean.substring(128, 128 + length * 2);
      let str = '';
      for (let i = 0; i < dataHex.length; i += 2) {
        const charCode = parseInt(dataHex.substring(i, i + 2), 16);
        if (charCode >= 32 && charCode <= 126) {
          str += String.fromCharCode(charCode);
        }
      }
      return str.trim();
    }
  }
  return '';
}
```

---

### B. 提现代币列表 (`withdrawableTokens`)

提现下拉框显示用户钱包中可从 Gonka 桥接出去的资产列表。构建此列表需要结合三个子操作，以合并不同的代币来源：

* **Cosmos 封装余额 (CW-20)**：通过 REST API 端点 `GET {nodeUrl}/productscience/inference/inference/wrapped_token_balances/{walletAddress}` 查询用户在 Gonka 链上的 CW-20 封装代币余额。

  **示例响应**：
  ```json
  {
    "balances": [
      {
        "token_info": {
          "chainId": "ethereum",
          "contractAddress": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
          "wrappedContractAddress": "gonka1fa83z7np903k9vh63guy82qthtv373d7vjeq0y7xeqh50rzn8vtssffkre"
        },
        "symbol": "USDC",
        "balance": "15000000",
        "decimals": "6",
        "formatted_balance": "15.0"
      }
    ]
  }
  ```

!!! tip "可选建议：动态合约发现与缓存"
    如果您希望动态发现部署在 Gonka 链上的所有封装代币合约，可以查询部署在封装代币代码 ID `105` 下的所有合约地址：

    `GET {nodeUrl}/cosmwasm/wasm/v1/code/105/contracts`

    **示例响应**：
    ```json
    {
      "contracts": [
        "gonka1fa83z7np903k9vh63guy82qthtv373d7vjeq0y7xeqh50rzn8vtssffkre",
        "gonka15ggwj9un6qrmu4nj5ev6l7kpdcr00td03ff2mmj4cyhl8u8vjd2qnl3hgk"
      ],
      "pagination": { "next_key": null, "total": "0" }
    }
    ```

    要获取每个合约地址的元数据（符号、名称、小数位数），请对以下智能合约查询 `token_info`：

    `GET {nodeUrl}/cosmwasm/wasm/v1/contract/{contractAddress}/smart/eyJ0b2tlbl9pbmZvIjp7fX0=`
    *（其中 `eyJ0b2tlbl9pbmZvIjp7fX0=` 是 `{"token_info":{}}` 的 Base64 编码）***示例响应**：
    ```json
    {
      "data": {
        "name": "USD Coin",
        "symbol": "USDC",
        "decimals": 6,
        "total_supply": "1400000"
      }
    }
    ```

    为了优化小部件性能并避免重复的链上智能查询，我们强烈建议在本地缓存此合约元数据。
* **Cosmos 原生 IBC 余额**：使用 bank 模块 REST API 查询标准 bank 余额：`GET {nodeUrl}/cosmos/bank/v1beta1/balances/{address}`。

  **示例响应**：
  ```json
  {
    "balances": [
      {
        "denom": "ngonka",
        "amount": "1000000000"
      },
      {
        "denom": "ibc/ED07A3391A112B175915CD8FAF43A2153E30D7181A2E45558B93F44C2754781B",
        "amount": "5000000"
      }
    ],
    "pagination": { "next_key": null, "total": "2" }
  }
  ```
* **动态GNK注入**：获取用户原生GNK（质押代币）余额。如果余额存在，则将其动态注入可提取代币列表中（映射为以太坊桥上的解封操作），以便用户可将GNK解封回WGNK。

#### 实现示例
为构建最终的可提取代币列表，需获取余额并将其合并：

```typescript
async function getWrappedTokenBalances(nodeUrl: string, walletAddress: string) {
  const response = await fetch(`${nodeUrl}/productscience/inference/inference/wrapped_token_balances/${walletAddress}`);
  const data = await response.json();
  return data?.balances || [];
}

async function getIbcBalances(nodeUrl: string, walletAddress: string, ibcDenom: string) {
  const balUrl = `${nodeUrl}/cosmos/bank/v1beta1/balances/${walletAddress}/by_denom?denom=${encodeURIComponent(ibcDenom)}`;
  const response = await fetch(balUrl);
  const data = await response.json();
  return data?.balance?.amount || '0';
}

// Combine wrapped balances with native GNK token staking balances for unwrap
const withdrawableTokens = computed(() => {
  const list = [...wrappedTokenBalances.value]; // Contains both native IBC balances & CW20 wrapped balances
  if (walletAddress.value) {
    const gnkBalance = walletStore.balanceOfStakingToken;
    const gnkAmt = parseFloat(gnkBalance.amount || '0') / 1_000_000_000;
    const hasGnk = list.some(t => t.symbol === 'GNK');
    if (!hasGnk && gnkAmt > 0) {
      list.unshift({
        symbol: 'GNK',
        full_denom: gnkBalance.denom,
        formatted_balance: gnkAmt.toString(),
        decimals: 9,
        isNative: false,
        isGnk: true,
        token_info: {
          chainId: 'ethereum',
          contractAddress: '', // mapped dynamically to bridge contract
        }
      });
    }
  }
  return list;
});
```
