!!! warning
    Always start with a small test transaction. Bridge transfers are irreversible, so before moving large amounts, send a small amount first and confirm it arrives as expected.

The dedicated Bridge smart contract, controlled by the Gonka consensus, is active on Ethereum at the address:

```text
0x972a7a92d92796a98801a8818bcf91f1648f2f68
```
---

# Withdraw USDT (Gonka → Ethereum)

!!! note
    Withdrawals are released on Ethereum by a BLS signature tied to the **current epoch's group key**, which is refreshed about once per day. A single epoch signature can authorize any number of withdrawals started in that epoch, so this step is normally fast. See [How Gonka → Ethereum is authorized](overview.md#how-gonka-ethereum-is-authorized-the-daily-group-key) for the background.

### A) Send Withdrawal Request on Gonka

Initiate the withdrawal transaction using CLI:

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
    If `--gas auto` produces an incorrect gas estimation, check the returned status for the required gas limit and explicitly pass it (e.g., `--gas 200000`).

#### Expected Output
```text
...
txhash: 12E8ABCA5A35D73042564FDF6D686424F742414EEC172450AB6EDA34BD1F0805
```

### B) Retrieve Withdrawal Receipt & Request ID

Allow a couple of blocks to be mined, then query the transaction hash to obtain the request ID:

```bash
./inferenced query tx 12E8ABCA5A35D73042564FDF6D686424F742414EEC172450AB6EDA34BD1F0805 --node http://node1.gonka.ai:8000/chain-rpc/
```

Ensure the output contains `"code": 0` (indicating success) and extract the base64-encoded `request_id`:

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

### C) Get BLS Signature Status

Query the BLS signature API with your request ID hex:

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

The response includes:
* `current_epoch_id`: The epoch of the request.
* `request_id`: The 32-byte hash used on Gonka.
* `uncompressed_signature_128`: The BLS signature needed for Ethereum execution.

### D) Submit Withdrawal Command on Ethereum

Use the [withdraw-tokens.js](https://github.com/gonka-ai/gonka/blob/gm/contracts/proposals/ethereum-bridge-contact/withdraw-tokens.js) script:

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
