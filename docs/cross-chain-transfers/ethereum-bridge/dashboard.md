!!! warning
    Always start with a small test transaction. Bridge transfers are irreversible, so before moving large amounts, send a small amount first and confirm it arrives as expected.

The dedicated Bridge smart contract, controlled by the Gonka consensus, is active on Ethereum at the address:

```text
0x972a7a92d92796a98801a8818bcf91f1648f2f68
```

---

# Using the dashboard

The dashboard is the easiest way to bridge. It handles the key derivation for you (see [Addresses and keys](addresses-and-keys.md)), so you don't need to import private keys or compute addresses by hand. Open it at:

```text
https://node1.gonka.ai:8443/dashboard
```

## What the dashboard does for you

* **Derives the correct addresses.** Connect the Ethereum wallet you bridge with, and the dashboard shows the matching `gonka1…` address the bridge will deliver tokens to — so you always know where your wrapped tokens will land.
* **Warns about seed-phrase accounts.** If you are using a wallet whose Ethereum and Gonka keys come from the same **mnemonic**, the dashboard detects this and warns you, because seed-derived accounts use different keys on each chain and would send funds to an address you don't control. Read [Addresses and keys](addresses-and-keys.md) for the full explanation.
* **Shows your bridged balances** in a Bridge Assets section, so you can confirm a deposit arrived.
* **Reports chain status**, so you can see if the chain is degraded before initiating a transfer.

## Supported flows

The dashboard supports the full set of transfers without using the CLI:

* **Ethereum → Gonka**: deposit any ERC-20 (USDT, USDC, WETH, …) and receive the wrapped token on Gonka.
* **Gonka → Ethereum**: withdraw a wrapped token back to an Ethereum address.
* **GNK ↔ WGNK**: bridge native GNK to Ethereum as WGNK and back.

## Typical deposit (Ethereum → Gonka)

1. Open the dashboard and connect your Ethereum wallet.
2. Confirm the derived `gonka1…` recipient address shown by the dashboard is one you control.
3. Choose the token and amount and approve the transfer to the bridge contract.
4. Wait ~15–20 minutes for Ethereum finalization (see [Timing & finalization](overview.md#timing-finalization)), then check the Bridge Assets section for your wrapped balance.

## Typical withdrawal (Gonka → Ethereum)

1. Connect, select the wrapped token and amount, and enter the destination **Ethereum** address.
2. Approve the withdrawal. The dashboard collects the BLS signature for the current epoch and submits the release transaction to the bridge contract on Ethereum.

!!! tip
    Prefer the dashboard if you are not comfortable with the CLI or with handling raw private keys. The step-by-step CLI flows are documented in [Deposit USDT](deposit-usdt.md), [Withdraw USDT](withdraw-usdt.md), [Deposit GNK](deposit-gnk.md), and [Withdraw GNK](withdraw-gnk.md) if you prefer to do it manually.
