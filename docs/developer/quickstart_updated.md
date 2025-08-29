---
name: index.md
---

# Developer Quickstart

This guide explains how to create a developer account in Gonka and submit an inference request using Gonka API.

---

## 1. Define variables

Before creating an account, set up the required environment variables:

```bash
export ACCOUNT_NAME=<your-desired-account-name>
export NODE_URL=http://node2.gonka.ai:8000
```

- Replace `<your-desired-account-name>` with your chosen account name.
- Replace `NODE_URL` with any random node from the list of current active participants, or keep the address of the genesis node (`http://node2.gonka.ai:8000`).

The following command returns a JSON array of participants currently active in the epoch, along with a cryptographic proof that can be used to independently verify the list of active nodes:
```bash
curl http://node2.gonka.ai:8000/v1/epochs/current/participants
```

## 2. Create an account

=== "Option 1: Via CLI tool"
    Download the `inferenced` CLI tool (the latest `inferenced` binary for your system is [here](https://github.com/gonka-ai/gonka/releases)).
    
    
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
    
    This command creates a new account, securely stores its keys in the `~/.inference` directory, and returns your new account address:
    
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
    
    Add Private Key to environment variables
    
    If you'd like to perform the request:
    
    Export your private key (for demo/testing only).
    ```bash
    ./inferenced keys export $ACCOUNT_NAME --unarmored-hex --unsafe
    ```
    
    This command outputs a plain-text private key.
    
    Add it to environment variable `GONKA_PRIVATE_KEY`, or `.env` file.
    ```bash
    export GONKA_PRIVATE_KEY=<your-private-key>
    ```

=== "Option 2: Via Keplr (external wallet)"

    Go to [the official Keplr website](https://www.keplr.app/){target=_blank} and click "Get Keplr wallet".
    
    <a href="/images/dashboard_keplr_step_2_1.png" target="_blank"><img src="/images/dashboard_keplr_step_2_1.png" style="width:500px; height:auto;"></a>
    
    Choose an extension for your browser.
    
    <a href="/images/dashboard_keplr_step_2_2.png" target="_blank"><img src="/images/dashboard_keplr_step_2_2.png" style="width:500px; height:auto;"></a>
    
    Add an extension to the browser.
    
    === "Firefox"
    
        <a href="/images/dashboard_keplr_step_2_3.png" target="_blank"><img src="/images/dashboard_keplr_step_2_3.png" style="width:500px; height:auto;"></a>
    
    === "Google Chrome"
    
        <a href="/images/dashboard_keplr_step_2_3_2.png" target="_blank"><img src="/images/dashboard_keplr_step_2_3_2.png" style="width:500px; height:auto;"></a>
    
    Click "Create a new wallet"

    <a href="/images/dashboard_keplr_step_2_4.png" target="_blank"><img src="/images/dashboard_keplr_step_2_4.png" style="width:500px; height:auto;"></a>

    Click "Connect with Google"

    <a href="/images/dashboard_keplr_step_2_5.png" target="_blank"><img src="/images/dashboard_keplr_step_2_5.png" style="width:500px; height:auto;"></a>

    Set Up Your Wallet

    <a href="/images/keplr_set_up_your_wallet.png" target="_blank"><img src="/images/keplr_set_up_your_wallet.png" style="width:500px; height:auto;"></a>

    Backup your private key securely. Anyone with your private key can have access to your assets. If you lose access to your Gmail Account, the only way to recover your wallet is using your private key. Keep this in a safe place.

    <a href="/images/keplr_back_up_private_key.png" target="_blank"><img src="/images/keplr_back_up_private_key.png" style="width:500px; height:auto;"></a>

    Select Cosmos Hub and Ethereum.
    
    <a href="/images/dashboard_keplr_step_2_7.png" target="_blank"><img src="/images/dashboard_keplr_step_2_7.png" style="width:500px; height:auto;"></a>
    
    Your Keplr wallet has been created.
    
    <a href="/images/dashboard_keplr_step_2_8.png" target="_blank"><img src="/images/dashboard_keplr_step_2_8.png" style="width:500px; height:auto;"></a>

    Open the Hosts list
    ```
    http://node2.gonka.ai:8000/v1/epochs/current/participants
    ```
    
    Choose any active Host from the list.

    !!! note "Why is this important?"
        This approach ensures decentralization: no single central server controls the network.
    
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

    Navigate three dots and click "View private key"

    <a href="/images/keplr_view_private_key.png" target="_blank"><img src="/images/keplr_view_private_key.png" style="width:auto; height:337.5px;"></a>

    Enter your password 
   
    <a href="/images/keplr_enter_your_password.png" target="_blank"><img src="/images/keplr_enter_your_password.png" style="width:auto; height:337.5px;"></a>

    Copy your private key and store it securely (a hard copy is preferred).   

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
        model="Qwen/QwQ-32B",
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
        model: "Qwen/QwQ-32B",
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
            "Qwen/QwQ-32B",
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
**Need help?** Join our [Discord server](https://discord.gg/fvhNxdFMvB) for assistance with general inquiries, technical issues, or security concerns.  
