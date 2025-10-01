# 硬件规格

标准：Nvidia GPU，属于 Tesla 之后的世代，每个 GPU 至少 16 GB VRAM。
每个 MLNode 容器必须至少使用 40GB VRAM 总计。

| NVIDIA GPU         | 发布日期  | VRAM           | 架构 | 世代            |
|---------------------|-----------|----------------|------|-----------------|
| H200               | 2024年    | 141 GB HBM3e   | Hopper       | H100 (数据中心)   |
| H100               | 2022年5月 | 80 GB HBM3     | Hopper       | H100 (数据中心)   |
| A100               | 2020年5月 | 40 GB 或 80 GB HBM2e | Ampere | A100                |
| RTX 6000 Ada Gen   | 2022年12月| 48 GB GDDR6    | Ada Lovelace | RTX 40 系列        |
| RTX A6000          | 2020年12月| 48 GB GDDR6    | Ampere       | RTX 30 系列        |
| L40                | 2022年    | 48 GB GDDR6    | Ada Lovelace | L 系列 (数据中心) |
| A40                | 2021年    | 48 GB GDDR6    | Ampere       | A40                 |
| RTX 4090 (每个 MLNode >= 2)          | 2022年10月| 24 GB GDDR6X   | Ada Lovelace | RTX 40 系列        |
| RTX 3090 (每个 MLNode >= 2)             | 2020年9月| 24 GB GDDR6X   | Ampere       | RTX 30 系列        |
| L4 (每个 MLNode >= 2)                | 2023年3月| 24 GB GDDR6    | Ada Lovelace | L 系列 (数据中心) |
