# Cross-Chain Transfers

Gonka supports moving assets between Gonka and other chains through two
independent mechanisms.

## Mechanism status

| Mechanism | What it covers | Status |
|---|---|---|
| **Ethereum bridge** (native, BLS-signed) | ERC-20 tokens (e.g. USDT), GNK, ETH | 🚧 **Preview — not yet active.** The bridge smart contract is **not yet deployed** on Ethereum mainnet. Do **not** send funds before the official launch announcement. |
| **IBC transfers** (Cosmos IBC) | IBC USDT held on Gonka (e.g. from community pool or proposal payments) | ✅ **Live** today |

## Which guide do I need?

| You have… | You want to… | Use |
|---|---|---|
| USDT on Ethereum (ERC-20) | Use it on Gonka as wrapped CW-20 USDT | [Wrap ERC-20 tokens (USDT)](wrap-erc20-tokens.md) |
| Wrapped CW-20 USDT on Gonka (minted by the native bridge) | Move it back to Ethereum | [Wrap ERC-20 tokens (USDT)](wrap-erc20-tokens.md) (section D onward) |
| GNK on Gonka | Get WGNK on Ethereum | [Move GNK to Ethereum (WGNK)](gnk-to-ethereum.md) |
| ETH on Ethereum | Use it on Gonka as WETH (CW-20) | [Move ETH to Gonka (WETH)](eth-to-gonka.md) |
| **IBC USDT on Gonka** (e.g. community pool payments) | Move it to Ethereum via Kava | [Withdraw IBC USDT via Kava](ibc-usdt-withdrawal.md) |

!!! danger "IBC USDT ≠ Wrapped USDT — do not mix the two flows"
    There are **two different USDT-like assets** that you may encounter on Gonka:

    - **IBC USDT** — USDT transferred via Cosmos IBC. This is what currently sits in the Gonka community pool and is paid out for some proposals. It moves **only** via IBC routes (see [Withdraw IBC USDT via Kava](ibc-usdt-withdrawal.md)).
    - **Wrapped USDT (CW-20)** — minted by the native Ethereum bridge when ERC-20 USDT is locked in the bridge contract on Ethereum. This will exist only **after** the Ethereum bridge is activated.

    They have different denominations, different contract addresses, and different
    redemption paths. Sending one to the other route will result in **lost funds**.

## How the Ethereum bridge works

!!! danger "Bridge not yet active"
    The Gonka Ethereum bridge contract is **not yet deployed** on Ethereum mainnet.
    The address shown as `<bridge-contract-address>` in this section is a
    **placeholder**. The actual contract address will be published in
    [Release announcements](../release-announcements.md) once the bridge is
    activated.

    **Do not send any funds** to the placeholder address. Funds sent before
    activation will be lost.

The Ethereum bridge is a dedicated bridge smart contract on Ethereum (`<bridge-contract-address>`) controlled by Gonka consensus. It lets you move:

- any **ERC-20** token between Ethereum and Gonka,
- the native **ETH** coin between Ethereum and Gonka,
- the native **GNK** coin between Gonka and Ethereum.

### Ethereum → Gonka (lock & mint)

To move an ERC-20 token (for example, USDT) from Ethereum to Gonka, the owner sends the token to the bridge contract on Ethereum. The tokens become **locked** in that contract. Once the deposit is recognized by Gonka consensus, the bridge **mints** a wrapped version of that ERC-20 on the Gonka chain as a **CW-20** token. Each wrapped asset has a unique CW-20 address that can only be created by the bridge.

After minting, ownership of the wrapped tokens is assigned to the Gonka address derived from the **same private/public key** the owner uses on Ethereum. The owner can then freely transfer the wrapped tokens to any other Gonka account.

The same lock & mint logic applies to native **ETH**: ETH sent to the bridge contract is locked there, and **WETH** is minted on Gonka as a CW-20 token assigned to the corresponding Gonka address.

### Gonka → Ethereum (burn & unlock / mint)

When the current owner of wrapped CW-20 tokens wants to withdraw them back to Ethereum, they submit a special transaction on the Gonka chain. This triggers **BLS signature generation** by the Gonka validator set (the status and the final signature can be polled via API).

Once the BLS signature is produced, it can be used to send a withdrawal command to the bridge contract on Ethereum. The bridge contract verifies the signature and other parameters, then **releases** the original tokens to the target Ethereum address.

A similar BLS-signed flow is used to move native **GNK** to Ethereum as **WGNK**: GNK is locked on an escrow account on Gonka, a BLS signature is generated, and that signature is used to invoke a **mint** command on the bridge contract on Ethereum.

### Same-key addressing

For all flows above, the Gonka and Ethereum addresses are **derived from the same private/public key**. If you start from an existing Ethereum address holding USDT, generate the matching Gonka address from the same key — that Gonka address will receive the wrapped token. If you start from an existing Gonka address, generate the corresponding Ethereum address from the same key, fund it with USDT/ETH, and ensure you have enough ETH for gas.

## How IBC USDT transfers work

IBC USDT is a **different asset class** from the wrapped tokens above. It arrives on Gonka via the Cosmos IBC channel from Kava (channel-5 on the Gonka side, channel-161 on the Kava side at the time this guide was written). It is **not** minted by the Gonka Ethereum bridge.

To move IBC USDT out of Gonka, you use the Cosmos IBC path: Gonka → Kava Cosmos → Kava EVM → Ethereum (via Stargate). See [Withdraw IBC USDT via Kava](ibc-usdt-withdrawal.md) for the step-by-step procedure.
