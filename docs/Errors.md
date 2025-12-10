# Errors
Here you can find examples of common errors and typical log entries that may appear in node logs.

```
2025/08/28 08:37:08 ERROR No epoch models available for this node subsystem=Nodes node_id=node1
2025/08/28 08:37:08 INFO Finalizing state transition for node subsystem=Nodes node_id=node1 from_status=FAILED to_status=FAILED from_poc_status="" to_poc_status="" succeeded=false blockHeight=92476
```
It’s not actually an error. It just indicates that your node hasn’t been assigned a model yet. Most likely, this is because your node hasn’t participated in a Sprint, hasn’t received Voting Power, and therefore hasn’t had a model assigned.
If your node has already passed PoC, you shouldn’t see this log anymore. If not, PoC takes place every ~24 hours.
