---
name: index.md
---

# Developer Quickstart

This guide explains how to create a developer account in Gonka and submit an inference request using Gonka API.

To proceed, you'll need access to the private codebase. Please send your GitHub username to hello@productscience.ai. 

---

## 1. Get `inferenced`

To interact with the network, you need the `inferenced` CLI tool.   
You can download the latest `inferenced` binary for your system [here](https://github.com/product-science/pivot-deploy/releases).


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

## 2. Define variables

Before creating an account, set up the required environment variables:

```bash
export ACCOUNT_NAME=<your-desired-account-name>
export NODE_URL=http://195.242.13.239:8000
export GONKA_ENDPOINTS=$NODE_URL/v1 
```

- Replace `<your-desired-account-name>` with your chosen account name.
- Replace `NODE_URL` with any random node from the list of current active participants, or keep the address of the genesis node (`http://195.242.13.239:8000`).

The following command returns a JSON array of participants currently active in the epoch, along with a cryptographic proof that can be used to independently verify the list of active nodes:
```bash
curl http://195.242.13.239:8000/v1/epochs/current/participants
```

## 3. Create an account

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

## 4. Add Private Key to environment variables

If you'd like to perform the request in Python:

#### 1. Export your private key (for demo/testing only).
```bash
./inferenced keys export $ACCOUNT_NAME --unarmored-hex --unsafe
```

This command outputs a plain-text private key.

#### 2. Add it to environment variable `GONKA_PRIVATE_KEY`, or `.env` file.
```bash
export GONKA_PRIVATE_KEY=<your-private-key>
```

## 5. Inference using modified OpenAI SDK

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
