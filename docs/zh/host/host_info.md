# 如何编辑主机公共信息

本指南介绍如何更新您的主机/验证者档案，包括可读名称、网站和头像/身份信息，以确保浏览器正确显示信息。

## 前提条件

- 您必须是主机/验证者的操作员（您持有操作员密钥）。
- 您的节点必须正在运行并连接到网络。
- 如果您希望获得经过验证的头像，请使用身份服务（例如，[Keybase](https://keybase.io/)）。

## 字段 / 参数

以下是您**唯一**可以设置或编辑的字段。

| 字段 | 标志 | 用途 / 显示内容 |
|----------|------------|----------------------------------------------------------------------------------------------|
| 昵称 | `--new-moniker` | 您的主机/验证者的公开名称，在浏览器中显示。 |
| 网站 | `--website` | 链接到您的主机/验证者的网站或项目页面，以便委托人了解更多信息。 |
| 身份 | `--identity` | 通常用于提供验证/证明身份（例如，[Keybase](https://keybase.io/)），许多浏览器会使用它获取您的头像/徽标。您需要从网站下载应用程序以生成PRP密钥来获取您的徽标。 |

## 分步指南
如果您还没有PGP密钥，请运行以下命令。
```
keybase pgp gen
```

??? note "使用Keybase生成PGP密钥（keybase pgp gen）"
    `keybase pgp gen` 为该账户生成新的PGP密钥。在所有情况下，它都会使用现有设备密钥对公钥进行签名，并将签名推送到服务器。因此，用户在运行此操作后将拥有一个公开可见的“PGP设备”。默认情况下，PGP密钥的私钥部分将写入用户的本地Keybase密钥链，并使用“本地密钥安全”（LKS）协议进行加密。（有关更多信息，请尝试运行 'keybase help keyring'）。此外，默认情况下，如果发现本地GnuPG密钥环，新生成的PGP密钥的公钥和私钥部分都会导出到本地GnuPG密钥环中。您可以指定 `--no-export` 以阻止将新生成的密钥导出到GnuPG密钥环。在后续私钥访问时——例如用于PGP解密或签名——无需再导出到本地GnuPG密钥环。Keybase将直接访问其本地密钥链中的私有PGP密钥。默认情况下，PGP密钥的私钥部分永远不会导出到本地系统之外，但用户可通过终端提示选择将加密的私有PGP密钥存储在Keybase服务器上。

您将被提示：

- `Push an encrypted copy of your new secret key to the Keybase.io server?` 输入 `Y` 用于 `Yes`。
- `When exporting to the GnuPG keychain, encrypt private keys with a passphrase?` 输入 `Y` 用于 `Yes` 且 `N` 用于 `No`

如果您已有PGP密钥，请运行以下命令将其导入Keybase。
```
keybase pgp select
```
打开Keybase应用程序。输入您的真实姓名，该名称将在浏览器中公开显示。

<a href="/images/validator_info_create_account.png" target="_blank"><img src="/images/validator_info_create_account.png" style="width:500px; height:auto;"></a>

为您的设备命名（将来无法更改）。

<a href="/images/validator_info_name_comp.png" target="_blank"><img src="/images/validator_info_name_comp.png" style="width:500px; height:auto;"></a>

点击左上角的头像，然后点击“查看/编辑个人资料”。

<a href="/images/validator_info_edit.png" target="_blank"><img src="/images/validator_info_edit.png" style="width:500px; height:auto;"></a>

上传您的头像。

<a href="/images/validator_info_upload_avatar.png" target="_blank"><img src="/images/validator_info_upload_avatar.png" style="width:500px; height:auto;"></a>

复制您的64位PGP密钥。您将在下面的命令中需要它作为 `--identity` 标志。

### 更新您的节点信息

运行此命令以编辑您的主机/验证者信息。请确保将 `cold-key-name`、`YourNewValidatorName`、`https://updated.website` 和 `PGP-64-ID` 替换为您自己的值。 

```
./inferenced tx staking edit-validator \
  --chain-id="gonka-mainnet" \
  --from <cold-key-name>  \
  --new-moniker <YourNewValidatorName> \
  --website <https://updated.website> \
  --identity <PGP-64-ID> \
  --keyring-backend file \
  --node <NODE_URL>/chain-rpc/ \
  --gas auto \
  --gas-adjustment 2.0 \
  --gas-prices 1ngonka \
  --yes
```

发送交易后，请等待其被包含在区块中并由网络确认。
检查您的主机/验证者信息：
```
./inferenced query staking delegator-validators \
  <cold-key-address> \
  --node <NODE_URL>/chain-rpc/
```
这应显示更新后的昵称、网站和身份。

**示例输出**
```
...
validators:
- commission:
    commission_rates:
      max_change_rate: "0.010000000000000000"
      max_rate: "0.200000000000000000"
      rate: "0.100000000000000000"
    update_time: "2025-08-27T23:56:24.580275479Z"
  consensus_pubkey:
    type: tendermint/PubKeyEd25519
    value: XMTuK2T6ojmAfcDzv5scXtl9QkgYaqwAnnyo7BdLKS4=
  delegator_shares: "186.000000000000000000"
  description:
    details: Created after Proof of Compute
    identity: 673C81B66A67ED67
    moniker: gonkavaloper18lluv53n4h9z34qu20vxcvypgdkhsg6n02fcaq
    website: https://gonka.ai
```

等待浏览器索引新数据（可能需要几分钟到几小时）。然后检查您的浏览器——您的名称、网站和头像应已显示。
