技术标准：

· GPU 要求： 须采用 NVIDIA Tesla 架构之后的 GPU 系列，且每个 MLNode 节点的可用 GPU 显存总量须 ≥ 320 GB。
· 组合规则： 允许混搭不同型号的 GPU，但前提是整套系统必须能够稳定运行经网络管理委员会批准的大语言模型，并参与概念验证。

| NVIDIA GPU | 发布日期 | VRAM | 架构 |
|------------|----------|------|------|
| B300 | 2025年3月 | 288 GB HBM3e | Blackwell Ultra |
| B200 | 2024年 | 192 GB HBM3e | Blackwell |
| RTX PRO 6000 | 2025年3月 | 96 GB GDDR7 ECC | Blackwell |
| H200 | 2024年 | 141 GB HBM3e | Hopper |
| H100 | 2022年5月 | 80 GB HBM3 | Hopper |
| A100 80GB | 2020年11月 | 80 GB HBM2e | Ampere |

（注：最终部署方案必须保证物理显存总量满足模型运行需求，并通过网络管理委员会的正式技术审核。）
