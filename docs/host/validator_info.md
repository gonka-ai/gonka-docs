# How to add or edit validator public info 

This guide shows how to update your validator profile with the human-readable name, website, and avatar/profile identity so that explorers display correct information.

## Prerequisites

- You must be the operator of the validator (you hold the operator key).
- Your node must be running and connected to the network.
- If you want a verified avatar, have an identity service (for example, Keybase).

## Fields / Parameters

Here are the **only** fields you can set or edit.

| Field    | Flag       | Purpose / What is displayed                                                                 |
|----------|------------|----------------------------------------------------------------------------------------------|
| Moniker  | `--moniker`  | The public name of your validator, shown in explorers.                  |
| Website  | `--website`  | Link to your validator’s website or project page. Displayed so delegators can learn more.    |
| Identity | `--identity` | Typically used to provide a verification/proof identity (e.g., [Keybase](https://keybase.io/), which many explorers use to fetch your avatar/logo.  You need to download the application from the website to generate a PRP key to fetch your logo. |

## Step-by-step guide
Run the following command if you don’t have a PGP key yet.
```
keybase pgp gen
```

??? note "Generating a PGP Key with Keybase (keybase pgp gen)"
    `keybase pgp gen` generates a new PGP key for this account. In all cases, it signs the public key with an existing device key, and pushes the signature to the server. Thus, the user will have a publicly visible "PGP device" after running this operation. The secret half of the PGP key is written by default to the user's local Keybase keychain and encrypted with the "local key security" (LKS) protocol. (For more information, try 'keybase help keyring'). Also, by default, the public and secret halves of the new PGP key are exported to the local GnuPG keyring, if one is found. You can specify `--no-export` to stop the export of the newly generated key to the GnuPG keyring. On subsequent secret key accesses --- say for PGP decryption or for signing `--- access` to the local GnuPG keyring is not required. Rather, keybase will access the secret PGP key in its own local keychain. By default, the secret half of the PGP key is never exported off of the local system, but users have a choice via terminal prompt to select storage of their encrypted secret PGP key on the Keybase servers.

You will be prompted:

- `Push an encrypted copy of your new secret key to the Keybase.io server?` Enter `Y` for `Yes`.
- `When exporting to the GnuPG keychain, encrypt private keys with a passphrase?` Enter `Y` for `Yes` and `N` for `No`

Run the following command if you have an existing PGP key, import it into Keybase.
```
keybase pgp select
```
Open the Keybase app. Enter your real name, which will be publicly visible in explorer.

<a href="/images/validator_info_create_account.png" target="_blank"><img src="/images/validator_info_create_account.png" style="width:500px; height:auto;"></a>

Name your device (it can not be changed in the future).

<a href="/images/validator_info_name_comp.png" target="_blank"><img src="/images/validator_info_name_comp.png" style="width:500px; height:auto;"></a>

Click on the avatar in the top left corner. Click “View/edit profile”.

<a href="/images/validator_info_edit.png" target="_blank"><img src="/images/validator_info_edit.png" style="width:500px; height:auto;"></a>

Upload your avatar.

<a href="/images/validator_info_upload_avatar.png" target="_blank"><img src="/images/validator_info_upload_avatar.png" style="width:500px; height:auto;"></a>

Copy your PGP. You will need it for `--identity` flag in the command below.

### Update your node info 

Below are examples of how to create a new validator or edit an existing one with these fields.

**Create Validator (with profile info).**
```
./inferenced tx staking create-validator \
  --chain-id="gonka-mainnet" \
  --from <account_cold_key> \
  --keyring-backend file \
  --moniker="YourValidatorName" \
  --website="https://yourvalidator.website" \
  --identity="<YourIdentity-ID>" \
```

**Edit Existing Validator Info**
```
./inferenced tx staking edit-validator \
  --chain-id="gonka-mainnet" \
  --from <account_cold_key> \
  --moniker="YourNewValidatorName" \
  --website="https://updated.website" \
  --identity="<NewIdentity-ID>"
```

Once you send the transaction, wait for it to be included in a block and confirmed by the network.
Check using a query:
```
./inferenced query staking validator <validator_operator_address> --chain-id=gonka-mainnet
```
This should show the updated moniker, website, and identity.

**Example output**
```
description:
  moniker: "Your Validator Name"
  identity: "<identity value you set>"
  website: "https://yourvalidator.website"
```

Wait for the explorer to index the new data (may take several minutes to hours). Then check your explorer — your name, website, and avatar should appear.
