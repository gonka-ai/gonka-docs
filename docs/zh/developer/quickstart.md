---
name: index.md
---

# 开发者快速入门

本指南解释了如何通过社区代理向 Gonka 发送推理请求。这是今天开始使用网络的最快方式。如果您希望[自行运行网关](#2-run-your-own-gateway-advanced)而非通过代理，请参阅本页底部的“运行您自己的网关”。

!!! note "如何连接到 Gonka"

    Gonka 推理现在围绕 **devshards** 组织——短暂的会话，持有小额链上存款（托管资金），并离线按请求结算。打开 devshard、签署请求、轮换会话以及提交结算到链上的职责由一种称为 **网关** 的软件执行。

    对于大多数开发者而言，使用 Gonka 最简单的方式是调用 **社区代理**——一个通过网关提供推理访问并暴露标准 OpenAI 兼容 API 的第三方。您只需从代理获取一个 API 密钥即可。

    ??? note "Gonka 与传统 AI API 的区别"

    Gonka 不仅仅是一个 AI API。它是一个用于可证明推理的加密协议，旨在使模型执行、计费和结算独立可审计，而非完全由单一提供商控制。

    | **方面** | **传统 AI API** <br> *(OpenAI、Anthropic 等)* | **Gonka API** |
    |---|---|---|
    | **模型来源与可验证输出** | 模型由提供商托管和版本控制，但用户无法独立验证哪个模型生成了特定输出。 | 推理可链接到协议定义的模型元数据和网络执行记录，实现可验证的来源。 |
    | **抗审查性** | 访问由提供商集中控制。 | 访问正逐步转向透明、协议治理的机制。当前生产访问仍受保护，协议级请求验证正在完成中。 |
    | **可审计性与透明度** | 日志记录、计费和使用跟踪由 API 提供商控制。 | 请求、计费和结算设计为可签名、带时间戳且可审计。 |
    | **透明代币经济** | 定价和资源分配由提供商定义。 | 网络的每次推理价格和结算由协议定义并上链，使底层推理经济可检查。 |

---

## 1. 使用社区代理（推荐）

代理是独立运营者，运行 Gonka 网关并向开发者转售推理服务。从您的应用程序角度看，代理端点的行为类似于任何 OpenAI 兼容的 API：您设置 `base_url`，传递 `Authorization: Bearer <API_KEY>` 头部，并像往常一样调用 `/v1/chat/completions`。

!!! caution "代理不属于核心协议"

    代理是独立的第三方。定价、支付方式（美元、加密货币、积分）、速率限制、支持的模型、SLA、退款政策和数据处理均由每个代理自行决定。在上线前，请阅读代理自己的文档和条款。

### 1.1 选择一个代理

- [https://proxy.gonka.gg/](https://proxy.gonka.gg/) · [▶ 演示](https://drive.google.com/file/d/1-Zk__4cY_ENi0Q8gw-JHgEBz6XZWXKAj/view?pli=1)
- [https://gonkagate.com/](https://gonkagate.com/)
- [https://gate.joingonka.ai/](https://gate.joingonka.ai/)
- [https://router.gonkascan.com/](https://router.gonkascan.com/) · [▶ 演示](https://youtu.be/1uWmLGPoBCM)
- [https://gonka-api.org/](https://gonka-api.org/) · [▶ 演示](https://youtu.be/JgY2ikjcP9M)
- [https://gonkabroker.com/](https://gonkabroker.com/)
- [https://router.mingles.ai/](https://router.mingles.ai/) · [▶ 演示](https://youtu.be/gegiRnNMavY)
- [https://console.hyperfusion.io/](https://console.hyperfusion.io/)
- [https://inference.dahl.global](https://inference.dahl.global)

??? note "关于此列表"
    这是一个精选的社区代理目录，这些代理通过公共 Gonka 网关路由推理，并同意被公开列出。该列表并非详尽无遗，也不对任何运营商作出背书。列表在每次页面加载时随机排序，因此每个代理的位置不代表排名；请根据各自的优势评估每个运营商。此目录反映了一个早期启动集。希望独立提供推理服务的新运营商，请参阅[有兴趣运营网关？](#3-interested-in-operating-a-gateway)。部分代理提供 **▶ 演示** 链接，指向简短的入门录屏——风格和时长可能有所不同。

??? tip "比较代理——社区可观测性仪表板"

    社区成员对公共代理端点运行独立监控探针并发布结果。这些仪表板可帮助您在选择代理前比较正常运行时间、延迟和定价：

    <ul class="broker-dashboards">
    <li><a href="https://meter.gonka.gg/">G-Meter</a></li>
    <li><a href="https://power.gnk.space/">Gonka Power</a></li>
    </ul>

    这些仪表板是**社区构建的工具，不属于核心协议的一部分**。数据准确性、方法论和可用性由每个仪表板运营商负责。请始终通过您自己的测试验证关键指标。每次页面加载时，列表都会以随机顺序显示。

### 1.2 获取 API 密钥

遵循经纪商网站上的入门说明。通常，您需要：

1. 在经纪商网站上注册（邮箱、账户、账单设置）。
2. 在经纪商仪表板中生成 API 密钥。
3. 记录经纪商的 `base_url`（例如 `https://api.<broker-domain>/v1`）以及支持的模型列表。

### 1.3 连接无代码应用或 AI 编程助手

将您的 API 密钥插入几乎任何支持 OpenAI 兼容提供商的 AI 软件、聊天界面或代理框架。

您需要从经纪商处获取三项内容（参见 [§1.2](#12-get-an-api-key)）：**基础 URL**、您的 **API 密钥** 和一个 **模型 ID**。

在大多数应用中，映射关系如下：

| 应用中的字段 | 应输入的内容 |
|---|---|
| API 基础 URL / 端点 | 您的经纪商 URL 加上 `/v1`，例如 `https://<broker-url>/v1`。如果应用要求提供 "OpenAI 基础 URL" 或 "自定义端点"，这就是它。 |
| API 密钥 / 认证令牌 | 您生成的密钥。即使应用提示 "输入 OpenAI API 密钥"，也请在此处使用您的经纪商密钥。 |
| 模型 / 自定义模型 | 您的经纪商支持的精确模型 ID。模型 ID 区分大小写 — 请完全复制，例如 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`。 |


以下菜单名称可能因应用版本而异 — 请查找等效设置。

=== "聊天界面"

    示例：Open WebUI、LibreChat、LobeChat。

    进入 **设置 → AI 提供商 / 连接**，选择 **OpenAI** 提供商，将默认的 OpenAI URL 替换为您的经纪商 URL 加上 `/v1`，插入您的密钥，并将模型 ID 添加到允许的模型列表中。

=== "AI IDE 和编程代理"

    示例：Cursor、Cline、Windsurf。

    进入 **设置 → 模型**，启用 **OpenAI 兼容** 提供商（或 **添加自定义模型**），用您的经纪商 URL 加上 `/v1` 覆盖基础 URL，并粘贴您的经纪商 API 密钥。

=== "无代码自动化"

    示例：Make.com、n8n、Flowise。

    使用标准的 **OpenAI** 模块，然后查找高级设置以将 **基础路径 / 基础 URL** 替换为您的经纪商 URL。

更喜欢编写代码？请继续阅读 [§1.4 在 Gonka 上发送您的第一个请求](#14-send-your-first-request-on-gonka)。

### 1.4 在 Gonka 上发送您的第一个请求

设置环境变量：

```bash
export GONKA_BROKER_URL=<broker-base-url>     # e.g. https://api.example-broker.com/v1
export GONKA_BROKER_API_KEY=<your-api-key>
export GONKA_MODEL=MiniMaxAI/MiniMax-M2.7   # or any model your broker supports
```

Gonka 经纪商端点与 OpenAI 兼容，因此您可以直接使用官方 OpenAI SDK —— 无需使用 Gonka 特定客户端。

=== "Python"

    安装 OpenAI Python SDK：

    ```bash
    pip install openai
    ```

    创建 `example.py`：

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

    安装 OpenAI JS SDK：

    ```bash
    npm install openai
    ```

    创建 `example.mjs`：

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

过一会儿，您应该会在终端中看到推理响应。

### 1.5 工具调用

工具调用通过相同的 OpenAI 兼容端点支持。仅支持 `type: "function"` —— Gonka 在后台使用 vLLM，它实现了 OpenAI 聊天补全规范，而非助手 API（`code_interpreter`、`file_search` 不可用）。

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

## 2. 运行您自己的网关（高级）

如果您的应用程序具有高吞吐量或其他要求，您可以自行运行 Gonka 网关，而不是通过代理。网关是一个小型程序（以 Docker 容器形式提供），您可以在自己的机器或服务器上运行——绝不能在 Gonka 主机上运行。它暴露与代理相同的 OpenAI 兼容 API，但密钥由您掌控，您直接在链上为它创建的 devshards 支付 GNK。

!!! warning "自托管网关需要允许列表中的地址"

    目前，只有链上 `devshard_escrow_params.allowed_creator_addresses` 列表中的 Gonka 账户才能打开 devshard。如果您的地址不在该列表中，您的网关无法创建会话，也无法发送推理请求。允许列表仅通过链上治理投票更改。请参阅下方的[有兴趣运行网关？](#3-interested-in-operating-a-gateway)。

    完整部署说明请参见[运行您自己的网关](gateway-developer-quickstart.md)。

---

## 3. 有兴趣运行网关？

推理通过网关进入网络。有两种方式获得网关，它们的管理方式不同。

**使用公共网关（当前代理）。** [§1.1](#11-pick-a-broker) 中的代理通过早期部署期间建立的访问安排连接到公共 Gonka 网关。这是一个引导步骤，该目录不再主动扩展。

**运行您自己的网关。** 运行您自己的链上 devshard 网关。这需要您的地址在治理控制的允许列表中（`devshard_escrow_params.allowed_creator_addresses`），这是新操作员的推荐路径。完整说明请参见[网关指南](gateway-developer-quickstart.md)。

要申请链上允许列表准入，请在 [GitHub 问题](https://github.com/gonka-ai/gonka/issues/new?title=Gateway+allowlist+request) 中提交您的操作员名称和联系方式、您计划使用的 `gonka1...` 地址以及您计划提供的模型。是否列入名单由链上治理决定——任何单一操作员或组织均无权单方面添加地址——表达兴趣并不保证会被审核、列入或有明确时间表。

---

**需要帮助？** 请参阅 [FAQ 页面](https://gonka.ai/FAQ/)，或加入 [Discord 服务器](https://discord.com/invite/RADwCT2U6R) 获取技术问题或安全相关支持。
