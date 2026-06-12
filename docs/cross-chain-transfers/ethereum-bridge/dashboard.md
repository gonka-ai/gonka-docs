!!! warning
    Always start with a small test transaction. Bridge transfers are irreversible, so before moving large amounts, send a small amount first and confirm it arrives as expected.

The dedicated Bridge smart contract, controlled by the Gonka consensus, is active on Ethereum at the address:

```text
0x972a7a92d92796a98801a8818bcf91f1648f2f68
```

---

# Bridge via dashboard (UI guide)

The dashboard is the easiest way to bridge. It handles the key derivation for you (see [Addresses and keys](addresses-and-keys.md)), so you don't need to import private keys or compute addresses by hand.

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

## Add wrapped tokens to Keplr

Wrapped ERC-20 tokens (such as wUSDC and wUSDT) are CW-20 tokens on the Gonka chain. Keplr does not detect CW-20 tokens automatically, so you need to add them as custom tokens. Once added, they will appear in your Keplr asset list alongside your other tokens.

!!! note
    IBC tokens (transferred via IBC, not the Ethereum bridge) appear in Keplr automatically. The manual steps below are only needed for bridge-wrapped CW-20 tokens.

**Step 1.** Open your Keplr wallet, click the menu icon (three horizontal lines) in the top-right corner, and select **Manage Asset List**.

<a href="/images/bridge_widget_12.png" target="_blank"><img src="/images/bridge_widget_12.png" style="width:auto; height:337.5px;"></a>

**Step 2.** Click the **+** button in the top-right corner to add a custom token.

<a href="/images/bridge_widget_13.png" target="_blank"><img src="/images/bridge_widget_13.png" style="width:auto; height:337.5px;"></a>

**Step 4.** On the **Add Custom Token** page, select **Gonka** from the chain dropdown. Paste the CW-20 contract address into the **Contract Address** field. The token metadata (name, symbol, decimals) will be filled in automatically. Click **Confirm**.

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

**Step 5.** Done — the token now appears in your Keplr wallet as a **Gonka CW20** token.

=== "USDC"

    <a href="/images/bridge_widget_15.png" target="_blank"><img src="/images/bridge_widget_15.png" style="width:auto; height:337.5px;"></a>

=== "USDT"

    <a href="/images/bridge_widget_19.png" target="_blank"><img src="/images/bridge_widget_19.png" style="width:auto; height:337.5px;"></a>

---

## Typical withdrawal (Gonka → Ethereum)

1. Connect your wallet, select the **WITHDRAW** toggle in the bridge widget.
2. Choose the wrapped token and amount, and enter the destination **Ethereum** address.
3. Approve the withdrawal. The dashboard collects the BLS signature for the current epoch and submits the release transaction to the bridge contract on Ethereum.

!!! tip
    Prefer the dashboard if you are not comfortable with the CLI or with handling raw private keys. The step-by-step CLI flows are documented in [Deposit USDT](deposit-usdt.md), [Withdraw USDT](withdraw-usdt.md), [Deposit GNK](deposit-gnk.md), and [Withdraw GNK](withdraw-gnk.md) if you prefer to do it manually.
