---
name: index.md
---

# Developer Quickstart

!!! note "Inference for free" 
    During the initial network phase, controlled by a governance parameter `GracePeriodEndEpoch` with a proposed default of 90 epochs (~90 days), the dynamic pricing system is bypassed and all inference costs are set to zero (until ~ November 20, 2025).

This guide explains how to create a developer account in Gonka and submit an inference request using Gonka API.

??? note "How Gonka differs from traditional AI APIs"
    Gonka isn’t just another AI API — it’s a cryptographic protocol for provable inference. By eliminating centralized identity, Gonka removes the traditional single point of failure that plagues SaaS-based AI services. Here is a quick comparison table to help you understand the differences between a Traditional AI API and the Gonka API.
    
    | **Aspect**                         | **Traditional AI API** <br> *(OpenAI, Anthropic, etc.)* | **Gonka API** |
    |-----------------------------------|---------------------------------------------------------|---------------|
    | **Model provenance & verifiable output** | Models are hosted and versioned by the provider, but there’s no way to cryptographically verify which model actually produced a given output. There’s no proof that the model wasn’t switched, fine-tuned behind the scenes, or A/B tested on you. | Every inference request and response can be cryptographically linked to a specific model hash and execution environment. This enables verifiable provenance — anyone can prove that a particular model version generated a specific output. |
    | **Censorship resistance**         | All access is controlled centrally — providers can restrict or terminate accounts at any time. This includes enforcement of geographic, political, or commercial policies. | Inference requests are signed and broadcast through a decentralized network. As long as you hold your private key and connect to a node, you can run inference. The system is designed to be uncensorable, unless restrictions are applied by a transparent, protocol-level consensus. |
    | **Auditability & transparency**   | Logging, billing, and usage tracking are fully controlled by the API provider. Users cannot independently verify their own usage or inspect how pricing, latency, or errors were handled. | Every interaction is signed and timestamped, enabling independent audit trails. You can prove when and how an inference occurred, which model was used, whether the results were altered, and ensure that disputes can be publicly resolved. |
    | **Transparent tokenomics**       | Billing rates have limited insight into compute pricing, model costs, or system load. | Tokenomics are on-chain or protocol-defined, meaning pricing mechanisms are transparent and inspectable. Users convert GNK into AI Tokens with predictable, traceable exchange logic, enabling clear forecasting of inference costs and supply-demand–driven economics. |

---

## 1. Define variables

Before creating an account, set up the required environment variables:

```bash
export ACCOUNT_NAME=<your-desired-account-name>
export NODE_URL=<http://random-node-url>
```

- Replace `<your-desired-account-name>` with your chosen account name.

??? note "Things to know about account names"
    This name is not recorded on-chain — it exists only in your local key store.
    Uniqueness is local: creating two keys with the same name will overwrite the existing one (with a CLI warning). If you proceed, the original key will be permanently lost. It is highly recommended to back up your public and private keys before performing this operation.

- Replace `<http://random-node-url>` with a random Node URL. You can either:
    - Use one of the **genesis nodes** from the list below.
    - Fetch the **current list of active participants** and select a random node.

Do not forget to write it down, you will need it in the next step.

??? note "Why a random node?"
    To avoid over-reliance on the genesis node and encourage decentralization, Gonka recommends selecting a random active node from the current epoch. This improves network load distribution and resilience to node outages.

??? note "How to choose a Node URL?"
    You can choose any node randomly — you **do not** need to consider which model it runs. At this point, the node is used purely as a gateway to fetch network state and broadcast transactions. All nodes expose the same public API.

=== "Genesis nodes"
    Set the `NODE_URL` to one of the genesis nodes:
    ```bash title="Genesis Node List"
    http://185.216.21.98:8000
    http://36.189.234.197:18026
    http://36.189.234.237:17241
    http://node1.gonka.ai:8000
    http://node2.gonka.ai:8000
    http://node3.gonka.ai:8000
    http://47.236.26.199:8000
    http://47.236.19.22:18000
    http://gonka.spv.re:8000
    ```
    
=== "Current list of active participants"
    Alternatively, you can select a random active participant from the current epoch. Open the link or run the following command to fetch the list of active participants along with a cryptographic proof for verification:
    === "Link"
        [http://node2.gonka.ai:8000/v1/epochs/current/participants](http://node2.gonka.ai:8000/v1/epochs/current/participants)

    === "Command"
        ```bash
        curl http://node2.gonka.ai:8000/v1/epochs/current/participants
        ```
    
## 2. Create an account

=== "Option 1: Via `inferenced` CLI tool"
    
    Download the `inferenced` CLI tool (the latest `inferenced` binary for your system is [here](https://github.com/gonka-ai/gonka/releases)).
    
    ??? note "What is the `inferenced` CLI tool?" 
        The `inferenced` CLI tool is a command-line interface utility used to interact with the Gonka network. It is a standalone, executable binary that allows users to create and manage Gonka accounts, perform inference tasks, upload models, and automate various operations through scripted commands.
        
    ??? note "Enabling Execution on Mac OS"
        On Mac OS, after downloading the inferenced binary, you may need to enable execution permissions manually. Follow these steps:
        
        1.	Open a terminal and navigate to the directory where the binary is located.
        
        2.	Run the following command to grant execution permission:
        ```
        chmod +x inferenced
        ```
        3.	Try running `./inferenced --help` to ensure it's working.
            
        4.	If you see a security warning when trying to run `inferenced`, go to System Settings → Privacy & Security.
        
        5.	Scroll down to the warning about `inferenced` and click "Allow Anyway".
    
    You can create an account with the following command:
    ```bash
    ./inferenced create-client $ACCOUNT_NAME \
      --node-address $NODE_URL
    ```
    
    Make sure to securely save your passphrase — you'll need it for future access.
    
    This command will:
    
    - Generate a keypair
    - Save it to `~/.inference`
    - Return your account address, public key, and mnemonic phrase (store it securely in a hard copy as well!)

    ```bash
    - address: <your-account-address>
      name: ACCOUNT_NAME
      pubkey: '{"@type":"...","key":"..."}'
      type: local
    ```
    
    The account stores your balance, add it to environment variable `GONKA_ADDRESS`, or `.env` file.
    
    ```bash
    export GONKA_ADDRESS=<your-account-address>
    ```

    You will use this account to purchase gonka (GNK) coins and pay for inference requests.

    Add Private Key to environment variables.
    
    If you'd like to perform the request, export your private key.
    
    ```bash
    ./inferenced keys export $ACCOUNT_NAME --unarmored-hex --unsafe
    ```
    
    This command outputs a plain-text private key.
    
    Add it to the environment variable `GONKA_PRIVATE_KEY`, or the `.env` file.
    ```bash
    export GONKA_PRIVATE_KEY=<your-private-key>
    ```
    To retrieve a list of all locally stored accounts, execute the following command:
    ```
    inferenced keys list [--keyring-backend test]
    ```

=== "Option 2: Via Keplr (external wallet)"

    Go to [the official Keplr website](https://www.keplr.app/){target=_blank} and click "Get Keplr wallet".
    
    <a href="/images/dashboard_keplr_step_2_1.png" target="_blank"><img src="/images/dashboard_keplr_step_2_1.png" style="width:500px; height:auto;"></a>
    
    Choose an extension for your browser.
    
    <a href="/images/dashboard_keplr_step_2_2.png" target="_blank"><img src="/images/dashboard_keplr_step_2_2.png" style="width:500px; height:auto;"></a>
    
    Add the selected extension to your browser.
    
    === "Firefox"
    
        <a href="/images/dashboard_keplr_step_2_3.png" target="_blank"><img src="/images/dashboard_keplr_step_2_3.png" style="width:500px; height:auto;"></a>
    
    === "Google Chrome"
    
        <a href="/images/dashboard_keplr_step_2_3_2.png" target="_blank"><img src="/images/dashboard_keplr_step_2_3_2.png" style="width:500px; height:auto;"></a>
    
    Click "Create a new wallet".

    <a href="/images/dashboard_keplr_step_2_4.png" target="_blank"><img src="/images/dashboard_keplr_step_2_4.png" style="width:500px; height:auto;"></a>

    === "Connect with Google"

        Click "Connect with Google".
    
        <a href="/images/keplr_welcome_to_keplr.png" target="_blank"><img src="/images/keplr_welcome_to_keplr.png" style="width:500px; height:auto;"></a>
    
        Set Up Your Wallet.
    
        <a href="/images/keplr_set_up_your_wallet.png" target="_blank"><img src="/images/keplr_set_up_your_wallet.png" style="width:500px; height:auto;"></a>
    
        Backup your private key securely. Anyone with your private key can have access to your assets. If you lose access to your Gmail Account, the only way to recover your wallet is using your private key. Keep this in a safe place.
    
        <a href="/images/keplr_back_up_private_key.png" target="_blank"><img src="/images/keplr_back_up_private_key.png" style="width:500px; height:auto;"></a>

    === "Create new recovery phrase"

        !!! note "Important Notice: Limited Functionality"
            This option creates an account using a mnemonic phrase and does not support transactions through the bridge. If you want to perform transactions via the bridge, please use Option 1: Via `inferenced` CLI tool or Option 2: Via Keplr (external wallet, "Connect with Google") instead.
        
        Click "Create new recovery phrase"
    
        <a href="/images/keplr_welcome_to_keplr.png" target="_blank"><img src="/images/keplr_welcome_to_keplr.png" style="width:500px; height:auto;"></a>

        DO NOT share your recovery phrase with ANYONE. Anyone with your recovery phrase can have full control over your assets. Please stay vigilant against phishing attacks at all times. Back up the phrase safely. You will never be able to restore your account without your recovery phrase.
    
        <a href="/images/keplr_new_recovery_phrase.png" target="_blank"><img src="/images/keplr_new_recovery_phrase.png" style="width:500px; height:auto;"></a>
    
        Verify your recovery phrase, create wallet name and password.
    
        <a href="/images/keplr_verify_your_recovery_phrase.png" target="_blank"><img src="/images/keplr_verify_your_recovery_phrase.png" style="width:500px; height:auto;"></a>
    
        Select Cosmos Hub and Ethereum.
        
        <a href="/images/dashboard_keplr_step_2_7.png" target="_blank"><img src="/images/dashboard_keplr_step_2_7.png" style="width:500px; height:auto;"></a>
            
        Your Keplr wallet has been created.
        
        <a href="/images/dashboard_keplr_step_2_8.png" target="_blank"><img src="/images/dashboard_keplr_step_2_8.png" style="width:500px; height:auto;"></a>
        
    **Open Gonka’s decentralized Dashboard**
    
    Choose a random node from the `inference_url` list of genesis-nodes.
    
    - [http://185.216.21.98:8000](http://185.216.21.98:8000)
    - [http://69.19.136.233:8000](http://69.19.136.233:8000)
    - [http://36.189.234.197:18026](http://36.189.234.197:18026)
    - [http://36.189.234.237:17241](http://36.189.234.237:17241)
    - [http://node1.gonka.ai:8000](http://node1.gonka.ai:8000)
    - [http://node2.gonka.ai:8000](http://node2.gonka.ai:8000)
    - [http://node3.gonka.ai:8000](http://node3.gonka.ai:8000)
    - [http://47.236.26.199:8000](http://47.236.26.199:8000)
    - [http://47.236.19.22:18000](http://47.236.19.22:18000)
    - [http://gonka.spv.re:8000](http://gonka.spv.re:8000)
    
    ??? note "An alternative, fully decentralized approach to choosing a random node from the list of active Hosts"
        Open the Hosts list: [http://node2.gonka.ai:8000/v1/epochs/current/participants](http://node2.gonka.ai:8000/v1/epochs/current/participants)
        
        Choose any active Host from the list.
        
        Copy their `inference_url` value.
        
    Paste the `inference_url` into your browser to load the dashboard.
    
    Once opened, you’ll see real-time data streamed directly from the Host’s node — including network statistics, active workloads, and inference metrics.
    
    In the top-right corner, click "Connect Wallet" to get started.
    
    <a href="/images/dashboard_ping_pub_3_1.png" target="_blank"><img src="/images/dashboard_ping_pub_3_1.png" style="width:500px; height:auto;"></a>
    
    Select Keplr and hit Connect.
    
    <a href="/images/dashboard_ping_pub_3_2.png" target="_blank"><img src="/images/dashboard_ping_pub_3_2.png" style="width:500px; height:auto;"></a>
    
    You will see a prompt to add a custom Gonka chain to your wallet. Approve and add Gonka chain.
    
    <a href="/images/dashboard_ping_pub_3_3.png" target="_blank"><img src="/images/dashboard_ping_pub_3_3.png" style="width:500px; height:auto;"></a>
        
    Done! Your Gonka Developer account has been successfully created.
    
    <a href="/images/dashboard_ping_pub_3_4.png" target="_blank"><img src="/images/dashboard_ping_pub_3_4.png" style="width:500px; height:auto;"></a>

    Open the extension and click on the account icon in the top-right corner of the extension window.
            
    <a href="/images/dashboard_ping_pub_3_5_1.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_1.png" style="width:auto; height:337.5px;"></a>

    Navigate three dots and click "View private key" if you "connected with Google" or "View recovery phrase" if you created an account using a "recovery phrase".

    === "Connect with Google"

        <a href="/images/keplr_view_private_key.png" target="_blank"><img src="/images/keplr_view_private_key.png" style="width:auto; height:337.5px;"></a>

    === "Create new recovery phrase"

        <a href="/images/keplr_view_recovery_phrase.png" target="_blank"><img src="/images/keplr_view_recovery_phrase.png" style="width:auto; height:337.5px;"></a>

    Enter your password. 
   
    <a href="/images/keplr_enter_your_password.png" target="_blank"><img src="/images/keplr_enter_your_password.png" style="width:auto; height:337.5px;"></a>

    Copy your private key or recovery phrase and store it securely (a hard copy is preferred).   

    ??? note "Optional: How to add an additional Gonka account in Keplr wallet — click to view steps"

        Open the extension and click on the account icon in the top-right corner of the extension window.
            
        <a href="/images/dashboard_ping_pub_3_5_1.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_1.png" style="width:auto; height:337.5px;"></a>
            
        Click the "Add wallet" button.
            
        <a href="/images/dashboard_ping_pub_3_5_2.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_2.png" style="width:auto; height:337.5px; display:block;"></a>
            
        Click "Import an Existing Wallet".
            
        <a href="/images/dashboard_ping_pub_3_5_3.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_3.png" style="width:450px; height:auto; display:block;"></a>
            
        Click "Use recovery phrase or private key"
    
        <a href="/images/dashboard_ping_pub_3_5_4.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_4.png" style="width:450px; height:auto;"></a>
    
        Paste your private key. You can import an account created using a recovery (mnemonic/seed) phrase. However, bridge functionality will be limited, as the bridge requires direct access to the raw private key to sign transactions and ensure full interoperability with Ethereum.
    
        <a href="/images/dashboard_ping_pub_3_5_4.png" target="_blank"><img src="/images/dashboard_keplr_step_3_5_5_private_key.png" style="width:450px; height:auto;"></a>
            
        Give your wallet a name for easy reference.
            
        <a href="/images/dashboard_ping_pub_3_5_5.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_5.png" style="width:450px; height:auto;"></a>
            
        Select Cosmos Hub and Ethereum.
    
        <a href="/images/dashboard_ping_pub_3_5_6.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_6.png" style="width:450px; height:auto; display:block;"></a>
            
        Done — your Gonka account has been successfully imported into Keplr!
            
        <a href="/images/dashboard_ping_pub_3_5_7.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_7.png" style="width:450px; height:auto;"></a>

    Add it to the environment variable `GONKA_PRIVATE_KEY,` or the `.env` file.
    ```
    export GONKA_PRIVATE_KEY=<your-private-key>
    ```
    To retrieve a list of all locally stored accounts, execute the following command:
    ```
    inferenced keys list [--keyring-backend test]
    ```

=== "Option 3: Via Leap (external wallet)"

    !!! note "Important Notice: Limited Functionality"

        This option creates an account using a mnemonic phrase and does not support transactions through the bridge. If you want to perform transactions via the bridge, please use Option 1: Via `inferenced` CLI tool or Option 2: Via Keplr (external wallet, "Connect with Google") instead.
    
    Go to [the official Leap website](https://www.leapwallet.io/){target=_blank} and click "Download Leap".
    
    <a href="/images/dashboard_leap_step_2_1.png" target="_blank"><img src="/images/dashboard_leap_step_2_1.png" style="width:500px; height:auto;"></a>
    
    Add the selected extension to your browser.
    
    <a href="/images/dashboard_leap_step_2_2.png" target="_blank"><img src="/images/dashboard_leap_step_2_2.png" style="width:500px; height:auto;"></a>
    
    Click "Create a new wallet".
    
    <a href="/images/dashboard_leap_step_2_3.png" target="_blank"><img src="/images/dashboard_leap_step_2_3.png" style="width:500px; height:auto;"></a>

    Save your secret recovery phrase. Write down these words, your secret recovery phrase is the only way to recover your wallet and funds!

    <a href="/images/leap_your_secret_recovery_phrase.png" target="_blank"><img src="/images/leap_your_secret_recovery_phrase.png" style="width:500px; height:auto;"></a>

    Choose a password to secure & lock your wallet. Agree to the Terms & Conditions.

    <a href="/images/leap_create_your_password.png" target="_blank"><img src="/images/leap_create_your_password.png" style="width:500px; height:auto;"></a>

    Your Leap wallet has been created.

    <a href="/images/leap_you_are_all_set.png" target="_blank"><img src="/images/leap_you_are_all_set.png" style="width:500px; height:auto;"></a>

    **Open Gonka’s decentralized Dashboard**
    
    Choose a random node from the `inference_url` list of genesis-nodes
    
    - [http://185.216.21.98:8000](http://185.216.21.98:8000)
    - [http://69.19.136.233:8000](http://69.19.136.233:8000)
    - [http://36.189.234.197:18026](http://36.189.234.197:18026)
    - [http://36.189.234.237:17241](http://36.189.234.237:17241)
    - [http://node1.gonka.ai:8000](http://node1.gonka.ai:8000)
    - [http://node2.gonka.ai:8000](http://node2.gonka.ai:8000)
    - [http://node3.gonka.ai:8000](http://node3.gonka.ai:8000)
    - [http://47.236.26.199:8000](http://47.236.26.199:8000)
    - [http://47.236.19.22:18000](http://47.236.19.22:18000)
    - [http://gonka.spv.re:8000](http://gonka.spv.re:8000)
    
    ??? note "An alternative, fully decentralized approach to choosing a random node from the list of active Hosts"
        Open the Hosts list: [http://node2.gonka.ai:8000/v1/epochs/current/participants](http://node2.gonka.ai:8000/v1/epochs/current/participants)

        Choose any active Host from the list.
        
        Copy their `inference_url` value.
        
    Paste the `inference_url` into your browser to load the Gonka dashboard, which shows live on-chain activity.
    
    Once opened, you’ll see real-time data streamed directly from the Host’s node — including network statistics, active workloads, and inference metrics.
    
    In the top-right corner, click "Connect Wallet" to get started.
    
    <a href="/images/dashboard_ping_pub_3_1.png" target="_blank"><img src="/images/dashboard_ping_pub_3_1.png" style="width:500px; height:auto;"></a>
    
    Select Leap and hit Connect.
    
    <a href="/images/choose_wallet_leap.png" target="_blank"><img src="/images/choose_wallet_leap.png" style="width:500px; height:auto;"></a>
    
    You will see a prompt to add a custom Gonka chain to your wallet. Approve and add Gonka chain.
    
    <a href="/images/leap_add_network.png" target="_blank"><img src="/images/leap_add_network.png" style="width:500px; height:auto;"></a>

    Done! Your Gonka Developer account has been successfully created.

    <a href="/images/leap_created_gonka_account.png" target="_blank"><img src="/images/leap_created_gonka_account.png" style="width:500px; height:auto;"></a>

    Open the extension and navigate to the menu in the top-left corner.
            
    <a href="/images/leap_left_menu.png" target="_blank"><img src="/images/leap_left_menu.png" style="width:auto; height:337.5px;"></a>

    Click "Security & Privacy".

    <a href="/images/leap_security_privacy.png" target="_blank"><img src="/images/leap_security_privacy.png" style="width:auto; height:337.5px;"></a>

    Click "Show private key". 
   
    <a href="/images/leap_show_private_key.png" target="_blank"><img src="/images/leap_show_private_key.png" style="width:auto; height:337.5px;"></a>

    Enter your password.
    
    <a href="/images/leap_enter_password.png" target="_blank"><img src="/images/leap_enter_password.png" style="width:auto; height:337.5px;"></a>

    Copy your private key and store it securely (a hard copy is preferred).   

    ??? note "Optional: How to add an additional Gonka account to Leap wallet — click to view steps"            
        Open the extension and click on the frog icon and wallet name in the top center button of the extension window.
            
        <a href="/images/dashboard_leap_step_3_5_1.png" target="_blank"><img src="/images/dashboard_leap_step_3_5_1.png" style="width:250px; height:auto;"></a>
            
        Click the "Create/Import wallet" button.
            
        <a href="/images/dashboard_leap_step_3_5_2.png" target="_blank"><img src="/images/dashboard_leap_step_3_5_2.png" style="width:250px; height:auto;"></a>
            
        Choose "Import using private key". You can import an account created using a recovery (mnemonic/seed) phrase. However, bridge functionality will be limited, as the bridge requires direct access to the raw private key to sign transactions and ensure full interoperability with Ethereum. 
            
        <a href="/images/dashboard_leap_step_3_5_3.png" target="_blank"><img src="/images/dashboard_leap_step_3_5_3.png" style="width:250px; height:auto;"></a>
    
        Paste your private key or a recovery (mnemonic/seed) phrase.
    
        <a href="/images/dashboard_leap_step_3_5_3.png" target="_blank"><img src="/images/dashboard_leap_step_3_5_4_private_key.png" style="width:250px; height:auto;"></a>
            
        Done — your Gonka account has been successfully imported into Leap wallet (click on the frog icon and wallet name in the top center button to switch between wallets).
            
        <a href="/images/dashboard_leap_step_3_5_4.png" target="_blank"><img src="/images/dashboard_leap_step_3_5_4.png" style="width:250px; height:auto;"></a>

    Add it to the environment variable `GONKA_PRIVATE_KEY,` or the `.env` file.
    ```
    export GONKA_PRIVATE_KEY=<your-private-key>
    ```
    To retrieve a list of all locally stored accounts, execute the following command:
    ```
    inferenced keys list [--keyring-backend test]
    ```

## 3. Inference using modified OpenAI SDK

=== "Python"
    To use the Gonka API in Python, you can use the [Gonka OpenAI SDK for Python](https://github.com/gonka-ai/gonka-openai/tree/main/python). Get started by installing the SDK using pip:

    ```
    pip install gonka-openai
    ```

    !!! note "If you encounter build errors, you may need to install system-level libraries"
        ```
        brew install pkg-config secp256k1
        ```

    With the SDK installed, create a file called `example.py` and copy the example code into it:

    ```py linenums="1"
    import os
    from gonka_openai import GonkaOpenAI

    client = GonkaOpenAI(
        gonka_private_key=os.environ.get('GONKA_PRIVATE_KEY'),
        source_url=NODE_URL
    )

    response = client.chat.completions.create(
        model="Qwen/Qwen3-235B-A22B-Instruct-2507-FP8",
        messages=[
            { "role": "user", "content": "Write a one-sentence bedtime story about a unicorn" }
        ]
    )

    print(response.choices[0].message.content)
    ```

    Execute the code with `python example.py`. In a few moments, you should see the output of your API request.

=== "TypeScript"
    To use the Gonka API in server-side JavaScript environments like Node.js, Deno, or Bun, you can use the [Gonka OpenAI SDK for TypeScript and JavaScript](https://github.com/gonka-ai/gonka-openai/tree/main/typescript). Get started by installing the SDK using npm or your preferred package manager:

    ```
    npm install gonka-openai
    ```

    With the SDK installed, create a file called `example.mjs` and copy the example code into it:

    ```ts linenums="1"
    import { GonkaOpenAI } from 'gonka-openai';

    const endpoints = await resolveEndpoints({ sourceUrl: process.env.NODE_URL });
    const client = new GonkaOpenAI({
        gonkaPrivateKey: process.env.GONKA_PRIVATE_KEY,
        endpoints
    });

    const response = await client.chat.completions.create({
        model: "Qwen/Qwen3-235B-A22B-Instruct-2507-FP8",
        messages: [
            { role: "user", content: "Hello! Tell me a short joke." }
        ]
    });

    console.log(response.choices[0].message.content);
    ```

    Execute the code with `node example.mjs`. In a few moments, you should see the output of your API request.

=== "Go"
    To use the Gonka API in Go, you can use the [Gonka OpenAI SDK for Go](https://github.com/gonka-ai/gonka-openai/tree/main/go). Get started by installing the SDK using go get:

    ```
    go get github.com/gonka-ai/gonka-openai/go
    ```

    With the SDK installed, create a file called `example.go` and copy the example code into it:

    ```go linenums="1"
    package main

    import (
        "fmt"
        "os"

        gonka "github.com/gonka-ai/gonka-openai/go"
    )

    func main() {
        client, err := gonka.NewClient(gonka.Options{
            GonkaPrivateKey: os.Getenv("GONKA_PRIVATE_KEY"),
            SourceUrl: os.Getenv("NODE_URL")},
        })
        if err != nil {
            panic(err)
        }

        response, err := client.CreateChatCompletion(
            "Qwen/Qwen3-235B-A22B-Instruct-2507-FP8",
            []gonka.ChatCompletionMessage{
                {
                    Role:    "user",
                    Content: "Write a haiku about programming",
                },
            },
        )
        if err != nil {
            fmt.Printf("Error: %v\n", err)
            return
        }

        fmt.Println(response.Choices[0].Message.Content)
    }
    ```

    Execute the code with `go run example.go`. In a few moments, you should see the output of your API request.

To perform inference from another language, see [the Gonka OpenAI client library repository](https://github.com/gonka-ai/gonka-openai), and adjust the examples accordingly.

---
**Need help?** Join our [Discord server](https://discord.com/invite/RADwCT2U6R) for assistance with general inquiries, technical issues, or security concerns.  
