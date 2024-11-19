# Network Node API

This section describes the **Network Node API**, providing examples and details on using the `/v1/active-participants` endpoint to retrieve Merkle proofs, signatures, and participant data.

---

### Example Request

```bash
curl -X GET http://<your-api-url>/v1/active-participants/
```

### Explanation of results

The /v1/active-participants endpoint returns a JSON object containing details about active participants, their weights, URLs, models, Merkle proofs, and validators. Here is a breakdown of the structure:

#### **Example response (Single active participant)**

```
{
  "index": "cosmos143hhxr09cteaxp53jtjw0lfys060tc842qwemw",
  "weight": 526,
  "inferenceUrl": "http://validator-api:8080",
  "models": [
    "unsloth/llama-3-8b-Instruct"
  ]
}
```

#### **Struct returned by the Endpoint**
```
type ActiveParticipantWithProof struct {
   ActiveParticipants types.ActiveParticipants `json:"active_participants"`
   ProofOps           cryptotypes.ProofOps     `json:"proof_ops"`
   Validators         []*types2.Validator      `json:"validators"`
   Block              *types2.Block            `json:"block"`
}
```

— `ActiveParticipants`: Lists all active participants.

— `ProofOps`: Contains proof operations for verification.

— `Validators`: Provides validator details for the blockchain.

— `Block`: Contains metadata about the block.

### Dependencies:

— `cryptotypes`: github.com/cometbft/cometbft/proto/tendermint/crypto

— `types2`: github.com/cometbft/cometbft/types

### Proof Details

The result can be verified by combining ProofOps, validators, and the value.

### Example Proof for Value Verification:

The proof for a value stored under the key inference/ActiveParticipants/value/:
```
"proof_ops": {
  "ops": [
    {
      "type": "ics23:iavl",
      "key": "QWN0aXZlUGFydGljaXBhbnRzL3ZhbHVlLw==", 
      "data": "..."
    },
    {
      "type": "ics23:simple",
      "key": "aW5mZXJlbmNl",
      "data": "..."
    }
  ]
}
```

#### **Key decoding**

— QWN0aXZlUGFydGljaXBhbnRzL3ZhbHVlLw== → ActiveParticipants/value/

— aW5mZXJlbmNl → inference

#### **Additional Resources**

For further details, refer to the code implementation:
[GitHub - server.go](https://github.com/product-science/inference-ignite/blob/5fcfe675b561b65db96a8abe00b675f371e65969/decentralized-api/server.go#L122)
