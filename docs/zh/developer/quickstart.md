---
name: index.md
---

# 开发者快速入门

<<<<<<< HEAD
<<<<<<< HEAD
本指南介绍了如何通过社区代理向Gonka发送推理请求。这是目前开始使用该网络的最快方式。如果您希望[运行自己的网关](#2-run-your-own-gateway-advanced)而不是通过代理，请参阅本页面底部的“运行您自己的网关”。

!!! note "如何连接到Gonka"

    Gonka推理现在围绕**devshard**组织——一种短期会话，持有少量链上存款（托管）并通过链下方式按请求结算账单。开启devshard、签名请求、轮换会话以及向链上提交结算的操作由一种名为**网关**的软件完成。

    对于大多数开发者来说，使用Gonka最简单的方法是调用一个**社区代理**——一个通过网关提供推理访问并暴露标准OpenAI兼容API的第三方。您只需要从代理获取一个API密钥即可。

    ??? note "Gonka与传统AI API的区别"

    Gonka不仅仅是另一个AI API。它是一种用于可验证推理的加密协议，旨在使模型执行、计费和结算过程能够独立审计，而不是完全由单一提供商控制。

    | **方面** | **传统AI API** <br> *(OpenAI, Anthropic等)* | **Gonka API** |
    | --- | --- | --- |
    | **模型来源与可验证输出** | 模型由提供商托管和版本化，但用户无法独立验证是哪个模型生成了特定输出。 |  |
=======
本指南介绍了如何通过社区代理向Gonka发送推理请求。这是目前开始使用该网络的最快方式。如果您希望[运行自己的网关](#2-run-your-own-gateway-advanced)而不是通过代理，请参阅本页底部的“运行您自己的网关”。
=======
本指南介绍了如何通过社区代理向Gonka发送推理请求。这是目前开始使用该网络的最快方式。如果您希望[运行自己的网关](#2-run-your-own-gateway-advanced)而不是通过代理，请参阅本页底部的“运行您自己的网关”部分。
>>>>>>> 6addb31 (transfers)

!!! note "如何连接到Gonka"

    Gonka推理现在围绕**devshard**组织——一种短期会话，持有少量链上存款（托管）并通过链下方式按请求结算账单。创建devshard、签名请求、轮换会话以及向链提交结算的操作由一种名为**网关**的软件完成。

    对于大多数开发者来说，使用Gonka最简单的方法是调用一个**社区代理**——一个通过网关提供推理访问并暴露标准OpenAI兼容API的第三方。您只需要从代理获取一个API密钥即可。

    ??? note "Gonka与传统AI API的区别"

    Gonka不仅仅是另一个AI API。它是一种用于可验证推理的加密协议，旨在使模型执行、计费和结算过程能够独立审计，而不是完全由单一提供商控制。

    | **方面** | **传统AI API** <br> *(OpenAI, Anthropic等)* | **Gonka API** |
    | --- | --- | --- |
<<<<<<< HEAD
    | **模型来源与可验证输出** | 模型由提供商托管和版本管理，但用户无法独立验证是哪个模型生成了特定输出。 |  |
>>>>>>> 7832026 (transfers)
=======
    | **模型来源与可验证输出** | 模型由提供商托管和版本管理，但用户无法独立验证某个输出是由哪个模型生成的。 |  |
>>>>>>> 6addb31 (transfers)
    | **抗审查性** |  |  |
    | **可审计性与透明度** | 推理可以关联到协议定义的模型元数据和网络执行记录，从而实现可验证的来源追踪。 |  |
    | **透明的代币经济** |  |  |

---

## 1. 使用社区代理（推荐）

<<<<<<< HEAD
代理是由独立运营商运行的Gonka网关，将推理服务转售给开发者。从您的应用程序角度来看，代理端点的行为类似于任何OpenAI兼容的API：您设置一个 `base_url`，传递一个 `Authorization: Bearer <API_KEY>` 头，并像往常一样调用 `/v1/chat/completions`。

!!! caution "代理不属于核心协议"

    代理是独立的第三方。定价、付款方式（美元、加密货币、积分）、速率限制、支持的模型、服务等级协议（SLA）、退款政策和数据处理均由各代理自行决定。在上线前请阅读代理自身的文档和条款。
=======
代理是独立运营商，他们运行Gonka网关并向开发者转售推理服务。从您的应用程序角度来看，代理端点的行为类似于任何OpenAI兼容API：您设置一个 `base_url`，传递一个 `Authorization: Bearer <API_KEY>` 头，并像往常一样调用 `/v1/chat/completions`。

!!! caution "代理不属于核心协议"

<<<<<<< HEAD
    代理是独立的第三方。定价、付款方式（美元、加密货币、积分）、速率限制、支持的模型、SLA、退款政策和数据处理由每个代理自行决定。在上线前请阅读代理自身的文档和条款。
>>>>>>> 7832026 (transfers)
=======
    代理是独立的第三方。定价、付款方式（美元、加密货币、积分）、速率限制、支持的模型、服务等级协议（SLA）、退款政策和数据处理均由各代理自行决定。在上线前请务必阅读代理自身的文档和条款。
>>>>>>> 6addb31 (transfers)

### 1.1 选择一个代理

- [https://proxy.gonka.gg/](https://proxy.gonka.gg/) · [▶ 演示](https://drive.google.com/file/d/1-Zk__4cY_ENi0Q8gw-JHgEBz6XZWXKAj/view?pli=1)
- [https://gonkagate.com/](https://gonkagate.com/)
- [https://gate.joingonka.ai/](https://gate.joingonka.ai/)
- [https://router.gonkascan.com/](https://router.gonkascan.com/) · [▶ 演示](https://youtu.be/1uWmLGPoBCM)
- [https://gonka-api.org/](https://gonka-api.org/) · [▶ 演示](https://youtu.be/JgY2ikjcP9M)
- [https://gonkabroker.com/](https://gonkabroker.com/)
<<<<<<< HEAD
- [https://router.mingles.ai/](https://router.mingles.ai/) · [▶ demo](https://youtu.be/gegiRnNMavY)
- [https://console.hyperfusion.io/](https://console.hyperfusion.io/)
- [https://inference.dahl.global](https://inference.dahl.global)
=======
- [https://router.mingles.ai/](https://router.mingles.ai/) · [▶ 演示](https://youtu.be/gegiRnNMavY)
- [https://console.hyperfusion.io/](https://console.hyperfusion.io/) 
>>>>>>> 183f0d2 (chore(zh): update translations for c3677db3)

??? note "关于此列表"
<<<<<<< HEAD
<<<<<<< HEAD
    这是一个经过筛选的社区代理目录，这些代理通过公共Gonka网关路由推理请求，并同意被公开列出。目录并不详尽，也不背书任何运营商。列表以随机顺序显示，并在每次页面加载时重新洗牌，因此每个代理的位置并不代表排名；请根据每个运营商自身的优点进行评估。此目录反映了早期启动阶段的一组运营商。希望独立提供推理服务的新运营商请参阅[有兴趣运营网关吗？](#3-interested-in-operating-a-gateway)。一些代理提供**▶ demo**链接，指向简短的入门视频——风格和长度可能有所不同。

??? tip "比较代理——社区可观测性仪表板"

    社区成员会对公共代理端点运行独立的监控探测，并发布结果。这些仪表板可以帮助您在选择代理前比较其正常运行时间、延迟和定价：
=======
    这是一个精选的社区代理目录，这些代理通过公共Gonka网关路由推理请求，并已同意公开列出。该列表并不详尽，也不背书任何运营商。列表以随机顺序显示，并在每次页面加载时重新洗牌，因此各代理的位置不代表排名；请根据各运营商自身的优点进行评估。此目录反映了早期引导阶段的一组运营商。希望独立提供推理服务的新运营商应参阅[有兴趣运营网关吗？](#3-interested-in-operating-a-gateway)。一些代理提供**▶ demo**链接指向简短的入门视频教程——风格和时长可能不同。
=======
    这是一个精选的社区代理目录，这些代理通过公共Gonka网关路由推理请求，并同意被公开列出。目录并不详尽，也不背书任何运营商。列表以随机顺序显示，每次页面加载都会重新洗牌，因此代理的位置不代表排名；请根据每个运营商自身的优点进行评估。此目录反映了一个早期引导集合。希望独立提供推理服务的新运营商可参阅[有兴趣运营网关吗？](#3-interested-in-operating-a-gateway)。一些代理提供**▶ 演示**链接，指向简短的入门视频——风格和长度可能有所不同。
>>>>>>> 6addb31 (transfers)

??? tip "比较代理——社区可观测性仪表板"

    社区成员对公共代理端点运行独立监控探针并发布结果。这些仪表板可以帮助您在选择代理前比较正常运行时间、延迟和定价：
>>>>>>> 7832026 (transfers)

    <ul class="broker-dashboards">
    <li><a href="https://meter.gonka.gg/">G-Meter</a></li>
    <li><a href="https://power.gnk.space/">Gonka Power</a></li>
    </ul>

<<<<<<< HEAD
<<<<<<< HEAD
    这些仪表板是**社区构建的工具，不属于核心协议的一部分**。数据准确性、方法论和可用性由各个仪表板运营方负责。请始终通过您自己的测试验证关键指标。此列表在每次页面加载时以随机顺序显示。

### 1.2 获取 API 密钥

按照经纪商网站上的引导说明操作。通常您需要：

1. 在经纪商网站上注册（邮箱、账户、账单设置）
2. 在经纪商的仪表板中生成一个 API 密钥
3. 记下经纪商的 `base_url`（例如 `https://api.<broker-domain>/v1`）以及支持的模型列表

### 1.3 连接无代码应用或 AI 编程助手

将您的 API 密钥插入几乎任何支持 OpenAI 兼容提供商的 AI 软件、聊天界面或代理框架中。

您需要从经纪商处获取三样信息（见 [§1.2](#12-get-an-api-key)）：**基础 URL**、您的**API 密钥**和一个**模型 ID**。
=======
    这些仪表盘是**社区构建的工具，不属于核心协议的一部分**。数据准确性、方法论和可用性由各个仪表盘运营方负责。请始终通过您自己的测试来验证关键指标。此列表在每次页面加载时以随机顺序显示。
=======
    这些仪表板是**社区构建的工具，不属于核心协议的一部分**。数据准确性、方法论和可用性由各个仪表板运营商负责。请始终通过您自己的测试验证关键指标。此列表在每次页面加载时以随机顺序显示。
>>>>>>> 6addb31 (transfers)

### 1.2 获取API密钥

按照经纪商网站上的引导说明操作。通常，您需要：

1. 在经纪商网站上注册（邮箱、账户、账单设置）
2. 在经纪商的仪表板中生成API密钥
3. 记下经纪商的`base_url`（例如`https://api.<broker-domain>/v1`）以及支持的模型列表

### 1.3 连接无代码应用或AI编程助手

将您的API密钥插入几乎任何支持OpenAI兼容提供商的AI软件、聊天界面或代理框架中

<<<<<<< HEAD
您需要从经纪商处获取三样信息（参见[§1.2](#12-get-an-api-key)）：**基础 URL**、您的**API 密钥**和一个**模型 ID**
>>>>>>> 7832026 (transfers)
=======
您需要从经纪商处获取三样信息（参见[§1.2](#12-get-an-api-key)）：**基础URL**、您的**API密钥**和一个**模型ID**
>>>>>>> 6addb31 (transfers)

在大多数应用中，映射关系如下：

| 应用中的字段 | 应输入的内容 |
| --- | --- |
<<<<<<< HEAD
<<<<<<< HEAD
| API Base URL / Endpoint | 您的经纪商 URL 加上附加的 `/v1`，例如 `https://<broker-url>/v1`。如果应用要求输入“OpenAI Base URL”或“Custom Endpoint”，即为此项。 |
| API Key / Auth Token | 您生成的密钥。即使应用提示“输入 OpenAI API 密钥”，此处仍使用您的经纪商密钥。 |
| Model / Custom Model | 您的经纪商所支持的确切模型 ID。模型 ID 区分大小写——请准确复制，例如 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`。 |

以下确切的菜单名称可能因应用版本而异——请查找对应的设置项。

=== "聊天界面"

    示例：Open WebUI, LibreChat, LobeChat。

    进入 **设置 → AI 提供商 / 连接**，选择 **OpenAI** 提供商，将默认的 OpenAI URL 替换为您的经纪商 URL 加上 `/v1`，插入您的密钥，并将模型 ID 添加到允许的模型列表中。

=== "AI IDE 和编程代理"

    示例：Cursor, Cline, Windsurf。

    进入 **设置 → 模型**，启用 **OpenAI 兼容** 提供商（或 **添加自定义模型**），将 Base URL 覆盖为您的经纪商 URL 加上 `/v1`，然后粘贴您的经纪商 API 密钥。

=== "无代码自动化"

    示例：Make.com, n8n, Flowise。

    使用标准的 **OpenAI** 模块，然后在高级设置中查找以使用您的经纪商 URL 覆盖 **Base Path / Base URL**。

更倾向于编写代码？请继续阅读 [§1.4 在 Gonka 上发送您的第一个请求](#14-send-your-first-request-on-gonka)。
=======
| API 基础 URL / 端点 | 您的经纪商 URL 后附加 `/v1`，例如 `https://<broker-url>/v1`。如果应用要求输入“OpenAI 基础 URL”或“自定义端点”，即为此项 |
| API 密钥 / 认证令牌 | 您生成的密钥。即使应用提示“输入 OpenAI API 密钥”，此处仍使用您的经纪商密钥 |
| 模型 / 自定义模型 | 您的经纪商所支持的确切模型 ID。模型 ID 区分大小写——请准确复制，例如 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` |
=======
| API基础URL / 端点 | 在您的经纪商URL后附加`/v1`，例如`https://<broker-url>/v1`。如果应用要求输入"OpenAI基础URL"或"自定义端点"，即为此项 |
| API密钥 / 认证令牌 | 您生成的密钥。即使应用提示"输入OpenAI API密钥"，也请在此处使用您的经纪商密钥 |
| 模型 / 自定义模型 | 您的经纪商支持的确切模型ID。模型ID区分大小写——请准确复制，例如`Qwen/Qwen3-235B-A22B-Instruct-2507-FP8` |
>>>>>>> 6addb31 (transfers)

以下确切的菜单名称可能因应用版本而异——请查找对应的设置

=== "聊天界面"

    示例：Open WebUI, LibreChat, LobeChat

    进入**设置 → AI提供商 / 连接**，选择**OpenAI**提供商，将默认的OpenAI URL替换为您的经纪商URL加上`/v1`，插入您的密钥，并将模型ID添加到允许的模型列表中

=== "AI集成开发环境和编码代理"

    示例：Cursor, Cline, Windsurf

    进入**设置 → 模型**，启用**OpenAI兼容**提供商（或**添加自定义模型**），将基础URL覆盖为您的经纪商URL加上`/v1`，并粘贴您的经纪商API密钥

=== "无代码自动化"

    示例：Make.com, n8n, Flowise

    使用标准的**OpenAI**模块，然后在高级设置中查找以使用经纪商的URL覆盖**基础路径 / 基础URL**

<<<<<<< HEAD
更倾向于编写代码？请继续阅读 [§1.4 在 Gonka 上发送您的第一个请求](#14-send-your-first-request-on-gonka)
>>>>>>> 7832026 (transfers)
=======
更倾向于编写代码？继续前往[§1.4 在Gonka上发送您的第一个请求](#14-send-your-first-request-on-gonka)
>>>>>>> 6addb31 (transfers)

### 1.4 在Gonka上发送您的第一个请求

设置环境变量：

```bash
export GONKA_BROKER_URL=<broker-base-url>     # e.g. https://api.example-broker.com/v1
export GONKA_BROKER_API_KEY=<your-api-key>
export GONKA_MODEL=Qwen/Qwen3-235B-A22B-Instruct-2507-FP8   # or any model your broker supports
```

<<<<<<< HEAD
<<<<<<< HEAD
Gonka 经纪商端点与 OpenAI 兼容，因此您可以直接使用官方 OpenAI SDK——无需使用特定于 Gonka 的客户端。
=======
Gonka 的代理端点与 OpenAI 兼容，因此你可以直接使用官方的 OpenAI SDK——不需要特定于 Gonka 的客户端。
>>>>>>> 7832026 (transfers)
=======
Gonka经纪商端点兼容OpenAI，因此您可以直接使用官方OpenAI SDK——无需Gonka专用客户端
>>>>>>> 6addb31 (transfers)

=== "Python"

    安装OpenAI Python SDK：

    ```bash
    pip install openai
    ```

    创建`example.py`：

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

    使用`python example.py`运行

=== "TypeScript"

    安装OpenAI JS SDK：

    ```bash
    npm install openai
    ```

    创建`example.mjs`：

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

    使用`node example.mjs`运行

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

<<<<<<< HEAD
<<<<<<< HEAD
片刻之后，你应该能在终端中看到推理响应。

### 1.5 工具调用

工具调用通过相同的 OpenAI 兼容端点支持。目前仅支持 `type: "function"` —— Gonka 使用 vLLM 作为底层实现，该实现遵循 OpenAI 聊天补全规范，而非助手 API（`code_interpreter`、`file_search` 不可用）。
=======
片刻之后，您应该会在终端中看到推理响应。

### 1.5 工具调用

工具调用通过相同的与OpenAI兼容的端点支持。仅支持`type: "function"` — Gonka 在底层使用 vLLM，它实现了 OpenAI 聊天补全规范，而不支持 Assistants API（`code_interpreter`、`file_search` 不可用）。
>>>>>>> 7832026 (transfers)
=======
片刻之后，你应该能在终端中看到推理响应。

### 1.5 工具调用

工具调用通过相同的与 OpenAI 兼容的端点支持。目前仅支持 `type: "function"` — Gonka 在底层使用 vLLM，它实现了 OpenAI 聊天补全规范，而非助手 API（`code_interpreter`、`file_search` 不可用）
>>>>>>> 6addb31 (transfers)

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

<<<<<<< HEAD
<<<<<<< HEAD
如果你的应用有高吞吐量或其他需求，你可以自己运行一个 Gonka 网关，而不必通过代理。网关是一个小型程序（以 Docker 容器形式提供），你可以在自己的机器或服务器上运行——绝不会在 Gonka 主机上运行。它暴露与代理相同的 OpenAI 兼容 API，但你拥有密钥，并直接在链上为它创建的 devshard 支付 GNK。

!!! warning "自托管网关需要允许列表中的地址"

    目前，只有在链上 `devshard_escrow_params.allowed_creator_addresses` 允许列表中的 Gonka 账户才能打开 devshard。如果你的地址不在该列表中，你的网关将无法创建会话，也无法发送推理请求。允许列表只能通过链上治理投票更改。参见下方 [有兴趣运行网关吗？](#3-interested-in-operating-a-gateway)。

    完整部署说明请参见 [运行你自己的网关](gateway-developer-quickstart.md)。
=======
如果你的应用具有高吞吐量或其他需求，你可以自行运行 Gonka 网关，而不必通过经纪商。网关是一个小型程序（以 Docker 容器形式发布），你将其运行在你自己的机器或服务器上——绝不在 Gonka 主机上运行。它暴露与经纪商相同的兼容 OpenAI 的 API，但你拥有密钥，并直接在链上为它创建的 devshards 支付 GNK。
=======
如果你的应用具有高吞吐量或其他需求，你可以自己运行一个 Gonka 网关，而不是通过代理。网关是一个小型程序（以 Docker 容器形式发布），你可以在自己的机器或服务器上运行——永远不会在 Gonka 主机上运行。它暴露与代理相同的与 OpenAI 兼容的 API，但你拥有密钥，并直接在链上为它创建的 devshard 支付 GNK。
>>>>>>> 6addb31 (transfers)

!!! warning "自托管网关需要一个白名单地址"

    目前，只有在链上 `devshard_escrow_params.allowed_creator_addresses` 白名单中的 Gonka 账户才能打开 devshard。如果你的地址不在该列表中，你的网关将无法创建会话，也无法发送推理请求。白名单仅能通过链上治理投票进行更改。参见下方的 [有兴趣运行网关吗？](#3-interested-in-operating-a-gateway)。

<<<<<<< HEAD
    完整部署说明请见[运行你自己的网关](gateway-developer-quickstart.md)。
>>>>>>> 7832026 (transfers)
=======
    完整的部署说明请参见 [运行你自己的网关](gateway-developer-quickstart.md)。
>>>>>>> 6addb31 (transfers)

---

## 3. 有兴趣运行网关吗？

<<<<<<< HEAD
<<<<<<< HEAD
推理通过网关进入网络。有两种方式拥有网关，其治理方式也不同。

**使用公共网关（当前代理）**。[§1.1](#11-pick-a-broker) 中的代理通过公共 Gonka 网关进行推理，这些访问安排是在早期发布期间制定的。这是一个引导步骤，目录目前不会主动扩展。

**运行你自己的网关**。自行运营你自己的链上 devshard 网关。这需要你的地址在治理控制的允许列表中（`devshard_escrow_params.allowed_creator_addresses`），并且这是新运营商推荐的路径。完整说明请参见 [网关指南](gateway-developer-quickstart.md)。

如需申请链上允许列表资格，请打开一个 [GitHub issue](https://github.com/gonka-ai/gonka/issues/new?title=Gateway+allowlist+request)，包含你的运营商名称和联系方式、你打算使用的 `gonka1...` 地址，以及你计划提供的模型。是否加入由链上治理决定——没有单一运营商或组织可以单方面添加地址——表达兴趣并不保证会被审核、加入或有明确时间表。

---

**需要帮助？** 请参见 [FAQ 页面](https://gonka.ai/FAQ/)，或加入 [Discord 服务器](https://discord.com/invite/RADwCT2U6R) 以获取技术问题或安全问题的支持。
=======
推理通过网关进入网络。有两种方式拥有网关，其管理方式也不同。
=======
推理通过网关进入网络。有两种方式可以获得网关，且它们的治理方式不同。
>>>>>>> 6addb31 (transfers)

**使用公共网关（当前代理）**。[§1.1](#11-pick-a-broker) 中的代理通过在早期推出期间达成访问安排的公共 Gonka 网关实现推理访问。这是一个引导步骤，目录目前不会主动扩展。

**运行你自己的网关**。自行运营你自己的链上 devshard 网关。这要求你的地址在治理控制的白名单中（`devshard_escrow_params.allowed_creator_addresses`），并且这是新运营商推荐的路径。完整说明请参见 [网关指南](gateway-developer-quickstart.md)。

如需申请链上白名单资格，请打开一个 [GitHub issue](https://github.com/gonka-ai/gonka/issues/new?title=Gateway+allowlist+request)，包含你的运营商名称和联系方式、你打算使用的 `gonka1...` 地址，以及你计划提供的模型。是否加入由链上治理决定——没有单一运营商或组织可以单方面添加地址——表达兴趣并不保证会被纳入、审核或有明确时间表。

---

<<<<<<< HEAD
**需要帮助？** 请查看[FAQ 页面](https://gonka.ai/FAQ/)，或加入[Discord 服务器](https://discord.com/invite/RADwCT2U6R)以获取技术问题或安全问题的支持。
>>>>>>> 7832026 (transfers)
=======
**需要帮助？** 请参见 [FAQ 页面](https://gonka.ai/FAQ/)，或加入 [Discord 服务器](https://discord.com/invite/RADwCT2U6R) 以解决技术问题或安全问题。
>>>>>>> 6addb31 (transfers)
