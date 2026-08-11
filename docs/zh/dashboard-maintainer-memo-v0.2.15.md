# 仪表板维护者备忘录 — Gonka v0.2.15

v0.2.15 由于内部 API 重构，意外更改了几个 `/v1` 查询端点的线格式。后续补丁将恢复之前的格式；一旦发布，主机将独立升级：**在过渡期间，以下端点会根据您查询的主机返回两种格式之一。** 请同时接受这两种格式。这种歧义仅限于此处列出的端点和字段——无需泛化；其他所有内容均未更改且为单一格式。

下文中的“v0.2.15 格式”是当前主机返回的格式；“恢复格式”是打补丁后的主机将返回的 0.2.15 之前的格式。

## `/v1/epochs/latest` — 参数嵌套并字符串化

受影响字段：`epoch_params`。

- 恢复格式：`epoch_params.epoch_length` = `40320`（数字）
- v0.2.15 格式：`epoch_params.epoch_params.epoch_length` = `"40320"`（字符串；整个对象嵌套一层更深，所有整数字段均为字符串）

健壮读取：如果 `epoch_params.epoch_params` 存在，则深入其内部；解析数值字段时接受数字和字符串两种形式。

此外：`active_confirmation_poc_event` 可能为 `null` 或缺失——两者均视为“无事件”。

## `/v1/epochs/{epoch}/participants` — 数字以字符串形式表示

`{epoch}` 是一个时间戳数字或字面量 `current`。

受影响字段：`active_participants`。在 v0.2.15 格式中，其数值字段（`created_at_block_height`、`poc_start_block_height`、`effective_block_height`、`epoch_group_id`、`epoch_id` 和 `participants[]` 内的数值字段）均为字符串。恢复格式：数字。仅对此对象接受两种形式。

## `/v1/versions` — `mlnodes` 可能缺失

v0.2.15 格式仅返回 `timestamp` / `api_version` / `node_version`。恢复格式包含 `mlnodes` 数组（如果主机没有则为空数组）。`mlnodes` 键缺失表示“主机尚未打补丁”，而非“无 ML 节点”。

## 小型永久性变更（有意为之，不会恢复）

- 可选的空值被省略而非输出：`hugging_face_id` 在 `/v1/models` 中未设置时缺失（原为 `""`）；`active_confirmation_poc_event` 在非活跃时缺失。将缺失视为为空。
- `/v1/poc-batches/{epoch}` 在无批次时返回 404（原为 200 并带空列表）。
- 来自每台主机 API 的一些 `/v1` 响应现在携带 `Deprecation: true` 头部：读取端点正逐步迁移至 edge-api 服务（路径相同，格式相同）。今天无需更改。
- `/v1/bls/*` 在 v0.2.15 格式中存在相同的字符串/枚举名翻转——仅当您读取 BLS 数据时相关。

## 附录：证明验证包 — 仅当您验证证明时才查看

`/v1/epochs/{epoch}/participants`，字段 `block`、`proof_ops`、`validators`：

- v0.2.15 格式：`block` 是 SDK 风格的区块（字符串高度，base64 哈希）；`validators[].voting_power` 是字符串
- 恢复格式：CometBFT 区块 JSON（数值 `header.height`，十六进制大写哈希）；数值 `voting_power`

如果您仅显示参与者和权重，本节不适用。
