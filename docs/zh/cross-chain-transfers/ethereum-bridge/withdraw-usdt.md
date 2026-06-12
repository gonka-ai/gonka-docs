!!! warning
    务必先进行小额测试交易。跨链转账是不可逆的，因此在转移大额资金前，请先发送少量金额，并确认其如期到账。

    由 Gonka 共识控制的专用跨链桥智能合约已在以太坊上激活，地址为：

```text
0x972a7a92d92796a98801a8818bcf91f1648f2f68
```

---

# 提现 USDT（Gonka → 以太坊）

!!! note
    提现请求由与**当前纪元的组密钥**关联的 BLS 签名在以太坊上释放，该组密钥大约每天轮换一次。单个纪元的签名可以授权在该纪元内发起的任意数量的提现，因此此步骤通常很快。有关背景信息，请参阅[Gonka → 以太坊的授权机制](overview.md#how-gonka-ethereum-is-authorized-the-daily-group-key)。

### A) 在 Gonka 上发送提现请求

使用 CLI 发起提现交易：

```bash
./inferenced tx wasm execute <gonka1CW20WrappedUSDTAddress> \
  '{"withdraw":{"amount":"<amount>","destination_address":"0xYourEthereumAddr","destination_bridge_address":"0x972a7a92d92796a98801a8818bcf91f1648f2f68"}}' \
  --from <your_key_name> \
  --chain-id gonka-mainnet \
  --gas auto --gas-adjustment 1.5 \
  -y \
  --node http://node1.gonka.ai:8000/chain-rpc/
```

!!! tip
    如果 `--gas auto` 产生的气体估算不正确，请检查返回状态中所需的气体限制，并显式传入该值（例如，`--gas 200000`）。

#### 预期输出

```text
...
txhash: 12E8ABCA5A35D73042564FDF6D686424F742414EEC172450AB6EDA34BD1F0805
```

### B) 获取提款收据和请求 ID

等待几个区块被挖出后，查询交易哈希以获取请求 ID：

```bash
./inferenced query tx 12E8ABCA5A35D73042564FDF6D686424F742414EEC172450AB6EDA34BD1F0805 --node http://node1.gonka.ai:8000/chain-rpc/
```

`"code": 0`
`request_id`

```json
"request_id": "vSTWiN1pvooxcFoDLzePCEq3x/C5NQ+jFMvfcEozCm4="
```

将 base64 字符串 `MDKEEP0` 转换为十六进制格式：

首先，将 base64 字符串解码为字节：
 
  `MDKEEP0` 解码后为字节序列。

使用 Python 或其他工具进行转换：


import base64

Base64 字符串
b64_str = "MDKEEP0"

添加必要的填充（如果缺失）
missing_padding = len(b64_str) % 4
if missing_padding:
    b64_str += '='
 (4
 missing_padding)

解码
decoded_bytes = base64.b64decode(b64_str)

转为十六进制
hex_str = decoded_bytes.hex()

print(hex_str)


运行结果：



30c444e0f0


✅ 所以，base64 `MDKEEP0` 对应的十六进制是：**30c444e0f0**。

```bash
echo "vSTWiN1pvooxcFoDLzePCEq3x/C5NQ+jFMvfcEozCm4=" | base64 -d | xxd -p -c 256
```

**十六进制输出示例：**

```text
bd24d688dd69be8a31705a032f378f084ab7c7f0b9350fa314cbdf704a330a6e
```

### C) 获取 BLS 签名状态

使用你的请求 ID 十六进制值查询 BLS 签名 API：

```bash
curl "https://node2.gonka.ai:8443/v1/bls/signatures/<REQUEST_ID_HEX>" \
  | jq -r ' { uncompressed_signature_128: .uncompressed_signature_128, current_epoch_id: .signing_request.current_epoch_id, request_id: .signing_request.request_id } '
 
```

响应包含：
* `current_epoch_id`：请求的 epoch。
* `request_id`：在 Gonka 上使用的 32 字节哈希。
* `uncompressed_signature_128`：以太坊执行所需的 BLS 签名。

!!! tip "桥接器 epoch 更新"
    在提交以太坊取款交易之前，请确保以太坊桥接合约已同步至 `current_epoch_id`。如果仪表板显示 **A Bridge needs epoch update**，或以太坊执行时出现 `InvalidEpoch` 错误，请按照[桥接器 epoch 更新](bridge-epoch-update.md)进行操作。

### D) 在以太坊上提交取款指令

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
