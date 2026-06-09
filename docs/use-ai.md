# Use AI

Gonka is an OpenAI-compatible AI network. If you have used OpenAI, Anthropic, or any other AI API before, you already know how to use Gonka.

You usually only need to change three things: your `base_url`, your `api_key`, and your `model`.

This works for building apps, connecting AI agents, integrating AI into business tools, or simply using large models through a familiar API.

## Why Gonka

| What you get | Why it matters |
| --- | --- |
| Always on | Gonka is a decentralized network. There is no single server to shut down, and no vendor can pull the plug. |
| No model substitution | Nodes in the network are continuously verified to ensure they run the exact model you requested. No silent downgrades. |
| Fair pricing | Inference costs are set by an on-chain pricing mechanism based on real demand. |
| Standard API | Drop-in OpenAI-compatible interface. Change `base_url` and `api_key`, nothing else. |

## Step 1: Pick a broker

A broker is your access point to the Gonka network. A broker gives you an API key and an endpoint URL.

From your application's point of view, this looks like any other OpenAI-compatible provider.

!!! note
    Brokers are independent third parties. Pricing, payment method (USD, crypto, credits), rate limits, supported models, SLAs[^broker-monitoring], refund policy, and data handling are decided by each broker. Read the broker's own documentation and terms before going live.

### Broker list

If you use an AI agent to set things up, share the agent page URL with your agent as a context document or system prompt. It contains the endpoint, authentication method, available models, and a minimal example request in a machine-readable form, so the agent will know what to do.

| Broker | For humans | For agents |
| --- | --- | --- |
| Gonka GG | [proxy.gonka.gg](https://proxy.gonka.gg/) | [proxy.gonka.gg/docs](https://proxy.gonka.gg/docs) |
| GonkaGate | [gonkagate.com](https://gonkagate.com/) | [gonkagate.com/en/docs/quickstart](https://gonkagate.com/en/docs/quickstart) |
| JoinGonka | [gate.joingonka.ai](https://gate.joingonka.ai/) | [gate.joingonka.ai/docs](https://gate.joingonka.ai/docs) |
| Gonka Router | [gonkarouter.io](https://gonkarouter.io/) | [gonkarouter.io/docs](https://gonkarouter.io/docs) |
| Hyperfusion | [hyperfusion.io](https://hyperfusion.io/) | [docs.hyperfusion.io/docs/intro](https://docs.hyperfusion.io/docs/intro) |
| Gonka API | [gonka-api.org](https://gonka-api.org/) | [gonka-api.org/for-agents](https://gonka-api.org/for-agents) |
| GonkaBroker | [gonkabroker.com](https://gonkabroker.com/) | [gonkabroker.com/#how-it-works](https://gonkabroker.com/#how-it-works) |
| Mingles AI Gateway | [gonka-gateway.mingles.ai](https://gonka-gateway.mingles.ai/) | [gonka-gateway.mingles.ai/agents](https://gonka-gateway.mingles.ai/agents) |

!!! note
    Broker agent pages and documentation are maintained by each broker. If a link is not live yet, use the broker's main site or documentation.

## Step 2: Get your API key

1. Open the broker website.
2. Create an account.
3. Add credits or billing.
4. Generate an API key.
5. Copy the broker's API base URL.

## Step 3: Pick a model

These models are currently available across the network:

- `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`
- `moonshotai/Kimi-K2.6`
- `MiniMaxAI/MiniMax-M2.7`

!!! note
    Model IDs are case-sensitive. Copy the string exactly as your broker returns or documents it.

    Availability can change. Do not copy a static model list blindly. Always fetch the latest model ID from your chosen broker with `GET /v1/models` before going live.

## Step 4: Connect your tool or app

Now you have your API Base URL, API Key, and Model ID. You can plug these into almost any AI software, chat interface, or agent framework that supports OpenAI-compatible providers.

Here is how to map your Gonka credentials in most apps:

| Field in your app | What to enter |
| --- | --- |
| API Base URL / Endpoint | Paste the broker's API Base URL, not necessarily the broker website URL. It usually ends with `/v1`, for example `https://<broker-api-host>/v1`. Get the exact API Base URL from the broker's docs or agent page. |
| API Key / Auth Token | Paste the key you generated. Even if the app says "Enter OpenAI API Key", use your broker key here. |
| Model / Custom Model | Paste an exact Model ID supported by your broker. You can start with Step 3, but prefer the fresh value returned by `GET /v1/models`. |

### Chat interfaces

Examples: Open WebUI, LibreChat, LobeChat.

Go to Settings -> AI Providers / Connections. Choose the OpenAI provider. Replace the default OpenAI URL with your broker's API Base URL, insert your key, and manually type the Model ID into the allowed models list.

### AI IDEs and coding agents

Examples: Cursor, Cline, Windsurf.

Go to Settings -> Models. Enable the OpenAI-compatible provider or select Add Custom Model. Override the Base URL and paste your broker API key.

### No-code automations

Examples: Make.com, n8n, Flowise.

Use the standard OpenAI module. Look for advanced settings to override the Base Path or Base URL with your broker's info.

### Custom code

Use the official OpenAI SDK. Initialize the client as usual, but pass your broker's API Base URL as `base_url` and your broker's key as `api_key`. No Gonka-specific libraries are needed.

=== "Python"

    ```python
    from openai import OpenAI

    client = OpenAI(
        base_url="https://<broker-api-host>/v1",
        api_key="YOUR_BROKER_API_KEY",
    )

    response = client.chat.completions.create(
        model="Qwen/Qwen3-235B-A22B-Instruct-2507-FP8",
        messages=[
            {"role": "user", "content": "Explain Gonka in one paragraph."}
        ],
    )

    print(response.choices[0].message.content)
    ```

=== "JavaScript"

    ```javascript
    import OpenAI from "openai";

    const client = new OpenAI({
      baseURL: "https://<broker-api-host>/v1",
      apiKey: "YOUR_BROKER_API_KEY",
    });

    const response = await client.chat.completions.create({
      model: "Qwen/Qwen3-235B-A22B-Instruct-2507-FP8",
      messages: [
        { role: "user", content: "Explain Gonka in one paragraph." },
      ],
    });

    console.log(response.choices[0].message.content);
    ```

[^broker-monitoring]: You can track the status of different brokers with monitoring services maintained by community members: [meter.gonka.gg](https://meter.gonka.gg/) and [power.gnk.space](https://power.gnk.space/).
