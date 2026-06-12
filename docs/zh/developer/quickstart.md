---
name: index.md
---

# 开发者快速入门

本指南介绍如何通过社区代理（broker）向 Gonka 发送推理请求。这是目前开始使用该网络的最快方式。

!!! note "开发者当前如何连接到 Gonka"

    Gonka 的推理服务目前围绕 **devshard** 组织——一种短期会话，包含少量链上存款（托管资金），并通过链下方式按请求结算费用。创建 devshard、签名请求、轮换会话以及提交链上结算的操作由一种名为 **网关（gateway）** 的软件完成。

    对大多数开发者而言，使用 Gonka 最简单的方式是调用一个 **社区代理（community broker）** —— 一个通过网关提供推理访问并暴露标准 OpenAI 兼容 API 的第三方服务。你只需要从代理处获取一个 API 密钥即可。

    如果你希望自行运行网关而非通过代理访问，请参见本页底部的 [运行你自己的网关（高级）](#2-run-your-own-gateway-advanced)。

    ??? note "Gonka 与传统 AI API 的区别"

    Gonka 不仅仅是另一个 AI API。它是一个用于可验证推理的加密协议，旨在使模型执行、计费和结算过程可独立审计，而不是完全由单一提供商控制。

    | **方面 * * | **传统 AI API * * <br> *(OpenAI、Anthropic 等) * | **Gonka API * * |
    | --- | --- | --- |
    | **模型来源与输出可验证性 * * | 模型由提供商托管和版本管理，但用户无法独立验证某个输出是由哪个模型生成的。 |  |
    | **抗审查性 * * |  |  |
    | **可审计性与透明度 * * |  |  |
    | **透明的代币经济 * * |  |  |
使用社区代理（推荐）

代理是由独立运营者运行的 Gonka 网关，向开发者转售推理服务。从你的应用程序角度看，代理端点的行为与任何 OpenAI 兼容 API 相同：你设置一个 `base_url`，传入 `Authorization: Bearer <API_KEY>` 请求头，并像往常一样调用 `/v1/chat/completions`。

caution "代理不属于核心协议的一部分"

    代理是独立的第三方。定价、支付方式（美元、加密货币、积分）、速率限制、支持的模型、服务等级协议（SLA）、退款政策和数据处理均由各代理自行决定。在正式上线前，请务必阅读代理自身的文档和条款。

1.1 选择一个代理

[https://proxy.gonka.gg/](https://proxy.gonka.gg/)
[https://gonkagate.com/](https://gonkagate.com/)
[https://gate.joingonka.ai/](https://gate.joingonka.ai/)
[https://router.gonkascan.com/](https://router.gonkascan.com/) · [▶ 演示](https://youtu.be/1uWmLGPoBCM)
[https://gonka-api.org/](https://gonka-api.org/)
[https://gonkabroker.com/](https://gonkabroker.com/)
[https://gonka-gateway.mingles.ai/](https://gonka-gateway.mingles.ai/)
[https://console.hyperfusion.io/](https://console.hyperfusion.io/)

??? note "关于此列表"
    这是一个精选的社区代理目录，这些代理通过公共 Gonka 网关路由推理请求，并已同意公开列出。该列表并不详尽，也不构成对任何运营者的背书。列表顺序在每次页面加载时随机打乱，因此代理的排列位置不代表排名；请根据各运营者自身优势进行评估。此目录反映了早期引导阶段的一组参与者。希望独立提供推理服务的新运营商可参见 [有兴趣运营网关吗？](#3-interested-in-operating-a-gateway)。部分代理提供 **▶ 演示** 链接，指向简短的入门视频——风格和时长可能有所不同。

??? tip "比较代理 — 社区可观测性仪表板"

    社区成员会针对公开的代理端点运行独立监控探针，并发布结果。这些仪表板可帮助你在选择代理前比较其可用性、延迟和定价：

    <ul class="broker-dashboards">
    <li><a href="https://meter.gonka.gg/">G-Meter</a></li>
    <li><a href="https://power.gnk.space/">Gonka Power</a></li>
    </ul>

    这些仪表板是 **社区构建的工具，不属于核心协议的一部分**。数据准确性、方法论和可用性由各仪表板运营者负责。请始终通过你自己的测试验证关键指标。该列表在每次页面加载时随机排序。

1.2 获取 API 密钥

按照代理网站上的引导说明操作。通常你需要：

在代理网站上注册（邮箱、账户、账单设置）。
在代理的控制台中生成 API 密钥。
记下代理的 `base_url`（例如 `https://api.<broker-domain>/v1`）以及支持的模型列表。

1.3 发送你的第一个请求

设置环境变量：


export GONKA_BROKER_URL=<broker-base-url>
     e.g. https://api.example-broker.com/v1
export GONKA_BROKER_API_KEY=<your-api-key>
export GONKA_MODEL=Qwen/Qwen3-235B-A22B-Instruct-2507-FP8
   or any model your broker supports


Gonka 的代理端点与 OpenAI 兼容，因此你可以直接使用官方的 OpenAI SDK，无需使用特定于 Gonka 的客户端。

=== "Python"

    安装 OpenAI Python SDK：

 

 
 


    pip install openai
 
 
 


    创建 `example.py`：

 

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
 
 
 


    使用 `python example.py` 运行。

=== "TypeScript"

    安装 OpenAI JS SDK：

 

 
 


    npm install openai
 
 
 


    创建 `example.mjs`：

 

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
 
 
 


    使用 `node example.mjs` 运行。

=== "Go"

    使用官方的 `openai-go` 客户端：

 

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
 
 
 


稍后，你应该能在终端中看到推理响应。

1.4 工具调用

工具调用通过相同的与 OpenAI 兼容的端点支持。仅支持 `type: "function"` — Gonka 在底层使用 vLLM，而 vLLM 实现了 OpenAI 聊天补全规范，不支持助手 API（`code_interpreter` 和 `file_search` 不可用）。

=== "Python"

 

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
 
 
 


=== "TypeScript"

 

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
 
 
 


---

## 2. 运行你自己的网关（高级）

如果你的应用具有高吞吐量或其他特殊需求，你可以选择自行运行 Gonka 网关，而不通过代理（broker）进行访问。该网关是一个小型程序（以 Docker 容器形式发布），可部署在你自己的机器或服务器上——**切勿**部署在 Gonka 主机上。它提供与代理相同的兼容 OpenAI 的 API，但私钥由你掌控，并且你将直接在链上以 GNK 支付其所创建的 devshard 费用。

!!! warning "自托管网关需要列入白名单的地址"

    目前，只有在链上 `devshard_escrow_params.allowed_creator_addresses` 白名单中的 Gonka 账户才能创建 devshard。如果你的地址不在该名单中，你的网关将无法创建会话，也无法发送推理请求。该白名单仅能通过链上治理投票进行修改。详见下方的[有兴趣运行网关吗？](#3-有兴趣运行网关吗)。

    完整部署说明请参阅[运行你自己的网关](gateway-developer-quickstart.md)。



## 3. 有兴趣运行网关吗？

推理请求通过网关接入网络。目前有两种方式获得网关，其管理机制也不同。

**使用公共网关（当前的代理）**。[§1.1](#11-选择一个代理) 中提到的代理是通过早期上线阶段达成的接入安排，经由公共 Gonka 网关接入推理服务。这属于启动阶段的临时措施，目前该目录不再主动扩展。

**自行运行网关**。自主运营你自己的链上 devshard 网关。这需要你的地址被列入由治理机制控制的白名单（`devshard_escrow_params.allowed_creator_addresses`），也是新运营商推荐的选择。完整操作指南请参阅[网关指南](gateway-developer-quickstart.md)。

如希望申请列入链上白名单，请创建一个 [GitHub issue](https://github.com/gonka-ai/gonka/issues/new?title=Gateway+allowlist+request)，内容需包括你的运营商名称和联系方式、计划使用的 `gonka1...` 地址，以及你打算提供的模型列表。是否纳入由链上治理决定——**无任何单一运营商或组织可单方面添加地址**——提出申请并不保证会被审核、通过或有明确时间表。



**需要帮助？** 请查看 [FAQ 页面](https://gonka.ai/FAQ/)，或加入 [Discord 服务器](https://discord.com/invite/RADwCT2U6R) 以获取技术支持或报告安全问题。
