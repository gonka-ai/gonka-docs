# Wallet & Transfer Guide

This guide explains how to work with wallets and coins on the network: how to get your wallet address, check your balance, send coins, and track transactions.
Before you can perform any wallet operations, you need to access your account. Follow the instructions below based on your role in the network.

**Are you a Host?**

You contribute computational resources and receive coins as rewards.
Before proceeding, you need access to your wallet, which is automatically created when the chain-node container runs for the first time.

**Are you a Developer?**

You build and deploy AI applications using the network’s distributed power. You’ll need to create an account and CLI tools for scripting and automation.
Go [here](https://gonka.ai/developer/quickstart/) to set up the CLI and access your account.

Once you have access to your account, return to this guide to learn how to:

- [Query Balance](https://gonka.ai/wallet/wallet-and-transfer-guide/#query-balance)
- [Send Coins](https://gonka.ai/wallet/wallet-and-transfer-guide/#send-coins)
- [Check Transaction Status](https://gonka.ai/wallet/wallet-and-transfer-guide/#check-transaction-status)

## Get Your Wallet Address

Before you can check balances or send funds, you need to know your wallet address.

```bash
inferenced keys list [--keyring-backend test]
```

This command lists all the wallet keys (accounts) you’ve created locally, along with their addresses and public keys. Example output:

```
- address: gonka1f85frkfw89cgpva0vgpyuldjgu6uhyd82hmjzr
  name: genesis
  pubkey: '{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"A+Qpbyhtsdl5N/6O6S/qJ9uvtbI7OFFsO5dcNrpEU0nv"}'
  type: local
```
Write down the address (used to receive coins and query balance).

---

## Query Balance

To check your balance, ensure you have sufficient funds before transferring, or to verify a successful transfer, use the following command:
    
```bash
inferenced query bank balances <address> [--node <node_rpc_url>]
```

This shows how many coins are in your wallet.
    
**Example:**
    
```bash
inferenced query bank balances gonka1a3jpdl4epdts64gns3a3fy9hjv2n9e3v7kxx0e --node http://node2.gonka.ai:26657
```

---

## Send Coins

In Cosmos, a fund transfer means sending coins from one account (wallet address) to another within a Cosmos-based blockchain. These transfers are used to pay for services or simply send value between users. 

=== "CLI"

    You can perform transfers using the Cosmos SDK command-line tool — specifically, the `inferenced` CLI. Each transfer is recorded on the blockchain and needs a valid sender, recipient, amount, and coin denomination.
    
    Once you know your balance and have the recipient’s address, you can send coins.
    
    ```bash
    inferenced tx bank send <sender-key-name> <recipient-address> <coins> --chain-id gonka-mainnet [--node <node_rpc_url> | --keyring-backend test]
    ```

    **Example:**

    ```bash
    inferenced tx bank send genesis gonka1a3jpdl4epdts64gns3a3fy9hjv2n9e3v7kxx0e 100igonka --chain-id gonka-mainnet
    ```
    
    When specifying coins, you can use the following denominations:
    
    - `ngonka` (exponent 0)
    - `ugonka` (exponent 3)
    - `migonka` (exponent 6)
    - `igonka` (exponent 9, base unit)
    - `kigonka` (exponent 12)
    - `mcigonka` (exponent 15)

=== "Keplr (web-extension)"

    To make a transfer on the Gonka chain between Gonka accounts using the Keplr wallet, log in and open to your Keplr wallet.
    
    <a href="/images/keplr_sender_txs_1.png" target="_blank"><img src="/images/keplr_sender_txs_1.png" style="width:250px; height:auto;"></a>
    
    Search for the Gonka chain on the home screen.
    
    <a href="/images/keplr_sender_txs_2.png" target="_blank"><img src="/images/keplr_sender_txs_1.png" style="width:250px; height:auto;"></a>
    
    Click “Send”.
    
    <a href="/images/keplr_sender_txs_3.png" target="_blank"><img src="/images/keplr_sender_txs_3.png" style="width:250px; height:auto;"></a>
    
    === "If you already know the receiver’s Gonka wallet address" 
            
        Paste the receiver’s Gonka wallet address into the address field. Specify the amount you intend to send.
    
        <a href="/images/keplr_sender_txs_4.png" target="_blank"><img src="/images/keplr_sender_txs_4.png" style="width:250px; height:auto;"></a>
    
    
    === "If you do not know the receiver’s Gonka wallet address"
    
        The receiver should open their Keplr wallet where their Gonka account is added. They click on "Copy address" above their balance.
    
        <a href="/images/keplr_receiver_txs_1.png" target="_blank"><img src="/images/keplr_receiver_txs_1.png" style="width:250px; height:auto;"></a>
      
        They search for the Gonka chain.
            
        <a href="/images/keplr_receiver_txs_2.png" target="_blank"><img src="/images/keplr_receiver_txs_2.png" style="width:250px; height:auto;"></a>
            
        They copy and send you their address.
    
        <a href="/images/keplr_receiver_txs_3.png" target="_blank"><img src="/images/keplr_receiver_txs_3.png" style="width:250px; height:auto;"></a>

        Paste the receiver’s Gonka wallet address into the address field. Specify the amount you intend to send.
    
        <a href="/images/keplr_sender_txs_4.png" target="_blank"><img src="/images/keplr_sender_txs_4.png" style="width:250px; height:auto;"></a>
    
    
    Approve the transaction.
    
    <a href="/images/keplr_sender_txs_5.png" target="_blank"><img src="/images/keplr_sender_txs_5.png" style="width:250px; height:auto;"></a>
    
    Wait for the Transaction successful notification. You will not see the transaction in the Activity tab because Gonka is a non native chain.
    
    <a href="/images/keplr_sender_txs_6.png" target="_blank"><img src="/images/keplr_sender_txs_6.png" style="width:250px; height:auto;"></a>

=== "Keplr (mobile app)"

    To make a transfer on the Gonka chain between Gonka accounts using the Keplr wallet, log in and open to your Keplr wallet.
    
    <a href="/images/keplr_mobile_sender_1.PNG" target="_blank"><img src="/images/keplr_mobile_sender_1.PNG" style="width:250px; height:auto;"></a>
    
    Search for the Gonka chain on the home screen.
    
    <a href="/images/keplr_mobile_sender_2.PNG" target="_blank"><img src="/images/keplr_mobile_sender_2.PNG" style="width:250px; height:auto;"></a>
    
    Click “Send”.
    
    <a href="/images/keplr_mobile_sender_3.PNG" target="_blank"><img src="/images/keplr_mobile_sender_3.PNG" style="width:250px; height:auto;"></a>
    
    === "If you already know the receiver’s Gonka wallet address" 
            
        Paste the receiver’s Gonka wallet address into the address field. Specify the amount you intend to send.
    
        <a href="/images/keplr_mobile_sender_4.PNG" target="_blank"><img src="/images/keplr_mobile_sender_4.PNG" style="width:250px; height:auto;"></a>
    
    
    === "If you do not know the receiver’s Gonka wallet address"
    
        The receiver should open their Keplr wallet where their Gonka account is added.  
    
         <a href="/images/keplr_mobile_receiver_1.PNG" target="_blank"><img src="/images/keplr_mobile_receiver_1.PNG" style="width:250px; height:auto;"></a>
      
         They search for the Gonka chain and click.
            
         <a href="/images/keplr_mobile_receiver_2.PNG" target="_blank"><img src="/images/keplr_mobile_receiver_2.PNG" style="width:250px; height:auto;"></a>

         They copy their address above their balance or click "Receive" and copy their address in the next step below.

         <a href="/images/keplr_mobile_receiver_3.PNG" target="_blank"><img src="/images/keplr_mobile_receiver_3.PNG" style="width:250px; height:auto;"></a>

         They copy and send you their address.
    
        <a href="/images/keplr_mobile_receiver_4.PNG" target="_blank"><img src="/images/keplr_mobile_receiver_4.PNG" style="width:250px; height:auto;"></a>

        Paste the receiver’s Gonka wallet address into the address field. Specify the amount you intend to send.
    
        <a href="/images/keplr_mobile_sender_4.PNG" target="_blank"><img src="/images/keplr_mobile_sender_4.PNG" style="width:250px; height:auto;"></a>
    
    
    Approve the transaction.
    
    <a href="/images/keplr_mobile_sender_5.PNG" target="_blank"><img src="/images/keplr_mobile_sender_5.PNG" style="width:250px; height:auto;"></a>
    
    Wait for the screen confirming that the transaction was successful. You will not see the transaction in the Activity tab because Gonka is a non native chain.
    
    <a href="/images/keplr_mobile_sender_6.PNG" target="_blank"><img src="/images/keplr_mobile_sender_6.PNG" style="width:250px; height:auto;"></a>



---

## Check Transaction Status

After sending a transaction, you may want to verify whether it was successfully processed and included in a block. Each transaction is assigned a unique hash (`TXHASH`) which you can use to look up its status on the blockchain.
To check the status of a transaction, use the following command:
```bash
inferenced query tx <TXHASH> --chain-id gonka-mainnet [--node <node_rpc_url>]
```

- Replace `<TXHASH>` with the actual transaction hash you received from the transfer command.
- You can optionally specify a node and chain ID if needed.

**Example:**
```bash
inferenced query tx 9712D97F127A1908C4DC4A1F4409AE380DC3BF0D662FA8D7E394422989CFFE2F --chain-id gonka-mainnet
```
If the transaction was successful, the output will contain:

- `code: 0` — indicates success
- A block `height` — the block in which the transaction was included
- A `timestamp` — the time the block was committed
- Details about the transaction message (e.g., `sender`, `receiver`, `amount`, `module`, `gas` used)

**Sample response (truncated for clarity):**
```bash linenums="1"
code: 0
txhash: 9712D97F127A1908C4DC4A1F4409AE380DC3BF0D662FA8D7E394422989CFFE2F
height: "233596"
timestamp: "2025-04-24T02:21:24Z"
tx:
  ...
  body:
    messages:
    - '@type': /cosmos.bank.v1beta1.MsgSend
      from_address: gonka17ek5qgf94zsp024kppcyze37p95drr3wnt6jp3
      to_address: gonka1ydt57pmnsd508ckw4fh6ey6h299v50zljpylla
      amount:
      - amount: "10"
        denom: ngonka
```
If the code is non-zero, the transaction has failed. Check the `raw_log` or info fields for error messages.
