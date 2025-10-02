# 开发者快速开始
Gonka 是一个去中心化的、密码学验证的可证明推理协议。Gonka 提供安全、抗审查和自主的开发者体验。
??? note "Gonka 与传统 AI API 的区别"
    Gonka 不仅仅是另一个 AI API — 它是一个可证明推理的密码学协议。通过消除中心化身份，Gonka 消除了困扰基于 SaaS 的 AI 服务的传统单点故障。
    这里是一个快速比较表，以了解传统 AI API 和 Gonka API 之间的区别：
        
    | 方面 | 传统 AI API（OpenAI、Anthropic 等） | Gonka API |
    |--------|----------------------------------------------|------------|
    | **模型来源和可验证输出** | 模型由提供商托管和版本化，但无法密码学验证哪个模型实际产生了给定输出。无法证明模型没有被切换、在幕后微调或对你进行 A/B 测试。 | 每个推理请求和响应都可以密码学链接到特定的模型哈希和执行环境。这实现了可验证的来源 — 任何人都可以证明特定模型版本生成了特定输出。 |
    | **抗审查性** | 所有访问都是集中控制的 — 提供商可以随时限制或终止账户。这包括地理、政治或商业政策的执行。 | 推理请求通过去中心化网络签名和广播。只要你持有私钥并连接到节点，你就可以运行推理。系统设计为不可审查，除非通过透明的协议级共识应用限制。 |
    | **可审计性和透明度** | 日志记录、计费和使用跟踪完全由 API 提供商控制。用户无法独立验证自己的使用情况或检查如何处理定价、延迟或错误。 | 每次交互都经过签名和时间戳，实现独立的审计跟踪。你可以证明推理何时以及如何发生，使用了哪个模型，结果是否被更改，并确保争议可以公开解决。 |
    | **透明的代币经济学** | 计费费率对计算定价、模型成本或系统负载的洞察有限。 | 代币经济学在链上或协议定义，意味着定价机制是透明和可检查的。用户将 GNK 转换为具有可预测、可跟踪交换逻辑的 AI 代币，实现推理成本的清晰预测和供需驱动的经济学。 |
    
要在测试网中继续，请通过将你的 GitHub 用户名发送邮件到 [hello@productscience.ai](mailto:hello@productscience.ai) 来请求访问私有代码库。

## 1. 安装 CLI（`inferenced`）
??? note "什么是 `inferenced` CLI 工具？" 
    inferenced CLI 工具是一个用于与 Gonka 网络交互的命令行界面实用程序。它是一个独立的可执行二进制文件，允许用户创建和管理 Gonka 账户、执行推理任务、上传模型，并通过脚本命令自动化各种操作。

从<a href="https://github.com/gonka-ai/gonka/releases" target="_blank" rel="noopener">这里</a>下载最新的 `inferenced` 二进制文件并使其可执行：
```
chmod +x inferenced
./inferenced --help
```

??? note "探索帮助菜单是了解的好方法"
    随时使用 `--help` 查看最新的程序内文档。

??? note "在 Mac OS 上启用执行"
    在 Mac OS 上，下载 inferenced 二进制文件后，你可能需要手动启用执行权限。请按照以下步骤操作：
    
    1. 打开终端并导航到二进制文件所在的目录。
    
    2. 运行以下命令授予执行权限：
    ```
    chmod +x inferenced
    ```
    3. 尝试运行 `./inferenced --help` 以确保它正常工作。
        
    4. 如果在尝试运行 `inferenced` 时看到安全警告，请转到系统设置 → 隐私与安全。
    
    5. 向下滚动到关于 `inferenced` 的警告并点击"仍要允许"。

## 2. 创建账户
使用以下命令创建新账户：
```bash
./inferenced create-client $ACCOUNT_NAME \
  --node-address $NODE_URL
```

确保安全保存你的密码短语 — 将来访问时需要。

此命令创建新账户，安全地将其密钥存储在 `~/.inference` 目录中，并返回你的新账户地址：
```bash
- address: <your-account-address>
  name: ACCOUNT_NAME
  pubkey: '{"@type":"...","key":"..."}'
  type: local
```

将账户地址添加到环境变量：
```bash
export GONKA_ADDRESS=<your-account-address>
```

## 3. 获取私钥
导出你的私钥（仅用于演示/测试）：
```bash
./inferenced keys export $ACCOUNT_NAME --unarmored-hex --unsafe
```

将私钥添加到环境变量：
```bash
export GONKA_PRIVATE_KEY=<your-private-key>
```

## 4. 运行推理
现在你可以运行推理了！使用以下命令：
```bash
./inferenced inference \
  --model Qwen/Qwen2.5-7B-Instruct \
  --prompt "Hello, how are you?" \
  --node-address $NODE_URL
```

## 5. 查看账户余额
检查你的账户余额：
```bash
./inferenced query balance $GONKA_ADDRESS
```

## 6. 获取帮助
随时使用 `--help` 标志获取命令帮助：
```bash
./inferenced --help
./inferenced inference --help
```

## 下一步
- 查看[开发者详情](https://gonka.ai/developer/details/)了解更高级的功能
- 加入我们的[Discord 服务器](https://discord.gg/fvhNxdFMvB)获取帮助
- 查看[API 参考](https://gonka.ai/api-reference/)了解完整的 API 文档

**需要帮助？** 加入我们的[Discord 服务器](https://discord.gg/fvhNxdFMvB)获取一般咨询、技术问题或安全担忧的帮助。
