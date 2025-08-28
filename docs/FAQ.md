# FAQ

=== "Questions"
    **Q: What is Gonka?**
    A: Gonka is a decentralized network for high‑efficiency AI compute — run by those who run it. It functions as a cost-effective and efficient alternative to centralized cloud services for AI model training and inference. As a protocol, it's not a company or a start-up.
    
    **Q: What is the GNK coin?**
    A: GNK is the native coin of the Gonka network. It is used to incentivize participants, price resources, and ensure the sustainable growth of the network.
    
    **Q: What makes the protocol efficient?**
    A: Our difference from the "big players" is the pricing and the fact that, despite the size of the user, the inference is being distributed equally. To learn more, please review the [Whitepaper](https://gonka.ai/whitepaper.pdf).
    
    **Q: How does the network operate?**
    A: The network's operation is collaborative and depends on the role you wish to take:
    As a [Developer](https://gonka.ai/developer/quickstart/): You can use the network's computational resources to build and deploy your AI applications.
    As a [Host](https://gonka.ai/host/quickstart/): You can contribute your computational resources to power the network. The protocol is designed to reward you for your contribution, ensuring the network's continuity and sovereignty.
    
    **Q: Where can I find information on key management?**
    A: You can find a dedicated section on [Key Management](https://gonka.ai/host/key-management/) in the documentation. It outlines the procedures and best practices for securely managing your application's keys on the network.
    
    **Q: What is the incentive for contributing computational resources?**
    A: We've created a dedicated document focused on [Tokenomics](https://gonka.ai/tokenomics.pdf), where you can find all the information about how the incentive in being measured.
    
    **Q: What are the hardware requirements?**
    A: You can find the minimum and recommended [hardware specifications](https://gonka.ai/host/hardware-specifications/) clearly outlined in the documentation. You should review this section to ensure your hardware meets the requirements for effective contribution. 

=== "Errors"
    ```
    2025/08/28 08:37:08 ERROR No epoch models available for this node subsystem=Nodes node_id=node1
    2025/08/28 08:37:08 INFO Finalizing state transition for node subsystem=Nodes node_id=node1 from_status=FAILED to_status=FAILED from_poc_status="" to_poc_status="" succeeded=false blockHeight=92476
    ```
    It’s not actually an error. It just indicates that your node hasn’t been assigned a model yet. Most likely, this is because your node hasn’t participated in a Sprint, hasn’t received Voting Power, and therefore hasn’t had a model assigned.
    If your node has already passed PoC, you shouldn’t see this log anymore. If not, PoC takes place every ~24 hours.
