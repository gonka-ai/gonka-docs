---
name: index.md
---

# Developer Quickstart

This guide explains how to create a developer account in Gonka and submit an inference request using Gonka API.

To proceed, you’ll need access to the private codebase. Please send your GitHub username to hello@productscience.ai. 

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
    3.	Try running `./inferenced --help` to ensure it’s working.
        
    4.	If you see a security warning when trying to run `inferenced`, go to System Settings → Privacy & Security.
    
    5.	Scroll down to the warning about `inferenced` and click “Allow Anyway”.

## 2. Define variables

Before creating an account, set up the required environment variables:

```bash
export API_URL=http://195.242.13.239:8000  
export ACCOUNT_NAME=<your-desired-account-name>
```

- Replace `<your-desired-account-name>` with your chosen account name.
- Replace `API_URL` with any random node from the list of current active participants, or keep the address of the genesis node (http://195.242.13.239:8000).

```bash
curl http://195.242.13.239:8000/v1/epochs/current/participants
```
This returns a JSON array of nodes currently active in the epoch, as well as cryptographic proof which can be used to indpependently verify the list of active nodes.

## 3. Create an account

You can create an account with the following command:
```bash
./inferenced create-client $ACCOUNT_NAME \
  --node-address $API_URL
```

This command creates a new account and securely stores its keys in the `~/.inference` directory.

Make sure to securely save your passphrase — you’ll need it for future access.

```bash
- address: ACCOUNT_ADDRESS
  name: ACCOUNT_NAME
  pubkey: '{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"..."}'
  type: local
```

`ACCOUNT_ADDRESS` is your account address which stores your balance

```bash
export ACCOUNT_ADDRESS=<your-account-address>
```

## 4. Add Private Key to environment variables

If you’d like to perform the request in Python:

1. Export your private key (for demo/testing only).
```bash
./inferenced keys export $ACCOUNT_NAME --unarmored-hex --unsafe
```

This command outputs a plain-text private key (e.g. `<PRIVATE_KEY>`).

2. Add it to environment variable `PRIVATE_KEY`, or `.env` file.
```bash
export PRIVATE_KEY=<your-private-key>
```

## 5. Inference using modified OpenAI API

Use the code snippet below:

=== "Python"
    ```python
    import os
    from gonka_openai import GonkaOpenAI

    client = GonkaOpenAI(
        gonka_private_key=os.environ.get('GONKA_PRIVATE_KEY'),
    )

    response = client.chat.completions.create({
        "model": "Qwen/QwQ-32B",
        "messages": [
            { "role": "user", "content": "Write a one-sentence bedtime story about a unicorn" }
        ]
    })

    print(response.choices[0].message.content)
    ```

=== "TypeScript"
    ```ts
    import { GonkaOpenAI } from 'gonka-openai';

    const client = new GonkaOpenAI({
        gonkaPrivateKey: process.env.GONKA_PRIVATE_KEY,
    });

    const response = await client.chat.completions.create({
        model: "Qwen/QwQ-32B",
        messages: [
            { role: "user", content: "Hello! Tell me a short joke." }
        ]
    });

    console.log(response.choices[0].message.content);
    ```

To perform inference from another language, see [the Gonka OpenAI client library repository](https://github.com/libermans/gonka-openai), and adjust the examples accordingly.

---
**Need help?** Join our [Discord server](https://discord.gg/fvhNxdFMvB) for assistance with general inquiries, technical issues, or security concerns.  
