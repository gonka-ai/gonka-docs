# Participant Guide: Gonka Ethereum Bridge Multisig (Safe)

This guide is for individuals who have been selected to be signers on the Gonka Ethereum Bridge Multisig. 

## What is a Safe Multisig?
A **Safe** (formerly Gnosis Safe) is a **Smart Contract Account** that runs on the Ethereum blockchain. Unlike a regular wallet (which has a single private key), a Multisig requires multiple authorized signers to approve a transaction before it can be executed. 

For the Gonka Ethereum Bridge, the Safe multisig protects a limited Ethereum-side admin role. The admin role is only intended for exceptional recovery scenarios, such as a prolonged absence of valid BLS group key updates during the 30-day timeout period or a BLS key conflict. In these cases, the admin may be able to set or reset the BLS group key, which makes the role security-sensitive because the BLS key ultimately controls bridge signing. The multisig ensures that these rare recovery actions cannot be performed by a single person. A required threshold of signers must review and approve the transaction before it can be executed.

## 1. Prerequisites

Before you can be added to the multisig, please make sure the following items are ready:

*   **Ethereum Wallet Address**: A secure Ethereum address that you control.
*   **Hardware Wallet (Highly Recommended)**: For mainnet security, it is strongly advised to use a hardware wallet (e.g., Ledger or Trezor) rather than a software-only "hot" wallet.
*   **Network Access**: Ensure you can access [app.safe.global](https://app.safe.global) and have an RPC provider (like Infura, Alchemy, or a public node) configured in your wallet.
*   **Small Amount of ETH**: While signing a transaction is usually free (off-chain signature), the person who **executes** the final transaction will need to pay gas in ETH. It is good practice for every signer to have at least 0.05 - 0.1 ETH for emergency executions.

## 2. Onboarding Process

### Step 1: Provide your Address
Send your public Ethereum address (0x...) to the multisig administrator. **Double-check every character.** Do not send your private key or seed phrase.

### Step 2: The Addition Transaction
The current multisig owners will initiate a transaction to "Add Owner." This transaction must be signed and executed according to the current threshold (e.g., 2-of-3).

### Step 3: Access the Safe
Once the transaction is confirmed on the blockchain:

1.  Go to [app.safe.global](https://app.safe.global).
2.  Connect your wallet.
3.  Add the Safe.
4.  Enter the Multisig Address provided by the administrator.
5.  You should now see the Safe dashboard and your address listed under "Owners."

## 3. How to Sign Transactions

The most common task for a participant is reviewing and signing proposed transactions.

1.  **Review**: 
    *   Open the Safe dashboard.
    *   Go to the **"Transactions"** tab -> **"Queue"**.
    *   Click on the transaction to expand the details.
2.  **Sign**: Click the **"Sign"** button. Your wallet will pop up asking for a signature. This is usually an off-chain signature and does not cost gas.
3.  **Wait**: Once the threshold of signatures is reached, the transaction can be executed.

## 4. How to Execute Transactions

If you are the last person to sign, or if you are tasked with finalizing a transaction:

1.  After the required number of signatures (e.g., 2 or 3) are collected, the **"Execute"** button will become active.
2.  Click **"Execute"**. 
3.  Your wallet will prompt you to pay the gas fee to submit the transaction to the blockchain.
4.  Once the transaction is mined, the action is completed.

## 5. Security Best Practices

*   **Verify the Safe Address**: Always ensure you are interacting with the correct Safe address. Bookmark the link once you've loaded it.
*   **Check Transaction Details**: Malicious actors may try to propose transactions that transfer ownership to themselves. Never sign a transaction if you don't understand the destination or the purpose.
*   **Keep Backups**: Ensure your hardware wallet seed phrase is backed up securely offline. If you lose access to your key, the multisig cannot "reset" your access without a majority vote from the other signers.
*   **Use the Official App**: Only use [app.safe.global](https://app.safe.global). Beware of phishing sites.
