# 以太坊桥概述

!!! warning 
    始终先进行小额测试交易。桥接转账是不可逆的，因此在转移大额资金之前，请先发送少量资金并确认其按预期到达。

    由Gonka共识控制的专用桥接智能合约已在以太坊上激活，地址为：

```text
0x972a7a92d92796a98801a8818bcf91f1648f2f68
```

[在 Etherscan 上查看桥接合约](https://etherscan.io/address/0x972a7a92d92796a98801a8818bcf91f1648f2f68){target=_blank}

!!! important "此地址同时也是 WGNK 代币"
    桥接合约**就是**ERC-20 标准的**WGNK**代币——它们是同一份部署在此地址的合约，并非两个独立合约。因此上述 Etherscan 页面同时代表了桥接合约和 WGNK 代币。通过桥接转入 Gonka 的 ERC-20 代币在 Gonka 侧以 CW-20 代币形式存在；只有**WGNK**存在于以太坊上，而它正是此合约。

!!! tip "将 WGNK 添加至您的以太坊钱包"
    WGNK 是标准的 ERC-20 代币，因此您可以在任何支持 ERC-20 的钱包（如 MetaMask、Trust Wallet、Ledger 浏览器扩展等）中将其添加为**自定义代币**。请使用上方的桥接合约地址（`0x972a7a92d92796a98801a8818bcf91f1648f2f68`）作为代币合约地址——它同时是桥接合约和 WGNK 代币。

!!! note "安全审计"
    该桥接合约已由 [CertiK](https://skynet.certik.com/projects/gonka){target=_blank} 完成审计。完整报告可在 CertiK Skynet 页面获取（Gonka–以太坊桥接审计与共识及推理审计并列列出），也可查看本地副本：[CertiK Gonka – 以太坊桥接审计（PDF）](../../assets/audits/CertiK-Gonka-Ethereum-Bridge-Audit.pdf){target=_blank}。

    该桥接支持转移：

* **任意 ERC-20 代币**（例如 [USDT](https://etherscan.io/token/0xdAC17F958D2ee523a2206206994597C13D831ec7){target=_blank}、[USDC](https://etherscan.io/token/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48){target=_blank}、[WETH](https://etherscan.io/token/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2){target=_blank}）在以太坊与 Gonka 之间双向转移。
* **原生 Gonka 币（GNK）** 在以太坊上作为封装版 GNK（WGNK）双向转移。

!!! note "ETH 以 WETH 形式桥接"
    桥接合约追踪发送至该合约地址的**ERC-20 代币转账**。原生 ETH 并非 ERC-20 代币，因此要桥接以太币，您需先在以太坊上将其封装为**WETH**（标准的 Wrapped Ether ERC-20 代币），然后像其他任何 ERC-20 代币一样桥接 WETH。

!!! important "任意 ERC-20 代币均可使用——无需注册"
    您可以桥接**任意**ERC-20 代币，即使该代币从未在 Gonka 上注册过。当存款被识别后，桥接合约会自动创建对应的封装版 CW-20 合约并铸造您的余额。通过治理进行注册是**可选的**，仅用于添加显示元数据（名称、符号、小数位数）和交易资格——转移代币**无需**注册。请注意，未注册时，小数位数可能与原始代币不一致，这是正常现象。在代币注册前，其封装版本的小数位数可能无法与原始代币匹配。这属于预期行为，不影响您的余额。详情请参阅 [注册桥接代币](register-token.md)。

!!! important "两个地址源自同一密钥"
    Gonka 将封装代币发送至由签署以太坊存款交易的**相同公钥推导出的 Gonka 地址**。如果您的以太坊和 Gonka 密钥来自同一个助记词，它们通常是**不同的密钥**，因此此机制将无法正常工作。请勿使用助记词推导 Gonka 地址并假设其与以太坊地址匹配，因为两者的推导方式不同。在首次转账前，请阅读 [地址与密钥](addresses-and-keys.md)。

---

## 概览

### 将以太坊上的 ERC-20 代币（例如 USDT）封装为 Gonka 代币
1. **存款**：ERC-20 代币所有者将代币发送至以太坊上的桥接智能合约地址。
2. **锁定与铸造**：代币被锁定在合约中。每个 Gonka 节点运行一个小型桥接容器，监听桥接地址。当存款在以太坊上**最终确认**，且**超过 50% 的节点（按投票权计算）** 独立验证后，桥接将在 Gonka 链上铸造该 ERC-20 代币的封装版本，作为 CW-20 代币。
3. **每个代币对应一个封装合约**：每个以太坊代币在 Gonka 上精确对应**一个**封装版 CW-20 合约（由链 ID + 以太坊合约地址确定）。某种代币的首次存款将实例化该合约；后续对该**相同**代币的所有存款都将复用**同一**封装合约。仅桥接合约可实例化这些合约或铸造其代币。
4. **所有权**：铸造完成后，封装代币的所有权将分配给由以太坊交易所用私钥/公钥对推导出的 Gonka 地址。此后，所有者可自由将封装代币转账至任意其他 Gonka 账户。逐步操作流程请参见 [存入 USDT（以太坊 → Gonka）](deposit-usdt.md)。

!!! note 
    注册代币（参见 [注册桥接代币](register-token.md)）是可选的。它不影响代币是否可被桥接——仅附加元数据，使封装代币在钱包和仪表板中显示正确的名称/符号/小数位数，并使其具备链上流动性池的资格。USDT 和 USDC 已预注册。您可在不预先注册的情况下桥接并测试任何其他 ERC-20 代币。

### 解封 / 提现回以太坊
1. **请求**：所有者在 Gonka 链上提交特殊提现交易。该操作将锁定/销毁封装代币，并触发 BLS 签名生成。
2. **签名获取**：使用提供的 API 端点检查签名生成状态。
3. **执行**：一旦生成 BLS 签名，即用于向以太坊上的桥接合约发送提现指令。合约验证签名后，将原始代币释放至目标以太坊地址。逐步操作流程请参见 [提现 USDT（Gonka → 以太坊）](withdraw-usdt.md)。

### 将原生 GNK 封装至以太坊（WGNK）
1. **托管**：一笔特殊交易将 GNK 锁定在托管账户中，并触发 BLS 签名生成。
2. **执行**：生成的 BLS 签名被提交至以太坊上的桥接合约，以在目标以太坊地址铸造等量的 WGNK。逐步操作流程请参见 [存入 GNK（Gonka → 以太坊）](deposit-gnk.md)。

!!! note 
    GNK 从不以“原生”形式存在于以太坊上。在以太坊一侧，它始终是封装版的**WGNK** ERC-20 代币——而该代币**本身就是桥接合约本身**（相同地址；桥接合约同时也是 WGNK ERC-20 合约）。"将 GNK 桥接至以太坊" 意味着在 Gonka 上将原生 GNK 锁定在托管账户，并在以太坊上铸造等量的 WGNK。

### 将 WGNK 从以太坊返回至 GNK
1. **销毁**：将 WGNK 发送至以太坊上的桥接合约，合约将其销毁。
2. **释放**：一旦 Gonka 共识识别到该销毁操作，等量的原生 GNK 将从托管账户释放至由销毁 WGNK 的同一密钥推导出的 Gonka 地址。详情请参见 [提现 GNK（以太坊 → Gonka）](withdraw-gnk.md)。

### 桥接 ETH（作为 WETH）
桥接检测的是 ERC-20 转账，而非原生 ETH 转账。要将以太币带入 Gonka：

1. **封装**：在以太坊上将您的 ETH 封装为**WETH**（标准的 Wrapped Ether ERC-20）。
2. **桥接**：将 WETH 发送至桥接合约——其行为与 [其他任何 ERC-20 存款](deposit-usdt.md)相同。

---

## Gonka → Ethereum 的授权方式（每日组密钥）

每次从 Gonka 转出（提取封装的 ERC-20/ETH 或铸造 WGNK）都会由 Gonka 验证器集合通过 BLS 签名在 Ethereum 上释放。为了使 Ethereum 桥接合约信任该签名，它必须知道**当前纪元的组密钥**，而它通过每日签名链来获取该密钥：

* 每个纪元开始时（大约**每天一次**），Gonka 会生成一个**新的组密钥**，并使用**上一个**纪元的密钥对其进行签名。
* 必须向 Ethereum 桥接合约提交一笔小额交易来注册该新密钥。合约仅接受由前一个密钥签名的**下一个**顺序纪元密钥——因此密钥历史形成一条从创世连续不断的链。
* **任何人**都可以使用相同的公开数据提交此更新。

一旦当前纪元的组密钥被注册，提款就会很快：**单个纪元签名可以授权该纪元内发起的任意数量的提款**。用户的流程如下：

1. 在 Gonka 上提交提款/铸造操作，指定**接收方 Ethereum 地址**。这会销毁/托管资产并触发使用组密钥进行 BLS 签名。
2. 获取生成的签名。
3. 将签名和转账数据提交到 Ethereum 上的桥接合约，合约会使用当前组密钥验证签名，并向接收方释放 ERC-20、ETH 或 WGNK。

### 如果当前纪元密钥尚未注册

提款使用当前纪元的组密钥签名，桥接合约必须已持有该密钥。在纪元切换后（约每天一次），合约可能会短暂滞后，你的释放可能会失败并提示 `InvalidEpoch`，或仪表板可能显示桥接落后于链。你无需等待：任何人都可以通过仪表板或手动推送缺失的密钥更新。参见 [Bridge epoch update](bridge-epoch-update.md)。

## 时间与最终确认

转账时间取决于方向：

* **Ethereum → Gonka：约 15–20 分钟。** 桥接会在存款区块于 Ethereum 上**最终确认**（≈ 两个纪元）后才进行铸造。Gonka 不使用任何预先垫资并承担风险的中间方，因此此等待不可避免。确切时间还取决于你的交易落在 Ethereum 纪元中的位置。
* **Gonka → Ethereum：快速。** 组密钥每天生成一次并全天使用，因此你可以随时发起提款，仅需等待 BLS 签名和你的 Ethereum 执行交易。

!!! warning "在 Gonka 链中断期间"
    桥接独立于 Gonka 区块生产摄取**已最终确认的 Ethereum 区块**。如果 Gonka 链停止，主机可以**跳过**这些 Ethereum 区块（及其内的存款）而不是排队，且在签名恢复前无法进行提款。如果你在 [仪表板](tracker-integration.md) 上看到链被报告为宕机，请等待其恢复健康后再进行桥接。

## 桥接与交易所

桥接仅**在一链上锁定资产并在另一链上释放**——它不会将一种资产兑换为另一种。交易发生在**独立的**合约中：

* 在 Ethereum 上，例如在 Uniswap 等 DEX 上交易 **WGNK ↔ USDC**。
* 在 Gonka 上，通过链上流动性池交易封装代币。

因此典型的“在 Ethereum 上出售 GNK”流程是：将 GNK 通过桥接转为 WGNK 到 Ethereum，然后在 DEX 上将 WGNK 交易为其他代币。

## 桥接与 IBC

此桥接将 Gonka 直接连接到 **Ethereum**。Gonka 还支持 **IBC** 以与其他 Cosmos 链进行转账（参见 [IBC](../ibc/withdraw-usdt-via-kava.md) 部分）。

* 使用 **Ethereum 桥接**在 **Ethereum 和 Gonka** 之间移动资产。它通常更简单，且比通过 IBC 路由需要更少的 gas 代币。
* 从 Ethereum 桥接的代币在 Gonka 上作为与此桥接绑定的封装 CW-20 存在。它可以在 Gonka 内部转移并**退回 Ethereum**，但**不能**转发或出售到其他 Cosmos 链——为此你需要使用 IBC 原生资产。

---

## 下一步

* [Addresses and keys](addresses-and-keys.md) — 单个私钥如何控制你的 Ethereum 和 Gonka 地址，以及助记词陷阱。
* [Using the dashboard](dashboard.md) — 桥接的最简单方式，无需 CLI 或原始密钥。
* [Bridge epoch update](bridge-epoch-update.md) — 如果桥接落后 Gonka 链一个或多个纪元时该怎么办。
* [Deposit USDT (Ethereum → Gonka)](deposit-usdt.md) 和 [Withdraw USDT (Gonka → Ethereum)](withdraw-usdt.md) — 双向桥接 ERC-20。
* [Deposit GNK (Gonka → Ethereum)](deposit-gnk.md) 和 [Withdraw GNK (Ethereum → Gonka)](withdraw-gnk.md) — 双向桥接原生 GNK。
* [Register a bridge token](register-token.md) — 可选的元数据/交易注册。
* [Dashboard & tracker integration](tracker-integration.md) — 供探索器/追踪器运营商集成桥接数据。
