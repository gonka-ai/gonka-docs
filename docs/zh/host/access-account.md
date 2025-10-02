# 访问你的主机账户

当 **chain‑node** 容器首次启动时，它会自动创建一个账户（钱包）及其密钥。
这些密钥用于任何账户级操作，例如转账。

你可以通过两种方式与密钥交互，我们推荐**选项 1** 以获得简单性：

## 选项 1：从容器访问账户

连接到运行网络节点的服务器，并连接到 `node` 容器（由 `ghcr.io/product-science/inferenced` 镜像创建）：
```
docker exec -it node /bin/sh
```
现在你可以执行必要的操作 — 例如，[查询余额](https://gonka.ai/wallet/wallet-and-transfer-guide/#query-balance)、[发送代币](https://gonka.ai/wallet/wallet-and-transfer-guide/#send-coins)、[检查交易状态](https://gonka.ai/wallet/wallet-and-transfer-guide/#check-transaction-status)。由于你已经在主机节点上并在其内部操作，因此不需要 `--node` 和 `--keyring-backend` 参数。

## 选项 2：将密钥导出到本地计算机

另一种选择是根据[说明](https://gonka.ai/developer/quickstart/#:~:text=You%20can%20download%20the%20latest%20inferenced%20binary%20for%20your%20system%20here.)安装 `inferenced`，将密钥复制到本地计算机，并在本地执行所有命令。

* 在测试网期间使用 `test` 密钥环后端。

连接到服务器上的 `node` 容器（由 `ghcr.io/product-science/inferenced` 镜像创建）：
```
docker exec -it node /bin/sh
```

导出名为 `KEY_NAME` 的密钥（你可以通过容器内的 `inferenced keys list` 找到它）：
```
inferenced keys export $KEY_NAME --keyring-backend test
```
系统会要求你输入密码短语，然后该密码短语将用于在本地计算机上导入密钥。

复制密钥：
```
-----BEGIN TENDERMINT PRIVATE KEY-----
...
-----END TENDERMINT PRIVATE KEY-----
```
并粘贴到本地文件 `keys.pem` 中。

然后，在本地计算机上导入密钥：
```
inferenced keys import join keys.pem --keyring-backend test
```

然后按照说明操作，添加：

- `--node` 参数，指向你要用作入口点的链节点的 `NODE_RPC_URL`（创世节点使用 `--node http://node2.gonka.ai:26657`）
- `--keyring-backend test` 以使用测试密钥环

!!! note
    如果你已在本地安装 `inferenced`，请确保它在你的 `PATH` 环境变量中，或从其目录直接运行（例如，`inferenced`）。

有关如何获取钱包地址、检查代币余额或向另一个地址发送代币的说明，请参阅[钱包与转账指南](https://gonka.ai/wallet/wallet-and-transfer-guide/)。
