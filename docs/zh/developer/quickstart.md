---
name: index.md
---

# 开发者快速入门

本指南介绍如何通过社区代理（broker）向 Gonka 发送推理请求。这是目前开始使用该网络的最快方式。

!!! note "开发者当前如何连接到 Gonka"

    Gonka 的推理目前围绕 **devshard** 组织——即短期会话，持有少量链上存款（托管资金），并通过链下方式按请求结算费用。创建 devshard、签名请求、轮换会话以及向链上提交结算的操作由一种名为 **网关（gateway）** 的软件完成。

    对大多数开发者而言，使用 Gonka 最简单的方式是调用一个 **社区代理（community broker）** —— 即第三方运营商，他们通过网关提供推理访问，并暴露标准的兼容 OpenAI 的 API 接口。你只需从代理处获取一个 API 密钥即可。

    如果你想运行自己的网关而非通过代理访问，请参见本页底部的 [运行你自己的网关（高级）](#2-run-your-own-gateway-advanced)。

??? note "Gonka 与传统 AI API 的区别"

    Gonka 不仅仅是另一个 AI API。它是一种用于可验证推理的加密协议，旨在使模型执行、计费和结算过程可独立审计，而不是完全由单一提供商控制。

    | **方面** | **传统 AI API** <br> *(如 OpenAI、Anthropic 等)
| **Gonka API** |
    |---|---|---|
    | **模型来源与输出可验证性** | 模型由提供商托管和版本管理，但用户无法独立验证某个输出是由哪个模型生成的。 | 推理结果可关联到协议定义的模型元数据和网络执行记录，实现可验证的来源追踪。 |
    | **抗审查性** | 访问由提供商集中控制。 | 访问正逐步转向透明且由协议治理的机制。当前生产环境的访问受到保护，直到协议级别的请求验证完成为止。 |
    | **可审计性与透明度** | 日志、计费和使用追踪由 API 提供商控制。 | 请求、计费和结算被设计为可签名、带时间戳并可供审计。 |
    | **透明的代币经济机制** | 定价和资源分配由提供商决定。 | 定价和结算由协议定义或在链上进行，使推理经济更加可查。 |

---

## 1. 使用社区代理（推荐）

代理是独立运营者，他们运行 Gonka 网关并向开发者转售推理服务。从你的应用程序角度看，代理端点的行为就像任何兼容 OpenAI 的 API：你设置一个 `base_url`，传入 `Authorization: Bearer <API_KEY>` 头部，并像往常一样调用 `/v1/chat/completions`。

!!! caution "代理不属于核心协议的一部分"

    代理是独立的第三方。定价、支付方式（美元、加密货币、积分）、速率限制、支持的模型、服务等级协议（SLA）、退款政策和数据处理均由各代理自行决定。在正式上线前，请务必阅读代理自身的文档和条款。

### 1.1 选择一个代理

- [https://proxy.gonka.gg/](https://proxy.gonka.gg/)
- [https://gonkagate.com/](https://gonkagate.com/)
- [https://gate.joingonka.ai/](https://gate.joingonka.ai/)
- [https://router.gonkascan.com/](https://router.gonkascan.com/) · [▶ 演示](https://youtu.be/1uWmLGPoBCM)
- [https://gonka-api.org/](https://gonka-api.org/)
- [https://gonkabroker.com/](https://gonkabroker.com/)
- [https://gonka-gateway.mingles.ai/](https://gonka-gateway.mingles.ai/)
- [https://console.hyperfusion.io/](https://console.hyperfusion.io/)

??? note "关于此列表"
    此列表为精选的社区代理目录，这些代理通过公共 Gonka 网关路由推理请求，并已同意公开列出。列表并不完整，也不代表对任何运营商的认可。列表顺序为每次页面加载时随机打乱，因此代理的排列位置不代表排名；请根据各运营商自身优势进行评估。本目录反映的是早期引导阶段的一组运营商。希望独立提供推理服务的新运营商可参见 [有兴趣运营网关吗？](#3-interested-in-operating-a-gateway)。部分代理提供 **▶ 演示** 链接，指向简短的上手录屏视频——风格和时长可能有所不同。

### 1.2 获取 API 密钥

按照代理网站上的引导流程操作。通常你需要：

1. 在代理网站注册（邮箱、账户、账单设置）。
2. 在代理的控制台中生成 API 密钥。
3. 记下代理的 `base_url`（例如 `https://api.<broker-domain>/v1`）以及支持的模型列表。

### 1.3 发送你的第一个请求

设置环境变量：

```bash
export GONKA_BROKER_URL=<broker-base-url>     # e.g. https://api.example-broker.com/v1
export GONKA_BROKER_API_KEY=<your-api-key>
export GONKA_MODEL=Qwen/Qwen3-235B-A22B-Instruct-2507-FP8   # or any model your broker supports
```

Gonka 的代理端点与 OpenAI 兼容，因此你可以直接使用官方的 OpenAI SDK，无需使用特定于 Gonka 的客户端。

=== "Python"

    安装 OpenAI Python SDK：

    ```bash
    pip install openai
    ```

    
example.py

def hello_world():
    """Prints 'Hello, World!' to the console."""
    print("Hello, World!")

def add_numbers(a, b):
    """Returns the sum of two numbers."""
    return a
 b

def main():
    """Main function to demonstrate basic functionality."""
    hello_world()
    
    num1 = 10
    num2 = 5
    result = add_numbers(num1, num2)
    print(f"The sum of {num1} and {num2} is: {result}")

Run the main function when the script is executed
if __name__ == "__main__":
    main()

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

    运行 `python example.py`。

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

    运行 `node example.mjs`。

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

稍后，你应该能在终端中看到推理响应。

### 1.4 工具调用

通过相同的兼容 OpenAI 的端点支持工具调用。仅支持 `type: "function"` —— Gonka 在底层使用 vLLM，它实现了 OpenAI 聊天补全规范，而不支持助手 API（`code_interpreter`、`file_search` 不可用）。

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

如果你的应用具有高吞吐量或其他特殊需求，你可以选择自行运行 Gonka 网关，而不是通过中介（broker）访问。该网关是一个小型程序（以 Docker 容器形式发布），可部署在你自己的机器或服务器上——**切勿**部署在 Gonka 主机上。它暴露的 API 与中介相同，兼容 OpenAI 格式，但私钥由你掌控，并且你将直接通过链上支付 GNK 代币，用于网关创建的 devshard。

!!! warning "自托管网关需要地址在白名单中"

    目前，只有在链上 `devshard_escrow_params.allowed_creator_addresses` 白名单中的 Gonka 账户才能创建 devshard。如果你的地址不在该列表中，你的网关将无法创建会话，也无法发送推理请求。该白名单仅能通过链上治理投票进行修改。详见下方的[有兴趣运行网关吗？](#3-有兴趣运行网关吗)。

完整部署说明请参见[运行你自己的网关](gateway-developer-quickstart.md)。

---

## 3. 有兴趣运行网关吗？

推理请求通过网关接入 Gonka 网络。目前有两种方式获取网关，其管理机制也不同。

**使用公共网关（当前的中介）**  
[§1.1](#11-选择一个中介) 中列出的中介，在早期上线阶段通过特定接入安排使用公共 Gonka 网关提供服务。这属于启动阶段的临时措施，目前该目录不再主动扩展。

**自行运行网关**  
你可以自主运营一个链上 devshard 网关。这需要你的地址被列入由治理机制控制的白名单（`devshard_escrow_params.allowed_creator_addresses`），也是新运营商推荐的选择。详细操作指南请参阅[网关开发者指南](gateway-developer-quickstart.md)。

如需申请加入链上白名单，请在 GitHub 上[提交一个问题](https://github.com/gonka-ai/gonka/issues/new?title=Gateway+allowlist+request)，内容需包括你的运营者名称和联系方式、计划使用的 `gonka1...` 地址，以及你打算提供的模型列表。是否加入由链上治理决定——**无任何单一运营者或组织可单方面添加地址**。提出申请并不保证会被审核、通过或有明确时间表。

---

**需要帮助？** 请查看[常见问题页面](https://gonka.ai/FAQ/)，或加入[Discord 服务器](https://discord.com/invite/RADwCT2U6R)以获取技术支持或报告安全问题。
