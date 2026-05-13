# Move GNK to Ethereum (WGNK)

This guide shows how to move the native Gonka coin (**GNK**) to Ethereum as
**WGNK** (wrapped GNK) via the native Ethereum bridge.

!!! danger "Bridge not yet active"
    The Gonka Ethereum bridge contract is **not yet deployed** on Ethereum
    mainnet. The address shown as `<bridge-contract-address>` below is a
    **placeholder**. The actual address will be published in
    [Release announcements](../release-announcements.md) once the bridge is
    activated.

    **Do not attempt this flow** until the launch is officially announced.

    This guide is published as a preview so the community can review the
    flow ahead of the launch. Commands and parameters are subject to change.

## How it works

A special transaction on the Gonka chain locks GNK on an escrow account and
triggers **BLS signature generation** by the Gonka validator set. The
resulting BLS signature can then be used to send a **mint** command to the
bridge contract on Ethereum, which verifies the signature and mints WGNK to
the target Ethereum address.

## A) Request Mint WGNK on Ethereum

Submit the request from Gonka. This locks GNK on the escrow account and
triggers BLS signature generation:

```bash
./inferenced \
  tx inference request-bridge-mint \
  <amount> \
  "0xYourEthereumAddr" \
  "ethereum" \
  --from <your_key_name> \
  --chain-id gonka-mainnet \
  --gas auto \
  -y \
  --node http://node2.gonka.ai:8000/chain-rpc/
```

Expected output:

```
...
txhash: 12E8ABCA5A35D73042564FDF6D686424F742414EEC172450AB6EDA34BD1F0805
```

Wait a couple of blocks and check the transaction:

```bash
./inferenced query tx 12E8ABCA5A35D73042564FDF6D686424F742414EEC172450AB6EDA34BD1F0805
```

The result contains:

- `"code": 0` — success
- `request_id: "vSTWiN1pvooxcFoDLzePCEq3x/C5NQ+jFMvfcEozCm4="` — the request
  ID for the next step (base64-encoded)

Convert the request ID to hex:

```bash
echo "vSTWiN1pvooxcFoDLzePCEq3x/C5NQ+jFMvfcEozCm4=" | base64 -d | xxd -p -c 256
# bd24d688dd69be8a31705a032f378f084ab7c7f0b9350fa314cbdf704a330a6e
```

!!! note "Gas estimation"
    `--gas auto` may produce an incorrect gas estimate. If the transaction
    fails, rerun with an explicit `--gas` value (for example `--gas 200000`).

## B) Get BLS signature status

Poll the BLS signature endpoint with the hex request ID until the signature
is available:

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

The response includes:

- `current_epoch_id` — epoch of the request
- `request_id` — 32-byte hash used on Gonka
- `uncompressed_signature_128` — the BLS signature you'll submit to the
  bridge contract on Ethereum

## C) Submit mint command on Ethereum

Use the [`mint-wgnk.js`](https://github.com/gonka-ai/gonka/blob/gm/contracts/proposals/ethereum-bridge-contact/mint-wgnk.js)
script to invoke the bridge contract on Ethereum with the BLS signature:

```bash
HARDHAT_NETWORK=mainnet node mint-wgnk.js \
  <bridge-contract-address> \
  <current_epoch_id> \
  <request_id> \
  <0xYourEthereumAddr> \
  <amount> \
  <uncompressed_signature_128>
```

The bridge contract verifies the signature and parameters, then mints WGNK
on Ethereum and assigns ownership to `<0xYourEthereumAddr>`.
