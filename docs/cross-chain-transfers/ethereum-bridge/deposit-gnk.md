!!! warning
    To avoid unintentional loss of tokens, do not use these instructions before the official announcement that the bridge is fully activated.

The dedicated Bridge smart contract, controlled by the Gonka consensus, is active on Ethereum at the address:

```text
0x972a7a92d92796a98801a8818bcf91f1648f2f68
```
---

# Deposit GNK (Gonka → Ethereum)

Lock GNK on Gonka and receive wrapped GNK (**WGNK**) at your Ethereum address.

### A) Request Minting WGNK on Ethereum

Use CLI to submit a bridge minting request:

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
    If `--gas auto` produces an incorrect gas estimation, check the returned status for the required gas limit and explicitly pass it (e.g., `--gas 200000`).

#### Expected Output
```text
...
txhash: 12E8ABCA5A35D73042564FDF6D686424F742414EEC172450AB6EDA34BD1F0805
```

Allow a couple of blocks to be mined, then check the status:

```bash
./inferenced query tx 12E8ABCA5A35D73042564FDF6D686424F742414EEC172450AB6EDA34BD1F0805
```

Verify that `"code": 0` and extract the base64 `request_id`:

```json
"request_id": "vSTWiN1pvooxcFoDLzePCEq3x/C5NQ+jFMvfcEozCm4="
```

Convert the base64 `request_id` to hexadecimal format:

```bash
echo "vSTWiN1pvooxcFoDLzePCEq3x/C5NQ+jFMvfcEozCm4=" | base64 -d | xxd -p -c 256
```
**Example Hex Output:**
```text
bd24d688dd69be8a31705a032f378f084ab7c7f0b9350fa314cbdf704a330a6e
```

### B) Get BLS Signature Status

Query the BLS signature API with your request ID hex:

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

### C) Submit Withdrawal Command on Ethereum

Submit the mint command to the bridge contract on Ethereum using the [mint-wgnk.js](https://github.com/gonka-ai/gonka/blob/gm/contracts/proposals/ethereum-bridge-contact/mint-wgnk.js) script:

```bash
HARDHAT_NETWORK=mainnet node mint-wgnk.js \
  0x972a7a92d92796a98801a8818bcf91f1648f2f68 \
  <current_epoch_id> \
  <request_id> \
  <0xYourEthereumAddr> \
  <amount> \
  <uncompressed_signature_128>
```
