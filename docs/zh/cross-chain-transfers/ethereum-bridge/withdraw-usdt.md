!!! warning "桥暂时不可用"
    遵循一起正在调查的事件，Gonka–Ethereum 桥已被暂停。在进一步通知前，请勿使用该桥。请关注官方公告获取更新。

!!! warning 
    始终先进行小额测试交易。桥接转账不可逆，因此在转移大额资金前，请先发送小额资金并确认其正常到账。

    由 Gonka 共识控制的专用桥接智能合约已部署在以太坊的地址：

```text
0x972a7a92d92796a98801a8818bcf91f1648f2f68
```
---

# 提现 USDT（Gonka → Ethereum）

!!! note 
    提现通过与 **当前纪元的群组密钥** 关联的 BLS 签名在以太坊上释放，该密钥大约每天刷新一次。单个纪元签名可授权该纪元内发起的任意数量的提现，因此此步骤通常很快。有关背景信息，请参阅 [Gonka → Ethereum 的授权机制](overview.md#how-gonka-ethereum-is-authorized-the-daily-group-key)。

### A) 在 Gonka 上发送提现请求

使用 CLI 启动提现交易：

```bash
./inferenced tx wasm execute <gonka1CW20WrappedUSDTAddress> \
  '{"withdraw":{"amount":"<amount>","destination_address":"0xYourEthereumAddr","destination_bridge_address":"0x972a7a92d92796a98801a8818bcf91f1648f2f68"}}' \
  --from <your_key_name> \
  --chain-id gonka-mainnet \
  --gas auto --gas-adjustment 2.0 \
  -y \
  --node http://node1.gonka.ai:8000/chain-rpc/
```

!!! tip 
    如果 `--gas auto` 估算的汽油费不正确，请检查返回的状态以获取所需的汽油限额，并显式传入该值（例如，`--gas 200000`）。

#### 预期输出
```text
...
txhash: 12E8ABCA5A35D73042564FDF6D686424F742414EEC172450AB6EDA34BD1F0805
```

### B) 检索提现收据与请求 ID

等待几个区块被挖出，然后查询交易哈希以获取请求 ID：

```bash
./inferenced query tx 12E8ABCA5A35D73042564FDF6D686424F742414EEC172450AB6EDA34BD1F0805 --node http://node1.gonka.ai:8000/chain-rpc/
```

确保输出包含 `"code": 0`（表示成功），并提取 Base64 编码的 `request_id`：

```json
"request_id": "vSTWiN1pvooxcFoDLzePCEq3x/C5NQ+jFMvfcEozCm4="
```

将 Base64 的 `request_id` 转换为十六进制格式：

```bash
echo "vSTWiN1pvooxcFoDLzePCEq3x/C5NQ+jFMvfcEozCm4=" | base64 -d | xxd -p -c 256
```
**示例十六进制输出：**
```text
bd24d688dd69be8a31705a032f378f084ab7c7f0b9350fa314cbdf704a330a6e
```

### C) 获取 BLS 签名状态

使用您的请求 ID 十六进制值查询 BLS 签名 API：

```bash
curl "https://node2.gonka.ai:8443/v1/bls/signatures/<REQUEST_ID_HEX>" \
  | jq -r '
    {
      uncompressed_signature_128: .uncompressed_signature_128,
      current_epoch_id: .signing_request.current_epoch_id,
      request_id: .signing_request.request_id
    }
  '
```

响应包括：
* `current_epoch_id`：请求所属的纪元。
* `request_id`：Gonka 上使用的 32 字节哈希。
* `uncompressed_signature_128`：以太坊执行所需的 BLS 签名。

!!! tip "桥纪元更新"
    在提交以太坊提现交易前，请确保以太坊桥接合约已同步至 `current_epoch_id`。如果仪表板显示 **桥需要纪元更新** 或以太坊执行失败并提示 `InvalidEpoch`，请参阅 [桥纪元更新](bridge-epoch-update.md)。

### D) 在以太坊上提交提现命令

使用 [withdraw-tokens.js](https://github.com/gonka-ai/gonka/blob/gm/contracts/proposals/ethereum-bridge-contact/withdraw-tokens.js) 脚本：

```bash
HARDHAT_NETWORK=mainnet node withdraw-tokens.js \
  0x972a7a92d92796a98801a8818bcf91f1648f2f68 \
  <current_epoch_id> \
  <request_id_base64> \
  <destination_address> \
  0xdAC17F958D2ee523a2206206994597C13D831ec7 \
  <amount> \
  <uncompressed_signature_128>
```
