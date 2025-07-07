# Developer Quickstart
Gonka is a decentralized, cryptographically verified protocol for provable inference. Gonka provides a secure, censorship-resistant, and self-sovereign developer experience.
??? note "How Gonka differs from traditional AI APIs"
    Gonka isn’t just another AI API — it’s a cryptographic protocol for provable inference. By eliminating centralized identity, Gonka removes the traditional single point of failure that plagues SaaS-based AI services. 
    Here is a quick comparison table to understand the difference between a Traditional AI API and the Gonka API:
        
    | Aspect | Traditional AI API (OpenAI, Anthropic, etc.) | Gonka API |
    |--------|----------------------------------------------|------------|
    | **Model provenance & verifiable output** | No cryptographic proof. Models may be swapped or A/B tested without transparency. | Each response is tied to a verifiable model hash and execution environment. |
    | **Censorship resistance** | Providers can revoke access or enforce geo/political restrictions. | Requests are signed and broadcast via a decentralized network. You retain control via your private key. |
    | **Auditability & transparency** | Users can’t independently verify logs, billing, or latency. | All interactions are timestamped and signed, with full public audit trails. |
    | **Transparent tokenomics** | Pricing is opaque, with unclear compute/model cost mappings. | On-chain tokenomics ensure visible, forecastable inference costs via GNK-to-token logic. |
    
To proceed in Testnet, request access to the private codebase by emailing your GitHub username to [hello@productscience.ai](mailto:hello@productscience.ai).

??? note "Exploring the help menu is a great way to get oriented"
    At any time, use `--help` to see the most recent in-program documentation.

## 1. Install the CLI (`inferenced`)
??? note "What is the `inferenced` CLI tool?" 
    The inferenced CLI tool is a command-line interface utility used to interact with the Gonka network. It is a standalone, executable binary that allows users to create and manage Gonka accounts, perform inference tasks, upload models, and automate various operations through scripted commands.

Download the latest `inferenced` binary from <a href="https://github.com/product-science/pivot-deploy/releases" target="_blank" rel="noopener">here</a> and make it executable:
```
chmod +x inferenced
./inferenced --help
```

??? note "Enabling Execution on Mac OS"
    - On MacOS, allow execution in `System Settings` → `Privacy & Security` if prompted.
    - Scroll down to the warning about `inferenced` and click `Allow Anyway`.

## 2. Choose a `NODE_URL` (API entry point)
You must now choose which node to connect to when making requests to the network. Do not forget to write it down, you will need it in the next step.

=== "Option 1 (recommended)"
    If you have installed the `inferenced` CLI (see Step 1), you can automatically get a random node:
    
    ```
    inferenced query inference get-random-node
    ```
    
    !!! note "Why a random node?"
        To avoid over-reliance on the genesis node and encourage decentralization, Gonka recommends selecting a random active node from the current epoch.
        This improves:
        
        - Network load distribution
        - Resilience to node outages

=== "Option 2"

    ```
    curl http://195.242.13.239:8000/v1/epochs/current/participants
    ```
    
    Choose any public_url from the list and use it as your `NODE_URL`.
    
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

??? note "Things to know about account names"

    - This name is not recorded on-chain — it exists only in your local key store
    - Uniqueness is local: creating two keys with the same name will overwrite the first (with a CLI warning)
    - The name cannot be changed after it is created
    - Use a consistent naming style for easier scripting and account management

```
export ACCOUNT_NAME=<your-desired-account-name>
export NODE_URL=http://195.242.13.239:8000
export GONKA_ENDPOINTS=$NODE_URL/v1 
```

## 4. Create an account
Replace `$ACCOUNT_NAME` and `$NODE_URL` with the values you set earlier.
```
./inferenced create-client $ACCOUNT_NAME \
  --node-address $NODE_URL
```
This command will:

- Generate a keypair
- Save it to `~/.inference`
- Return your account address, public key, and mnemonic (store it securely!)
  
The account stores your balance, add it to environment variable `GONKA_ADDRESS`, or `.env` file. 

```
export GONKA_ADDRESS=<your-account-address>
```

You will use this account to purchase gonka (GNK) coins and pay for inference requests.
To list all locally stored accounts:
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
    Once your account is created, you can optionally open the Gonka Dashboard to:
    
    - View your balances and accounts
    - Track AI Token usage, recent transactions, and inference history
    - Monitor network performance in real-time
    - 
    No setup is required — it loads automatically when your wallet is connected.

## 6. Run Inference using modified OpenAI SDK
Every testnet Developer account receives:

- 5 GNK coins (5 billion ngonka)
- Equivalent to ~1–5 million AI tokens of model usage
Inference tokens are allocated [dynamically based on model cost.](https://testnet.productscience.ai/wallet/pricing/)

=== "Python"
    To use the Gonka API in Python, you can use the [Gonka OpenAI SDK for Python](https://github.com/libermans/gonka-openai/tree/main/python). Get started by installing the SDK using pip:

    ```
    pip install gonka-openai
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
    To use the Gonka API in server-side JavaScript environments like Node.js, Deno, or Bun, you can use the [Gonka OpenAI SDK for TypeScript and JavaScript](https://github.com/libermans/gonka-openai/tree/main/typescript). Get started by installing the SDK using npm or your preferred package manager:

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
    To use the Gonka API in Go, you can use the [Gonka OpenAI SDK for Go](https://github.com/libermans/gonka-openai/tree/main/go). Get started by installing the SDK using go get:

    ```
    go get github.com/libermans/gonka-openai/go
    ```

    With the SDK installed, create a file called `example.go` and copy the example code into it:

    ```go linenums="1"
    package main

    import (
        "fmt"
        "os"

        gonka "github.com/libermans/gonka-openai/go"
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

To perform inference from another language, see [the Gonka OpenAI client library repository](https://github.com/libermans/gonka-openai), and adjust the examples accordingly.

---
**Need help?** Join our [Discord server](https://discord.gg/fvhNxdFMvB) for assistance with general inquiries, technical issues, or security concerns.  
