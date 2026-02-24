**AI Token（AI 令牌）**
是一种与具体模型绑定的计算单位，用于量化训练或推理操作所需的计算成本。例如，在 QwQ-32B 模型（FP16，32K 上下文）的场景下，一个 AI Token 可能表示处理固定数量输入和/或输出 token 所需的计算资源。AI Token 与基础模型的特性高度相关，真实反映内存占用、FLOPs 等实际计算开销。

**Appropriate Vector（合格向量）**
指在 Sprint 期间由节点的 Transformer 模型生成的有效输出向量，其与全局 Target Vector 之间的欧几里得距离满足预先定义的接近度要求。该输出必须落在特定的距离阈值内，该阈值经过统计校准以控制难度，成功概率并非固定值（例如，在某一阶段的统计期望中，大约每 900 次尝试成功 1 次）。

**Consensus（共识）**
是一种协议机制，用于使网络就区块链的单一、可验证状态达成一致，确保所有参与者维护一致且不可篡改的账本。在 Gonka 中，共识通过 Proof of Compute 实现。

**Epoch（周期）**
是区块链的核心运行周期。在一个 Epoch 中，Hosts 执行有意义的 AI 工作、参与验证并累积奖励。一个 Epoch 持续 17,280 个区块（约 24 小时），并在 Epoch 末尾的 Sprint 完成后结束，同时确定下一 Epoch 的 Host 权重。

**Gonka Blockchain（Gonka 区块链）**
是去中心化 AI 网络的基础账本和协调层（L1）。它记录账户余额、交易以及用于证明 Hosts 正确执行 AI 工作的加密工件，而所有实际计算（如推理和训练）都在链下完成。

**Gonka Network（Gonka 网络）**
是由 Hosts 和 Developers 等参与者组成的完整生态系统，通过去中心化基础设施进行交互。该网络以 Gonka Blockchain 为核心，分发任务、验证结果，并仅奖励可验证的有效工作，从而为 AI 工作负载创造一个竞争性、可扩展的环境。

**Gonka 角色（Personas）**

- Developer（开发者）. 通过利用网络的分布式计算能力来构建和部署 AI 应用。
- Gonka Contributor（Gonka 贡献者）. 参与核心区块链代码库的开发、协议升级、性能优化、安全补丁以及新功能集成。
- Holder（持币者）. 指持有网络原生代币的用户，即拥有一个包含 Gonka 代币的钱包。持币者可以持有、转移或出售代币，将其用于推理，并按照协议规则使用。成为 Holder 本身不自动赋予除代币所有权之外的治理义务或责任。
- Host（主机）. 向网络贡献计算能力。Hosts 执行推理和其他计算任务，只要保持诚实参与和可靠性，即可按其贡献的计算能力比例获得奖励。Hosts 是网络的基础。只有 Hosts 拥有网络中的投票权，该投票权代表其在治理中的权重，用于提出和投票决定协议变更、参数调整和升级。任何 Host 都可以在处理推理请求时动态承担 Validator、Transfer Agent 和 Executor 的角色（这些并非预定义或链上角色，而是运行时职能）。

**ML Node（机器学习节点）**
在 Gonka 中，ML Node 是位于 Host 私有基础设施内的计算节点，负责执行所有实际 AI 工作负载（如 LLM 推理、训练步骤和 Sprint 计算）。它从不直接与公共网络交互，而是从 Host 的 API Node 接收任务并返回结果。所有高强度计算均在链下执行，区块链仅记录验证工件、证明和任务承诺。

**Network Node（网络节点）**
是一种负责所有通信的服务组件，包括：

- [Chain Node（链节点）](https://github.com/product-science/inference-ignite/tree/main/inference-chain). 连接区块链，维护区块链层，并处理共识。
- [API Node（API 节点）￼](https://github.com/product-science/inference-ignite/tree/main/decentralized-api). 作为区块链（Chain Node）与 AI 执行环境（ML Node）之间的主要协调层。它对外提供 REST/gRPC 接口，用于与用户、开发者和内部组件交互，同时管理需要链下执行的任务编排、验证调度和结果校验流程。除处理用户请求外，还负责：
    - 将推理和训练任务路由至 ML Node
    - 记录推理结果并确保任务完成
    - 调度和管理验证任务
    - 向 Chain Node 报告回执和签名以参与共识
    - 协调整个 Proof of Compute 过程

**Private Key（私钥）**
是加密密钥对中的私有部分，用于在 Gonka 网络中保障和授权交易及操作。私钥必须始终保密。任何持有私钥的一方都可以在协议层面代表其所有者行事。私钥的安全完全由持有者自行负责。

**Proof of Compute（PoC，计算证明）**
是一种共识机制，用可验证的基于 Transformer 的计算能力，取代基于资本或哈希算力的权重机制。它定义了如何衡量真实的 AI 计算并将其转换为治理和共识权重。PoC 通过在每个 Epoch 末尾执行的、短暂且同步的 Sprint 来完成。在 Sprint 之外，Epoch 用于真实世界的 AI 计算。在非严格语境中，社区有时会用 PoC 指代一次 Sprint，但二者在机制层面并不等价。
当提到 “Next PoC” 或 “PoC phase” 时，通常指的是下一个 Sprint，即 Proof of Compute 的执行阶段。

**Public Key（公钥）**
是一种公开可用的加密密钥，用于验证签名、加密消息以及在 Gonka 网络中标识账户，是加密密钥对中可公开共享的部分。

**Randomized Task Verification（随机任务验证）**
是平台验证策略的核心基础。系统不会对每一次推理任务进行冗余验证，而是基于 Hosts（Executor）的声誉随机选择一部分任务进行验证。Host 的声誉越高，其工作需要验证的比例就越低。该机制将整体验证开销大幅降低至仅占全部任务的 1–10%，同时通过概率性保障机制以及一旦作弊将失去奖励的威慑手段，维持系统的可信性。

**Sprint**
是 Proof of Compute 的一个阶段。在 Sprint 期间，所有 Hosts 会同时在带有随机化层的 Transformer 模型上，对一系列 nonces 执行与 AI 相关的推理计算，并生成输出向量。只要所提交的输出能够被验证为确实由指定的 Sprint 模型生成，Host 在下一 epoch 中的投票权重就与其处理的 nonces 数量成正比。

**Sprint Seed（Sprint 种子）**
由基于最新区块链状态的随机数生成器产生，该种子用于对 Transformer 模型的隐藏层施加随机变换。

**Validator `status: jailed`（验证者状态：已隔离 `Jailed` ）**
表示某个验证者由于未满足最低共识参与要求（具体而言，在规定窗口内签署的区块数量不足），已被协议自动且临时地移出区块生产流程。

**Voting Power（Weight，投票权 / 权重）**
表示 Host 在网络治理和协议决策中的权重，其大小由 Host 在某一 Sprint 中成功处理的 nonces 数量按比例决定。
