### Get Your Address

First, to transfer funds, you'll need to know the recipient's address. To list all keys (accounts) you've generated, run:

```bash
inferenced keys list
```

This command will display each key name along with its associated address. Example output:

```
- address: cosmos1f85frkfw89cgpva0vgpyuldjgu6uhyd82hmjzr
  name: genesis
  pubkey: '{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"A+Qpbyhtsdl5N/6O6S/qJ9uvtbI7OFFsO5dcNrpEU0nv"}'
  type: local
```

---

### Send Coins

To send coins, use the following command:

```bash
inferenced tx bank send <sender-key-name> <recipient-address> <coins>
```

**Example:**

```bash
inferenced tx bank send genesis cosmos1a3jpdl4epdts64gns3a3fy9hjv2n9e3v7kxx0e 100icoin
```

When specifying coins, you can use the following denominations:

- `nicoin` (exponent 0)
- `uicoin` (exponent 3)
- `micoin` (exponent 6)
- `icoin` (exponent 9, base unit)
- `kicoin` (exponent 12)
- `mcicoin` (exponent 15)

---

### Query Balance

To ensure you have sufficient funds before transferring or to verify a successful transfer, use the following command:

```bash
inferenced query bank balances <address> [--node <node_rpc_url>]
```

**Example:**

```bash
inferenced query bank balances cosmos1a3jpdl4epdts64gns3a3fy9hjv2n9e3v7kxx0e
```

#### Optional `--node` Argument

Use the `--node` argument when you're executing the command in a development environment without direct access to a running chain node. If running alongside the chain node, specifying this argument is not required.

**Example Syntax:**

```bash
--node http://<node-host>:<node-port>
```

Typically, `<node-port>` is `26657`.
