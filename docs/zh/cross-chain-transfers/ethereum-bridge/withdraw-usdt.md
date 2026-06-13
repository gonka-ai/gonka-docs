!!! warning
    务必先进行小额测试交易。跨链转账是不可逆的，因此在转移大额资金之前，请先发送少量金额，并确认其如期到账。

由 Gonka 共识控制的专用跨链桥智能合约已在以太坊上激活，地址为：

```text
0x972a7a92d92796a98801a8818bcf91f1648f2f68
```
---

# 提取 USDT（Gonka → 以太坊）

!!! note
    提现通过与**当前纪元群组密钥**绑定的 BLS 签名在以太坊上释放，该密钥大约每天刷新一次。一个纪元签名可以授权该纪元内发起的任意数量的提现，因此此步骤通常很快。详见[Gonka → 以太坊的授权方式](overview.md#gonka-以太坊的授权方式每日群组密钥)了解背景。

### A) 在 Gonka 上发送提取请求

使用 CLI 发起提取交易：

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
    如果 `--gas auto` 的估算不准确，请查看返回状态中所需的 Gas 额度，并在命令中显式传递它（例如：`--gas 200000`）。

#### 预期输出
```text
...
txhash: 12E8ABCA5A35D73042564FDF6D686424F742414EEC172450AB6EDA34BD1F0805
```

### B) 获取提取凭证与请求 ID

等待几个区块生成，然后查询交易哈希以获取请求 ID：

```bash
./inferenced query tx 12E8ABCA5A35D73042564FDF6D686424F742414EEC172450AB6EDA34BD1F0805 --node http://node1.gonka.ai:8000/chain-rpc/
```

确保输出中包含 `"code": 0`（表示成功），并提取 Base64 编码的 `request_id`：

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

响应包含以下字段：
* `current_epoch_id`：该请求对应的纪元。
* `request_id`：在 Gonka 上使用的 32 字节哈希。
* `uncompressed_signature_128`：在以太坊上执行提取所需的 BLS 签名。

!!! tip "跨链桥纪元更新"
    在提交以太坊提现交易之前，请确保以太坊跨链桥合约已同步到 `current_epoch_id`。如果仪表板显示 **A Bridge needs epoch update** 或以太坊执行失败并出现 `InvalidEpoch` 错误，请按照[跨链桥纪元更新](bridge-epoch-update.md)操作。

### D) 在以太坊上提交提取命令

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
