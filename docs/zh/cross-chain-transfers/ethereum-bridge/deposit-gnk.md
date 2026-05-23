!!! warning
    为避免不必要的代币损失，在跨链桥完全激活的官方公告发布之前，请勿使用本指南中的说明。

由 Gonka 共识控制的专用跨链桥智能合约已在以太坊上激活，地址为：

```text
0x972a7a92d92796a98801a8818bcf91f1648f2f68
```
---

# 存入 GNK（Gonka → 以太坊）

在 Gonka 上锁定 GNK，并在你的以太坊地址上收到包装版的 GNK（**WGNK**）。

### A) 请求在以太坊上铸造 WGNK

使用 CLI 提交跨链桥铸造请求：

```bash
./inferenced tx inference request-bridge-mint \
  <amount> \
  "0xYourEthereumAddr" \
  "ethereum" \
  --from <your_key_name> \
  --chain-id gonka-mainnet \
  --gas auto \
  -y \
  --node http://node2.gonka.ai:8000/chain-rpc/
```

!!! tip
    如果 `--gas auto` 的估算不准确，请根据返回状态中所需的 Gas 额度，并在命令中显式传递它（例如：`--gas 200000`）。

#### 预期输出
```text
...
txhash: 12E8ABCA5A35D73042564FDF6D686424F742414EEC172450AB6EDA34BD1F0805
```

等待几个区块生成，然后检查状态：

```bash
./inferenced query tx 12E8ABCA5A35D73042564FDF6D686424F742414EEC172450AB6EDA34BD1F0805
```

确认 `"code": 0` 并提取 Base64 编码的 `request_id`：

```json
"request_id": "vSTWiN1pvooxcFoDLzePCEq3x/C5NQ+jFMvfcEozCm4="
```

将 Base64 编码的 `request_id` 转换为十六进制格式：

```bash
echo "vSTWiN1pvooxcFoDLzePCEq3x/C5NQ+jFMvfcEozCm4=" | base64 -d | xxd -p -c 256
```
**十六进制输出示例：**
```text
bd24d688dd69be8a31705a032f378f084ab7c7f0b9350fa314cbdf704a330a6e
```

### B) 获取 BLS 签名状态

使用您的请求 ID 十六进制值查询 BLS 签名 API：

```bash
curl "https://node2.gonka.ai:8433/v1/bls/signatures/<REQUEST_ID_HEX>" \
  | jq -r '
    {
      uncompressed_signature_128: .uncompressed_signature_128,
      current_epoch_id: .signing_request.current_epoch_id,
      request_id: .signing_request.request_id
    }
  '
```

### C) 在以太坊上提交提取命令

使用 [mint-wgnk.js](https://github.com/gonka-ai/gonka/blob/gm/contracts/proposals/ethereum-bridge-contact/mint-wgnk.js) 脚本向以太坊上的跨链桥合约提交铸造命令：

```bash
HARDHAT_NETWORK=mainnet node mint-wgnk.js \
  0x972a7a92d92796a98801a8818bcf91f1648f2f68 \
  <current_epoch_id> \
  <request_id> \
  <0xYourEthereumAddr> \
  <amount> \
  <uncompressed_signature_128>
```
