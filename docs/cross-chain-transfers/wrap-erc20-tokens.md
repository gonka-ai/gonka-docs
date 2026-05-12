# Wrap ERC-20 tokens (USDT)

This guide shows how to wrap an ERC-20 token (USDT in the example) from
Ethereum to Gonka via the native Ethereum bridge, transfer the wrapped CW-20
token on Gonka, and withdraw it back to Ethereum.

!!! danger "Bridge not yet active"
    The Gonka Ethereum bridge contract is **not yet deployed** on Ethereum
    mainnet. The address shown as `<bridge-contract-address>` below is a
    **placeholder**. The actual address will be published in
    [Release announcements](../release-announcements.md) once the bridge is
    activated.

    **Do not send any funds** to the bridge contract until the launch is
    officially announced. Funds sent before activation will be lost.

    This guide is published as a preview so the community can review the
    flow ahead of the launch. Commands and parameters are subject to change.

!!! warning "IBC USDT is a different asset"
    «IBC USDT» (the USDT held in the Gonka community pool, paid for some
    proposals) is **not** the same as the wrapped CW-20 USDT produced by this
    bridge. They have different denominations and different redemption routes.
    To move IBC USDT, use [Withdraw IBC USDT via Kava](ibc-usdt-withdrawal.md)
    instead.

## Same-key addressing

The Gonka and Ethereum addresses used by the bridge are derived from the
**same private/public key**.

- If you want to use an existing Ethereum address that already holds USDT,
  generate the matching Gonka address from the same private key — that Gonka
  address will receive the wrapped token.
- If instead you want to use an existing Gonka address, generate the
  corresponding Ethereum address from the same private key, acquire USDT on
  it, and ensure you have enough ETH for gas.

## A) Send USDT to the bridge contract on Ethereum

Transfer USDT from your Ethereum address to the bridge contract. Any standard
ERC-20 `transfer` call works; the example below uses ethers.js:

```javascript
const tx = await usdtContract.transfer(
  "<bridge-contract-address>",   // bridge address (placeholder)
  amountBN                       // BigNumber amount
);
await tx.wait();
```

Once the transaction is confirmed on Ethereum and recognized by Gonka
consensus, the bridge mints wrapped CW-20 USDT on Gonka. Ownership is
assigned to the Gonka address derived from the same key as the sending
Ethereum address.

## B) Check wrapped token balance on Gonka

Query the wrapped tokens owned by a Gonka address via the API:

```bash
curl "https://node2.gonka.ai:8433/chain-api/productscience/inference/inference/wrapped_token_balances/{gonkaAddress}"
```

Example response:

```json
{
  "balances": [
    {
      "token_info": {
        "chainId": "ethereum",
        "contractAddress": "0xUSDTContractAddress",
        "wrappedContractAddress": "gonka1CW20WrappedUSDTAddress"
      },
      "symbol": "USDT",
      "balance": "100000",
      "decimals": "6",
      "formatted_balance": "0.1"
    }
  ]
}
```

The `wrappedContractAddress` is the CW-20 address of the wrapped USDT on
Gonka. You'll use it in the next steps.

## C) Transfer wrapped USDT on Gonka

Use the wrapped CW-20 address returned above to transfer to any Gonka
account:

```bash
export WUSDT_CONTRACT="gonka1CW20WrappedUSDTAddress"

./inferenced tx wasm execute $WUSDT_CONTRACT \
  '{"transfer":{"recipient":"gonka1xxxxxxxx...","amount":"123456"}}' \
  --from <your_key_name> --chain-id gonka-mainnet --gas auto
```

Example output:

```
...
txhash: 39E3D4B86CF6B0C8952C789F4D73DB9FE27DEA4BD25F3842BE9298C78980A51D
```

Wait 2-3 blocks, then check the transaction status:

```bash
./inferenced query tx 39E3D4B86CF6B0C8952C789F4D73DB9FE27DEA4BD25F3842BE9298C78980A51D
```

`"code": 0` means the transfer was successful.

!!! note "Gas estimation"
    `--gas auto` may produce an incorrect gas estimate. If the transaction
    fails for that reason, the transaction status will show the required gas
    amount; rerun the command with an explicit `--gas` value (for example
    `--gas 200000`).

## D) Withdraw wrapped USDT back to Ethereum

Submit a withdrawal request on Gonka, which burns the wrapped USDT and
triggers BLS signature generation:

```bash
./inferenced tx wasm execute <gonka1CW20WrappedUSDTAddress> \
  '{"withdraw":{"amount":"<amount>","destination_address":"0xYourEthereumAddr"}}' \
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

Convert the request ID to hex (you'll need it for the BLS lookup and the
Ethereum withdrawal command):

```bash
echo "vSTWiN1pvooxcFoDLzePCEq3x/C5NQ+jFMvfcEozCm4=" | base64 -d | xxd -p -c 256
# bd24d688dd69be8a31705a032f378f084ab7c7f0b9350fa314cbdf704a330a6e
```

!!! note "Gas estimation"
    `--gas auto` may produce an incorrect gas estimate. If the transaction
    fails, rerun with an explicit `--gas` value (for example `--gas 200000`).

## E) Get BLS signature status

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

## F) Submit withdrawal command on Ethereum

Use the [`withdraw-tokens.js`](https://github.com/gonka-ai/gonka/blob/gm/contracts/proposals/ethereum-bridge-contact/withdraw-tokens.js)
script to invoke the bridge contract on Ethereum with the BLS signature:

```bash
HARDHAT_NETWORK=mainnet node withdraw-tokens.js \
  <bridge-contract-address> \
  <current_epoch_id> \
  <request_id> \
  <destination_address> \
  <USDT_contract_address> \
  <amount> \
  <uncompressed_signature_128>
```

The bridge contract verifies the signature and parameters, then releases the
original USDT to `<destination_address>` on Ethereum.
