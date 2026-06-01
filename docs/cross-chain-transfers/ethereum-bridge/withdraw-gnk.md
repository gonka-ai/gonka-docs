!!! warning
    Always start with a small test transaction. Bridge transfers are irreversible, so before moving large amounts, send a small amount first and confirm it arrives as expected.

The dedicated Bridge smart contract, controlled by the Gonka consensus, is active on Ethereum at the address:

```text
0x972a7a92d92796a98801a8818bcf91f1648f2f68
```
---

# Withdraw GNK (Ethereum → Gonka)

This is the reverse of [Deposit GNK (Gonka → Ethereum)](deposit-gnk.md). It burns wrapped GNK (**WGNK**) on Ethereum and releases the equivalent native **GNK** from escrow on Gonka.

Native GNK is released to the Gonka address **derived from the same key that burns the WGNK** on Ethereum. Make sure you control that key on Gonka — see [Addresses and keys](addresses-and-keys.md).

### A) Burn WGNK on Ethereum

Burning is done by simply transferring WGNK to the bridge contract address. The bridge contract recognizes a transfer to itself as a burn and emits a `WGNKBurned` event.

```javascript
// WGNK is the bridge contract itself (it is both the bridge and the WGNK ERC-20)
const tx = await wgnkContract.transfer(
  "0x972a7a92d92796a98801a8818bcf91f1648f2f68",   // bridge / WGNK address
  amountBN                                        // BigNumber amount (9 decimals)
);
await tx.wait();
```

!!! note
    WGNK uses **9 decimals** to match the native GNK token.

### B) Wait for Finalization

The bridge only acts on **finalized** Ethereum blocks (about two epochs). Expect **15–20 minutes** between the burn being mined on Ethereum and the native GNK appearing on Gonka. No further action is required on the Ethereum side — once the burn is finalized, the Gonka consensus validates it and releases the escrowed GNK automatically.

### C) Check Your GNK Balance on Gonka

Query the native balance of the Gonka address derived from your key:

```bash
inferenced query bank balances <your_gonka_address> --node http://node1.gonka.ai:8000/chain-rpc/
```

You should see the released amount in `ngonka` (1 GNK = 10^9 ngonka).

!!! tip
    If the balance does not appear after ~20 minutes, confirm that the burn transaction was finalized on Ethereum and that you are querying the `gonka1…` address derived from the **same** key that signed the burn (not a seed-derived Gonka account — see [Addresses and keys](addresses-and-keys.md)).
