# How to edit Host public info 

This guide shows how to update your Host/Validator profile with the human-readable name, website, and avatar/profile identity so that explorers display correct information.

## Prerequisites

- You must be the operator of the Host/Validator (you hold the operator key).
- Your node must be running and connected to the network.
- If you want a verified avatar, have an identity service (for example, [Keybase](https://keybase.io/)).

## Fields / Parameters

Here are the **only** fields you can set or edit.

| Field    | Flag       | Purpose / What is displayed                                                                 |
|----------|------------|----------------------------------------------------------------------------------------------|
| Moniker  | `--new-moniker`  | The public name of your Host/Validator, shown in explorers.                  |
| Website  | `--website`  | Link to your Host/Validator’s website or project page. Displayed so delegators can learn more.    |
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

Copy your 64-bit PGP. You will need it for `--identity` flag in the command below.

### Update your node info 

Run this command to edit your Host/Validator information. Make sure to replace `cold-key-name`, `YourNewValidatorName`, `https://updated.website`, and `PGP-64-ID` with your own values. 

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

Once you send the transaction, wait for it to be included in a block and confirmed by the network.
Check your Host/Validator info:
```
./inferenced query staking delegator-validators \
  <cold-key-address> \
  --node <NODE_URL>/chain-rpc/
```
This should show the updated moniker, website, and identity.

**Example output**
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

Wait for the explorer to index the new data (may take several minutes to hours). Then check your explorer — your name, website, and avatar should appear.
