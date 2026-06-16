---
name: use-in-your-app.md
---

# Use Gonka in your app

Gonka exposes a standard **OpenAI-compatible API**. If you have used the OpenAI, Anthropic, or any other AI API before, you already know how to use Gonka — you usually only need to change three things: your `base_url`, your `api_key`, and your `model`.

This guide is for connecting Gonka to an existing tool, app, agent framework, or no-code automation. If you are writing code against the API with an SDK, start with the [Developer Quickstart](quickstart.md) instead.

!!! note "What you need"

    Gonka inference is reached through a **broker** — an independent operator that runs a Gonka gateway and exposes an OpenAI-compatible endpoint. From a broker you get an **API base URL** and an **API key**. That is all most apps require.

## Step 1: Pick a broker

A broker is your access point to the Gonka network. From your application's point of view, it behaves like any other OpenAI-compatible provider.

The current list of community brokers — including demo links and community observability dashboards — lives in the [Developer Quickstart](quickstart.md#11-pick-a-broker). Use that list as the single source of truth; it is kept up to date there.

!!! caution "Brokers are independent third parties"

    Pricing, payment methods (USD, crypto, credits), rate limits, supported models, SLAs, refund policies, and data handling are decided by each broker. Read the broker's own documentation and terms before going live.

!!! tip "Setting up with an AI agent?"

    Some brokers publish a machine-readable agent page that lists the endpoint, authentication method, available models, and a minimal example request. If your broker offers one, share its URL with your agent as a context document or system prompt and it will know what to do.

## Step 2: Get your API key

Follow the onboarding flow on your broker's site. Typically you will:

1. Create an account.
2. Add credits or set up billing.
3. Generate an API key.
4. Copy the broker's **API base URL** (often ends in `/v1`).

## Step 3: Pick a model

Model availability changes over time and differs by broker, so do not copy a static list. Find the current models in your broker's **dashboard or documentation** — most brokers show the supported models (and their exact IDs) right next to where you generated your API key.

!!! note "Model IDs are case-sensitive"

    Copy the model string exactly as your broker lists it, for example `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`. A small difference in capitalization or spacing will cause the request to fail.

!!! tip "Writing code?"

    Developers can also fetch the live list programmatically by calling `GET /v1/models` on the broker's OpenAI-compatible endpoint (with your API key in the `Authorization` header).

## Step 4: Connect your tool or app

Now you have your **Base URL**, **API key**, and **Model ID**. You can plug these into almost any AI software, chat interface, or agent framework that supports OpenAI-compatible providers.

In most apps the mapping is:

| Field in your app | What to enter |
|---|---|
| API Base URL / Endpoint | Your broker URL with `/v1` appended, e.g. `https://<broker-url>/v1`. If the app asks for an "OpenAI Base URL" or "Custom Endpoint", this is it. |
| API Key / Auth Token | The key you generated. Even if the app says "Enter OpenAI API Key", use your broker key here. |
| Model / Custom Model | The exact Model ID from Step 3. |

The exact menu names below may differ between app versions — look for the equivalent settings.

=== "Chat interfaces"

    Examples: Open WebUI, LibreChat, LobeChat.

    Go to **Settings → AI Providers / Connections**, choose the **OpenAI** provider, replace the default OpenAI URL with your broker URL plus `/v1`, insert your key, and add the Model ID to the allowed models list.

=== "AI IDEs and coding agents"

    Examples: Cursor, Cline, Windsurf.

    Go to **Settings → Models**, enable the **OpenAI-compatible** provider (or **Add Custom Model**), override the Base URL with your broker URL plus `/v1`, and paste your broker API key.

=== "No-code automations"

    Examples: Make.com, n8n, Flowise.

    Use the standard **OpenAI** module, then look for advanced settings to override the **Base Path / Base URL** with your broker's URL.

=== "Custom code"

    Use the official OpenAI SDK — no Gonka-specific library is required. Pass your broker URL plus `/v1` as `base_url` and your broker key as `api_key`. See the [Developer Quickstart](quickstart.md#13-send-your-first-request) for full Python, TypeScript, and Go examples.

---

**Need help?** See the [FAQ page](https://gonka.ai/FAQ/), or join the [Discord server](https://discord.com/invite/RADwCT2U6R).
