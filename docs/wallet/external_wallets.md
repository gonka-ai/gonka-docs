# Adding the Gonka Network to Keplr and Leap Wallets

This guide explains how to add the Gonka Network to your Keplr and Leap wallets.

It is divided into two parts:

1. Full setup — if you don’t have Keplr or Leap installed yet, you’ll find step-by-step instructions to create and set up your wallet from scratch.
2. Quick add — if you already have Keplr or Leap, you can skip directly to the instructions on how to add the Gonka Network to your existing wallet.

=== "Full setup" (if you do not have Keplr or Leap installed)"
    
    ??? note "What is a wallet?"
        A crypto wallet serves as a secure container for a user's public and private cryptographic keys, enabling them to manage, transfer, and purchase cryptocurrencies. Gonka is built on the Cosmos-SDK blockchain framework and can be accessed using Keplr or Leap wallet (other wallet support is coming soon).
        
    === "Keplr"
    
        Go to [the official Keplr website](https://www.keplr.app/){target=_blank} and click "Get Keplr wallet".
    
        <a href="/images/dashboard_keplr_step_2_1.png" target="_blank"><img src="/images/dashboard_keplr_step_2_1.png" style="width:500px; height:auto;"></a>
    
        Choose an extension for your browser.
    
        <a href="/images/dashboard_keplr_step_2_2.png" target="_blank"><img src="/images/dashboard_keplr_step_2_2.png" style="width:500px; height:auto;"></a>
    
        Add an extension to the browser.
    
        === "Firefox"
    
            <a href="/images/dashboard_keplr_step_2_3.png" target="_blank"><img src="/images/dashboard_keplr_step_2_3.png" style="width:500px; height:auto;"></a>
    
        === "Google Chrome"
    
            <a href="/images/dashboard_keplr_step_2_3_2.png" target="_blank"><img src="/images/dashboard_keplr_step_2_3_2.png" style="width:500px; height:auto;"></a>
    
        Click "Import an existing wallet."
    
        <a href="/images/dashboard_keplr_step_2_4.png" target="_blank"><img src="/images/dashboard_keplr_step_2_4.png" style="width:500px; height:auto;"></a>
    
        Click "Use recovery phrase or private key".
    
        <a href="/images/dashboard_keplr_step_2_5.png" target="_blank"><img src="/images/dashboard_keplr_step_2_5.png" style="width:500px; height:auto;"></a>
    
        Paste your private key that was created via CLI in [this step](https://gonka.ai/developer/quickstart/#4-inference-using-modified-openai-sdk:~:text=your%2Daccount%2Daddress%3E-,3.%20Add%20Private%20Key%20to%20environment%20variables,export%20GONKA_PRIVATE_KEY%3D%3Cyour%2Dprivate%2Dkey%3E,-4.%20Inference%20using). Do not import your recovery (mnemonic/seed) phrase, as the bridge requires direct access to the raw private key to sign transactions and ensure proper interoperability with Ethereum.
    
        <a href="/images/dashboard_keplr_step_2_6_private key.png" target="_blank"><img src="/images/dashboard_keplr_step_2_6_private_key.png" style="width:500px; height:auto;"></a>
    
        Give your wallet a name for easy reference.
    
        <a href="/images/dashboard_keplr_step_2_6.png" target="_blank"><img src="/images/dashboard_keplr_step_2_6.png" style="width:500px; height:auto;"></a>
    
        Select Cosmos Hub and Ethereum.
    
        <a href="/images/dashboard_keplr_step_2_7.png" target="_blank"><img src="/images/dashboard_keplr_step_2_7.png" style="width:500px; height:auto;"></a>
    
        Done — your Gonka account has been successfully imported into Keplr!
    
        <a href="/images/dashboard_keplr_step_2_8.png" target="_blank"><img src="/images/dashboard_keplr_step_2_8.png" style="width:500px; height:auto;"></a>
    
    === "Leap"
    
        Go to [the official Leap website](https://www.leapwallet.io/){target=_blank} and click "Download Leap".
    
        <a href="/images/dashboard_leap_step_2_1.png" target="_blank"><img src="/images/dashboard_leap_step_2_1.png" style="width:500px; height:auto;"></a>
    
        Add an extension to the browser.
    
        <a href="/images/dashboard_leap_step_2_2.png" target="_blank"><img src="/images/dashboard_leap_step_2_2.png" style="width:500px; height:auto;"></a>
    
        Click "Import an existing wallet."
    
        <a href="/images/dashboard_leap_step_2_3.png" target="_blank"><img src="/images/dashboard_leap_step_2_3.png" style="width:500px; height:auto;"></a>
    
        Choose "Import private key". Do not choose "Import recovery phrase", as the bridge requires direct access to the raw private key to sign transactions and ensure proper interoperability with Ethereum.
    
        <a href="/images/dashboard_leap_step_2_4.png" target="_blank"><img src="/images/dashboard_leap_step_2_4.png" style="width:500px; height:auto;"></a>
    
        Paste the private key that was created in [this step via CLI](https://gonka.ai/developer/quickstart/#4-inference-using-modified-openai-sdk:~:text=request%20in%20Python%3A-,3.1.%20Export%20your%20private%20key%20(for%20demo/testing%20only).,export%20GONKA_PRIVATE_KEY%3D%3Cyour%2Dprivate%2Dkey%3E,-4.%20Inference%20using).
    
        <a href="/images/dashboard_leap_2_5_private_key.png" target="_blank"><img src="/images/dashboard_leap_2_5_private_key.png" style="width:500px; height:auto;"></a>
    
        Create your password.
    
        <a href="/images/dashboard_leap_step_2_6.png" target="_blank"><img src="/images/dashboard_leap_step_2_6.png" style="width:500px; height:auto;"></a>
    
        Done — your Gonka account has been successfully imported into Leap!
    
        <a href="/images/dashboard_leap_step_2_7.png" target="_blank"><img src="/images/dashboard_leap_step_2_7.png" style="width:500px; height:auto;"></a>

=== "Quick add (if you do have Keplr or Leap installed)"
      
    === "Keplr"
        
        Open the extension and click on the account icon in the top-right corner of the extension window.
            
        <a href="/images/dashboard_ping_pub_3_5_1.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_1.png" style="width:auto; height:337.5px;"></a>
            
        Click the "Add wallet" button.
            
        <a href="/images/dashboard_ping_pub_3_5_2.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_2.png" style="width:auto; height:337.5px; display:block;"></a>
            
        Click "Import an Existing Wallet".
            
        <a href="/images/dashboard_ping_pub_3_5_3.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_3.png" style="width:450px; height:auto; display:block;"></a>
            
        Click "Use recovery phrase or private key"
    
        <a href="/images/dashboard_ping_pub_3_5_4.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_4.png" style="width:450px; height:auto;"></a>
    
        Paste your private key that was created via the CLI in [this step](https://gonka.ai/developer/quickstart/#4-inference-using-modified-openai-sdk:~:text=request%20in%20Python%3A-,3.1.%20Export%20your%20private%20key%20(for%20demo/testing%20only).,export%20GONKA_PRIVATE_KEY%3D%3Cyour%2Dprivate%2Dkey%3E,-4.%20Inference%20using). Do not import the recovery (mnemonic/seed) phrase, as the bridge requires direct access to the raw private key to sign transactions and ensure proper interoperability with Ethereum.
    
        <a href="/images/dashboard_ping_pub_3_5_4.png" target="_blank"><img src="/images/dashboard_keplr_step_3_5_5_private_key.png" style="width:450px; height:auto;"></a>
            
        Give your wallet a name for easy reference.
            
        <a href="/images/dashboard_ping_pub_3_5_5.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_5.png" style="width:450px; height:auto;"></a>
            
        Select Cosmos Hub and Ethereum.
    
        <a href="/images/dashboard_ping_pub_3_5_6.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_6.png" style="width:450px; height:auto; display:block;"></a>
            
        Done — your Gonka account has been successfully imported into Keplr!
            
        <a href="/images/dashboard_ping_pub_3_5_7.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_7.png" style="width:450px; height:auto;"></a>
        
    === "Leap"
            
        Open the extension and click on the frog icon and wallet name in the top center button of the extension window.
            
        <a href="/images/dashboard_leap_step_3_5_1.png" target="_blank"><img src="/images/dashboard_leap_step_3_5_1.png" style="width:250px; height:auto;"></a>
            
        Click the "Create/Import wallet" button.
            
        <a href="/images/dashboard_leap_step_3_5_2.png" target="_blank"><img src="/images/dashboard_leap_step_3_5_2.png" style="width:250px; height:auto;"></a>
            
        Choose "Import using private key". Do not choose "Import using recovery phrase", as the bridge requires direct access to the raw private key to sign transactions and ensure proper interoperability with Ethereum. 
            
        <a href="/images/dashboard_leap_step_3_5_3.png" target="_blank"><img src="/images/dashboard_leap_step_3_5_3.png" style="width:250px; height:auto;"></a>
    
        Paste your private key that was created in [this step via CLI. ](https://gonka.ai/developer/quickstart/#4-inference-using-modified-openai-sdk:~:text=request%20in%20Python%3A-,3.1.%20Export%20your%20private%20key%20(for%20demo/testing%20only).,export%20GONKA_PRIVATE_KEY%3D%3Cyour%2Dprivate%2Dkey%3E,-4.%20Inference%20using)
    
        <a href="/images/dashboard_leap_step_3_5_3.png" target="_blank"><img src="/images/dashboard_leap_step_3_5_4_private_key.png" style="width:250px; height:auto;"></a>
            
        Done — your Gonka account has been successfully imported into Leap wallet (click on the frog icon and wallet name in the top center button to switch between wallets).
