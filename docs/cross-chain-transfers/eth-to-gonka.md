# Move ETH to Gonka (WETH)

This guide shows how to move the native Ethereum coin (**ETH**) to Gonka as
**WETH** (wrapped ETH, a CW-20 token on Gonka) via the native Ethereum bridge.

!!! danger "Bridge not yet active"
    The Gonka Ethereum bridge contract is **not yet deployed** on Ethereum
    mainnet. The address shown as `<bridge-contract-address>` below is a
    **placeholder**. The actual address will be published in
    [Release announcements](../release-announcements.md) once the bridge is
    activated.

    **Do not send any funds** to the bridge contract until the launch is
    officially announced. ETH sent before activation will be lost.

    This guide is published as a preview so the community can review the
    flow ahead of the launch. Detailed commands will be added before launch.

## How it works

To move native ETH to Gonka, you transfer ETH to the bridge contract on
Ethereum. The ETH becomes **locked** in that contract. Once the transaction
is recognized by Gonka consensus, the bridge **mints** WETH on the Gonka
chain as a CW-20 token.

After minting, ownership of the wrapped tokens is assigned to the Gonka
address derived from the **same private/public key** that signed the ETH
deposit on Ethereum.

## Same-key addressing

The Gonka and Ethereum addresses used by the bridge are derived from the
same private/public key.

- If you want to use an existing Ethereum address that already holds ETH,
  generate the matching Gonka address from the same private key — that Gonka
  address will receive WETH.
- If instead you want to use an existing Gonka address, generate the
  corresponding Ethereum address from the same private key, fund it with
  ETH, and ensure you have enough additional ETH for gas.

## A) Send ETH to the bridge contract on Ethereum

!!! info "Detailed instructions coming soon"
    Step-by-step commands for the ETH → WETH flow will be published here
    before the bridge launch. In short, ETH is sent to the bridge contract
    on Ethereum, where it is locked; once the deposit is recognized by Gonka
    consensus, WETH (a CW-20 token) is minted on Gonka to the corresponding
    Gonka address.

## B) Check WETH balance on Gonka

WETH is a CW-20 token on Gonka, so once minted it can be queried like any
other wrapped token:

```bash
curl "https://node2.gonka.ai:8433/chain-api/productscience/inference/inference/wrapped_token_balances/{gonkaAddress}"
```

The response lists each wrapped asset owned by the Gonka address, including
its `symbol`, `wrappedContractAddress` (CW-20 address on Gonka), and
`formatted_balance`. See [Wrap ERC-20 tokens (USDT)](wrap-erc20-tokens.md)
for an example response and for transferring CW-20 tokens between Gonka
accounts.

## Withdrawing WETH back to Ethereum

The withdrawal flow (burn WETH on Gonka → BLS signature → release ETH on
Ethereum) follows the same pattern as the
[wrapped USDT withdrawal](wrap-erc20-tokens.md#d-withdraw-wrapped-usdt-back-to-ethereum).
Detailed commands and the matching Hardhat script will be published here
before the bridge launch.
