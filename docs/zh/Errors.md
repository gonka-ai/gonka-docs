# 错误
在这里，您可以找到一些常见错误以及可能出现在节点日志中的典型日志条目的示例。

```

2025/08/28 08:37:08 ERROR No epoch models available for this node subsystem=Nodes node_id=node1
2025/08/28 08:37:08 INFO Finalizing state transition for node subsystem=Nodes node_id=node1 from_status=FAILED to_status=FAILED from_poc_status="" to_poc_status="" succeeded=false blockHeight=92476
```

这实际上并不是一个错误，只是表明你的节点尚未被分配模型。很可能是因为你的节点还未参与过 Sprint，未获得投票权（Voting Power），因此还没有被分配模型。  
如果你的节点已经通过了 PoC，那么你应该不会再看到此日志。如果尚未通过，PoC 大约每 24 小时进行一次。
