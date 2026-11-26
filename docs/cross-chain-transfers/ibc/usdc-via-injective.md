# Transfer USDC via Injective (Ethereum ↔ Gonka)

**Use case:** move native **USDC** from Ethereum to Gonka and back. The route goes through **Injective**: Circle's CCTP bridge carries USDC between Ethereum and Injective, and IBC carries it between Injective and Gonka.

The route can stop after any completed leg. USDC can stay on **Injective**, stay on **Gonka**, or go back to **Ethereum**.

**Disclaimer:** This guide is **not financial advice**. Route parameters, supported assets, fees, and wallet and bridge UIs can change. Always verify the current route, addresses, and amounts before sending funds.

!!! note "One of several routes"
    This guide covers one way to move USDC between Ethereum and Gonka: Circle's CCTP bridge to Injective, then IBC to Gonka. Other bridges and routes for USDC exist, with different fees, speed, and supported assets.

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
| USDC on Injective (CCTP) | `erc20:0xa00C59fF5a080D2b954d0c75e46E22a0c371235a`, shown in Keplr as **USDC.inj** |
| USDC on Gonka | `ibc/0E375D8E89689B859677EE3248974D5E561B2F02526A282107CADFF08B57A56A`, shown in Keplr as **USDC.inj on Gonka (IBC)** |
| Channel when sending **from Injective** | `channel-509` |
| Channel when sending **from Gonka** | `channel-8` |

!!! important "Native USDC only"
    This route is for **native USDC** issued through Circle's CCTP. Don't confuse it with USDC or USDT bridged by other routes (Peggy, Axelar, the Gonka–Ethereum bridge). Those have different denoms on Gonka and don't travel over this channel.

## Before starting

Requirements:

- **MetaMask** and **Keplr** installed, with **one seed phrase in both wallets**. See [Addresses](#addresses-in-this-route) below.
- **USDC on Ethereum.** Holding ETH alone is not enough: the CCTP bridge only shows your USDC balance. If needed, swap a small amount of ETH to USDC in MetaMask first (**Swap**, ETH → USDC).
- **ETH** for Ethereum gas. Leg 1 takes two transactions (approve and burn). Leg 4 takes one (mint).
- **Native INJ** on your Injective address, for gas on legs 2 and 4. About **0.01 INJ** is plenty.
- **GNK** on your Gonka address, for gas on leg 3. A fraction of a GNK is enough.

!!! tip "How to get native INJ"
    Withdraw INJ from an exchange to your `inj1…` address and choose the **Injective** network. Leave **Memo** empty. Don't choose ERC20 or BEP20.

    Swapping ETH to INJ in MetaMask on Ethereum gives you **ERC-20 INJ** on Ethereum. That token can't pay gas on Injective until it's bridged there.

<div style="display:flex; flex-wrap:wrap; gap:12px; margin:12px 0;">
<a href="/images/usdc_injective_00_metamask_swap_eth_usdc.png" target="_blank"><img src="/images/usdc_injective_00_metamask_swap_eth_usdc.png" alt="MetaMask swap ETH to USDC" style="height:320px; width:auto;"></a>
<a href="/images/usdc_injective_00_exchange_withdraw_inj.png" target="_blank"><img src="/images/usdc_injective_00_exchange_withdraw_inj.png" alt="Exchange withdrawal of INJ on the Injective network" style="height:320px; width:auto;"></a>
</div>

### Addresses in this route

| Chain | Address | Where to find it |
|---|---|---|
| Ethereum | `0x…` | MetaMask |
| Injective | `inj1…` | Keplr → Injective |
| Gonka | `gonka1…` | Keplr → Gonka |

Injective uses Ethereum-style keys. With the same seed phrase in MetaMask and Keplr, your `0x…` address in MetaMask and your `inj1…` address in Keplr are **the same account**. The CCTP bridge accepts the `0x…` form as the Injective recipient and fills it in for you.

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
2. Click **Connect wallet** and choose **MetaMask**. MetaMask should be on **Ethereum Mainnet**.

<div style="display:flex; flex-wrap:wrap; gap:12px; margin:12px 0;">
<a href="/images/usdc_injective_01_cctp_bridge_page.png" target="_blank"><img src="/images/usdc_injective_01_cctp_bridge_page.png" alt="Injective CCTP bridge" style="height:320px; width:auto;"></a>
<a href="/images/usdc_injective_02_cctp_connect_wallet.png" target="_blank"><img src="/images/usdc_injective_02_cctp_connect_wallet.png" alt="Connect a wallet" style="height:320px; width:auto;"></a>
</div>

### 2. Set the route and send

- **From:** Ethereum
- **To:** Injective
- **Amount:** a small test amount. The **Balance** above the field shows your USDC on Ethereum.
- **Transfer speed:**
    - **Fast**: arrives in seconds, for a small fee in USDC (shown as **Max fee**).
    - **Standard**: up to 20 minutes, no bridge fee.
- **Recipient on Injective:** filled in with your `0x…` address. Leave it.

<div style="display:flex; flex-wrap:wrap; gap:12px; margin:12px 0;">
<a href="/images/usdc_injective_03_cctp_route_ethereum_injective.png" target="_blank"><img src="/images/usdc_injective_03_cctp_route_ethereum_injective.png" alt="CCTP route Ethereum to Injective" style="height:320px; width:auto;"></a>
</div>

Click **Bridge USDC** and confirm in MetaMask:

1. **Spending cap request** (**Approve USDC**): lets Circle CCTP spend your USDC.
2. **Transaction request** (**Burn on source**): burns USDC on Ethereum and starts the transfer.

<div style="display:flex; flex-wrap:wrap; gap:12px; margin:12px 0;">
<a href="/images/usdc_injective_04_metamask_approve_usdc.png" target="_blank"><img src="/images/usdc_injective_04_metamask_approve_usdc.png" alt="MetaMask spending cap request" style="height:320px; width:auto;"></a>
<a href="/images/usdc_injective_05_metamask_burn_usdc.png" target="_blank"><img src="/images/usdc_injective_05_metamask_burn_usdc.png" alt="MetaMask burn transaction" style="height:320px; width:auto;"></a>
</div>

The bridge then shows **Wait for attestation** and **Mint on destination**.

<div style="display:flex; flex-wrap:wrap; gap:12px; margin:12px 0;">
<a href="/images/usdc_injective_06_cctp_wait_attestation.png" target="_blank"><img src="/images/usdc_injective_06_cctp_wait_attestation.png" alt="Wait for attestation" style="height:320px; width:auto;"></a>
</div>

### 3. Mint on Injective

MetaMask may ask to **Add Injective** as a network. Confirm it.

<div style="display:flex; flex-wrap:wrap; gap:12px; margin:12px 0;">
<a href="/images/usdc_injective_07_metamask_add_injective.png" target="_blank"><img src="/images/usdc_injective_07_metamask_add_injective.png" alt="MetaMask Add Injective network" style="height:320px; width:auto;"></a>
</div>

!!! warning "`Nonce already used` on Mint on destination"
    **Mint on destination** may turn red with **`Nonce already used`** and offer **Retry**. This means a relayer has **already minted** your USDC on Injective. Don't retry. Check your balance as in the next step.

<div style="display:flex; flex-wrap:wrap; gap:12px; margin:12px 0;">
<a href="/images/usdc_injective_08_cctp_nonce_already_used.png" target="_blank"><img src="/images/usdc_injective_08_cctp_nonce_already_used.png" alt="Nonce already used on Mint on destination" style="height:320px; width:auto;"></a>
</div>

### 4. Check that USDC arrived on Injective

- In **Keplr**, look for **USDC.inj** on **Injective**.
- Or open your `0x…` address on [blockscout.injective.network](https://blockscout.injective.network){target=_blank} and look under **Tokens**.
- Or query it directly:

```bash
curl -sS "https://sentry.lcd.injective.network/cosmos/bank/v1beta1/balances/<inj1-address>" | jq '.balances'
```

USDC shows as `erc20:0xa00C59fF5a080D2b954d0c75e46E22a0c371235a`, with 6 decimals.

---

## Step 2 — Injective → Gonka

### 1. Add Gonka in Keplr

**Keplr → ☰ Menu → Add/Remove Chains → search *Gonka* → turn it on.**

<div style="display:flex; flex-wrap:wrap; gap:12px; margin:12px 0;">
<a href="/images/usdc_injective_09_keplr_menu_add_remove_chains.png" target="_blank"><img src="/images/usdc_injective_09_keplr_menu_add_remove_chains.png" alt="Keplr menu Add/Remove Chains" style="height:320px; width:auto;"></a>
<a href="/images/usdc_injective_10_keplr_enable_gonka.png" target="_blank"><img src="/images/usdc_injective_10_keplr_enable_gonka.png" alt="Enable Gonka in Keplr" style="height:320px; width:auto;"></a>
</div>

You can also get there from **Settings → Chains and Assets → Add / Remove Chains**.

Then **close Keplr and open it again**. Until you do, Gonka doesn't appear as a destination chain in the IBC channel dialog.

### 2. Turn on manual IBC in Keplr

**Settings → Advanced → Manual IBC Transfer → ON**

<div style="display:flex; flex-wrap:wrap; gap:12px; margin:12px 0;">
<a href="/images/usdc_injective_12_keplr_settings_advanced.png" target="_blank"><img src="/images/usdc_injective_12_keplr_settings_advanced.png" alt="Keplr Settings Advanced" style="height:320px; width:auto;"></a>
<a href="/images/usdc_injective_13_keplr_manual_ibc_on.png" target="_blank"><img src="/images/usdc_injective_13_keplr_manual_ibc_on.png" alt="Manual IBC Transfer on" style="height:320px; width:auto;"></a>
</div>

### 3. Copy your Gonka address

Find **GNK (Gonka)** on the Keplr home screen and copy your **`gonka1…`** address.

### 4. Open Advanced IBC Transfer

1. On the Keplr home screen, scroll to the bottom. On the **Advanced IBC Transfer** card, click **Transfer**.
2. In **Select Asset**, choose **USDC.inj (Injective)**.

<div style="display:flex; flex-wrap:wrap; gap:12px; margin:12px 0;">
<a href="/images/usdc_injective_14_keplr_advanced_ibc_card.png" target="_blank"><img src="/images/usdc_injective_14_keplr_advanced_ibc_card.png" alt="Advanced IBC Transfer card" style="height:320px; width:auto;"></a>
<a href="/images/usdc_injective_15_keplr_select_usdc_injective.png" target="_blank"><img src="/images/usdc_injective_15_keplr_select_usdc_injective.png" alt="Select USDC.inj on Injective" style="height:320px; width:auto;"></a>
</div>

### 5. Add the channel (first time only)

1. Open the **Destination Chain** dropdown and choose **New IBC Transfer Channel**.
2. In **Add IBC channel**, set:
    - **Destination Chain:** Gonka
    - **Source Channel Id:** **`channel-509`**
3. Click **Save**.

<div style="display:flex; flex-wrap:wrap; gap:12px; margin:12px 0;">
<a href="/images/usdc_injective_16_keplr_new_ibc_channel.png" target="_blank"><img src="/images/usdc_injective_16_keplr_new_ibc_channel.png" alt="New IBC Transfer Channel" style="height:320px; width:auto;"></a>
<a href="/images/usdc_injective_17_keplr_add_channel_gonka.png" target="_blank"><img src="/images/usdc_injective_17_keplr_add_channel_gonka.png" alt="Add IBC channel to Gonka" style="height:320px; width:auto;"></a>
</div>

Next time, **Gonka (channel-509)** appears directly in the dropdown.

### 6. Send a small test amount

1. **Destination Chain:** Gonka (channel-509)
2. **Wallet Address:** your `gonka1…` address
3. Click **Next**, then enter the **Amount**. Leave **Memo** empty or add a note for yourself.
4. Click **Next** and review **Confirm Transaction**. It should read *IBC Transfer … via channel-509*. The **Tx Fee** is paid in **INJ**.
5. Click **Approve**.

<div style="display:flex; flex-wrap:wrap; gap:12px; margin:12px 0;">
<a href="/images/usdc_injective_18_keplr_gonka_channel_509.png" target="_blank"><img src="/images/usdc_injective_18_keplr_gonka_channel_509.png" alt="Gonka channel-509 selected" style="height:320px; width:auto;"></a>
<a href="/images/usdc_injective_19_keplr_amount_fee_inj.png" target="_blank"><img src="/images/usdc_injective_19_keplr_amount_fee_inj.png" alt="Amount and fee in INJ" style="height:320px; width:auto;"></a>
<a href="/images/usdc_injective_20_keplr_confirm_channel_509.png" target="_blank"><img src="/images/usdc_injective_20_keplr_confirm_channel_509.png" alt="Confirm transaction via channel-509" style="height:320px; width:auto;"></a>
</div>

The transfer usually arrives within a minute or two.

### 7. Check that USDC arrived on Gonka

In Keplr, **USDC.inj** now shows a line **on Gonka (IBC)**. Or query it directly:

```bash
curl -sS "https://node2.gonka.ai:8443/chain-api/cosmos/bank/v1beta1/balances/<gonka1-address>" | jq '.balances'
```

Look for this denom:

```text
ibc/0E375D8E89689B859677EE3248974D5E561B2F02526A282107CADFF08B57A56A
```

The API returns the amount in base units: **`1000000` = 1 USDC**.

<div style="display:flex; flex-wrap:wrap; gap:12px; margin:12px 0;">
<a href="/images/usdc_injective_21_keplr_usdc_on_gonka.png" target="_blank"><img src="/images/usdc_injective_21_keplr_usdc_on_gonka.png" alt="USDC.inj on Gonka in Keplr" style="height:320px; width:auto;"></a>
</div>

---

## Step 3 — Gonka → Injective

1. On the Keplr home screen, open **Advanced IBC Transfer → Transfer**.
2. In **Select Asset**, choose **USDC.inj on Gonka (IBC)**.
3. Add the channel (first time only): **Destination Chain → New IBC Transfer Channel**:
    - **Destination Chain:** Injective
    - **Source Channel Id:** **`channel-8`**
4. **Destination Chain:** Injective (channel-8)
5. **Wallet Address:** your `inj1…` address
6. Click **Next**, enter the **Amount**, and click **Next**.
7. Review **Confirm Transaction**. It should read *IBC Transfer … via channel-8*. The **Tx Fee** is paid in **GNK**.
8. Click **Approve**.

<div style="display:flex; flex-wrap:wrap; gap:12px; margin:12px 0;">
<a href="/images/usdc_injective_22_keplr_select_usdc_gonka.png" target="_blank"><img src="/images/usdc_injective_22_keplr_select_usdc_gonka.png" alt="Select USDC.inj on Gonka" style="height:320px; width:auto;"></a>
<a href="/images/usdc_injective_23_keplr_injective_channel_8.png" target="_blank"><img src="/images/usdc_injective_23_keplr_injective_channel_8.png" alt="Injective channel-8" style="height:320px; width:auto;"></a>
<a href="/images/usdc_injective_24_keplr_recipient_inj.png" target="_blank"><img src="/images/usdc_injective_24_keplr_recipient_inj.png" alt="Recipient inj1 address" style="height:320px; width:auto;"></a>
<a href="/images/usdc_injective_25_keplr_confirm_channel_8.png" target="_blank"><img src="/images/usdc_injective_25_keplr_confirm_channel_8.png" alt="Confirm transaction via channel-8" style="height:320px; width:auto;"></a>
</div>

USDC should appear back on **Injective** within a minute or two. Check it as in [Step 1](#4-check-that-usdc-arrived-on-injective).

---

## Step 4 — Injective → Ethereum (CCTP)

1. Open [bridge.injective.network/cctp](https://bridge.injective.network/cctp/){target=_blank} and connect **MetaMask**.
2. Click the **⇄** arrow so the route is **From: Injective → To: Ethereum**.
3. Enter the **Amount**, choose **Transfer speed**, and check **Recipient on Ethereum** (your `0x…` address).
4. Click **Bridge USDC** and confirm in MetaMask:
    1. **Spending cap request** on the **Injective** network (**Approve USDC**)
    2. **Transaction request** on the **Injective** network (**Burn on source**)
    3. After **Wait for attestation**, a **Transaction request** on **Ethereum** (**Mint on destination**). It shows *You receive + … USDC*.
5. The bridge shows **Bridge complete**. In MetaMask, switch to **Ethereum Mainnet** and check your **USDC** balance.

<div style="display:flex; flex-wrap:wrap; gap:12px; margin:12px 0;">
<a href="/images/usdc_injective_26_cctp_route_injective_ethereum.png" target="_blank"><img src="/images/usdc_injective_26_cctp_route_injective_ethereum.png" alt="CCTP route Injective to Ethereum" style="height:320px; width:auto;"></a>
<a href="/images/usdc_injective_27_metamask_approve_usdc_injective.png" target="_blank"><img src="/images/usdc_injective_27_metamask_approve_usdc_injective.png" alt="Approve USDC on Injective" style="height:320px; width:auto;"></a>
<a href="/images/usdc_injective_28_metamask_burn_usdc_injective.png" target="_blank"><img src="/images/usdc_injective_28_metamask_burn_usdc_injective.png" alt="Burn USDC on Injective" style="height:320px; width:auto;"></a>
<a href="/images/usdc_injective_29_metamask_mint_ethereum.png" target="_blank"><img src="/images/usdc_injective_29_metamask_mint_ethereum.png" alt="Mint USDC on Ethereum" style="height:320px; width:auto;"></a>
<a href="/images/usdc_injective_30_cctp_bridge_complete.png" target="_blank"><img src="/images/usdc_injective_30_cctp_bridge_complete.png" alt="Bridge complete" style="height:320px; width:auto;"></a>
</div>

Gas for the approve and burn is paid in **INJ**. Gas for the mint on Ethereum is paid in **ETH**.

---

## Typical fees

These were measured on mainnet for a test transfer of under 2 USDC. Ethereum gas varies with network load.

| Step | Fee paid in | Fee observed |
|---|---|---|
| Leg 1: approve and burn on Ethereum | ETH | ~$0.40 per transaction |
| Leg 1: Fast transfer | USDC | under 0.01 USDC |
| Leg 2: IBC Injective → Gonka | INJ | ~0.0004 INJ (< $0.01) |
| Leg 3: IBC Gonka → Injective | GNK | ~0.0003 GNK |
| Leg 4: approve and burn on Injective | INJ | < $0.01 |
| Leg 4: mint on Ethereum | ETH | ~$0.60 |

Ethereum gas is the main cost of this route. The IBC legs cost fractions of a cent.

---

## Troubleshooting

| Symptom | Cause | What to do |
|---|---|---|
| The CCTP bridge shows `Balance: 0 USDC` | The wallet holds ETH, but no USDC | Swap ETH to USDC on Ethereum first. Check that MetaMask is on **Ethereum Mainnet** and the right account is connected |
| **Mint on destination** shows `Nonce already used` | A relayer has already minted your USDC | Check your balance on Injective. Don't retry |
| The IBC transfer fails for insufficient fees | No native INJ (leg 2) or no GNK (leg 3) | Add a small amount of the gas token to that address |
| Gonka is missing from **Destination Chain** in **Add IBC channel** | Gonka is not added in Keplr, or Keplr hasn't reloaded | Add Gonka in **Add/Remove Chains**, then close and reopen Keplr |
| **Advanced IBC Transfer** card is missing | Manual IBC is off | **Settings → Advanced → Manual IBC Transfer → ON** |

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
