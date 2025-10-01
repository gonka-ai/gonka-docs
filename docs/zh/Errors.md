# 错误
在这里你可以找到常见错误的示例和节点日志中可能出现的典型日志条目。

```
2025/08/28 08:37:08 ERROR No epoch models available for this node subsystem=Nodes node_id=node1
2025/08/28 08:37:08 INFO Finalizing state transition for node subsystem=Nodes node_id=node1 from_status=FAILED to_status=FAILED from_poc_status="" to_poc_status="" succeeded=false blockHeight=92476
```
这实际上不是一个错误。它只是表明你的节点还没有被分配模型。很可能是因为你的节点还没有参与 Sprint，没有获得投票权，因此没有分配模型。
如果你的节点已经通过了 PoC，你应该不会再看到这个日志。如果没有，PoC 大约每 24 小时进行一次。
