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

