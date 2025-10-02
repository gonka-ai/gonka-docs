# 使用以太坊上的 USDT 获取 GNK

当前，去中心化交易仅支持以太坊网络上的 USDT 和 USDC。

开始之前：

1. 创建一个 Gonka 账户（作为[主机](https://gonka.ai/host/quickstart/)或[开发者](https://gonka.ai/developer/quickstart/)）
2. [设置外部钱包](https://gonka.ai/wallet/dashboard#2-set-up-external-wallet)
3. [连接到仪表盘](https://gonka.ai/wallet/dashboard#3-connect-wallet)

## 第 1 步：购买 USDT（ERC-20）

1.1. 在 Keplr 中搜索 Ethereum。将鼠标悬停在复制图标上并复制你的以太坊地址。  
    <a href="/images/getting-gnk-using-usdt-from-ethereum-1-5.png" target="_blank"><img src="/images/getting-gnk-using-usdt-from-ethereum-1-5.png" style="width:250px; height:auto;"></a>

1.2. 点击 Buy（购买）。  
    <a href="/images/getting-gnk-using-usdt-from-ethereum-1-1.png" target="_blank"><img src="/images/getting-gnk-using-usdt-from-ethereum-1-1.png" style="width:250px; height:auto;"></a>

1.3. 选择任意第三方服务。演示中使用 [Swapped.com](https://swapped.com/)，与 Gonka 网络无任何关联。  
    <a href="/images/getting-gnk-using-usdt-from-ethereum-1-2.png" target="_blank"><img src="/images/getting-gnk-using-usdt-from-ethereum-1-2.png" style="width:250px; height:auto;"></a>

1.4. 选择 USDT（ERC-20）。  
    <a href="/images/getting-gnk-using-usdt-from-ethereum-1-3.png" target="_blank"><img src="/images/getting-gnk-using-usdt-from-ethereum-1-3.png" style="width:250px; height:auto;"></a>

1.5. 输入你从 Keplr 复制的 USDT（ERC-20）地址。  
    <a href="/images/getting-gnk-using-usdt-from-ethereum-1-6.png" target="_blank"><img src="/images/getting-gnk-using-usdt-from-ethereum-1-6.png" style="width:250px; height:auto;"></a>

1.6. 选择 Pay with Card（银行卡支付）并完成订单。  
    <a href="/images/getting-gnk-using-usdt-from-ethereum-1-7.png" target="_blank"><img src="/images/getting-gnk-using-usdt-from-ethereum-1-7.png" style="width:250px; height:auto;"></a>

1.7. 订单完成  
    <a href="/images/getting-gnk-using-usdt-from-ethereum-1-8.png" target="_blank"><img src="/images/getting-gnk-using-usdt-from-ethereum-1-8.png" style="width:250px; height:auto;"></a>

1.8. 短暂处理后（通常几分钟），你的余额会在 Keplr 中更新。  
    <a href="/images/getting-gnk-using-usdt-from-ethereum-1-9.png" target="_blank"><img src="/images/getting-gnk-using-usdt-from-ethereum-1-9.png" style="width:250px; height:auto;"></a>

## 第 2 步：将 USDT 发送到 Gonka 跨链桥

2.1. 在 Keplr 中点击 Send（发送）。  
    <a href="/images/getting-gnk-using-usdt-from-ethereum-2-1.png" target="_blank"><img src="/images/getting-gnk-using-usdt-from-ethereum-2-1.png" style="width:250px; height:auto;"></a>

2.2. 选择 USDT。  
    <a href="/images/getting-gnk-using-usdt-from-ethereum-2-2.png" target="_blank"><img src="/images/getting-gnk-using-usdt-from-ethereum-2-2.png" style="width:250px; height:auto;"></a>

2.3. 所有 ERC-20 代币均保存在专用智能合约中，该合约维护所有账户的余额。粘贴 Gonka Bridge 地址：  
```
0x87490233DB4EF48B6E3eef9C5B97Cdf772E25571
```

2.4. 输入你希望转账的数量。  
    <a href="/images/getting-gnk-using-usdt-from-ethereum-2-4.png" target="_blank"><img src="/images/getting-gnk-using-usdt-from-ethereum-2-4.png" style="width:250px; height:auto;"></a>

2.5. 查看本次交易所需的 Gas Fee。先取消交易（点击 Cancel），我们将先购买少量 ETH 作为手续费。  
    <a href="/images/getting-gnk-using-usdt-from-ethereum-2-5.png" target="_blank"><img src="/images/getting-gnk-using-usdt-from-ethereum-2-5.png" style="width:250px; height:auto;"></a>

## 第 3 步：购买 ETH 以支付 Gas 费

3.1. 返回主界面并点击 Buy（购买）。  
    <a href="/images/getting-gnk-using-usdt-from-ethereum-3-1.png" target="_blank"><img src="/images/getting-gnk-using-usdt-from-ethereum-3-1.png" style="width:250px; height:auto;"></a>

3.2. 选择任意第三方服务。演示中使用 Swapped.com，与 Gonka 网络无任何关联。  
    <a href="/images/getting-gnk-using-usdt-from-ethereum-3-2.png" target="_blank"><img src="/images/getting-gnk-using-usdt-from-ethereum-3-2.png" style="width:250px; height:auto;"></a>

3.3. 选择 ETH（Ethereum）。  
    <a href="/images/getting-gnk-using-usdt-from-ethereum-3-3.png" target="_blank"><img src="/images/getting-gnk-using-usdt-from-ethereum-3-3.png" style="width:250px; height:auto;"></a>

3.4. 输入所需的 ETH 数量以支付 Gas（参考步骤 2.5 中显示的费用）。  
    <a href="/images/getting-gnk-using-usdt-from-ethereum-3-4.png" target="_blank"><img src="/images/getting-gnk-using-usdt-from-ethereum-3-4.png" style="width:250px; height:auto;"></a>

3.5. 粘贴你的以太坊地址（参见步骤 1.1 与 1.2 获取地址）。  
    <a href="/images/getting-gnk-using-usdt-from-ethereum-3-5.png" target="_blank"><img src="/images/getting-gnk-using-usdt-from-ethereum-3-5.png" style="width:250px; height:auto;"></a>

3.6. 输入支付信息，完成订单。  
    <a href="/images/getting-gnk-using-usdt-from-ethereum-3-6.png" target="_blank"><img src="/images/getting-gnk-using-usdt-from-ethereum-3-6.png" style="width:250px; height:auto;"></a>

3.7. 订单完成  
    <a href="/images/getting-gnk-using-usdt-from-ethereum-3-7.png" target="_blank"><img src="/images/getting-gnk-using-usdt-from-ethereum-3-7.png" style="width:250px; height:auto;"></a>

3.8. 处理完成后，你在 Keplr 的 ETH 余额会更新。  
    <a href="/images/getting-gnk-using-usdt-from-ethereum-3-8.png" target="_blank"><img src="/images/getting-gnk-using-usdt-from-ethereum-3-8.png" style="width:250px; height:auto;"></a>

## 第 4 步：完成跨链桥转账

4.1. 再次粘贴 Gonka Bridge 地址。
```
0x87490233DB4EF48B6E3eef9C5B97Cdf772E25571
```
输入要发送的 USDT 数量并点击 Next。  
    <a href="/images/getting-gnk-using-usdt-from-ethereum-4-1.png" target="_blank"><img src="/images/getting-gnk-using-usdt-from-ethereum-4-1.png" style="width:250px; height:auto;"></a>

4.2. 在 Keplr 中确认交易。  
    <a href="/images/getting-gnk-using-usdt-from-ethereum-4-2.png" target="_blank"><img src="/images/getting-gnk-using-usdt-from-ethereum-4-2.png" style="width:250px; height:auto;"></a>

4.3. 等待你的余额在 Liquidity Pool（流动性池）板块更新：http://36.189.234.237:19252/dashboard/gonka-mainnet/developer  
    <a href="/images/getting-gnk-using-usdt-from-ethereum-4-3.png" target="_blank"><img src="/images/getting-gnk-using-usdt-from-ethereum-4-3.png" style="width:800px; height:auto;"></a>

4.4. 输入你希望兑换的稳定币数量，然后点击 Swap。  
    <a href="/images/getting-gnk-using-usdt-from-ethereum-4-4.png" target="_blank"><img src="/images/getting-gnk-using-usdt-from-ethereum-4-4.png" style="width:800px; height:auto;"></a>

4.5. 在 Keplr 中查看并确认交易。  
    <a href="/images/getting-gnk-using-usdt-from-ethereum-4-5.png" target="_blank"><img src="/images/getting-gnk-using-usdt-from-ethereum-4-5.png" style="width:800px; height:auto;"></a>

4.6. 交易确认后，你的余额会相应更新。  
    <a href="/images/getting-gnk-using-usdt-from-ethereum-4-6.png" target="_blank"><img src="/images/getting-gnk-using-usdt-from-ethereum-4-6.png" style="width:800px; height:auto;"></a>
