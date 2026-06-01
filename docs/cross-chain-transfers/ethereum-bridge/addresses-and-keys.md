!!! warning
    Always start with a small test transaction. Bridge transfers are irreversible, so before moving large amounts, send a small amount first and confirm it arrives as expected.

The dedicated Bridge smart contract, controlled by the Gonka consensus, is active on Ethereum at the address:

```text
0x972a7a92d92796a98801a8818bcf91f1648f2f68
```

---

# Addresses and keys

This is the single most important page to understand before bridging. **Read it before your first transfer.**

## One key, two addresses

Ethereum and Gonka both use the same kind of cryptographic key (a `secp256k1` key pair). A single private key therefore controls an account on **both** chains. The two chains only differ in how they turn the public key into a human-readable address:

| Chain | Address format | How the address is derived from the public key |
| --- | --- | --- |
| Ethereum | `0x...` (20 bytes, hex) | `keccak256(uncompressed_public_key)` → last 20 bytes |
| Gonka | `gonka1...` (bech32) | `ripemd160(sha256(compressed_public_key))` → bech32 with the `gonka` prefix |

So a single private key produces **two different-looking addresses** — one `0x…` and one `gonka1…` — but both are controlled by that same key.

## How the bridge decides where your tokens go

When you bridge tokens from Ethereum to Gonka, you send them to the bridge contract and sign that Ethereum transaction with your Ethereum private key. The Gonka bridge:

1. Detects the finalized deposit transaction on Ethereum.
2. **Recovers the public key** from your transaction's signature.
3. Computes the **Gonka address** for that public key (the `gonka1…` standard derivation above).
4. Mints/releases the bridged tokens to that `gonka1…` address.

In other words: **the wrapped tokens are delivered to the Gonka address that belongs to the exact key that signed the Ethereum deposit.** To spend them, you must use the same key on Gonka.

The reverse direction is different: when you withdraw or burn on the Gonka side, you **explicitly specify the destination Ethereum address** in the transaction — it is not derived from a key.

## The seed-phrase pitfall (read this!)

Most users never see their raw private key — they only have a **seed phrase** (mnemonic) and let their wallet derive keys for them. This is convenient, but it creates a trap for bridging:

A seed phrase does not map to a single key. Wallets derive keys from it using **BIP-44 derivation paths**, and each blockchain uses a **different path**:

* Ethereum wallets use coin type **60** → path `m/44'/60'/0'/0/0`
* Cosmos/Gonka wallets use coin type **118** → path `m/44'/118'/0'/0/0`

Because the paths differ, the **same seed phrase produces two completely different private keys** for Ethereum and Gonka — and therefore two unrelated address pairs. If you deposit from a seed-derived Ethereum account and then look at the seed-derived Gonka account in your wallet, **they are not the same key**, so the bridged tokens will land on a `gonka1…` address your wallet is not showing you and may not control.

!!! danger
    Do **not** assume "same seed phrase = same account on both chains." For the bridge you need the **same private key** on both chains, not the same seed phrase. Using the standard, different derivation paths will send your funds to an address derived from your Ethereum key — which your Gonka wallet, derived on a different path, does not control.

## How to get the matching Gonka address

You have two options.

### Option A — Use the dashboard (recommended)

The Gonka dashboard solves the derivation for you. Connect the **same Ethereum wallet** you bridge with, and the dashboard derives and displays the correct `gonka1…` address that the bridge will use, shows your wrapped balances, and guides the deposit/withdraw flow. This avoids handling raw private keys yourself and removes the seed-phrase confusion described above.

Open the dashboard at:

```text
https://node1.gonka.ai:8443/dashboard
```

### Option B — Import the same private key into the Gonka keyring

If you work from the CLI, import the **exact same** `secp256k1` private key (hex) that controls your Ethereum account into the Gonka keyring. The resulting `gonka1…` address is the one the bridge mints to:

```bash
inferenced keys import-hex <key_name> <YOUR_PRIVATE_KEY_HEX>

# Show the derived Gonka address
inferenced keys show <key_name> -a
```

The address printed here is exactly the `gonka1…` address that will receive your bridged tokens, and the key can sign Gonka transactions (transfers, withdrawals) for them.

!!! warning
    Importing a raw private key exposes it to the machine and keyring you import it on. Prefer a file-based keyring (`--keyring-backend file`) on a secure machine, and never paste a private key that also guards significant Ethereum funds onto an untrusted host. When in doubt, use the dashboard.

## Quick checklist

* Decide which key you will bridge with **before** you start.
* If you have USDT/ETH on an Ethereum address already: derive the matching `gonka1…` address from that key (dashboard, or `import-hex`).
* If you want to use an existing Gonka address: derive the matching `0x…` Ethereum address from that key, fund it with the token and enough ETH for gas.
* Always send a small test amount first and confirm it arrives on the expected `gonka1…` address.
