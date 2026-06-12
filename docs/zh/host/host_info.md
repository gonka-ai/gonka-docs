# 如何编辑主机公共信息

本指南介绍如何更新你的主机/验证者资料，包括可读名称、网站和头像/身份标识，以便在区块链浏览器中正确显示相关信息。

## 前置条件

- 你必须是该主机/验证者的操作员（即你持有操作员密钥）。
- 你的节点必须正在运行并已连接到网络。
- 如果你希望拥有经过验证的头像，请注册一个身份服务（例如 [Keybase](https://keybase.io/)）。

## 可编辑字段 / 参数

以下是你**唯一可以设置或修改**的字段：

| 字段 | 参数标志 | 用途 / 显示内容 |
| --- | --- | --- |
| 名称 (Moniker) | `--new-moniker` |  |
| 网站 (Website) |  |  |
| 身份 (Identity) |  |  |
## 分步操作指南
如果你尚未拥有PGP密钥，请先运行以下命令。
```

keybase pgp gen
```

??? note "使用 Keybase 生成 PGP 密钥（keybase pgp gen）"
    `keybase pgp gen` 会为该账户生成一个新的 PGP 密钥。在所有情况下，它都会使用现有的设备密钥对该公钥进行签名，并将签名推送到服务器。因此，用户在执行此操作后将拥有一个公开可见的“PGP 设备”。默认情况下，PGP 密钥的私钥部分会被写入用户本地的 Keybase 密钥链，并使用“本地密钥安全”（LKS）协议进行加密。（更多信息，请尝试运行 'keybase help keyring'）。此外，默认情况下，新生成的 PGP 密钥的公钥和私钥部分都会被导出到本地 GnuPG 密钥环（如果系统中存在 GnuPG 密钥环的话）。你可以指定 `--no-export` 以阻止将新生成的密钥导出到 GnuPG 密钥环。在后续对私钥的访问中——例如进行 PGP 解密或签名时——无需再导出到本地 GnuPG 密钥环。Keybase 将直接从其自身的本地密钥链中访问私钥。默认情况下，PGP 私钥的私钥部分永远不会导出到本地系统之外，但用户可以通过终端提示选择将加密后的 PGP 私钥存储在 Keybase 服务器上。

系统将提示你：

- `Push an encrypted copy of your new secret key to the Keybase.io server?` 请输入 `Y` 以用于 `Yes`。
- `When exporting to the GnuPG keychain, encrypt private keys with a passphrase?` 请输入 `Y` 以用于 `Yes`，并输入 `N` 以用于 `No`。

如果你已有现有的 PGP 密钥，请运行以下命令将其导入 Keybase。
```

keybase pgp select
```

打开 Keybase 应用。输入您的真实姓名，该名称将在浏览器中公开显示。

<a href="/images/validator_info_create_account.png" target="_blank"><img src="/images/validator_info_create_account.png" style="width:500px; height:auto;"></a>

为您的设备命名（此名称将来无法更改）。

<a href="/images/validator_info_name_comp.png" target="_blank"><img src="/images/validator_info_name_comp.png" style="width:500px; height:auto;"></a>

单击左上角的头像，然后点击“查看/编辑个人资料”。

<a href="/images/validator_info_edit.png" target="_blank"><img src="/images/validator_info_edit.png" style="width:500px; height:auto;"></a>

上传您的头像。

<a href="/images/validator_info_upload_avatar.png" target="_blank"><img src="/images/validator_info_upload_avatar.png" style="width:500px; height:auto;"></a>

复制您的 64 位 PGP 密钥，您在下方命令中的 `--identity` 参数处需要用到它。

### 更新您的节点信息

运行以下命令以编辑您的主机/验证节点信息。请确保将 `cold-key-name`、`YourNewValidatorName`、`https://updated.website` 和 `PGP-64-ID` 替换为您自己的值。 

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

发送交易后，请等待其被包含在区块中并得到网络确认。  
检查您的主机/验证节点信息：
```

./inferenced query staking delegator-validators \
  <cold-key-address> \
  --node <NODE_URL>/chain-rpc/
```

这应显示更新后的名称、网站和身份。
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

等待浏览器索引新数据（可能需要几分钟到几小时）。然后检查您的浏览器页面——您的姓名、网站和头像应该会显示出来。
