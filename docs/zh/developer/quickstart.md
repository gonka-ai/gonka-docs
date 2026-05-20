---
name: index.md
---

# 开发者快速开始

本指南介绍如何通过 **社区经纪商（community broker）** 向 Gonka 发送推理请求。这是目前接入网络最快的方式。

!!! note "开发者目前如何接入 Gonka"

    Gonka 推理现在围绕 **devshards** 组织 —— 这是一种短生命周期的会话，它在链上持有少量押金（escrow），并将每次请求的计费在链下结算。打开 devshard、对请求进行签名、轮换会话以及向链上提交结算的工作，都由一段被称为 **gateway** 的软件完成。

    对大多数开发者而言，使用 Gonka 最简单的方式就是调用一个 **社区经纪商（community broker）** —— 这是一家已经运行 gateway 并对外提供标准 OpenAI 兼容 API 的第三方。你只需要从经纪商那里获取一个 API key。

    如果你希望自己运行 gateway 而不是通过经纪商，请参见页面底部的 [自行运行 gateway](#2-run-your-own-gateway-advanced)。

??? note "Gonka 与传统 AI API 的区别"

    Gonka 不仅仅是另一个 AI API，它是一个用于可证明推理（provable inference）的加密协议，其目标是让模型执行、计费与结算可以被独立审计，而不是完全由单一服务商掌控。

    | **方面** | **传统 AI API** <br> *(OpenAI、Anthropic 等)* | **Gonka API** |
    |---|---|---|
    | **模型来源与可验证输出** | 模型由服务商托管和版本管理，但用户无法独立验证某次输出实际上是由哪个模型产生的。 | 推理可以与协议定义的模型元数据以及网络执行记录建立关联，从而实现可验证的来源（verifiable provenance）。 |
    | **抗审查性** | 访问由服务商集中控制。 | 访问正在迁移到由协议治理的透明机制。在协议层面的请求校验完善之前，当前生产环境的访问仍处于受控状态。 |
    | **可审计性与透明度** | 日志、计费和用量统计由 API 服务商控制。 | 请求、计费与结算被设计为经过签名、加时间戳，并可被审计。 |
    | **透明的代币经济学** | 价格与资源分配由服务商定义。 | 价格与结算由协议或链上规则定义，使推理的经济模型更易于检查。 |

---

## 1. 使用社区经纪商（推荐）

经纪商（broker）是一个独立运营方，自行运行 Gonka gateway，并将推理服务转售给开发者。从你的应用视角看，经纪商的接入点与任意 OpenAI 兼容 API 完全相同：设置 `base_url`，添加 `Authorization: Bearer <API_KEY>` 头，按惯例调用 `/v1/chat/completions` 即可。

!!! caution "经纪商不是核心协议的一部分"

    经纪商是独立的第三方。定价、支付方式（USD、加密货币、抵用额度）、速率限制、所支持的模型、SLA、退款政策以及数据处理方式，都由每家经纪商自行决定。在正式上线前，请先阅读经纪商自己的文档与服务条款。

### 1.1 选择经纪商

- [https://proxy.gonka.gg/](https://proxy.gonka.gg/)
- [https://gonkagate.com/](https://gonkagate.com/)
- [https://gate.joingonka.ai/](https://gate.joingonka.ai/)
- [https://router.gonkascan.com/](https://router.gonkascan.com/)
- [https://gonka.pw/](https://gonka.pw/)
- [https://gonka-api.org/](https://gonka-api.org/)

??? note "关于此列表"
    此处列出的经纪商在主网上运行 Gonka gateway，并已同意被公开列出。Gonka 不为任何特定经纪商背书。列表会在每次页面加载时以随机顺序重新打乱，因此每家经纪商出现的位置不代表任何排名；请根据自身需求独立评估每家运营方。

### 1.2 获取 API key

按经纪商网站上的接入说明操作。通常你需要：

1. 在经纪商网站注册（邮箱、账户、计费配置）。
2. 在经纪商的控制台中生成 API key。
3. 记下经纪商的 `base_url`（例如 `https://api.<broker-domain>/v1`）以及它支持的模型列表。

### 1.3 发送你的第一个请求

设置环境变量：

```bash
export GONKA_BROKER_URL=<broker-base-url>     # 例如 https://api.example-broker.com/v1
export GONKA_BROKER_API_KEY=<your-api-key>
export GONKA_MODEL=Qwen/Qwen3-235B-A22B-Instruct-2507-FP8   # 或经纪商支持的任意模型
```

Gonka 经纪商接入点是 OpenAI 兼容的，因此可以直接使用 OpenAI 官方 SDK —— 不需要 Gonka 特定的客户端库。

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
            {"role": "user", "content": "写一句关于独角兽的睡前小故事"}
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
        messages: [{ role: "user", content: "你好！请讲一个短笑话。" }],
    });

    console.log(response.choices[0].message.content);
    ```

    使用 `node example.mjs` 运行。

=== "Go"

    使用 OpenAI 官方 `openai-go` 客户端：

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
            Model: openai.F(os.Getenv("GONKA_MODEL")),
            Messages: openai.F([]openai.ChatCompletionMessageParamUnion{
                openai.UserMessage("写一首关于编程的俳句"),
            }),
        })
        if err != nil {
            log.Fatal(err)
        }
        log.Println(r.Choices[0].Message.Content)
    }
    ```

稍等片刻，你应该会在终端中看到推理响应。

### 1.4 工具调用

工具调用通过同一个 OpenAI 兼容接入点提供。仅支持 `type: "function"` —— Gonka 底层使用 vLLM，它实现的是 OpenAI Chat Completions 规范，而不是 Assistants API（`code_interpreter`、`file_search` 等功能不可用）。

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
                "description": "获取某个城市的当前天气",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "city": {"type": "string", "description": "城市名称"}
                    },
                    "required": ["city"],
                },
            },
        }
    ]

    response = client.chat.completions.create(
        model=os.environ["GONKA_MODEL"],
        messages=[{"role": "user", "content": "巴黎的天气怎么样？"}],
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
                description: "获取某个城市的当前天气",
                parameters: {
                    type: "object",
                    properties: { city: { type: "string", description: "城市名称" } },
                    required: ["city"],
                },
            },
        },
    ];

    const response = await client.chat.completions.create({
        model: process.env.GONKA_MODEL,
        messages: [{ role: "user", content: "巴黎的天气怎么样？" }],
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

## 2. 自行运行 gateway（进阶） { #2-run-your-own-gateway-advanced }

如果你的应用有较高的吞吐量或其他特殊需求，可以自行运行 Gonka gateway，而不必通过经纪商。Gateway 是一个以 Docker 容器形式分发的小型程序，你可以将它运行在自己的机器或服务器上 —— **绝不要运行在 Gonka 主机上**。它对外暴露与经纪商相同的 OpenAI 兼容 API，但密钥由你掌控，且为它创建的 devshard 直接在链上以 GNK 支付。

!!! warning "自托管 gateway 需要白名单地址"

    目前，只有处于链上 `devshard_escrow_params.allowed_creator_addresses` 列表中的 Gonka 账户才能创建 devshards。如果你的地址不在该列表中，你的 gateway 就无法创建会话，也就无法发起推理请求。该白名单由链上治理投票扩充。如需申请加入，请参见下文 [成为经纪商](#3-become-a-broker)。

我们正在准备一份独立指南，其中包含完整的部署说明、配置、devshard 轮换以及运维相关内容。在文档完善之前，如需提前获取相关信息，请在 [Discord](https://discord.com/invite/RADwCT2U6R) 联系我们。

---

## 3. 成为经纪商 { #3-become-a-broker }

如果你希望被加入到上方的公开经纪商列表，并（在需要时）被加入到链上的 devshard 创建者白名单，请在 GitHub 上提交一个 issue：

[提交 issue：“Request to be added as a Gonka broker”](https://github.com/gonka-ai/gonka/issues/new?title=Request+to+be+added+as+a+Gonka+broker)

请在 issue 中包含以下信息：

- 运营方名称与联系方式（邮箱或 Discord 用户名）。
- 你的 gateway 的公开接入点 URL。
- 你打算用于创建 devshard 的 Gonka 地址（`gonka1...`）。
- 你计划支持的模型，以及你将施加的速率限制（如有）。
- 简要描述你的计费模式（USD / 加密货币 / 抵用额度）以及目标用户群体。

社区将进行评审；当需要链上加入白名单时，将创建相应的链上治理提案。Gonka 不会单方面挑选经纪商 —— 加入白名单需要通过公开投票。

---

**需要帮助？** 请查看 [FAQ 页面](https://gonka.ai/FAQ/)，或加入 [Discord 服务器](https://discord.com/invite/RADwCT2U6R) 反馈技术问题或安全相关问题。
