# Hardware Specifications

Criteria: Supports NVIDIA GPUs of generations newer than Tesla, provided that at least 40 GB total GPU VRAM is available to each MLNode container. Any combination of GPUs is allowed, as long as the system can host the LLMs approved by network governance and participate in PoC.

| NVIDIA GPU         | Release Date  | VRAM           | Architecture | Generation            |
|---------------------|---------------|----------------|--------------|-----------------------|
| H200               | 2024           | 141 GB of HBM3e| Hopper       | H100 (Data Center)   |
| H100               | May 2022       | 80 GB HBM3     | Hopper       | H100 (Data Center)   |
| A100               | May 2020       | 40 GB or 80 GB HBM2e | Ampere | A100                |
| RTX 6000 Ada Gen   | December 2022  | 48 GB GDDR6    | Ada Lovelace | RTX 40 Series        |
| RTX A6000          | December 2020  | 48 GB GDDR6    | Ampere       | RTX 30 Series        |
| L40                | 2022           | 48 GB GDDR6    | Ada Lovelace | L-Series (Data Center) |
| A40                | 2021           | 48 GB GDDR6    | Ampere       | A40                 |
| RTX 4090 (>= 2 per MLNode)          | October 2022   | 24 GB GDDR6X   | Ada Lovelace | RTX 40 Series        |
| RTX 3090 (>= 2 per MLNode)             | September 2020 | 24 GB GDDR6X   | Ampere       | RTX 30 Series        |
| L4 (>= 2 per MLNode)                | March 2023     | 24 GB GDDR6    | Ada Lovelace | L-Series (Data Center) |
