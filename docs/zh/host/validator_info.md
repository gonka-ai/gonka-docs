# 如何编辑验证者公开信息

本指南介绍如何更新您的验证者资料，包括可读名称、网站和头像/身份标识，以便浏览器正确显示信息。

## 前提条件

- 您必须是验证者的运营商（持有运营商密钥）。
- 您的节点必须正在运行并连接到网络。
- 如果您希望拥有经过验证的头像，请准备一个身份服务（例如，[Keybase](https://keybase.io/)）。

## 字段 / 参数

以下是您可以设置或编辑的**唯一**字段。

| 字段     | 标志        | 用途 / 显示内容                                                                 |
|----------|------------|----------------------------------------------------------------------------------|
| 名称（Moniker）  | `--new-moniker`  | 您验证者的公开名称，将在浏览器中显示。                  |
| 网站（Website）  | `--website`  | 指向您验证者网站或项目页面的链接。显示后，委托人可进一步了解您的信息。    |
| 身份（Identity） | `--identity` | 通常用于提供身份验证证明（例如 [Keybase](https://keybase.io/)），许多浏览器使用此ID获取您的头像/标志。您需要从网站下载应用以生成PRP密钥来获取您的标志。 |

## 分步指南

如果您还没有PGP密钥，请运行以下命令：
```
keybase pgp gen
```

??? note "使用 Keybase 生成 PGP 密钥（keybase pgp gen"
    `keybase pgp gen` 为该账户生成一个新的PGP密钥。在所有情况下，它都会使用现有的设备密钥对公钥进行签名，并将签名推送到服务器。因此，用户在执行此操作后将拥有一个公开可见的“PGP设备”。默认情况下，PGP密钥的私钥部分会被写入用户的本地Keybase密钥链，并使用“本地密钥安全”（LKS）协议加密。（更多信息，请尝试 'keybase help keyring'）。此外，默认情况下，如果找到本地GnuPG密钥环，新PGP密钥的公钥和私钥部分都会被导出到其中。您可以指定 `--no-export` 来阻止将新生成的密钥导出到GnuPG密钥环。在后续访问私钥时——例如用于PGP解密或签名——无需访问本地GnuPG密钥环。Keybase将直接在其自己的本地密钥链中访问私钥。默认情况下，PGP密钥的私钥部分永远不会导出到本地系统之外，但用户可以通过终端提示选择是否将其加密后的私钥存储在Keybase服务器上。

系统会提示您：

- Push an encrypted copy of your new secret key to the Keybase.io server? 输入 Y 表示“是”。
- When exporting to the GnuPG keychain, encrypt private keys with a passphrase? 输入 Y 表示“是”，N 表示“否”。
  
如果您已有PGP密钥，请运行以下命令将其导入Keybase：
```
keybase pgp select
```

打开Keybase应用。输入您的真实姓名，该姓名将在浏览器中公开显示。

<a href="/images/validator_info_create_account.png" target="_blank"><img src="/images/validator_info_create_account.png" style="width:500px; height:auto;"></a>

为您的设备命名（未来无法更改）。

<a href="/images/validator_info_name_comp.png" target="_blank"><img src="/images/validator_info_name_comp.png" style="width:500px; height:auto;"></a>

点击左上角的头像，然后点击“查看/编辑个人资料”。

<a href="/images/validator_info_edit.png" target="_blank"><img src="/images/validator_info_edit.png" style="width:500px; height:auto;"></a>

上传您的头像。

<a href="/images/validator_info_upload_avatar.png" target="_blank"><img src="/images/validator_info_upload_avatar.png" style="width:500px; height:auto;"></a>

复制您的64位PGP ID。您将在下面命令的 --identity 参数中使用它。

更新您的节点信息
运行以下命令以编辑验证者信息。请确保将 cold-key-name、YourNewValidatorName、https://updated.website 和 PGP-64-ID 替换为您自己的值。

```
./inferenced tx staking edit-validator \
  --chain-id="gonka-mainnet" \
  --from <cold-key-name>  \
  --new-moniker <YourNewValidatorName> \
  --website <https://updated.website> \
  --identity <PGP-64-ID> \
  --keyring-backend file \
  --node <NODE_URL>/chain-rpc/ \
  --yes
```

发送交易后，请等待其被打包进区块并被网络确认。

检查您的验证者信息：
```
./inferenced query staking delegator-validators \
  <cold-key-address> \
  --node <NODE_URL>/chain-rpc/
```

这应显示已更新的名称、网站和身份信息。

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

等待浏览器索引新数据（可能需要几分钟到几小时）。然后查看浏览器，您的名称、网站和头像应已显示。
