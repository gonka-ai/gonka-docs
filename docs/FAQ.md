# FAQ

## Q: What is Gonka?
A: Gonka is a decentralized network for high‑efficiency AI compute — run by those who run it. It functions as a cost-effective and efficient alternative to centralized cloud services for AI model training and inference. As a protocol, it's not a company or a start-up.
    
## Q: What is the GNK coin?
A: GNK is the native coin of the Gonka network. It is used to incentivize participants, price resources, and ensure the sustainable growth of the network.
    
## Q: What makes the protocol efficient?
A: Our difference from the "big players" is the pricing and the fact that, despite the size of the user, the inference is being distributed equally. To learn more, please review the [Whitepaper](https://gonka.ai/whitepaper.pdf).
    
## Q: How does the network operate?
A: The network's operation is collaborative and depends on the role you wish to take:
As a [Developer](https://gonka.ai/developer/quickstart/): You can use the network's computational resources to build and deploy your AI applications.
As a [Host](https://gonka.ai/host/quickstart/): You can contribute your computational resources to power the network. The protocol is designed to reward you for your contribution, ensuring the network's continuity and sovereignty.
    
## Q: Where can I find information on key management?
A: You can find a dedicated section on [Key Management](https://gonka.ai/host/key-management/) in the documentation. It outlines the procedures and best practices for securely managing your application's keys on the network.
    
## Q: What is the incentive for contributing computational resources?
A: We've created a dedicated document focused on [Tokenomics](https://gonka.ai/tokenomics.pdf), where you can find all the information about how the incentive in being measured.
    
## Q: What are the hardware requirements?**
A: You can find the minimum and recommended [hardware specifications](https://gonka.ai/host/hardware-specifications/) clearly outlined in the documentation. You should review this section to ensure your hardware meets the requirements for effective contribution.

## Q: What if I want to stop mining but still use my account when I come back?
A: To restore a Network Node in the future, it will be sufficient to back up:

- cold key (most important, everything else can be rotated)
- secres from tmkms: `.tmkms/secrets/`
- keyring from `.inference .inference/keyring-file/`
- node key from `.inference/config .inference/config/node_key.json`
- password for warm key `KEYRING_PASSWORD`
