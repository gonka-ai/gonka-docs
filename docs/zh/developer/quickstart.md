---
name: index.md
---

# 开发者快速入门

本指南介绍如何通过社区代理向Gonka发送推理请求。这是目前开始使用该网络的最快方式。

!!! note "开发者当前如何连接到Gonka"

    Gonka推理现在围绕**devshards**组织——一种短期会话，持有少量链上存款（托管），并通过链下方式按请求结算账单。创建devshard、签名请求、轮换会话以及向链提交结算的操作由一种名为**gateway**的软件完成。

    对于大多数开发者来说，使用Gonka最简单的方法是调用一个**社区代理**——一个通过gateway提供推理访问并暴露标准OpenAI兼容API的第三方。您只需要从代理获取一个API密钥。

    如果您希望运行自己的gateway而不是通过代理，请参阅本页底部的[运行您自己的gateway](#2-run-your-own-gateway-advanced)。

    ??? note "Gonka与传统AI API的区别"

    Gonka不仅仅是另一个AI API。它是一种可验证推理的加密协议，旨在使模型执行、计费和结算变得独立可审计，而不是完全由单一提供商控制。

    | **方面** | **传统AI API** <br> *(OpenAI, Anthropic等)* | **Gonka API** |
    | --- | --- | --- |
    | **模型来源与可验证输出** | 模型由提供商托管和版本化，但用户无法独立验证是哪个模型生成了特定输出。 |  |
    | **抗审查性** |  |  |
    | **可审计性与透明度** | 推理可以关联到协议定义的模型元数据和网络执行记录，从而实现可验证的来源追踪。 |  |
    | **透明的代币经济** |  |  |

---

## 1. 使用社区代理（推荐）

代理是独立运营商，他们运行Gonka gateway并向开发者转售推理服务。从您的应用程序角度来看，代理端点的行为就像任何OpenAI兼容API一样：您设置一个 `base_url`，传递一个 `Authorization: Bearer <API_KEY>` 头，并像往常一样调用 `/v1/chat/completions`。

!!! caution "代理不是核心协议的一部分"

    代理是独立的第三方。定价、支付方式（美元、加密货币、积分）、速率限制、支持的模型、SLA、退款政策和数据处理由每个代理自行决定。在上线前请阅读代理自身的文档和条款。

### 1.1 选择一个代理

- [https://proxy.gonka.gg/](https://proxy.gonka.gg/)
- [https://gonkagate.com/](https://gonkagate.com/)
- [https://gate.joingonka.ai/](https://gate.joingonka.ai/)
- [https://router.gonkascan.com/](https://router.gonkascan.com/) · [▶ demo](https://youtu.be/1uWmLGPoBCM)
- [https://gonka-api.org/](https://gonka-api.org/)
- [https://gonkabroker.com/](https://gonkabroker.com/)
- [https://gonka-gateway.mingles.ai/](https://gonka-gateway.mingles.ai/)
- [https://console.hyperfusion.io/](https://console.hyperfusion.io/) 

??? note "关于此列表"
    这是一个经过筛选的社区代理目录，这些代理通过公共Gonka gateway路由推理请求，并同意被公开列出。该列表并非详尽无遗，也不背书任何运营商。列表以随机顺序显示，并在每次页面加载时重新洗牌，因此每个代理的位置不代表排名；请根据每个运营商自身的优点进行评估。此目录反映了一个早期引导集合。希望独立提供推理服务的新运营商应参阅[有兴趣运营gateway吗？](#3-interested-in-operating-a-gateway)。一些代理提供**▶ demo**链接，指向简短的入门视频教程——风格和长度可能有所不同。

??? tip "比较代理——社区可观测性仪表板"

    社区成员对公共代理端点运行独立监控探测并将结果发布。这些仪表板可以帮助您在选择代理前比较正常运行时间、延迟和定价：

    <ul class="broker-dashboards">
    <li><a href="https://meter.gonka.gg/">G-Meter</a></li>
    <li><a href="https://power.gnk.space/">Gonka Power</a></li>
    </ul>

    这些仪表板是**社区构建的工具，不属于核心协议**。数据准确性、方法论和可用性由各个仪表板运营方负责。请始终通过您自己的测试来验证关键指标。该列表在每次页面加载时以随机顺序显示。

### 1.2 获取 API 密钥

按照经纪商网站上的引导说明操作。通常您需要：

1. 在经纪商网站上注册（邮箱、账户、账单设置）
2. 在经纪商的仪表板中生成一个 API 密钥
3. 记录经纪商的 `base_url`（例如 `https://api.<broker-domain>/v1`）以及支持的模型列表

### 1.3 发送您的第一个请求

设置环境变量：

```bash
export GONKA_BROKER_URL=<broker-base-url>     # e.g. https://api.example-broker.com/v1
export GONKA_BROKER_API_KEY=<your-api-key>
export GONKA_MODEL=Qwen/Qwen3-235B-A22B-Instruct-2507-FP8   # or any model your broker supports
```

Gonka 的代理端点与 OpenAI 兼容，因此你可以直接使用官方 OpenAI SDK——无需 Gonka 特定的客户端。

=== "Python"

    安装 OpenAI Python SDK:

    ```bash
    pip install openai
    ```

    创建 `example.py`:

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

    使用 `python example.py` 运行。

=== "TypeScript"

    安装 OpenAI JS SDK:

    ```bash
    npm install openai
    ```

    创建 `example.mjs`:

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

    使用 `node example.mjs` 运行。

=== "Go"

    使用官方的 `openai-go` 客户端：

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

片刻之后，你应该能在终端中看到推理响应。

### 1.4 工具调用

工具调用通过相同的与OpenAI兼容的端点支持。仅支持`type: "function"` — Gonka 在底层使用 vLLM，它实现了 OpenAI 聊天补全规范，而不支持 Assistants API（`code_interpreter`、`file_search` 不可用）。

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

## 2. 运行你自己的网关（高级）

如果你的应用具有高吞吐量或其他需求，你可以自行运行 Gonka 网关，而不是通过经纪商。网关是一个小型程序（以 Docker 容器形式提供），你可以在自己的机器或服务器上运行——绝不在 Gonka 主机上运行。它暴露与经纪商相同的兼容 OpenAI 的 API，但你拥有密钥，并直接在链上为它创建的 devshard 支付 GNK。

!!! warning "自托管网关需要一个白名单地址"

    目前，只有在链上 `devshard_escrow_params.allowed_creator_addresses` 白名单中的 Gonka 账户才能打开 devshard。如果你的地址不在该列表中，你的网关将无法创建会话，也无法发送推理请求。白名单仅通过链上治理投票进行更改。参见下方 [有兴趣运行网关吗？](#3-interested-in-operating-a-gateway)。

    完整部署说明请参阅 [运行你自己的网关](gateway-developer-quickstart.md)。

---

## 3. 有兴趣运行网关吗？

推理通过网关接入网络。有两种方式拥有网关，且它们的管理方式不同。

**使用公共网关（当前的经纪商）**。[§1.1](#11-pick-a-broker) 中的经纪商通过在早期上线期间达成的访问安排，经由公共 Gonka 网关接入推理。这是一个引导步骤，目录目前不会主动扩展。

**运行你自己的网关**。运营你自己的链上 devshard 网关。这需要你的地址在治理控制的白名单中（`devshard_escrow_params.allowed_creator_addresses`），并且这是新运营商推荐的路径。完整说明请参阅 [网关指南](gateway-developer-quickstart.md)。

要申请链上白名单资格，请创建一个 [GitHub issue](https://github.com/gonka-ai/gonka/issues/new?title=Gateway+allowlist+request)，包含你的运营商名称和联系方式、你打算使用的 `gonka1...` 地址，以及你计划提供的模型。是否加入由链上治理决定——没有单一运营商或组织可以单方面添加地址——表达兴趣并不保证会被纳入、审核或有明确时间表。

---

**需要帮助？** 请参阅 [FAQ 页面](https://gonka.ai/FAQ/)，或加入 [Discord 服务器](https://discord.com/invite/RADwCT2U6R) 以获取技术问题或安全问题的支持。
