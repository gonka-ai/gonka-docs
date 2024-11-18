# Example of how an individual active participant looks like

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
The active-participant endpoint returns the following struct

type ActiveParticipantWithProof struct {
   ActiveParticipants types.ActiveParticipants `json:"active_participants"`
   ProofOps           cryptotypes.ProofOps     `json:"proof_ops"`
   Validators         []*types2.Validator      `json:"validators"`
   Block              *types2.Block            `json:"block"`
}
