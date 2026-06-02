# Ethereum bridge overview

!!! warning
    Always start with a small test transaction. Bridge transfers are irreversible, so before moving large amounts, send a small amount first and confirm it arrives as expected.

The dedicated Bridge smart contract, controlled by the Gonka consensus, is active on Ethereum at the address:

```text
0x972a7a92d92796a98801a8818bcf91f1648f2f68
```

[View the bridge contract on Etherscan](https://etherscan.io/address/0x972a7a92d92796a98801a8818bcf91f1648f2f68){target=_blank}

The bridge allows you to move:

* **Any ERC-20 token** (e.g., [USDT](https://etherscan.io/token/0xdAC17F958D2ee523a2206206994597C13D831ec7){target=_blank}, [USDC](https://etherscan.io/token/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48){target=_blank}, [WETH](https://etherscan.io/token/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2){target=_blank}) from Ethereum to Gonka and back.
* **Native Gonka coin (GNK)** to Ethereum (as wrapped GNK) and back.

!!! note "ETH is bridged as WETH"
    The bridge tracks **ERC-20 token transfers** to the bridge contract. Native ETH is not an ERC-20, so to bridge ether you first wrap it into **WETH** (the standard Wrapped Ether ERC-20 token) on Ethereum, then bridge WETH exactly like any other ERC-20.

!!! important "Any ERC-20 token works — registration is not required"
    You can bridge **any** ERC-20 token, even one that has never been registered on Gonka. When the deposit is recognized, the bridge automatically creates the wrapped CW-20 contract and mints your balance. Registration through governance is **optional** and only adds display metadata (name, symbol, decimals) and trading eligibility — it is **not** needed to move tokens. Note that without registration, the decimals might not match the original token and it is expected. Until a token is registered, its wrapped version may not reflect the original's decimals. This is expected and does not affect your balance. See [Register a bridge token](register-token.md) for details.

!!! important "Both addresses come from the same key"
    Gonka delivers wrapped tokens to the Gonka address **derived from the same public key** that signed your Ethereum deposit. If your Ethereum and Gonka keys come from a seed phrase, they are usually **different** keys and this will not work. Don't use your seed phrase to derive a Gonka address and assume it matches your Ethereum one, the two are derived differently. Read [Addresses and keys](addresses-and-keys.md) **before** your first transfer.

---

## Overview

### Wrapping ERC-20 Tokens (e.g., USDT) from Ethereum to Gonka
1. **Deposit**: The owner of the ERC-20 token sends their tokens to the bridge smart contract address on Ethereum.
2. **Locking & Minting**: The tokens become locked in the contract. Each Gonka host runs a small bridge container that watches the bridge address. Once the deposit is **finalized** on Ethereum and **more than 50% of the hosts (by voting power)** have independently confirmed it, the bridge mints wrapped versions of that ERC-20 on the Gonka chain as CW-20 tokens.
3. **One wrapped contract per token**: Each Ethereum token maps to exactly **one** wrapped CW-20 contract on Gonka (keyed by chain ID + Ethereum contract address). The first deposit of a given token instantiates that contract; every later deposit of the **same** token reuses the **same** wrapped contract. Only the bridge can instantiate these contracts or mint their tokens.
4. **Ownership**: After minting, ownership of the wrapped tokens is assigned to the Gonka address derived from the same private/public key pair used on Ethereum. From this point, the owner can freely transfer the wrapped tokens to any other Gonka account. See [Deposit USDT (Ethereum → Gonka)](deposit-usdt.md) for the step-by-step flow.

!!! note
    Registering a token (see [Register a bridge token](register-token.md)) is optional. It does not affect whether a token can be bridged — it only attaches metadata so the wrapped token shows a proper name/symbol/decimals in wallets and dashboards, and makes it eligible for the on-chain liquidity pool. USDT and USDC are pre-registered. You can bridge and test any other ERC-20 without registering it first.

### Unwrapping / Withdrawing back to Ethereum
1. **Request**: The owner submits a special withdrawal transaction on the Gonka chain. This locks/burns the wrapped token and triggers BLS signature generation.
2. **Signature Retrieval**: Check the status of the signature generation using the provided API endpoint.
3. **Execution**: Once the BLS signature is produced, it is used to send a withdrawal command to the bridge contract on Ethereum. The contract verifies the signature and releases the original tokens to the target Ethereum address. See [Withdraw USDT (Gonka → Ethereum)](withdraw-usdt.md) for the step-by-step flow.

### Wrapping Native GNK to Ethereum (WGNK)
1. **Escrow**: A special transaction locks GNK on an escrow account and triggers BLS signature generation.
2. **Execution**: The generated BLS signature is submitted to the bridge contract on Ethereum to mint WGNK to the target Ethereum address. See [Deposit GNK (Gonka → Ethereum)](deposit-gnk.md) for the step-by-step flow.

!!! note
    GNK never exists "natively" on Ethereum. On the Ethereum side it is always the wrapped **WGNK** ERC-20 token issued by the bridge contract. "Bridging GNK to Ethereum" means locking native GNK in escrow on Gonka and minting the equivalent WGNK on Ethereum.

### Returning WGNK from Ethereum back to GNK
1. **Burn**: WGNK is sent to the bridge contract on Ethereum, which burns it.
2. **Release**: Once the burn is recognized by Gonka consensus, the equivalent native GNK is released from escrow to the Gonka address derived from the same key that burned the WGNK. See [Withdraw GNK (Ethereum → Gonka)](withdraw-gnk.md).

### Bridging ETH (as WETH)
The bridge detects ERC-20 transfers, not native ETH transfers. To bring ether to Gonka:

1. **Wrap**: Wrap your ETH into **WETH** (the standard Wrapped Ether ERC-20) on Ethereum.
2. **Bridge**: Send the WETH to the bridge contract — it behaves like [any other ERC-20 deposit](deposit-usdt.md). Gonka mints the wrapped WETH as a CW-20 token to the Gonka address derived from the same key, and you can withdraw it back to Ethereum the same way.

---

## How Gonka → Ethereum is authorized (the daily group key)

Every transfer **out** of Gonka (withdrawing a wrapped ERC-20/ETH, or minting WGNK) is released on Ethereum by a BLS signature from the Gonka validator set. For the Ethereum bridge contract to trust that signature, it must know the **current epoch's group key**, and it learns it through a daily chain of signatures:

* At the start of each epoch (about **once per day**), Gonka generates a **new group key** and signs it with the **previous** epoch's key.
* A small transaction must be submitted to the Ethereum bridge contract to register that new key. The contract only accepts the **next** sequential epoch key, signed by the previous one — so the key history forms an unbroken chain back to genesis.
* **Anyone** can submit this update with the same public data.

Once the current epoch's group key is registered, withdrawals are fast: a **single epoch signature can authorize any number of withdrawals** initiated during that epoch. The flow for a user is:

1. Submit the withdrawal/mint operation on Gonka, specifying the **recipient Ethereum address**. This burns/escrows the asset and triggers BLS signing with the group key.
2. Retrieve the produced signature.
3. Submit the signature plus the transfer data to the bridge contract on Ethereum, which verifies it against the current group key and releases the ERC-20, ETH, or WGNK to the recipient.

### If the current epoch key isn't registered yet

Withdrawals are signed with the current epoch's group key, and the bridge contract must already hold that key. Just after an epoch change (about daily) the contract can briefly lag, and your release will revert with `InvalidEpoch`. You do not have to wait — anyone can push the key. Fetch it from `https://node2.gonka.ai:8443/chain-api/productscience/inference/bls/epoch_data/<epochId>` (use the `group_public_key` and `validation_signature` fields) and submit it with `submit-epoch-public.js <bridge> <epochId> <group_public_key> <validation_signature>`. Submit any missing epochs in order (`latest + 1` first); it's a normal Ethereum transaction, so you just pay a usual amount of gas. Then retry your withdrawal.

## Timing & finalization

Transfer time depends on the direction:

* **Ethereum → Gonka: about 15–20 minutes.** The bridge waits for the deposit block to be **finalized** on Ethereum (≈ two epochs) before minting. Gonka uses no intermediaries that front the funds and take on risk, so this wait is unavoidable. The exact time also depends on where in the Ethereum epoch your transaction lands.
* **Gonka → Ethereum: fast.** The group key is formed once per epoch and used all day, so you can start a withdrawal at any time and only wait for the BLS signature and your Ethereum execution transaction.

!!! warning "During a Gonka chain outage"
    The bridge ingests **finalized Ethereum blocks** independently of Gonka block production. If the Gonka chain is halted, those Ethereum blocks (and the deposits in them) can be **skipped** by the hosts rather than queued, and withdrawals cannot be signed until signing resumes. If you ever see the chain reported as down on the [dashboard](tracker-integration.md), wait until it is healthy again before bridging.

## Bridge vs. exchange

The bridge only **locks an asset on one chain and releases it on the other** — it does not swap one asset for another. Trading happens on **separate** contracts:

* On Ethereum, e.g. swap **WGNK ↔ USDC** on a DEX such as Uniswap.
* On Gonka, swap wrapped tokens via the on-chain liquidity pool.

So a typical "sell GNK on Ethereum" flow is: bridge GNK → WGNK to Ethereum, then trade WGNK for another token on a DEX.

## Bridge vs. IBC

This bridge connects Gonka directly with **Ethereum**. Gonka also supports **IBC** for transfers with other Cosmos chains (see the [IBC](../ibc/withdraw-usdt-via-kava.md) section).

* Use the **Ethereum bridge** to move assets between **Ethereum and Gonka**. It is typically simpler and needs fewer gas tokens than routing through IBC.
* A token bridged from Ethereum lives on Gonka as a wrapped CW-20 tied to this bridge. It can be transferred within Gonka and sent **back to Ethereum**, but it **cannot** be forwarded or sold onto another Cosmos chain — for that you would use an IBC-native asset.

---

## Where to next

* [Addresses and keys](addresses-and-keys.md) — how a single private key controls both your Ethereum and Gonka addresses, and the seed-phrase pitfall.
* [Using the dashboard](dashboard.md) — the easiest way to bridge, with no CLI or raw keys.
* [Deposit USDT (Ethereum → Gonka)](deposit-usdt.md) and [Withdraw USDT (Gonka → Ethereum)](withdraw-usdt.md) — bridging an ERC-20 both ways.
* [Deposit GNK (Gonka → Ethereum)](deposit-gnk.md) and [Withdraw GNK (Ethereum → Gonka)](withdraw-gnk.md) — bridging native GNK both ways.
* [Register a bridge token](register-token.md) — optional metadata/trading registration.
* [Dashboard & tracker integration](tracker-integration.md) — for explorer/tracker operators integrating bridge data.
