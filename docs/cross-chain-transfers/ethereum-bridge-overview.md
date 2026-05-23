# Ethereum bridge overview

!!! warning
    To avoid unintentional loss of tokens, do not use these instructions before the official announcement that the bridge is fully activated.

The dedicated Bridge smart contract, controlled by the Gonka consensus, is active on Ethereum at the address:

```text
0x972a7a92d92796a98801a8818bcf91f1648f2f68
```

The bridge allows you to move:

* **ERC-20 tokens** (e.g., USDT) from Ethereum to Gonka and back.
* **Native Ethereum coin (ETH)** to Gonka (as wrapped ETH) and back.
* **Native Gonka coin (GNK)** to Ethereum (as wrapped GNK) and back.

---

## Overview

### Wrapping ERC-20 Tokens (e.g., USDT) from Ethereum to Gonka
1. **Deposit**: The owner of the ERC-20 token sends their tokens to the bridge smart contract address on Ethereum.
2. **Locking & Minting**: The tokens become locked in the contract. Once the transaction is recognized by the Gonka consensus, the bridge mints wrapped versions of that ERC-20 on the Gonka chain as CW-20 tokens. Each wrapped asset has a unique token address that can only be created by the bridge.
3. **Ownership**: After minting, ownership of the wrapped tokens is assigned to the Gonka address derived from the same private/public key pair used on Ethereum. From this point, the owner can freely transfer the wrapped tokens to any other Gonka account.

!!! note
    Wrapped tokens on the Gonka side must be registered on-chain through a governance proposal. Initially, the official USDT and USDC tokens are pre-registered. For instructions on how to register new tokens, see [Register a bridge token](how-to-register-a-new-bridge-token.md).

### Unwrapping / Withdrawing back to Ethereum
1. **Request**: The owner submits a special withdrawal transaction on the Gonka chain. This locks/burns the wrapped token and triggers BLS signature generation.
2. **Signature Retrieval**: Check the status of the signature generation using the provided API endpoint.
3. **Execution**: Once the BLS signature is produced, it is used to send a withdrawal command to the bridge contract on Ethereum. The contract verifies the signature and releases the original tokens to the target Ethereum address.

### Wrapping Native GNK to Ethereum (WGNK)
1. **Escrow**: A special transaction locks GNK on an escrow account and triggers BLS signature generation.
2. **Execution**: The generated BLS signature is submitted to the bridge contract on Ethereum to mint WGNK to the target Ethereum address.

### Wrapping Native ETH to Gonka (WETH)
1. **Deposit**: ETH is transferred to the bridge contract on Ethereum, where it is locked.
2. **Minting**: Once recognized by Gonka consensus, the bridge mints wrapped ETH (WETH) on the Gonka chain as CW-20 tokens and assigns them to the Gonka address derived from the owner's private key.
