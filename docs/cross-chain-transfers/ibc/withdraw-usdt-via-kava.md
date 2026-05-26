# Withdraw USDT via Kava (Gonka → Ethereum)

**Use case:** spendable IBC USDT is already available in a Gonka wallet balance, and the target route is Gonka → Kava Cosmos → Kava EVM → Ethereum.

The guide describes the **full path** to Ethereum. The route can stop after any completed leg: IBC USDT can remain on **Kava in Keplr**, move to **Kava EVM in MetaMask**, or continue to **Ethereum**.

**Disclaimer:** This guide is **not financial advice**. Route parameters, supported assets, fees, and wallet / bridge UIs can change. Always verify the current route, addresses, and amounts before sending funds.

## Important: this guide is for IBC USDT

This guide covers **IBC USDT on Gonka / Kava Cosmos**.

Do **not** confuse it with:

- native **ERC-20 USDT** on Ethereum
- exchange USDT balances
- USDT on other networks

Before sending funds, always check:

- asset denom
- source network
- destination network
- destination address

## Route overview

The route has **three steps**:

1. **Gonka → Kava (Cosmos)** in **Keplr**
2. **Kava → Kava EVM** in **[app.kava.io](https://app.kava.io)**
3. **Kava EVM → Ethereum** in **[Stargate](https://stargate.finance/transfer)**

## Before starting

Requirements:

- **Spendable USDT on Gonka** in the wallet balance
- Some **`GNK`** for Gonka transaction fees
- Some **KAVA** for Kava / Kava EVM fees
- Some **ETH** for Ethereum fees
- **Keplr** and **MetaMask** installed
- A **small test transfer first**

**Useful official pages:**

- Keplr help, including IBC: [help.keplr.app](https://help.keplr.app/)
- Kava app, including transfer + wKAVA: [app.kava.io](https://app.kava.io) — transfer: [app.kava.io/transfer](https://app.kava.io/transfer)
- Kava Help Center: [help.app.kava.io](https://help.app.kava.io/)
- Stargate bridge UI: [stargate.finance/transfer](https://stargate.finance/transfer)
- Kava guide on bridging USDT with Stargate: [How to Bridge USDt with Stargate](https://www.kava.io/news/how-to-bridge-usdt-with-stargate)

## Important: use the right address at each step

- In **Step 1**, send to the **Kava Cosmos address** in Keplr: **`kava1...`**
- In **Step 2**, connect both wallets inside **app.kava.io**
- In **Step 3**, receive on the **Ethereum address** in MetaMask: **`0x...`**

---

## Step 1 — Send USDT from Gonka to Kava (Cosmos)

This step sends funds from **Gonka** to a **Kava Cosmos** address in **Keplr**.

### 1. Turn on manual IBC in Keplr

In **Keplr**:

**Settings → Advanced → Manual IBC Transfer → ON**

If labels differ slightly by version, use Keplr’s own docs: [help.keplr.app](https://help.keplr.app/).

### 2. Configure the transfer on Gonka

- Open **Advanced IBC Transfer** for the **USDT / USDt** asset

If Keplr shows **Add IBC channel** or **New IBC channel**, set:

- **Destination chain:** **Kava**
- **Source Channel Id:** **`channel-5`**

Then save the channel.

### 3. Copy the Kava address

- Make sure **Kava** is visible in Keplr
- Switch to **Kava**
- Copy the full **`kava1...`** address

### 4. Send a small test amount

On **Advanced IBC Transfer**, choose **Kava (`channel-5`)** from the destination dropdown.

Then:

- Paste the **`kava1...`** address
- Enter a **small test amount**
- Leave **memo** empty unless the destination is an **exchange deposit address** requiring a **memo/tag**
- Review the fee in **`ngonka`**
- Approve the transaction

USDT should appear on **Kava in Keplr**.

---

## Step 2 — Move USDT from Kava IBC to Kava EVM

This step moves funds from **Kava Cosmos** to **Kava EVM**.

Start with a small test amount.

### 1. Open the Kava transfer tool

Open the **Transfer** page: [app.kava.io/transfer](https://app.kava.io/transfer).

### 2. Connect both wallets

- Connect **Keplr** for the **Kava** IBC side
- Connect **MetaMask** for the **Kava EVM** side

### 3. Set the route

Choose:

- **Asset:** **USDT**
- **Sending chain:** **Kava IBC**
- **Receiving chain:** **Kava EVM**
- Click **Transfer**

USDT should appear on **Kava EVM in MetaMask**.

Kava’s help article on moving USDT across Kava surfaces, with the relevant direction here being **Cosmos → Kava EVM**: [How to transfer USDt to Cosmos chains with a single click](https://help.app.kava.io/article/44-how-to-transfer-usdt-to-cosmos-chains-with-a-single-click).

### If USDT does not appear in MetaMask

MetaMask may not show the token automatically. Manual token import may be required.

Kava help documentation has listed the following **USDT contract on Kava EVM**:

`0x919C1c267BC06a7039e03fcc2eF738525769109c`

Before using the contract for a real transfer, verify the contract again in:

- the current **[Kava Help Center](https://help.app.kava.io/)**
- the **[app.kava.io](https://app.kava.io)** UI
- the wallet’s token information

If MetaMask asks for decimals, use **6**.

---

## Step 3 — Bridge USDT from Kava EVM to Ethereum

This step bridges funds from **Kava EVM** to **Ethereum mainnet**.

### 1. Open Stargate

Open: [stargate.finance/transfer](https://stargate.finance/transfer).

Background from Kava on this bridge pattern: [How to Bridge USDt with Stargate](https://www.kava.io/news/how-to-bridge-usdt-with-stargate).

### 2. Make sure MetaMask is on Kava EVM

Before starting, MetaMask should be connected to **Kava EVM**.

The source network is **Kava EVM**, not Ethereum.

### 3. Set the bridge route

In Stargate, choose:

- **From / Source:** **Kava EVM**
- **To / Destination:** **Ethereum**
- **Asset:** **USDT**

In some UIs, the source may be shown simply as **Kava**. The important condition is matching the network where USDT sits after Step 2.

### 4. Review fees and send a small test

Before confirming:

- Check the **bridge fee**
- Check the **estimated received amount**
- Send a **small test first**

Then approve the transaction in MetaMask.

USDT should appear on **Ethereum Mainnet in MetaMask**.

### If Stargate does not offer this route

Stop there.

Do **not** guess an alternative bridge.

If **USDT from Kava EVM to Ethereum** is not shown, the route may be paused, changed, or temporarily unavailable.

---

## Step 4 — Confirm the funds on Ethereum

- Switch MetaMask to **Ethereum Mainnet**
- Check the **USDT** balance for the receiving address
- If needed, import the token manually

A commonly used Ethereum mainnet USDT contract is:

`0xdAC17F958D2ee523a2206206994597C13D831ec7`

Before importing, verify the current contract in a trusted source such as:

- **Tether**
- **[Etherscan](https://etherscan.io/)**
- the wallet’s verified token list

After the test amount arrives, repeat the same flow for the remaining balance.

---

## Optional — Move KAVA between Kava Cosmos and Kava EVM

If KAVA is needed on the other side for gas, use: [app.kava.io/evm/wkava](https://app.kava.io/evm/wkava).

Step-by-step guide from Kava: [Send KAVA to and from Kava Cosmos and Kava EVM](https://help.app.kava.io/article/26-send-kava-to-and-from-kava-cosmos-and-kava-evm).

---

## Advanced note — verify the Gonka IBC channel before large transfers

For most users, channel verification is **not required for a small test transfer**.

To verify the current Gonka outbound channel before sending a larger amount, check the channel with:

```bash
curl -sS "https://node1.gonka.ai:8443/chain-api/ibc/core/channel/v1/channels" | jq '.channels[] | select(.port_id=="transfer") | {gonka_channel_id:.channel_id, kava_counterparty:.counterparty.channel_id}'
```

At the time of guide preparation, the Gonka → Kava transfer used:

- **Gonka side:** `channel-5`
- **Kava side:** `channel-161`

When sending **from Gonka**, use the **Gonka-side channel**, which is **`channel-5`**.

---

## Final safety reminder

Before sending the full amount, make sure:

- Step 1 ended with USDT visible on **Kava in Keplr**
- Step 2 ended with USDT visible on **Kava EVM in MetaMask**
- Step 3 offers **USDT from Kava EVM to Ethereum** in **Stargate**
- The test transfer completed successfully

If any check fails, stop and review before moving the full balance.

---

Always double-check the route, addresses, assets, and amounts, and start with a small test transfer.
