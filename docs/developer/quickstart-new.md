# Developer Quickstart
Gonka is a decentralized, cryptographically verified protocol for provable inference. Gonka provides a secure, censorship-resistant, and self-sovereign developer experience.
??? note "How Gonka differs from traditional AI APIs"
    Gonka isn’t just another AI API — it’s a cryptographic protocol for provable inference. By eliminating centralized identity, Gonka removes the traditional single point of failure that plagues SaaS-based AI services. 
    Here is a quick comparison table to understand the difference between a Traditional AI API and the Gonka API:
        
    | Aspect | Traditional AI API (OpenAI, Anthropic, etc.) | Gonka API |
    |--------|----------------------------------------------|------------|
    | **Model provenance & verifiable output** | Models are hosted and versioned by the provider, but there’s no way to cryptographically verify which model actually produced a given output. There’s no proof that the model wasn’t switched, fine-tuned behind the scenes, or A/B tested on you. | Every inference request and response can be cryptographically linked to a specific model hash and execution environment. This enables verifiable provenance — anyone can prove that a particular model version generated a specific output. |
    | **Censorship resistance** | All access is controlled centrally — providers can restrict or terminate accounts at any time. This includes enforcement of geographic, political, or commercial policies. | Inference requests are signed and broadcast through a decentralized network. As long as you hold your private key and connect to a node, you can run inference. The system is designed to be uncensorable, unless restrictions are applied by a transparent, protocol-level consensus. |
    | **Auditability & transparency** | Logging, billing, and usage tracking are fully controlled by the API provider. Users cannot independently verify their own usage or inspect how pricing, latency, or errors were handled. | Every interaction is signed and timestamped, enabling independent audit trails. You can prove when and how an inference occurred, which model was used, whether the results were altered, and ensure that disputes can be publicly resolved. |
    | **Transparent tokenomics** | Billing rates have limited insight into compute pricing, model costs, or system load. | Tokenomics are on-chain or protocol-defined, meaning pricing mechanisms are transparent and inspectable. Users convert GNK into AI Tokens with predictable, traceable exchange logic, enabling clear forecasting of inference costs and supply-demand–driven economics. |
    
To proceed in Testnet, request access to the private codebase by emailing your GitHub username to [hello@productscience.ai](mailto:hello@productscience.ai).

## 1. Install the CLI (`inferenced`)
??? note "What is the `inferenced` CLI tool?" 
    The inferenced CLI tool is a command-line interface utility used to interact with the Gonka network. It is a standalone, executable binary that allows users to create and manage Gonka accounts, perform inference tasks, upload models, and automate various operations through scripted commands.

Download the latest `inferenced` binary from <a href="https://github.com/product-science/pivot-deploy/releases" target="_blank" rel="noopener">here</a> and make it executable:
```
chmod +x inferenced
./inferenced --help
```

??? note "Exploring the help menu is a great way to get oriented"
    At any time, use `--help` to see the most recent in-program documentation.

??? note "Enabling Execution on Mac OS"
    - On MacOS, allow execution in `System Settings` → `Privacy & Security` if prompted.
    - Scroll down to the warning about `inferenced` and click `Allow Anyway`.

## 2. Choose a `NODE_URL` (API entry point)
You must choose a random node to connect to before making requests to the network. Do not forget to write it down, you will need it in the next step.

!!! note "Why a random node?"
    To avoid over-reliance on the genesis node and encourage decentralization, Gonka recommends selecting a random active node from the current epoch. This improves network load distribution and resilience to node outages.

=== "Option 1 (recommended)"
    If you have installed the `inferenced` CLI (see Step 1), you can automatically get a random node:
    
    ```
    inferenced query inference get-random-node
    ```

=== "Option 2"
    Choose any public_url from the list and use it as your `NODE_URL`.

    ```
    curl http://195.242.13.239:8000/v1/epochs/current/participants
    ```
        
    !!! note "How to choose?"
        You can choose any node randomly — you do not need to consider:
        
        - which model does it run
        - its location
        - its hardware
        
        At this point, the node is used purely as a gateway to fetch network state and broadcast transactions. All nodes expose the same public API. Model/runtime details are irrelevant here.

=== "Option 3"
    Use the genesis node (centralized but always available):
    
    ```
    http://195.242.13.239:8000
    ```
## 3. Set up the required environment variables
Once you’ve selected a node, choose a unique name for your local account and set the environment variables below.

```
export ACCOUNT_NAME=<your-desired-account-name>
export NODE_URL=http://195.242.13.239:8000
export GONKA_ENDPOINTS=$NODE_URL/v1 
```

??? note "Things to know about account names"

    - This name is not recorded on-chain — it exists only in your local key store.
    - Uniqueness is local: creating two keys with the same name will overwrite the existing one (with a CLI warning). If you proceed, the original key will be permanently lost. We highly recommend backing up your public and private keys before performing this operation.
    - The name cannot be changed after it is created.
    - Use a consistent naming style for easier scripting and account management. Here are a few recommended naming patterns for `ACCOUNT_NAME`:
        - `dev-main` — for your primary local testnet account
        - `dev-<username>` — if you're working in a shared repo or multi-user environment
        - `bot-inference`, `demo-client` — to separate functional roles
        - `test-001`, `test-002`, … — for scripting or automated test accounts
        - `2025-q3-inference` — for time-scoped or experimental usage
    - Using lowercase, hyphenated names helps avoid parsing errors in scripts.

## 4. Create an account
Replace `$ACCOUNT_NAME` and `$NODE_URL` with the values you set earlier.
```
./inferenced create-client $ACCOUNT_NAME \
  --node-address $NODE_URL
```
This command will:

- Generate a keypair
- Save it to `~/.inference`
- Return your account address, public key, and mnemonic (store it securely in a hard copy as well!)
  
The account stores your balance, add it to environment variable `GONKA_ADDRESS`, or `.env` file. 

```
export GONKA_ADDRESS=<your-account-address>
```

You will use this account to purchase gonka (GNK) coins and pay for inference requests.
To retrieve a list of all locally stored accounts, execute the following command:
```
inferenced keys list [--keyring-backend test]
```

## 5. Export Private Key for Use in SDKs
If you’d like to perform the request in Python, export your private key (for demo/testing only) and add it to the environment variable `GONKA_PRIVATE_KEY`, or `.env` file.
```
./inferenced keys export $ACCOUNT_NAME --unarmored-hex --unsafe && \
export GONKA_PRIVATE_KEY=<your-private-key>
```

??? note "Optional: Use the Gonka Dashboard"
    [The Gonka Dashboard](https://gonka.ai/wallet/dashboard) offers a rich, real-time view into the network — including active nodes, inference activity, and protocol performance — all available instantly, no login or setup required. When you connect a supported wallet (e.g., Keplr or Leap) that holds your Gonka key, the dashboard seamlessly expands to include personalized insights:
    
    - GNK balance and recent token usage
    - Inference transaction history
    - AI Token spend over time
    - One-click GNK purchasing (coming soon)
    
    It’s a lightweight, zero-friction interface for monitoring both the public network and your activity — all in one place.

## 6. Run Inference using modified OpenAI SDK
As testnet GNK coins cannot be purchased, every testnet Developer account receives:

- 5 GNK coins (5 billion ngonka)
- Equivalent to ~1–5 million AI tokens of model usage
Inference tokens are allocated [dynamically based on model cost.](https://gonka.ai/wallet/pricing/)

!!! note "Mainnet: Switch to paid access"
    Once Gonka launches on the mainnet:
    
    - Free GNK distribution will end
    - Testnet balances will be reset to zero
    - You’ll need to purchase GNK via a supported [wallet](https://gonka.ai/wallet/dashboard#2-set-up-external-wallet) to continue using the API

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
        endpoints=[os.environ.get('GONKA_ENDPOINTS')]
    )

    response = client.chat.completions.create({
        "model": "Qwen/QwQ-32B",
        "messages": [
            { "role": "user", "content": "Write a one-sentence bedtime story about a unicorn" }
        ]
    })

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

    const client = new GonkaOpenAI({
        gonkaPrivateKey: process.env.GONKA_PRIVATE_KEY,
        endpoints: [process.env.GONKA_ENDPOINTS]
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
        client := gonka.NewClient(
            os.Getenv("GONKA_PRIVATE_KEY"),
            []string{os.Getenv("GONKA_ENDPOINTS")},
        )

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
