# Bridge epoch update

Gonka &rarr; Ethereum transfers use a BLS signature from the current Gonka epoch. The Ethereum bridge contract must know the current epoch's group key before it can verify that signature and release funds on Ethereum.

At the start of each epoch, about once per day, Gonka creates a new group key. A small Ethereum transaction registers that key on the bridge contract. Usually this is already done, but the bridge can briefly lag behind the Gonka chain just after an epoch change.

## When you need this

You may need an epoch update if a Gonka &rarr; Ethereum withdrawal or WGNK mint is ready, but Ethereum execution cannot proceed because the bridge is behind the chain.

On the dashboard, this can appear as:

```text
A Bridge needs epoch update
Bridge: Epoch 283 | Chain: Epoch 284 (1 behind)

Withdrawals to Ethereum require the bridge to be synced to the current epoch.
```

If you see this, click **Update bridge** in the dashboard. Any user can submit the update. It is a normal Ethereum transaction, so the wallet that clicks the button pays Ethereum gas once for the update.

## Manual update

If you are not using the dashboard, submit each missing epoch in order:

1. Check the latest epoch known by the Ethereum bridge contract.
2. Start with `latest + 1`.
3. Fetch the epoch data:

```bash
curl "https://node2.gonka.ai:8443/chain-api/productscience/inference/bls/epoch_data/<epochId>"
```

4. Use the returned `group_public_key` and `validation_signature` fields with the bridge update script:

```bash
HARDHAT_NETWORK=mainnet node submit-epoch-public.js \
  0x972a7a92d92796a98801a8818bcf91f1648f2f68 \
  <epochId> \
  <group_public_key> \
  <validation_signature>
```

5. Repeat for every missing epoch until the bridge epoch matches the chain epoch.
6. Retry the withdrawal or WGNK mint execution on Ethereum.

!!! note
    The bridge contract only accepts the next sequential epoch key, signed by the previous epoch key. If the bridge is more than one epoch behind, submit the missing epochs one by one.
