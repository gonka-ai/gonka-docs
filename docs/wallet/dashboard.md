# Getting Started with the Dashboard
Gonka Dashboard on Ping.pub instantly displays your coin balances, allows you to buy and send coins, shows live on-chain activity (including a list of transactions and their statuses), real-time inference analytics, and more. Connect Keplr or Leap wallet to unlock full interactivity – manage your accounts, monitor inference workloads, and analyze AI token usage in real-time.

## 1. Gonka Account
To use the dashboard, you need a Gonka account.

- Already have one? Proceed to the ["Set Up External Wallet"](https://testnet.productscience.ai/wallet/dashboard/#2-set-up-external-wallet) section.
- New user? Visit [the Developer](https://testnet.productscience.ai/developer/quickstart/) or [Host](https://testnet.productscience.ai/participant/quickstart/) Quickstart to create an account.

## 2. Set Up External Wallet
To interact with the Gonka network through your wallet, we recommend using [Keplr](https://www.keplr.app/) or [Leap](https://www.leapwallet.io/) (a browser extension wallet built for Cosmos-based chains).

??? note "What is a wallet?"
    A crypto wallet serves as a secure container for a user’s public and private cryptographic keys, enabling them to manage, transfer, and purchase cryptocurrencies. Gonka is built on the Cosmos-SDK blockchain framework and can be accessed using Keplr or Leap wallet (other wallet support is coming soon).
    
- If you have a Keplr or Leap wallet, proceed to the ["Connect wallet"](https://testnet.productscience.ai/wallet/dashboard/#3-connect-wallet) section.
- If you haven’t set it up yet, follow the steps below.

=== "Keplr"

    2.1. Go to [the official Keplr website](https://www.keplr.app/) and click “Get Keplr wallet”.
    
    ![](/images/dashboard_keplr_step_2_1.png){ width=400 }
    
    2.2. Choose an extension for your browser.
    
    ![](/images/dashboard_keplr_step_2_2.png){ width=400 }
    
    2.3. Add an extension to the browser.
    === "Fire Fox"
    
        ![](/images/dashboard_keplr_step_2_3.png){ width=400 }
    
    === "Google Chrome"
    
        ![](/images/dashboard_keplr_step_2_3_2.png){ width=400 }
    
    2.4. Click “Import an existing wallet.”
    
    ![](/images/dashboard_keplr_step_2_4.png){ width=400 }
    
    2.5. Click “Use recovery phrase or Private key”. Enter your mnemonic seed phrase (created via the CLI [in this step](https://testnet.productscience.ai/developer/quickstart/#2-create-an-account)), or paste your [private key](https://testnet.productscience.ai/developer/quickstart/#4-inference-using-modified-openai-sdk:~:text=request%20in%20Python%3A-,3.1.%20Export%20your%20private%20key%20(for%20demo/testing%20only).,export%20GONKA_PRIVATE_KEY%3D%3Cyour%2Dprivate%2Dkey%3E,-4.%20Inference%20using).
    
    ![](/images/dashboard_keplr_step_2_5.png){ width=400 }
    
    2.6. Give your wallet a name for easy reference.
    
    ![](/images/dashboard_keplr_step_2_6.png){ width=400 }
    
    2.7. Select Cosmos Hub and Ethereum.
    
    ![](/images/dashboard_keplr_step_2_7.png){ width=400 }
    
    2.8. Done — your Gonka account has been successfully imported into Keplr!
    
    ![](/images/dashboard_keplr_step_2_8.png){ width=400 }

=== "Leap"
    
    2.1. Go to [the official Leap website](https://www.leapwallet.io/) and click “Download Leap”.
    
    ![](/images/dashboard_leap_step_2_1.png){ width=400 }
    
    2.2. Add an extension to the browser.
    
    ![](/images/dashboard_leap_step_2_2.png){ width=400 }
    
    2.3. Click “Import an existing wallet.”
    
    ![](/images/dashboard_leap_step_2_3.png){ width=400 }
    
    2.4. Choose to import recovery phrase (mnemonic seed phrase, created via the CLI [in this step](https://testnet.productscience.ai/developer/quickstart/#2-create-an-account)) or paste your [private key](https://testnet.productscience.ai/developer/quickstart/#4-inference-using-modified-openai-sdk:~:text=request%20in%20Python%3A-,3.1.%20Export%20your%20private%20key%20(for%20demo/testing%20only).,export%20GONKA_PRIVATE_KEY%3D%3Cyour%2Dprivate%2Dkey%3E,-4.%20Inference%20using).
    
    ![](/images/dashboard_leap_step_2_4.png){ width=400 }
    
    === "If you entered the recovery (mnemonic/seed) phrase"
        When you enter your seed phrase in Leap, it shows multiple wallets (Wallet 1, Wallet 2, etc.) because each one is a different address generated from the same seed. This is normal. Since you created your wallet using the CLI, it most likely used the default path, which in Leap is: Wallet 1. To be sure:
    
        - Check the address you got from the CLI
        - Find the matching address in Leap (Wallet 1, 2, etc.)
        - Choose the one that matches — that’s your real wallet
        
        ![](/images/dashboard_leap_step_2_5.png){ width=400 }

    === "If you entered the private key"
        Create your password
    
        ![](/images/dashboard_leap_step_2_6.png){ width=400 }
    
    2.5. Done — your Gonka account has been successfully imported into Leap!
    
    ![](/images/dashboard_leap_step_2_7.png){ width=400 }

## 3. Connect wallet
3.1. Head over to [Ping.Pub](https://ping.pub/), a popular and trusted web wallet and block explorer for Cosmos-based chains. In the top-right corner, click “Connect Wallet” to get started.
![](/images/dashboard_ping_pub_3_1.png){ width=400 }

3.2. Select Keplr or Leap and hit Connect.
![](/images/dashboard_ping_pub_3_2.png){ width=400 }

3.3. You will see a prompt for adding a custom Gonka chain to your wallet. Approve and add Gonka chain.
![](/images/dashboard_ping_pub_3_3.png){ width=400 }


3.4. Done! You successfully added your account to the wallet.
![](/images/dashboard_ping_pub_3_4.png){ width=400 }

??? note "Optional: How to add an additional Gonka account into wallet — click to view steps"

    === "Keplr"
    
        Open the extension and click on the account icon in the top-right corner of the extension window.
        
        ![](/images/dashboard_ping_pub_3_5_1.png){ width=400 }
        
        Click the “Add wallet” button.
        
        ![](/images/dashboard_ping_pub_3_5_2.png){ width=400 }
        
        Click “Import an Existing Wallet”.
        
        ![](/images/dashboard_ping_pub_3_5_3.png){ width=400 }
        
        Enter your mnemonic seed phrase (created via the CLI [in this step](https://testnet.productscience.ai/developer/quickstart/#2-create-an-account)), or paste your [private key](https://testnet.productscience.ai/developer/quickstart/#4-inference-using-modified-openai-sdk:~:text=request%20in%20Python%3A-,3.1.%20Export%20your%20private%20key%20(for%20demo/testing%20only).,export%20GONKA_PRIVATE_KEY%3D%3Cyour%2Dprivate%2Dkey%3E,-4.%20Inference%20using).
        ![](/images/dashboard_ping_pub_3_5_4.png){ width=400 }
        
        Give your wallet a name for easy reference.
        ![](/images/dashboard_ping_pub_3_5_5.png){ width=400 }
        
        Select Cosmos Hub and Etherium.
        ![](/images/dashboard_ping_pub_3_5_6.png){ width=400 }
        
        Done — your Gonka account has been successfully imported into Keplr!
        ![](/images/dashboard_ping_pub_3_5_7.png){ width=400 }
    
    === "Leap"
        
        Open the extension and click on the frog icon and wallet name in the top center button of the extension window.
        
        ![](/images/dashboard_leap_step_3_5_1.png){ width=400 height=100 }
        
        Click the “Create/Import wallet” button.
        
        ![](/images/dashboard_leap_step_3_5_2.png){ width=400 }
        
        Enter your recovery (mnemonic/seed) phrase (created via the CLI [in this step](https://testnet.productscience.ai/developer/quickstart/#2-create-an-account)), or paste your [private key](https://testnet.productscience.ai/developer/quickstart/#4-inference-using-modified-openai-sdk:~:text=request%20in%20Python%3A-,3.1.%20Export%20your%20private%20key%20(for%20demo/testing%20only).,export%20GONKA_PRIVATE_KEY%3D%3Cyour%2Dprivate%2Dkey%3E,-4.%20Inference%20using).
        
        ![](/images/dashboard_leap_step_3_5_3.png){ width=400 }
        
        Done — your Gonka account has been successfully imported into Leap wallet (click on the frog icon and wallet name in the top center button to switch between wallets).
        
        ![](/images/dashboard_leap_step_3_5_4.png){ width=400 }

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
    | **Buy GNK**                 | Live GNK/USDT price and purchase link                        | [Step-by-step guide](https://gonka.ping.pub) |
    | **Use Gonka API**           | OpenAI-compatible API access with private key                | [Developer quickstart](https://testnet.productscience.ai/developer/quickstart/#4-inference-using-modified-openai-sdk) |

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
    | **Token Usage Graph**    | 30-day daily token usage chart per model                                        |
