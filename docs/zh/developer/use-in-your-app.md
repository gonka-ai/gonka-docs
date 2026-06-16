---
name: use-in-your-app.md
---

# 在你的应用中使用 Gonka

Gonka 对外提供标准的 **OpenAI 兼容 API**。如果你用过 OpenAI、Anthropic 或任意其他 AI API，那么你已经知道如何使用 Gonka —— 通常你只需要改三样东西：`base_url`、`api_key` 和 `model`。

本指南面向把 Gonka 接入到现有工具、应用、Agent 框架或免代码（no-code）自动化的场景。如果你要用 SDK 写代码调用 API，请改从 [开发者快速开始](quickstart.md) 入手。

!!! note "你需要准备什么"

    Gonka 推理通过 **经纪商（broker）** 接入 —— 这是一家运行 Gonka gateway 并对外暴露 OpenAI 兼容接入点的独立运营方。你会从经纪商那里拿到一个 **API base URL** 和一个 **API key**。对大多数应用来说，这就足够了。

## 第 1 步：选择经纪商

经纪商是你接入 Gonka 网络的入口。从你的应用视角看，它的行为和任意其他 OpenAI 兼容服务商完全相同。

当前的社区经纪商列表 —— 包含演示链接和社区可观测性面板 —— 维护在 [开发者快速开始](quickstart.md#11) 中。请以那里的列表为唯一准确来源，它会在那里保持更新。

!!! caution "经纪商是独立的第三方"

    定价、支付方式（USD、加密货币、抵用额度）、速率限制、所支持的模型、SLA、退款政策以及数据处理方式，都由每家经纪商自行决定。在正式上线前，请先阅读经纪商自己的文档与服务条款。

!!! tip "用 AI Agent 来配置？"

    一些经纪商会发布机器可读的 agent 页面，列出接入点、认证方式、可用模型以及一个最小请求示例。如果你的经纪商提供了这样的页面，把它的 URL 作为上下文文档或系统提示词交给你的 agent，它就知道该怎么做了。

## 第 2 步：获取 API key

按你所选经纪商网站上的接入流程操作。通常你需要：

1. 创建账户。
2. 充值或配置计费。
3. 生成 API key。
4. 复制经纪商的 **API base URL**（通常以 `/v1` 结尾）。

## 第 3 步：选择模型

模型的可用性会随时间变化，而且不同经纪商也不一样，所以不要照抄一份静态列表。请在你所选经纪商的 **控制台或文档** 中查找当前可用模型 —— 大多数经纪商会在你生成 API key 的同一位置附近展示所支持的模型（及其准确的模型 ID）。

!!! note "模型 ID 区分大小写"

    请严格按照经纪商列出的字符串复制模型 ID，例如 `Qwen/Qwen3-235B-A22B-Instruct-2507-FP8`。大小写或空格上的细微差异都会导致请求失败。

!!! tip "在写代码？"

    开发者也可以通过对经纪商的 OpenAI 兼容接入点调用 `GET /v1/models` 来以编程方式获取实时模型列表（在 `Authorization` 头中带上你的 API key）。

## 第 4 步：接入你的工具或应用

现在你已经有了 **Base URL**、**API key** 和 **Model ID**。你可以把它们填入几乎任何支持 OpenAI 兼容服务商的 AI 软件、聊天界面或 Agent 框架。

在大多数应用中，对应关系如下：

| 应用中的字段 | 填入什么 |
|---|---|
| API Base URL / Endpoint（接入点） | 你的经纪商 URL 加上 `/v1`，例如 `https://<broker-url>/v1`。如果应用要求填写 "OpenAI Base URL" 或 "Custom Endpoint"，填这个。 |
| API Key / Auth Token（认证令牌） | 你生成的那个 key。即使应用提示 "Enter OpenAI API Key"，也填你的经纪商 key。 |
| Model / Custom Model（模型） | 第 3 步中那个准确的 Model ID。 |

下面的菜单名称在不同版本的应用中可能不同 —— 请找到对应的设置项。

=== "聊天界面"

    例如：Open WebUI、LibreChat、LobeChat。

    进入 **Settings → AI Providers / Connections**，选择 **OpenAI** 服务商，用你的经纪商 URL 加 `/v1` 替换默认的 OpenAI URL，填入你的 key，并把 Model ID 加入允许的模型列表。

=== "AI IDE 与编码 Agent"

    例如：Cursor、Cline、Windsurf。

    进入 **Settings → Models**，启用 **OpenAI-compatible** 服务商（或选择 **Add Custom Model**），用你的经纪商 URL 加 `/v1` 覆盖 Base URL，并填入你的经纪商 API key。

=== "免代码自动化"

    例如：Make.com、n8n、Flowise。

    使用标准的 **OpenAI** 模块，然后在高级设置中找到可覆盖 **Base Path / Base URL** 的选项，填入你经纪商的 URL。

=== "自定义代码"

    使用 OpenAI 官方 SDK —— 不需要任何 Gonka 特定的库。把你的经纪商 URL 加 `/v1` 作为 `base_url` 传入，把经纪商 key 作为 `api_key` 传入。完整的 Python、TypeScript 和 Go 示例见 [开发者快速开始](quickstart.md#13)。

---

**需要帮助？** 请查看 [FAQ 页面](https://gonka.ai/FAQ/)，或加入 [Discord 服务器](https://discord.com/invite/RADwCT2U6R)。
