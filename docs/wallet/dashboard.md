# Getting Started with the Dashboard
Gonka Web Dashboard instantly displays your coin balances, allows you to buy and send coins, shows live on-chain activity (including a list of transactions and their statuses), real-time inference analytics, and more. Connect Keplr or Leap wallet to unlock full interactivity – manage your accounts, monitor inference workloads, and analyze AI token usage in real-time.

## 1. Gonka Account
To use the dashboard, you need a Gonka account.

- Already have one? Proceed to the ["Set Up External Wallet"](https://testnet.productscience.ai/wallet/dashboard/#2-set-up-external-wallet) section.
- New user? Visit [the Developer](https://testnet.productscience.ai/developer/quickstart/){target=_blank} or [Host](https://testnet.productscience.ai/participant/quickstart/){target=_blank} Quickstart to create an account.

## 2. Set Up External Wallet
To interact with the Gonka network through your wallet, we recommend using [Keplr](https://www.keplr.app/){target=_blank} or [Leap](https://www.leapwallet.io/){target=_blank} (a browser extension wallet built for Cosmos-based chains).

??? note "What is a wallet?"
    A crypto wallet serves as a secure container for a user's public and private cryptographic keys, enabling them to manage, transfer, and purchase cryptocurrencies. Gonka is built on the Cosmos-SDK blockchain framework and can be accessed using Keplr or Leap wallet (other wallet support is coming soon).
    
- If you have a Keplr or Leap wallet, proceed to the ["Connect wallet"](https://testnet.productscience.ai/wallet/dashboard/#3-connect-wallet) section.
- If you haven't set it up yet, follow the steps below.

=== "Keplr"

    2.1. Go to [the official Keplr website](https://www.keplr.app/){target=_blank} and click "Get Keplr wallet".

    <a href="/images/dashboard_keplr_step_2_1.png" target="_blank"><img src="/images/dashboard_keplr_step_2_1.png" style="width:500px; height:auto;"></a>

    2.2. Choose an extension for your browser.

    <a href="/images/dashboard_keplr_step_2_2.png" target="_blank"><img src="/images/dashboard_keplr_step_2_2.png" style="width:500px; height:auto;"></a>

    2.3. Add an extension to the browser.

    === "Firefox"

        <a href="/images/dashboard_keplr_step_2_3.png" target="_blank"><img src="/images/dashboard_keplr_step_2_3.png" style="width:500px; height:auto;"></a>

    === "Google Chrome"

        <a href="/images/dashboard_keplr_step_2_3_2.png" target="_blank"><img src="/images/dashboard_keplr_step_2_3_2.png" style="width:500px; height:auto;"></a>

    2.4. Click "Import an existing wallet."

    <a href="/images/dashboard_keplr_step_2_4.png" target="_blank"><img src="/images/dashboard_keplr_step_2_4.png" style="width:500px; height:auto;"></a>

    2.5. Click "Use recovery phrase or private key".

    <a href="/images/dashboard_keplr_step_2_5.png" target="_blank"><img src="/images/dashboard_keplr_step_2_5.png" style="width:500px; height:auto;"></a>

    2.6. Paste your private key that was created via CLI in [this step](https://testnet.productscience.ai/developer/quickstart/#4-inference-using-modified-openai-sdk:~:text=your%2Daccount%2Daddress%3E-,3.%20Add%20Private%20Key%20to%20environment%20variables,export%20GONKA_PRIVATE_KEY%3D%3Cyour%2Dprivate%2Dkey%3E,-4.%20Inference%20using). Do not import your recovery (mnemonic/seed) phrase, as the bridge requires direct access to the raw private key to sign transactions and ensure proper interoperability with Ethereum.

    <a href="/images/dashboard_keplr_step_2_6_private key.png" target="_blank"><img src="/images/dashboard_keplr_step_2_6_private_key.png" style="width:500px; height:auto;"></a>

    2.7. Give your wallet a name for easy reference.

    <a href="/images/dashboard_keplr_step_2_6.png" target="_blank"><img src="/images/dashboard_keplr_step_2_6.png" style="width:500px; height:auto;"></a>

    2.8. Select Cosmos Hub and Ethereum.

    <a href="/images/dashboard_keplr_step_2_7.png" target="_blank"><img src="/images/dashboard_keplr_step_2_7.png" style="width:500px; height:auto;"></a>

    2.9. Done — your Gonka account has been successfully imported into Keplr!

    <a href="/images/dashboard_keplr_step_2_8.png" target="_blank"><img src="/images/dashboard_keplr_step_2_8.png" style="width:500px; height:auto;"></a>

=== "Leap"

    2.1. Go to [the official Leap website](https://www.leapwallet.io/){target=_blank} and click "Download Leap".

    <a href="/images/dashboard_leap_step_2_1.png" target="_blank"><img src="/images/dashboard_leap_step_2_1.png" style="width:500px; height:auto;"></a>

    2.2. Add an extension to the browser.

    <a href="/images/dashboard_leap_step_2_2.png" target="_blank"><img src="/images/dashboard_leap_step_2_2.png" style="width:500px; height:auto;"></a>

    2.3. Click "Import an existing wallet."

    <a href="/images/dashboard_leap_step_2_3.png" target="_blank"><img src="/images/dashboard_leap_step_2_3.png" style="width:500px; height:auto;"></a>

    2.4. Choose "Import private key". Do not choose "Import recovery phrase", as the bridge requires direct access to the raw private key to sign transactions and ensure proper interoperability with Ethereum.

    <a href="/images/dashboard_leap_step_2_4.png" target="_blank"><img src="/images/dashboard_leap_step_2_4.png" style="width:500px; height:auto;"></a>

    2.5. Paste the private key that was created in [this step via CLI](https://testnet.productscience.ai/developer/quickstart/#4-inference-using-modified-openai-sdk:~:text=request%20in%20Python%3A-,3.1.%20Export%20your%20private%20key%20(for%20demo/testing%20only).,export%20GONKA_PRIVATE_KEY%3D%3Cyour%2Dprivate%2Dkey%3E,-4.%20Inference%20using).

    <a href="/images/dashboard_leap_2_5_private_key.png" target="_blank"><img src="/images/dashboard_leap_2_5_private_key.png" style="width:500px; height:auto;"></a>

    2.6. Create your password

    <a href="/images/dashboard_leap_step_2_6.png" target="_blank"><img src="/images/dashboard_leap_step_2_6.png" style="width:500px; height:auto;"></a>

    2.7. Done — your Gonka account has been successfully imported into Leap!

    <a href="/images/dashboard_leap_step_2_7.png" target="_blank"><img src="/images/dashboard_leap_step_2_7.png" style="width:500px; height:auto;"></a>

## 3. Connect wallet
3.1. Head over to [Gonka Web Dashboard](https://ping.pub/){target=_blank}. In the top-right corner, click "Connect Wallet" to get started.

<a href="/images/dashboard_ping_pub_3_1.png" target="_blank"><img src="/images/dashboard_ping_pub_3_1.png" style="width:500px; height:auto;"></a>

3.2. Select Keplr or Leap and hit Connect.

<a href="/images/dashboard_ping_pub_3_2.png" target="_blank"><img src="/images/dashboard_ping_pub_3_2.png" style="width:500px; height:auto;"></a>

3.3. You will see a prompt to add a custom Gonka chain to your wallet. Approve and add Gonka chain.

<a href="/images/dashboard_ping_pub_3_3.png" target="_blank"><img src="/images/dashboard_ping_pub_3_3.png" style="width:500px; height:auto;"></a>

3.4. Done! You successfully added your account to the wallet.

<a href="/images/dashboard_ping_pub_3_4.png" target="_blank"><img src="/images/dashboard_ping_pub_3_4.png" style="width:500px; height:auto;"></a>

??? note "Optional: How to add an additional Gonka account into wallet — click to view steps"

    === "Keplr"
    
        Open the extension and click on the account icon in the top-right corner of the extension window.
        
        <a href="/images/dashboard_ping_pub_3_5_1.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_1.png" style="width:auto; height:337.5px;"></a>
        
        Click the "Add wallet" button.
        
        <a href="/images/dashboard_ping_pub_3_5_2.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_2.png" style="width:auto; height:337.5px; display:block;"></a>
        
        Click "Import an Existing Wallet".
        
        <a href="/images/dashboard_ping_pub_3_5_3.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_3.png" style="width:450px; height:auto; display:block;"></a>
        
        Click "Use recovery phrase or private key"

        <a href="/images/dashboard_ping_pub_3_5_4.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_4.png" style="width:450px; height:auto;"></a>

        Paste your private key that was created via the CLI in [this step](https://testnet.productscience.ai/developer/quickstart/#4-inference-using-modified-openai-sdk:~:text=request%20in%20Python%3A-,3.1.%20Export%20your%20private%20key%20(for%20demo/testing%20only).,export%20GONKA_PRIVATE_KEY%3D%3Cyour%2Dprivate%2Dkey%3E,-4.%20Inference%20using). Do not import the recovery (mnemonic/seed) phrase, as the bridge requires direct access to the raw private key to sign transactions and ensure proper interoperability with Ethereum.

        <a href="/images/dashboard_ping_pub_3_5_4.png" target="_blank"><img src="/images/dashboard_keplr_step_3_5_5_private_key.png" style="width:450px; height:auto;"></a>
        
        Give your wallet a name for easy reference.
        
        <a href="/images/dashboard_ping_pub_3_5_5.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_5.png" style="width:450px; height:auto;"></a>
        
        Select Cosmos Hub and Ethereum.

        <a href="/images/dashboard_ping_pub_3_5_6.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_6.png" style="width:450px; height:auto; display:block;"></a>
        
        Done — your Gonka account has been successfully imported into Keplr!
        
        <a href="/images/dashboard_ping_pub_3_5_7.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_7.png" style="width:450px; height:auto;"></a>
    
    === "Leap"
        
        Open the extension and click on the frog icon and wallet name in the top center button of the extension window.
        
        <a href="/images/dashboard_leap_step_3_5_1.png" target="_blank"><img src="/images/dashboard_leap_step_3_5_1.png" style="width:250px; height:auto;"></a>
        
        Click the "Create/Import wallet" button.
        
        <a href="/images/dashboard_leap_step_3_5_2.png" target="_blank"><img src="/images/dashboard_leap_step_3_5_2.png" style="width:250px; height:auto;"></a>
        
        Choose "Import using private key". Do not choose "Import using recovery phrase", as the bridge requires direct access to the raw private key to sign transactions and ensure proper interoperability with Ethereum. 
        
        <a href="/images/dashboard_leap_step_3_5_3.png" target="_blank"><img src="/images/dashboard_leap_step_3_5_3.png" style="width:250px; height:auto;"></a>

        Paste your private key that was created in [this step via CLI. ](https://testnet.productscience.ai/developer/quickstart/#4-inference-using-modified-openai-sdk:~:text=request%20in%20Python%3A-,3.1.%20Export%20your%20private%20key%20(for%20demo/testing%20only).,export%20GONKA_PRIVATE_KEY%3D%3Cyour%2Dprivate%2Dkey%3E,-4.%20Inference%20using)

        <a href="/images/dashboard_leap_step_3_5_3.png" target="_blank"><img src="/images/dashboard_leap_step_3_5_4_private_key.png" style="width:250px; height:auto;"></a>
        
        Done — your Gonka account has been successfully imported into Leap wallet (click on the frog icon and wallet name in the top center button to switch between wallets).
        
        <a href="/images/dashboard_leap_step_3_5_4.png" target="_blank"><img src="/images/dashboard_leap_step_3_5_4.png" style="width:250px; height:auto;"></a>

## Dashboard Overview

Once your wallet is connected, the dashboard unlocks access to all metrics and insights.

=== "Overview"

    | **Metric**                        | **Description**                                       |
    |----------------------------------|-------------------------------------------------------|
    | **AI Tokens (last week/7 epochs)** | Total tokens used in successful inferences             |
    | **Active Providers**             | Number of validators currently providing inference     |
    | **Models**                       | Number of active models registered on the network      |
    | **Throughput**                   | Combined compute power contributed by Hosts            |
    | **Users**                        | *(coming soon)*                                        |

=== "Developer Tools"

    | **Feature**                  | **Description**                                              | **Link**                |
    |-----------------------------|--------------------------------------------------------------|-------------------------|
    | **Buy GNK**                 | Live GNK/USDT price and purchase link                        | [Step-by-step guide](https://gonka.ping.pub){target=_blank} |
    | **Use Gonka API**           | OpenAI-compatible API access with private key                | [Developer quickstart](https://testnet.productscience.ai/developer/quickstart/#4-inference-using-modified-openai-sdk){target=_blank} |

=== "Account Details"

    | **Metric**             | **Description**                                                                 |
    |------------------------|---------------------------------------------------------------------------------|
    | **Balance**            | View GNK balance                                                                |
    | **Send**               | Send GNK tokens to another address                                              |
    | **Buy**                | One-click GNK purchase *(coming soon)*                                          |
    | **Spent**              | GNK used recently (last week/7 Epochs) *(coming soon)*                          |
    | **AI Token Usage**     | Token usage (in/out) over the last week or 7 Epochs                             |
    | **Recent Transactions**| Status for transactions or Inferences (Started / Finished / Validated)  <br> Block Height  <br> Amount (fees in coins)                                  |

=== "AI Inferences (Epoch Metrics)"

    | **Metric**               | **Description**                                                                 |
    |--------------------------|---------------------------------------------------------------------------------|
    | **Inferences Today**     | Total requests processed this epoch                                             |
    | **Inferences Last Week** | Total requests processed over the last week or 7 epochs                         |
    | **AI Tokens Today**      | Token flow (input + output) today                                               |
    | **AI Tokens Last Week**  | Token flow over the last week or 7 epochs                                       |
    | **Model Performance**    | Quantization format *(coming soon)*  <br> Context length *(coming soon)* <br> Input/output token pricing <br> Max throughput *(coming soon)* <br> Latency *(coming soon)* |
    | **Token Usage Graph**    | 30-day daily token usage chart per model 
