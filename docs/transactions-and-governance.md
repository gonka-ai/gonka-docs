# Transactions and Governance
## Transaction Submission via API (inferenced)
In this blockchain architecture, a dedicated API handles transaction signing and broadcasting on behalf of clients. This pattern is necessary because the chain relies on a **single on-chain account** for governance, proposal submission, and voting. This account also participates in high-frequency messaging—potentially sending **thousands of messages per block**—as part of its node responsibilities.
Due to the risk of **account sequence mismatches**, all transactions from this account must be carefully managed. The API ensures sequence correctness by processing one transaction at a time, and by locally managing the signing process.
### Workflow Overview
**1.	Message Creation (Generate-Only Mode)**

External clients or internal services prepare the transaction payload using the `--generate-only` flag. This mode creates the transaction body **without gas, fee, or signature,** focusing purely on the message structure.
```bash
inferenced tx <module> <msg> \
  --generate-only \
  --chain-id=<chain-id> \
  --from=<placeholder> \
  > tx.json
```
!!! note
    Do not include `--fees` or `--gas` in this step. These are injected by the API to ensure consistency and compatibility with the signing account.

**2.	API Submission**

Submit the raw JSON output from the generate-only step to the API:
```bash
POST /v1/tx
Content-Type: application/json
```
Request Body:
```bash
{
  "body": {
    "messages": [...],
    "memo": "",
    "timeout_height": "0",
    ...
  },
  "auth_info": {},
  "signatures": []
}
```
**3.	API Handling**

The API performs the following:

 - Injects gas and fee values based on internal policy.
 - Queries the current account sequence and number for the signer account.
 - Signs the transaction using the private key of the node’s managed account.
 - Broadcasts the signed transaction to the chain.
 - Ensures strict serial execution, processing only one transaction at a time.
 - 
**4.	API Response**

The response mirrors what the chain node would return from broadcast_tx_commit:
```bash
{
  "height": "102045",
  "txhash": "A1B2C3D4...",
  "codespace": "",
  "code": 0,
  "data": "",
  "raw_log": "...",
  ...
}
```
!!! notes
    - The API is responsible for setting gas and fee values. Clients should omit those fields when generating the JSON.
    - This setup allows seamless interaction with governance features, while safely scaling up message volume without account sequence failures.
    - The signing account is kept securely on the API host, isolated from external access.

## Submitting a Parameter Change Proposal
This section explains how to create and submit a governance proposal to update on-chain parameters for the `inferenced` chain using the API. The API takes care of all signing and account sequence handling.
### Why This Workflow?
The `inferenced` chain uses a high-throughput internal account for governance actions, including parameter changes. This account is managed by the node and may submit thousands of transactions per block. To ensure account sequence correctness, governance proposals must be submitted through a controlled API that serializes transaction signing and broadcasting.
### Step-by-Step Instructions
**1. Identify the Authority Account (Governance Module)**
Parameter changes require an `authority` field in the message, which must match the **governance module account.**
To find it:
```bash
inferenced query auth module-accounts
```
Search for the account named `"gov"` and copy its address (e.g., `cosmos10d07y265gmmuvt4z0w9aw880jnsr700j6zn9kn`). This becomes the `authority` in your proposal JSON.
**2. Fetch Current Parameters**
Query the current parameters for the module you wish to update. For the `inference` module:
```bash
inferenced query inference params --output json
```
Use the complete output in your proposal under the `params` field—**even if you're only changing one value.** Omitting other fields may unintentionally reset them or result in an invalid proposal.
**3. Check Minimum Deposit Requirement**
Every proposal must include a `deposit` that meets or exceeds the chain’s minimum deposit threshold. Query it with:
```bash
inferenced query gov params --output json
```
Look for the `min_deposit` field (e.g., `10000nicoin`) and include this in the `deposit` field of your proposal.
**4. Create the Proposal JSON**
Example structure:
```bash
{
  "messages": [
    {
      "@type": "/inference.inference.MsgUpdateParams",
      "authority": "cosmos10d07y265gmmuvt4z0w9aw880jnsr700j6zn9kn",
      "params": {
        "epoch_params": {
          "epoch_length": 1000,
          "other_field": "value"
        },
        "validation_params": {
          ...
        },
        "poc_params": {
          ...
        },
        "tokenomics_params": {
          ...
        }
      }
    }
  ],
}
{
  "body": {
    "messages": [
      {
        "@type": "/cosmos.gov.v1.MsgSubmitProposal",
        "messages": [
          {
      "@type": "/inference.inference.MsgUpdateParams",
      "authority": "cosmos10d07y265gmmuvt4z0w9aw880jnsr700j6zn9kn",
      "params": {
        "epoch_params": {
          "epoch_length": 1000,
          "other_field": "value"
        },
        "validation_params": {
          ...
        },
        "poc_params": {
          ...
        },
        "tokenomics_params": {
          ...
        }
        ],
        "initial_deposit": [
          {
            "denom": "nicoin",
            "amount": "10000000"
          }
        ],
  "metadata": "ipfs://CID",  // Optional
  "deposit": "10000nicoin",
  "title": "Update to 1000 epoch length",
  "summary": "Epoch length should be longer",
  "expedited": false,
        "proposer": "cosmos...", // Should be the address of YOUR account
      }
    ],
    "memo": "",
    "timeout_height": "0",
    "extension_options": [],
    "non_critical_extension_options": []
  },
  "auth_info": { },
  "signatures": []
}
```
**Important:**
- Ensure** all parameter groups** are included (`epoch_params`, `validation_params`, `poc_params`, `tokenomics_params`) even if you're only changing one value.
- The `deposit` must meet the chain's current minimum requirements
- The `metadata` field is optional and may be omitted unless your process uses IPFS metadata.

**5. Submit the Proposal via the API**
Send the complete JSON to:
```bash
POST /v1/tx
Content-Type: application/json
```
The API will:
- Inject gas and fee values.
- Sign the transaction using the node's internal governance account.
- Broadcast the transaction to the chain.
- Return the standard `broadcast_tx_commit` response.

## Submitting a Deposit for a Proposal
Governance proposals must reach the minimum deposit threshold before they enter the voting period. If a proposal was submitted with an insufficient deposit, additional funds can be added using a MsgDeposit transaction.
This guide walks through how to construct and submit a deposit transaction using the API.
### Step-by-Step Instructions
**1. Get the Proposal ID**
Each proposal is assigned a unique proposal_id when it’s submitted. You can find it using:
```bash
inferenced query gov proposals
```
Identify the relevant proposal and note its `proposal_id`.
**2. Construct the Deposit Message**
Here’s an example MsgDeposit transaction JSON:
```bash
{
  "messages": [
    {
      "@type": "/cosmos.gov.v1.MsgDeposit",
      "proposal_id": "1",
      "depositor": "cosmos1...",  // Your account address
      "amount": [
        {
          "denom": "nicoin",
          "amount": "10000"
        }
      ]
    }
  ],
  "memo": "",
  "timeout_height": "0",
  "extension_options": [],
  "non_critical_extension_options": [],
  "auth_info": {},
  "signatures": []
}
```
**Important Notes:**
- Replace `1` with the actual `proposal_id`.
- Set `depositor` to your account address.
- The amount must be at least enough to meet the chain’s `min_deposit`.

To check the current deposit requirement:
```bash
inferenced query gov params --output json
```
Look under `deposit_params.min_deposit`.

