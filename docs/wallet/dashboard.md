# Getting Started with the Dashboard
The Gonka Dashboard on Ping.pub is your main interface to interact with the network. It lets you observe live on-chain activity, manage your wallet-linked developer accounts, and analyze inference workloads and token usage in real time. Before using the dashboard features, you need to connect your wallet. Once your wallet is connected, the dashboard becomes fully interactive, showing detailed token balances, live metrics, and inference analytics.

## 1. Gonka Account
To use the dashboard, you need a Gonka account.

- Already have one? Proceed to Set Up Keplr Wallet
- New user? Visit the Developer or Host Quickstart to create an account.

## 2. Set Up Keplr Wallet
To interact with the Gonka network through your wallet, we recommend using [Keplr](https://www.keplr.app/) (a browser extension wallet built for Cosmos-based chains).

- If you have a Keplr wallet, proceed to Step 3.
- If you haven’t set it up yet, follow the steps below. 

2.1. Go to [the official Keplr website](https://www.keplr.app/) and click “Get Keplr wallet”.

![](/images/dashboard_keplr_step_2_1.png){ width=400 }

2.2. Choose an extension for your browser.

![](/images/dashboard_keplr_step_2_2.png){ width=400 }

2.3. Add an extension to the browser.

![](/images/dashboard_keplr_step_2_3.png){ width=400 }

2.4. Give necessary permissions.

![](/images/dashboard_keplr_step_2_4.png){ width=400 }

2.5. Click “Import an existing wallet.”

![](/images/dashboard_keplr_step_2_5.png){ width=400 }

2.6. Click “Use recovery phrase or Private key”. Enter your mnemonic seed phrase (created via the CLI [in this step](https://testnet.productscience.ai/developer/quickstart/#2-create-an-account)), or paste your [private key](https://testnet.productscience.ai/developer/quickstart/#4-inference-using-modified-openai-sdk:~:text=request%20in%20Python%3A-,3.1.%20Export%20your%20private%20key%20(for%20demo/testing%20only).,export%20GONKA_PRIVATE_KEY%3D%3Cyour%2Dprivate%2Dkey%3E,-4.%20Inference%20using).

![](/images/dashboard_keplr_step_2_6.png){ width=400 }

2.7. Give your wallet a name for easy reference.

![](/images/dashboard_keplr_step_2_7.png){ width=400 }

Step 2.8. Select Cosmos Hub and Etherium.

![](/images/dashboard_keplr_step_2_8.png){ width=400 }

2.9. Done — your Gonka account has been successfully imported into Keplr!

![](/images/dashboard_keplr_step_2_9.png){ width=400 }

## 3. Connect wallet
3.1. Head over to www.gonka.ping.pub, a popular and trusted web wallet and block explorer for Cosmos-based chains. In the top-right corner, click “Connect Wallet” to get started.
![](/images/dashboard_ping_pub_3_1.png){ width=400 }

3.2. Select Keplr and hit Connect.
![](/images/dashboard_ping_pub_3_2.png){ width=400 }

3.3. You will see a prompt for adding a custom Gonka chain to your wallet. Approve and add Gonka chain.
![](/images/dashboard_ping_pub_3_3.png){ width=400 }


3.4. Done! You successfully added your account to Keplr wallet.
![](/images/dashboard_ping_pub_3_4.png){ width=400 }

3.5. (Optional) If you want to add additional gonka account (in case you have multiple Gonka accounts), follow these steps.

3.5.1. Open the extension and click on the account icon in the top-right corner of the extension window.

![](/images/dashboard_ping_pub_3_5_1.png){ width=400 }

3.5.2. Click the “Add wallet” button.

![](/images/dashboard_ping_pub_3_5_2.png){ width=400 }

3.5.3. Click “Import an Existing Wallet”.

![](/images/dashboard_ping_pub_3_5_3.png){ width=400 }

3.5.4. Enter your mnemonic seed phrase (created via the CLI [in this step](https://testnet.productscience.ai/developer/quickstart/#2-create-an-account)), or paste your [private key](https://testnet.productscience.ai/developer/quickstart/#4-inference-using-modified-openai-sdk:~:text=request%20in%20Python%3A-,3.1.%20Export%20your%20private%20key%20(for%20demo/testing%20only).,export%20GONKA_PRIVATE_KEY%3D%3Cyour%2Dprivate%2Dkey%3E,-4.%20Inference%20using).
![](/images/dashboard_ping_pub_3_5_4.png){ width=400 }

3.5.5. Give your wallet a name for easy reference.
![](/images/dashboard_ping_pub_3_5_5.png){ width=400 }

3.5.6. Select Cosmos Hub and Etherium.
![](/images/dashboard_ping_pub_3_5_6.png){ width=400 }

3.5.7. Done — your Gonka account has been successfully imported into Keplr!
![](/images/dashboard_ping_pub_3_5_7.png){ width=400 }

## Dashboard Overview

Once your wallet is connected, the dashboard unlocks access to all metrics and insights.
### Metrics

| **Metric**                        | **Description**                                       |
|----------------------------------|-------------------------------------------------------|
| **AI Tokens (last week/7 epochs)** | Total tokens used in successful inferences             |
| **Active Providers**             | Number of validators currently providing inference     |
| **Models**                       | Number of active models registered on the network      |
| **Throughput**                   | Combined compute power contributed by Hosts            |
| **Users**                        | *(coming soon)*                                        |

### Developer Tools

| **Feature**                  | **Description**                                              | **Link**                |
|-----------------------------|--------------------------------------------------------------|-------------------------|
| **Buy GNK**                 | Live GNK/USDT price and purchase link                        | [Step-by-step guide](https://gonka.ping.pub) |
| **Use Gonka API**           | OpenAI-compatible API access with private key                | [Developer quickstart](https://testnet.productscience.ai/developer/quickstart/#4-inference-using-modified-openai-sdk) |

### Developer Account List
When a wallet is connected, you'll see all accounts you own, with:

- Account address (linked to its detail page)
- Balance in GNK
Accounts are hidden if the wallet is not connected (for privacy).

### Account Detail

| **Metric**             | **Description**                                                                 |
|------------------------|---------------------------------------------------------------------------------|
| **Balance**            | View GNK balance                                                                |
| **Send**               | Send GNK tokens to another address                                              |
| **Buy**                | One-click GNK purchase *(coming soon)*                                          |
| **Spent**              | GNK used recently (last week/7 Epochs) *(coming soon)*                          |
| **AI Token Usage**     | Token usage (in/out) over the last week or 7 Epochs                             |
| **Recent Transactions**| Status for transactions or Inferences (Started / Finished / Validated)  <br> Block Height  <br> Amount (fees in coins)                                  |

### AI Inferences (Epoch Metrics)

| **Metric**               | **Description**                                                                 |
|--------------------------|---------------------------------------------------------------------------------|
| **Inferences Today**     | Total requests processed this epoch                                             |
| **Inferences Last Week** | Total requests processed over the last week or 7 epochs                         |
| **AI Tokens Today**      | Token flow (input + output) today                                               |
| **AI Tokens Last Week**  | Token flow over the last week or 7 epochs                                       |
| **Model Performance**    | Quantization format *(coming soon)*  <br> Context length *(coming soon)* <br> Input/output token pricing <br> Max throughput *(coming soon)* <br> Latency *(coming soon)* |
| **Token Usage Graph**    | 30-day daily token usage chart per model                                        |
