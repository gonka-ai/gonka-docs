!!! warning
    Always start with a small test transaction. Bridge transfers are irreversible, so before moving large amounts, send a small amount first and confirm it arrives as expected.

The dedicated Bridge smart contract, controlled by the Gonka consensus, is active on Ethereum at the address:

```text
0x972a7a92d92796a98801a8818bcf91f1648f2f68
```

---

# Bridge via dashboard (UI guide)

The dashboard is the easiest way to bridge. It handles the key derivation for you (see [Addresses and keys](addresses-and-keys.md)), so you don't need to import private keys or compute addresses by hand.

!!! tip
    Prefer the dashboard if you are not comfortable with the CLI or with handling raw private keys. The step-by-step CLI flows are documented in [Deposit USDT](deposit-usdt.md), [Withdraw USDT](withdraw-usdt.md), [Deposit GNK](deposit-gnk.md), and [Withdraw GNK](withdraw-gnk.md) if you prefer to do it manually.

## What the dashboard does for you

* **Derives the correct addresses.** Connect the Ethereum wallet you bridge with, and the dashboard shows the matching `gonka1…` address the bridge will deliver tokens to — so you always know where your wrapped tokens will land.
* **Warns about seed-phrase accounts.** If you are using a wallet whose Ethereum and Gonka keys come from the same **mnemonic**, the dashboard detects this and warns you, because seed-derived accounts use different keys on each chain — so your Gonka wallet won't show the bridged tokens by default. You still control the receiving address (you can derive the matching key from the same mnemonic), but it requires an extra manual step. Read [Addresses and keys](addresses-and-keys.md) for the full explanation.
* **Shows your bridged balances** in a Bridge Assets section, so you can confirm a deposit arrived.
* **Reports chain status**, so you can see if the chain is degraded before initiating a transfer.
* **Prompts for bridge epoch updates** when the Ethereum bridge is behind the Gonka chain. If you see **A Bridge needs epoch update**, click **Update bridge** to submit the missing epoch key. This is a normal Ethereum transaction, so the connected wallet pays gas. See [Bridge epoch update](bridge-epoch-update.md).

## Supported flows

The dashboard supports the full set of transfers without using the CLI:

* **Ethereum → Gonka**: deposit any ERC-20 (USDT, USDC, WETH, …) and receive the wrapped token on Gonka.
* **Gonka → Ethereum**: withdraw a wrapped token back to an Ethereum address.
* **GNK ↔ WGNK**: bridge native GNK to Ethereum as WGNK and back.

---

## Deposit ERC-20 tokens (Ethereum → Gonka)

This section walks you through depositing ERC-20 tokens from Ethereum to Gonka using the bridge widget on the native dashboard. The examples below use USDC and USDT — the flow is identical for any supported ERC-20 token.

A deposit goes through three stages:

1. **Lock tokens on Ethereum** — your tokens are sent to the bridge contract on Ethereum and locked.
2. **Validator signatures** — Gonka validators observe the finalized Ethereum deposit and collect BLS signatures.
3. **Mint on Gonka** — the wrapped tokens are minted on Gonka and delivered to your derived `gonka1…` address.

### 1. Open the dashboard

Open one of the genesis nodes in your browser:

- [https://node1.gonka.ai:8443](https://node1.gonka.ai:8443)
- [https://node2.gonka.ai:8443](https://node2.gonka.ai:8443)

Navigate to the **Developers** section in the left sidebar. You will see the bridge widget at the bottom of the page with **WITHDRAW** / **DEPOSIT** toggles.

<a href="/images/bridge_widget_2.png" target="_blank"><img src="/images/bridge_widget_2.png" style="width:500px; height:auto;"></a>

### 2. Connect your Keplr wallet

Make sure the **DEPOSIT** toggle is selected. Click **CONNECT WALLET**.

A dialog will appear with the available wallet options. Select **KEPLR**.

<a href="/images/bridge_widget_3.png" target="_blank"><img src="/images/bridge_widget_3.png" style="width:500px; height:auto;"></a>

!!! note "Keplr shows "Not Installed"?"
    If you see a "Not Installed" message, you need to install the Keplr browser extension first. Follow the instructions in [Create a Gonka account → Keplr browser extension](../../wallet/create-account.md) to set it up, then return here.

Enter your Keplr password if prompted. Once connected, the widget will show **Keplr Connected** with your shortened Gonka address and your GNK balance. Click **CONTINUE** to proceed.

<a href="/images/bridge_widget_4.png" target="_blank"><img src="/images/bridge_widget_4.png" style="width:500px; height:auto;"></a>

!!! warning "Seed-phrase (mnemonic) accounts"
    If your Gonka account was created from a **seed phrase** (mnemonic) rather than a raw private key, the bridge widget will detect the address mismatch and warn you. This happens because Ethereum and Gonka derive **different keys** from the same seed phrase, so tokens will be delivered to a different `gonka1…` address than your wallet currently shows. The funds are not lost — you can derive the matching key from the same mnemonic — but it requires a manual derivation step. If you see this warning, stop and read [Addresses and keys](addresses-and-keys.md) before proceeding.

### 3. Choose token and amount

On Step 2, select the token you want to deposit from the **Token** dropdown and enter the **Amount**. The widget displays your current balance of that token on Ethereum. The **Receiving address on Gonka** is auto-filled from your connected wallet.

The widget also shows the estimated **processing time** and **approximate fee** in ETH.

=== "USDC"

    <a href="/images/bridge_widget_5.png" target="_blank"><img src="/images/bridge_widget_5.png" style="width:500px; height:auto;"></a>

=== "USDT"

    <a href="/images/bridge_widget_8.png" target="_blank"><img src="/images/bridge_widget_8.png" style="width:500px; height:auto;"></a>

Click **REVIEW & BRIDGE**.

### 4. Confirm the transaction

Your wallet will open a **Confirm Transaction** screen. Review the details carefully before approving:

- **Token and amount** — verify the correct token and amount.
- **From** — your Ethereum address (the sender).
- **To** — the bridge contract address (`0x972a7A92…648f2F68`). This is expected — you are sending tokens to the bridge, which will then mint wrapped tokens on Gonka.
- **Tx Fee** — the Ethereum gas fee you will pay for this transaction.

=== "USDC"

    <a href="/images/bridge_widget_6.png" target="_blank"><img src="/images/bridge_widget_6.png" style="width:500px; height:auto;"></a>

=== "USDT"

    <a href="/images/bridge_widget_9.png" target="_blank"><img src="/images/bridge_widget_9.png" style="width:500px; height:auto;"></a>

Click **Approve** to submit the transaction.

!!! warning
    Double-check the details before confirming. Bridge transfers are **irreversible**. If anything looks wrong, click **✕** to cancel and start over.

### 5. Deposit complete

After the transaction is confirmed on Ethereum, the bridge will lock your tokens, collect validator signatures, and mint the wrapped tokens on Gonka. The widget will show a **Deposit complete** screen with a summary of the operation.

=== "USDC"

    <a href="/images/bridge_widget_7.png" target="_blank"><img src="/images/bridge_widget_7.png" style="width:500px; height:auto;"></a>

=== "USDT"

    <a href="/images/bridge_widget_10.png" target="_blank"><img src="/images/bridge_widget_10.png" style="width:500px; height:auto;"></a>

From this screen you can:

- Click **VIEW ON EXPLORER** to see the transaction details on Ethereum.
- Click **TRANSFER MORE TOKENS** to make another deposit.
- Click **DISCONNECT** to disconnect your wallet.

### 6. Verify your deposit

You can confirm your wrapped tokens arrived in several ways:

- **In the dashboard**: open `https://node2.gonka.ai:8443/dashboard/gonka/account/<your_gonka_address>` and check your balances.
- **Via the transaction link** shown on the Deposit complete screen.
- **In Keplr**: wrapped tokens (CW-20) do not appear in Keplr automatically — follow the steps below to add them manually.

---

### Add wrapped tokens to Keplr

Wrapped ERC-20 tokens (such as wUSDC and wUSDT) are CW-20 tokens on the Gonka chain. Keplr does not detect CW-20 tokens automatically, so you need to add them as custom tokens. Once added, they will appear in your Keplr asset list alongside your other tokens.

!!! note
    IBC tokens (transferred via IBC, not the Ethereum bridge) appear in Keplr automatically. The manual steps below are only needed for bridge-wrapped CW-20 tokens.

**Step 1.** Open your Keplr wallet, click the menu icon (three horizontal lines) in the top-right corner, and select **Manage Asset List**.

<a href="/images/bridge_widget_12.png" target="_blank"><img src="/images/bridge_widget_12.png" style="width:auto; height:337.5px;"></a>

**Step 2.** Click the **+** button in the top-right corner to add a custom token.

<a href="/images/bridge_widget_13.png" target="_blank"><img src="/images/bridge_widget_13.png" style="width:auto; height:337.5px;"></a>

**Step 3.** On the **Add Custom Token** page, select **Gonka** from the chain dropdown. Paste the CW-20 contract address into the **Contract Address** field. The token metadata (name, symbol, decimals) will be filled in automatically. Click **Confirm**.

=== "USDC"

    Contract address:
    ```
    gonka1fa83z7np903k9vh63guy82qthtv373d7vjeq0y7xeqh50rzn8vtssffkre
    ```

    <a href="/images/bridge_widget_14.png" target="_blank"><img src="/images/bridge_widget_14.png" style="width:auto; height:337.5px;"></a>

=== "USDT"

    Contract address:
    ```
    gonka15ggwj9un6qrmu4nj5ev6l7kpdcr00td03ff2mmj4cyhl8u8vjd2qnl3hgk
    ```

    <a href="/images/bridge_widget_18.png" target="_blank"><img src="/images/bridge_widget_18.png" style="width:auto; height:337.5px;"></a>

**Step 4.** Done — the token now appears in your Keplr wallet as a **Gonka CW20** token.

=== "USDC"

    <a href="/images/bridge_widget_15.png" target="_blank"><img src="/images/bridge_widget_15.png" style="width:auto; height:337.5px;"></a>

=== "USDT"

    <a href="/images/bridge_widget_19.png" target="_blank"><img src="/images/bridge_widget_19.png" style="width:auto; height:337.5px;"></a>

---

## Withdraw tokens (Gonka → Ethereum)

This section walks you through withdrawing tokens from Gonka back to Ethereum using the bridge widget. The examples below use GNK and USDC — the flow is identical for any supported token.

A withdrawal goes through three stages, tracked by a progress indicator in the widget:

1. **Burn tokens on Gonka** — the wrapped token is burned (or native GNK is locked) on the Gonka chain.
2. **Validator signatures** — Gonka validators produce a BLS aggregate signature authorizing the release.
3. **Release on Ethereum** — the original token is released from the bridge contract on Ethereum (or WGNK is minted).

### 1. Open the dashboard

Open one of the genesis nodes in your browser:

- [https://node1.gonka.ai:8443](https://node1.gonka.ai:8443)
- [https://node2.gonka.ai:8443](https://node2.gonka.ai:8443)

Navigate to the **Developers** section in the left sidebar. Select the **WITHDRAW** toggle in the bridge widget.

<a href="/images/bridge_withdraw_1.png" target="_blank"><img src="/images/bridge_withdraw_1.png" style="width:500px; height:auto;"></a>

### 2. Connect your Keplr wallet

Make sure the **WITHDRAW** toggle is selected. Click **CONNECT WALLET**.

A dialog will appear with the available wallet options. Select **KEPLR**.

<a href="/images/bridge_withdraw_2.png" target="_blank"><img src="/images/bridge_withdraw_2.png" style="width:500px; height:auto;"></a>

!!! note "Keplr shows "Not Installed"?"
    If you see a "Not Installed" message, you need to install the Keplr browser extension first. Follow the instructions in [Create a Gonka account → Keplr browser extension](../../wallet/create-account.md) to set it up, then return here.

Enter your Keplr password if prompted. Once connected, the widget will show **Keplr Connected** with your shortened Gonka address and your GNK balance. Click **CONTINUE** to proceed.

<a href="/images/bridge_withdraw_3.png" target="_blank"><img src="/images/bridge_withdraw_3.png" style="width:500px; height:auto;"></a>

!!! warning "Seed-phrase (mnemonic) accounts"
    If your Gonka account was created from a **seed phrase** (mnemonic) rather than a raw private key, the bridge widget will detect the address mismatch and warn you. This happens because Ethereum and Gonka derive **different keys** from the same seed phrase, so tokens will be released to a different Ethereum address than your wallet currently shows. The funds are not lost — you can derive the matching key from the same mnemonic — but it requires a manual derivation step. If you see this warning, stop and read [Addresses and keys](addresses-and-keys.md) before proceeding.

### 3. Choose token and amount

On Step 2, select the token you want to withdraw from the **Token** dropdown and enter the **Amount**. The widget displays your current balance of that token on Gonka. The **Destination Address** is auto-filled from your connected wallet.

The widget also shows the bridge epoch status and the **approximate fee** in ETH.

=== "GNK"

    <a href="/images/bridge_withdraw_4.png" target="_blank"><img src="/images/bridge_withdraw_4.png" style="width:500px; height:auto;"></a>

=== "USDC (Ethereum)"

    <a href="/images/bridge_withdraw_8.png" target="_blank"><img src="/images/bridge_withdraw_8.png" style="width:500px; height:auto;"></a>

Click **REVIEW & BRIDGE**.

### 4. Confirm the burn transaction on Gonka

Keplr will open a **Confirm Transaction** popup for the Gonka chain. This transaction burns the wrapped token (or locks native GNK) on Gonka — this is the **Burn tokens on Gonka** step shown in the progress tracker. Review the details and click **Approve**.

- For **GNK**: the message type is `MsgRequestBridgeMint`, which locks your GNK on Gonka and requests minting of WGNK on Ethereum.
- For **ERC-20 tokens** (USDC, USDT, …): the message is an `Execute Wasm Contract` call to the wrapped token's CW-20 contract with a `withdraw` payload.
- **Tx Fee** — 0 GNK (no gas fee on the Gonka chain for this transaction).

=== "GNK"

    <a href="/images/bridge_withdraw_5.png" target="_blank"><img src="/images/bridge_withdraw_5.png" style="width:500px; height:auto;"></a>

=== "USDC (Ethereum)"

    <a href="/images/bridge_withdraw_9.png" target="_blank"><img src="/images/bridge_withdraw_9.png" style="width:500px; height:auto;"></a>

!!! warning
    Double-check the details before confirming. Bridge transfers are **irreversible**. If anything looks wrong, click **✕** to cancel and start over.

After you approve, the progress tracker marks **Burn tokens on Gonka** as complete. The Gonka validators then automatically collect and aggregate their BLS signatures (**Validator signatures** step) — no action is required from you during this stage.

### 5. Confirm the release transaction on Ethereum

Once the validators have produced the BLS aggregate signature (**Validator signatures** — done), Keplr opens a second popup — this time for the **Ethereum chain**. This transaction executes the bridge contract (`0x972a7a92…648f2f68`) to release the tokens on Ethereum (the **Release on Ethereum** step).

- **To** — the bridge contract address on Ethereum.
- **Tx Fee** — the Ethereum gas fee (paid in ETH). The exact amount depends on current gas prices.

=== "GNK"

    <a href="/images/bridge_withdraw_6.png" target="_blank"><img src="/images/bridge_withdraw_6.png" style="width:500px; height:auto;"></a>

=== "USDC (Ethereum)"

    <a href="/images/bridge_withdraw_10.png" target="_blank"><img src="/images/bridge_withdraw_10.png" style="width:500px; height:auto;"></a>

Click **Approve** to submit the release transaction.

### 6. Withdrawal complete

After the release transaction is confirmed on Ethereum, the widget shows a **Withdrawal complete** screen with all three stages marked as done:

- **Burn tokens on Gonka** — done
- **Validator signatures** — done
- **Release on Ethereum** — done

=== "GNK"

    <a href="/images/bridge_withdraw_7.png" target="_blank"><img src="/images/bridge_withdraw_7.png" style="width:500px; height:auto;"></a>

=== "USDC (Ethereum)"

    <a href="/images/bridge_withdraw_11.png" target="_blank"><img src="/images/bridge_withdraw_11.png" style="width:500px; height:auto;"></a>

From this screen you can:

- Click **VIEW ON EXPLORER** to see the transaction details on Ethereum.
- Click **TRANSFER MORE TOKENS** to make another withdrawal.
- Click **DISCONNECT** to disconnect your wallet.

### 7. Verify your withdrawal

You can confirm your tokens arrived in several ways:

- **In the dashboard**: check the transaction via the explorer link on the Withdrawal complete screen.
- **In your Ethereum wallet**: the released ERC-20 tokens (USDC, USDT, etc.) should appear in your wallet balance.
- **WGNK in Keplr**: if you withdrew GNK, the resulting WGNK token is added to your Keplr wallet **automatically** and appears in your asset list without any manual steps.

<a href="/images/bridge_withdraw_12.png" target="_blank"><img src="/images/bridge_withdraw_12.png" style="width:auto; height:337.5px;"></a>
