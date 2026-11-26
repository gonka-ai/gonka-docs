# Transfer USDC via Injective (Ethereum ↔ Gonka)

**Use case:** move native **USDC** from Ethereum to Gonka and back. The route goes through **Injective**: Circle's CCTP bridge carries USDC between Ethereum and Injective, and IBC carries it between Injective and Gonka.

The route can stop after any completed leg. USDC can stay on **Injective**, stay on **Gonka**, or go back to **Ethereum**.

**Disclaimer:** This guide is **not financial advice**. Route parameters, supported assets, fees, and wallet and bridge UIs can change. Always verify the current route, addresses, and amounts before sending funds.

!!! warning
    Always start with a small test transaction. Send a small amount first and confirm it arrives before moving larger amounts.

## Route overview

| Leg | Direction | Tool | Wallet |
|---|---|---|---|
| 1 | Ethereum → Injective | [Injective CCTP bridge](https://bridge.injective.network/cctp/){target=_blank} | MetaMask |
| 2 | Injective → Gonka | Keplr, Advanced IBC Transfer, **`channel-509`** | Keplr |
| 3 | Gonka → Injective | Keplr, Advanced IBC Transfer, **`channel-8`** | Keplr |
| 4 | Injective → Ethereum | [Injective CCTP bridge](https://bridge.injective.network/cctp/){target=_blank} | MetaMask |

## Asset and channel reference

| Item | Value |
|---|---|
| USDC on Ethereum | `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48` |
| USDC on Injective (CCTP) | `erc20:0xa00C59fF5a080D2b954d0c75e46E22a0c371235a` |
| USDC on Gonka | `ibc/0E375D8E89689B859677EE3248974D5E561B2F02526A282107CADFF08B57A56A` |
| Channel when sending **from Injective** | `channel-509` |
| Channel when sending **from Gonka** | `channel-8` |

!!! important "Native USDC only"
    This route is for **native USDC** issued through Circle's CCTP. Don't confuse it with USDC or USDT bridged by other routes (Peggy, Axelar, the Gonka–Ethereum bridge). Those have different denoms on Gonka and don't travel over this channel.

## Before starting

Requirements:

- **MetaMask** and **Keplr** installed, with **one seed phrase in both wallets**. See [Addresses](#addresses-in-this-route) below.
- **USDC on Ethereum.** Holding ETH alone is not enough: the CCTP bridge only shows your USDC balance. If needed, swap a small amount of ETH to USDC in MetaMask first.
- **ETH** for Ethereum gas. Leg 1 takes two transactions (approve and burn). Leg 4 takes one (mint).
- **Native INJ** on your Injective address, for gas on legs 2 and 4. About **0.01 INJ** is plenty.
- **GNK** on your Gonka address, for gas on leg 3. A fraction of a GNK is enough.
- **Gonka enabled in Keplr.** See [Step 2](#step-2-injective-gonka).

!!! tip "How to get native INJ"
    Withdraw INJ from an exchange to your `inj1…` address and choose the **Injective** network. Leave **Memo** empty. Don't choose ERC20 or BEP20.

    Swapping ETH to INJ in MetaMask on Ethereum gives you **ERC-20 INJ** on Ethereum. That token can't pay gas on Injective until it's bridged there.

### Addresses in this route

| Chain | Address | Where to find it |
|---|---|---|
| Ethereum | `0x…` | MetaMask |
| Injective | `inj1…` | Keplr → Injective |
| Gonka | `gonka1…` | Keplr → Gonka |

Injective uses Ethereum-style keys. With the same seed phrase in MetaMask and Keplr, your `0x…` address in MetaMask and your `inj1…` address in Keplr are **the same account**. USDC minted by the CCTP bridge goes to that account.

Your `gonka1…` address won't look related to the other two, because Gonka derives addresses differently (coin type 1200). This is expected.

### Useful official pages

- Injective CCTP bridge: [bridge.injective.network/cctp](https://bridge.injective.network/cctp/){target=_blank}
- Injective EVM explorer: [blockscout.injective.network](https://blockscout.injective.network){target=_blank}
- Injective Cosmos explorer: [explorer.injective.network](https://explorer.injective.network){target=_blank}
- Keplr help, including IBC: [help.keplr.app](https://help.keplr.app/){target=_blank}
- Circle CCTP: [developers.circle.com/cctp](https://developers.circle.com/cctp){target=_blank}

---

## Step 1 — Ethereum → Injective (CCTP)

### 1. Connect MetaMask

1. Open [bridge.injective.network/cctp](https://bridge.injective.network/cctp/){target=_blank}.
2. In MetaMask, select **Ethereum Mainnet**.
3. Connect **MetaMask**.

!!! note
    Use **MetaMask** for this step. Connecting Keplr on the CCTP page currently fails.

### 2. Set the route and send

- **From:** Ethereum
- **To:** Injective
- **Asset:** USDC
- **Amount:** a small test amount

Approve the two MetaMask transactions:

1. **Approve**: lets the CCTP contract spend your USDC.
2. **Burn** (`depositForBurn`): burns USDC on Ethereum and starts the transfer.

### 3. Wait for the mint on Injective

A standard CCTP transfer waits for Ethereum finality, usually about **15–20 minutes**. A relayer then mints USDC to your Injective account automatically.

!!! warning "Error on the final Mint step"
    The bridge UI may offer a **Mint** button, and clicking it may show an error such as **`nonce already used`**. This means the relayer has **already minted** your USDC. Check your balance before you retry anything.

### 4. Check that USDC arrived on Injective

- In **Keplr**, switch to **Injective** and look for **USDC**.
- Or open your `0x…` address on [blockscout.injective.network](https://blockscout.injective.network){target=_blank} and look under **Tokens**.
- Or query it directly:

```bash
curl -sS "https://sentry.lcd.injective.network/cosmos/bank/v1beta1/balances/<inj1-address>" | jq '.balances'
```

USDC shows as `erc20:0xa00C59fF5a080D2b954d0c75e46E22a0c371235a`, with 6 decimals.

---

## Step 2 — Injective → Gonka

### 1. Enable Gonka in Keplr

**Keplr → Menu → Manage Chain Visibility → search *Gonka* → enable → Save.**

Then **close Keplr fully and open it again**. Gonka doesn't appear as an IBC destination until Keplr reloads its chain list.

### 2. Turn on manual IBC in Keplr

**Settings → General → Advanced → Manual IBC Transfer → ON**

Labels can differ slightly between Keplr versions. See [help.keplr.app](https://help.keplr.app/){target=_blank}.

### 3. Copy your Gonka address

Switch to **Gonka** in Keplr and copy your full **`gonka1…`** address.

### 4. Add the channel

1. Switch to **Injective** and open the **USDC** token.
2. Choose **IBC Transfer**.
3. Click **+ New IBC Transfer Channel** and set:
    - **Destination chain:** Gonka
    - **Channel ID:** **`channel-509`**
4. Save the channel.

### 5. Send a small test amount

- **Destination:** Gonka (`channel-509`)
- **Recipient:** your `gonka1…` address
- **Amount:** a small test amount
- **Memo:** leave empty

Review the fee, which is paid in **INJ**, and approve. The transfer usually arrives within a few minutes.

### 6. Check that USDC arrived on Gonka

```bash
curl -sS "https://node2.gonka.ai:8443/chain-api/cosmos/bank/v1beta1/balances/<gonka1-address>" | jq '.balances'
```

Look for this denom:

```text
ibc/0E375D8E89689B859677EE3248974D5E561B2F02526A282107CADFF08B57A56A
```

!!! note "Displayed amount"
    Keplr may show USDC on Gonka as an unnamed `ibc/0E37…` token, in base units without decimals. USDC has 6 decimals, so **`1000000` = 1 USDC**.

---

## Step 3 — Gonka → Injective

1. In Keplr, switch to **Gonka** and open the **USDC** token (`ibc/0E37…`).
2. Choose **IBC Transfer**.
3. Click **+ New IBC Transfer Channel** and set:
    - **Destination chain:** Injective
    - **Channel ID:** **`channel-8`**
4. Save the channel.
5. Send:
    - **Recipient:** your `inj1…` address
    - **Amount:** a small test amount
    - **Memo:** leave empty
6. Review the fee, which is paid in **GNK** (`ngonka`), and approve.

USDC should appear back on **Injective** within a few minutes. Check it as in [Step 1](#4-check-that-usdc-arrived-on-injective).

---

## Step 4 — Injective → Ethereum (CCTP)

1. Open [bridge.injective.network/cctp](https://bridge.injective.network/cctp/){target=_blank} and connect **MetaMask**.
2. Set the route:
    - **From:** Injective
    - **To:** Ethereum
    - **Asset:** USDC
3. Approve the **approve** and **burn** transactions. Gas for both is paid in **INJ**.
4. Wait for attestation, then complete the **mint on Ethereum**. Gas for the mint is paid in **ETH**.
5. In MetaMask, switch to **Ethereum Mainnet** and check your **USDC** balance.

---

## Typical fees

These were measured on mainnet for a test transfer of under 2 USDC. Ethereum gas varies with network load.

| Step | Fee paid in | Approximate fee |
|---|---|---|
| Leg 1: approve and burn on Ethereum | ETH | Ethereum gas for 2 transactions |
| Leg 2: IBC Injective → Gonka | INJ | ~0.0004 INJ |
| Leg 3: IBC Gonka → Injective | GNK | ~0.0003 GNK |
| Leg 4: approve and burn on Injective | INJ | ~0.0001 INJ |
| Leg 4: mint on Ethereum | ETH | Ethereum gas for 1 transaction |

Ethereum gas is the main cost of this route. The IBC legs cost fractions of a cent.

---

## Troubleshooting

| Symptom | Cause | What to do |
|---|---|---|
| The CCTP bridge shows a USDC balance of 0 | The wallet holds ETH, but no USDC | Swap ETH to USDC on Ethereum first. Check that MetaMask is on **Ethereum Mainnet** and the right account is connected |
| Keplr fails on the CCTP page | Known issue with the bridge UI | Use MetaMask for legs 1 and 4 |
| `nonce already used` on Mint | The relayer has already minted your USDC | Check your balance on Injective. Don't retry |
| The IBC transfer fails for insufficient fees | No native INJ (leg 2) or no GNK (leg 3) | Add a small amount of the gas token to that address |
| Gonka is missing from the destination dropdown | Gonka is not enabled in Keplr, or Keplr hasn't reloaded | Enable Gonka in **Manage Chain Visibility**, then close and reopen Keplr |
| USDC on Gonka shows a large number | The denom is shown in base units | Divide by 1,000,000 |

---

## Advanced note — verify the channel before large transfers

You don't need to verify the channel for a small test transfer. To check the channel before sending a larger amount:

```bash
curl -sS "https://node2.gonka.ai:8443/chain-api/ibc/core/channel/v1/channels/channel-8/ports/transfer" \
  | jq '{state: .channel.state, counterparty: .channel.counterparty}'

curl -sS "https://node2.gonka.ai:8443/chain-api/ibc/core/channel/v1/channels/channel-8/ports/transfer/client_state" \
  | jq -r '.identified_client_state.client_state.chain_id'
```

Expected output: `STATE_OPEN`, counterparty `channel-509`, and chain ID `injective-1`.

---

Always double-check the route, addresses, assets, and amounts, and start with a small test transfer.
