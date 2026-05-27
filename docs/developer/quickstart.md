---
name: index.md
---

# Developer Quickstart

This guide explains how to send an inference request to Gonka through a community broker. It is the fastest way to start using the network today.

!!! note "How developers connect to Gonka now"

    Gonka inference is now organised around **devshards** — short-lived sessions that hold a small on-chain deposit (an escrow) and settle per-request billing off-chain. The role of opening a devshard, signing requests, rotating the session, and submitting settlement to the chain is performed by a piece of software called a **gateway**.

    For most developers, the simplest way to use Gonka is to call a **community broker** — a third party who already runs a gateway and exposes a standard OpenAI-compatible API. You just need an API key from the broker.

    If you would like to run your own gateway instead of going through a broker, see [Run your own gateway](#2-run-your-own-gateway-advanced) at the bottom of this page.

??? note "How Gonka differs from traditional AI APIs"

    Gonka is not just another AI API. It is a cryptographic protocol for provable inference that aims to make model execution, billing, and settlement independently auditable, rather than fully controlled by a single provider.

    | **Aspect** | **Traditional AI API** <br> *(OpenAI, Anthropic, etc.)* | **Gonka API** |
    |---|---|---|
    | **Model provenance and verifiable output** | Models are hosted and versioned by the provider, but users cannot independently verify which model produced a given output. | Inference can be linked to protocol-defined model metadata and network execution records, enabling verifiable provenance. |
    | **Censorship resistance** | Access is controlled centrally by the provider. | Access is moving into transparent, protocol-governed mechanisms. Current production access is guarded while protocol-level request validation is being completed. |
    | **Auditability and transparency** | Logging, billing, and usage tracking are controlled by the API provider. | Requests, billing, and settlement are designed to be signed, timestamped, and auditable. |
    | **Transparent tokenomics** | Pricing and resource allocation are provider-defined. | Pricing and settlement are protocol-defined or on-chain, making inference economics more inspectable. |

---

## 1. Use a community broker (recommended)

A broker is an independent operator who runs a Gonka gateway and resells inference to developers. From your application's point of view, a broker endpoint behaves like any OpenAI-compatible API: you set a `base_url`, pass an `Authorization: Bearer <API_KEY>` header, and call `/v1/chat/completions` as usual.

!!! caution "Brokers are not part of the core protocol"

    Brokers are independent third parties. Pricing, payment method (USD, crypto, credits), rate limits, supported models, SLAs, refund policy, and data handling are decided by each broker. Read the broker's own documentation and terms before going live.

### 1.1 Pick a broker

- [https://proxy.gonka.gg/](https://proxy.gonka.gg/)
- [https://gonkagate.com/](https://gonkagate.com/)
- [https://gate.joingonka.ai/](https://gate.joingonka.ai/)
- [https://router.gonkascan.com/](https://router.gonkascan.com/)
- [https://gonka.pw/](https://gonka.pw/)
- [https://gonka-api.org/](https://gonka-api.org/)
- [https://gonkabroker.com/](https://gonkabroker.com/)

??? note "About this list"
    Brokers listed here run a Gonka gateway against the mainnet and have agreed to public listing. Gonka does not endorse any specific broker. The list is displayed in a random order that is re-shuffled on every page load, so the position of each broker is not a ranking; please evaluate each operator on its own merits.

### 1.2 Get an API key

Follow the onboarding instructions on the broker's site. Typically, you will:

1. Sign up on the broker's site (email, account, billing setup).
2. Generate an API key in the broker's dashboard.
3. Note the broker's `base_url` (for example `https://api.<broker-domain>/v1`) and the list of supported models.

### 1.3 Send your first request

Set environment variables:

```bash
export GONKA_BROKER_URL=<broker-base-url>     # e.g. https://api.example-broker.com/v1
export GONKA_BROKER_API_KEY=<your-api-key>
export GONKA_MODEL=Qwen/Qwen3-235B-A22B-Instruct-2507-FP8   # or any model your broker supports
```

The Gonka broker endpoint is OpenAI-compatible, so you can use the official OpenAI SDK directly — no Gonka-specific client is required.

=== "Python"

    Install the OpenAI Python SDK:

    ```bash
    pip install openai
    ```

    Create `example.py`:

    ```py linenums="1"
    import os
    from openai import OpenAI

    client = OpenAI(
        base_url=os.environ["GONKA_BROKER_URL"],
        api_key=os.environ["GONKA_BROKER_API_KEY"],
    )

    response = client.chat.completions.create(
        model=os.environ["GONKA_MODEL"],
        messages=[
            {"role": "user", "content": "Write a one-sentence bedtime story about a unicorn"}
        ],
    )

    print(response.choices[0].message.content)
    ```

    Run with `python example.py`.

=== "TypeScript"

    Install the OpenAI JS SDK:

    ```bash
    npm install openai
    ```

    Create `example.mjs`:

    ```ts linenums="1"
    import OpenAI from "openai";

    const client = new OpenAI({
        baseURL: process.env.GONKA_BROKER_URL,
        apiKey: process.env.GONKA_BROKER_API_KEY,
    });

    const response = await client.chat.completions.create({
        model: process.env.GONKA_MODEL,
        messages: [{ role: "user", content: "Hello! Tell me a short joke." }],
    });

    console.log(response.choices[0].message.content);
    ```

    Run with `node example.mjs`.

=== "Go"

    Use the official `openai-go` client:

    ```go linenums="1"
    package main

    import (
        "context"
        "log"
        "os"

        "github.com/openai/openai-go"
        "github.com/openai/openai-go/option"
    )

    func main() {
        client := openai.NewClient(
            option.WithBaseURL(os.Getenv("GONKA_BROKER_URL")),
            option.WithAPIKey(os.Getenv("GONKA_BROKER_API_KEY")),
        )

        r, err := client.Chat.Completions.New(context.Background(), openai.ChatCompletionNewParams{
            Model: os.Getenv("GONKA_MODEL"),
            Messages: []openai.ChatCompletionMessageParamUnion{
                openai.UserMessage("Write a haiku about programming"),
            },
        })
        if err != nil {
            log.Fatal(err)
        }
        log.Println(r.Choices[0].Message.Content)
    }
    ```

In a few moments, you should see the inference response in your terminal.

### 1.4 Tool calling

Tool calling is supported through the same OpenAI-compatible endpoint. Only `type: "function"` is supported — Gonka uses vLLM under the hood, which implements the OpenAI chat completions spec, not the Assistants API (`code_interpreter`, `file_search` are unavailable).

=== "Python"

    ```py linenums="1"
    import os
    import json
    from openai import OpenAI

    client = OpenAI(
        base_url=os.environ["GONKA_BROKER_URL"],
        api_key=os.environ["GONKA_BROKER_API_KEY"],
    )

    tools = [
        {
            "type": "function",
            "function": {
                "name": "get_weather",
                "description": "Get the current weather for a city",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "city": {"type": "string", "description": "City name"}
                    },
                    "required": ["city"],
                },
            },
        }
    ]

    response = client.chat.completions.create(
        model=os.environ["GONKA_MODEL"],
        messages=[{"role": "user", "content": "What's the weather in Paris?"}],
        tools=tools,
        tool_choice="auto",
    )

    message = response.choices[0].message
    if message.tool_calls:
        call = message.tool_calls[0]
        args = json.loads(call.function.arguments)
        print(call.function.name, args)
    ```

=== "TypeScript"

    ```ts linenums="1"
    import OpenAI from "openai";

    const client = new OpenAI({
        baseURL: process.env.GONKA_BROKER_URL,
        apiKey: process.env.GONKA_BROKER_API_KEY,
    });

    const tools = [
        {
            type: "function",
            function: {
                name: "get_weather",
                description: "Get the current weather for a city",
                parameters: {
                    type: "object",
                    properties: { city: { type: "string", description: "City name" } },
                    required: ["city"],
                },
            },
        },
    ];

    const response = await client.chat.completions.create({
        model: process.env.GONKA_MODEL,
        messages: [{ role: "user", content: "What's the weather in Paris?" }],
        tools,
        tool_choice: "auto",
    });

    const message = response.choices[0].message;
    if (message.tool_calls) {
        const call = message.tool_calls[0];
        const args = JSON.parse(call.function.arguments);
        console.log(call.function.name, args);
    }
    ```

---

## 2. Run your own gateway (advanced)

If your application has high throughput or other requirements, you can run a Gonka gateway yourself instead of going through a broker. The gateway is a small program (shipped as a Docker container) that you run on your own machine or server — never on a Gonka host. It exposes the same OpenAI-compatible API as a broker, but you own the keys and you pay GNK directly on-chain for the devshards it creates.

!!! warning "Self-hosted gateway requires an allow-listed address"

    Today, only Gonka accounts on the on-chain `devshard_escrow_params.allowed_creator_addresses` list can open devshards. If your address is not on that list, your gateway will not be able to create sessions, and you will not be able to send inference. The allow-list is expanded by on-chain governance vote. See [Become a broker](#3-become-a-broker) below for how to request inclusion.

Full deployment instructions are in [Run your own gateway (mainnet)](gateway-developer-quickstart.md). For **gonka-testnet**, see [Run your own gateway (testnet)](gateway-developer-quickstart-testnet.md).

---

## 3. Become a broker

If you want to be added to the public broker list above and (where applicable) to the on-chain allow-list of devshard creators, open a GitHub issue:

[Open an issue: "Request to be added as a Gonka broker"](https://github.com/gonka-ai/gonka/issues/new?title=Request+to+be+added+as+a+Gonka+broker)

Please include in the issue:

- Operator name and contact (email or Discord handle).
- Public endpoint URL of your gateway.
- Gonka address you intend to use for devshard creation (`gonka1...`).
- Supported models and any rate limits you plan to enforce.
- A brief description of your billing model (USD / crypto / credits) and target audience.

The community will review and, where on-chain inclusion is needed, an on-chain governance proposal will be created. Gonka does not unilaterally pick brokers — additions to the allow-list happen through public votes.

---

**Need help?** See the [FAQ page](https://gonka.ai/FAQ/), or join the [Discord server](https://discord.com/invite/RADwCT2U6R) for technical issues or security concerns.
