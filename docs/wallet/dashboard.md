# Getting Started with the Dashboard
Dashboard shows live on-chain activity.

Instead of relying on a single centralized server, all network data and inference metrics are hosted directly on the Hosts' nodes. This means the dashboard can connect to any Host’s node and fetch live network data straight from the source.

You can interact with the dashboard in two ways:

- **Preview Mode** — explore a dashboard and view network data without creating an account.
- **Full Mode** — unlock the complete feature set by connecting your own wallet.

=== "**Preview Mode**"

    If you want to explore the network or see real-time inference metrics before setting up your own account, follow these steps:
    
    1. Here is the list of genesis nodes. Choose a random node from the list below and open it in a new browser window/tab.
    
        - [http://185.216.21.98:8000](http://185.216.21.98:8000)  
        - [http://36.189.234.197:18026](http://36.189.234.197:18026)  
        - [http://36.189.234.237:17241](http://36.189.234.237:17241)  
        - [http://node1.gonka.ai:8000](http://node1.gonka.ai:8000)  
        - [http://node2.gonka.ai:8000](http://node2.gonka.ai:8000)  
        - [http://node3.gonka.ai:8000](http://node3.gonka.ai:8000)  
        - [http://47.236.26.199:8000](http://47.236.26.199:8000)  
        - [http://47.236.19.22:18000](http://47.236.19.22:18000)  
        - [http://gonka.spv.re:8000](http://gonka.spv.re:8000)  
    
        ??? note "Alternative: fully decentralized way to choose a random node"
            Open the Hosts list: [http://node2.gonka.ai:8000/v1/epochs/current/participants](http://node2.gonka.ai:8000/v1/epochs/current/participants).  
            Choose any active Host from the list.
            Copy their `inference_url` value.
            Paste the `inference_url` into your browser to load the dashboard.
    
    2. Once opened, you’ll see real-time data streamed directly from the Host’s node — including network statistics, active workloads, and inference metrics.
    
    !!! note "Why is this important?"
        This architecture ensures decentralization: no single central server controls the network. In preview mode, functionality is limited. You can view balances, transactions, and some analytics. If you want to send coins, manage your personal accounts, or analyze your private AI token usage, unlock [Full mode](https://gonka.ai/wallet/dashboard/#__tabbed_1_2).

=== "**Full Mode**"
    
    First, open the dashboard using Preview Mode. Once you’ve accessed it, continue with the instructions below to enable all features.
    
    ### 1. Access Gonka Account
    
    To unlock the full functionality of the dashboard, you need a Gonka account.
    
    - Already have one? Proceed to the ["Set Up External Wallet"](https://gonka.ai/wallet/dashboard/#2-set-up-external-wallet) section below.
    - New user? Visit [the Developer](https://gonka.ai/developer/quickstart/){target=_blank} or [Host](https://gonka.ai/host/quickstart/){target=_blank} Quickstart to create an account.
    
    ### 2. Set Up External Wallet
    To interact with Dashboard through your wallet, we recommend using [Keplr](https://www.keplr.app/){target=_blank} or [Leap](https://www.leapwallet.io/){target=_blank} (a browser extension wallet built for Cosmos-based chains).
    
    ??? note "What is a wallet?"
        A crypto wallet serves as a secure container for a user's public and private cryptographic keys, enabling them to manage, transfer, and purchase cryptocurrencies. Gonka is built on the Cosmos-SDK blockchain framework and can be accessed using Keplr or Leap wallet (other wallet support is coming soon).
        
    - If you have a Keplr or Leap wallet browser extention, proceed to the ["Connect wallet"](https://gonka.ai/wallet/dashboard/#3-connect-wallet) section.
    - If you haven't set it up yet, follow the steps below.
    
    === "Keplr"
        Install an extension for your browser.
            
        Go to [the official Keplr website](https://www.keplr.app/){target=_blank} and click "Get Keplr wallet".
            
        <a href="/images/dashboard_keplr_step_2_1.png" target="_blank"><img src="/images/dashboard_keplr_step_2_1.png" style="width:500px; height:auto;"></a>
            
        Choose an extension for your browser.
            
        <a href="/images/dashboard_keplr_step_2_2.png" target="_blank"><img src="/images/dashboard_keplr_step_2_2.png" style="width:500px; height:auto;"></a>
            
        Add the selected extension to your browser.
            
        === "Firefox"
            
             <a href="/images/dashboard_keplr_step_2_3.png" target="_blank"><img src="/images/dashboard_keplr_step_2_3.png" style="width:500px; height:auto;"></a>
            
        === "Google Chrome"
            
              <a href="/images/dashboard_keplr_step_2_3_2.png" target="_blank"><img src="/images/dashboard_keplr_step_2_3_2.png" style="width:500px; height:auto;"></a>

        After installing the extension, you should see it in the top-right panel of your browser. 
                
        <a href="/images/keplr_extension.png" target="_blank"><img src="/images/keplr_extension.png" style="width:500px; height:auto;"></a>

        At this point, the extension is installed, but not yet connected to your wallet. 
        Next, open the extension and log in to your wallet. Once you are logged in, follow the steps below to  and continue with the setup process.        
    
    === "Leap"
    
        2.1. Go to [the official Leap website](https://www.leapwallet.io/){target=_blank} and click "Download Leap".
    
        <a href="/images/dashboard_leap_step_2_1.png" target="_blank"><img src="/images/dashboard_leap_step_2_1.png" style="width:500px; height:auto;"></a>
    
        2.2. Add an extension to the browser.
    
        <a href="/images/dashboard_leap_step_2_2.png" target="_blank"><img src="/images/dashboard_leap_step_2_2.png" style="width:500px; height:auto;"></a>
    
        2.3. Click "Import an existing wallet."
    
        <a href="/images/dashboard_leap_step_2_3.png" target="_blank"><img src="/images/dashboard_leap_step_2_3.png" style="width:500px; height:auto;"></a>
    
        2.4. Choose "Import private key". 

        !!! note "Important note on wallet-bridge compatibility. Please read carefully  if you intend to sell Gonka coins via the Ethereum bridge in the future"
            An Ethereum bridge is a system that lets you securely move assets or data between Ethereum and another blockchain, locking coins on one chain and minting or releasing equivalent coins on the other. Essentially, it’s the mechanism you need if you want to sell, trade, or use coins from another chain within the Ethereum ecosystem. At the moment, there is no bridge to Ethereum on Gonka. Any future deployment of such a bridge would require on-chain governance approval. If an Ethereum bridge is approved by on-chain governance, only accounts with a raw private key are expected to be eligible.
            
            Eligible (you can export/use a raw private key):
            
            - Accounts created via `inferenced` CLI tool
            - Accounts created via the “Connect with Google” flow in Keplr
            - Accounts created from a recovery phrase in Leap (Leap allows exporting the private key)
        
            Not eligible (no private key export):
            
            - Keplr wallets created from a recovery phrase. Keplr does not export the private key, so avoid creating mnemonic-based wallets there if future bridge compatibility matters.
            
        <a href="/images/dashboard_leap_step_2_4.png" target="_blank"><img src="/images/dashboard_leap_step_2_4.png" style="width:500px; height:auto;"></a>
    
        2.5. Paste the private key.
    
        <a href="/images/dashboard_leap_2_5_private_key.png" target="_blank"><img src="/images/dashboard_leap_2_5_private_key.png" style="width:500px; height:auto;"></a>
    
        2.6. Create your password. Store your password in a safe and secure place.
    
        <a href="/images/dashboard_leap_step_2_6.png" target="_blank"><img src="/images/dashboard_leap_step_2_6.png" style="width:500px; height:auto;"></a>
    
        2.7. Done — your Gonka account has been successfully imported into Leap!
    
        <a href="/images/dashboard_leap_step_2_7.png" target="_blank"><img src="/images/dashboard_leap_step_2_7.png" style="width:500px; height:auto;"></a>

    ### 3. Connect wallet

    3.1  Open Gonka dashboard following the [preview mode](https://gonka.ai/wallet/dashboard/#__tabbed_1_1) instructions. 
    
    3.2. In the top-right corner, click "Connect Wallet" to get started.
    
    <a href="/images/dashboard_ping_pub_3_1.png" target="_blank"><img src="/images/dashboard_ping_pub_3_1.png" style="width:500px; height:auto;"></a>
    
    3.3. Select Keplr or Leap and hit Connect.
    
    <a href="/images/dashboard_ping_pub_3_2.png" target="_blank"><img src="/images/dashboard_ping_pub_3_2.png" style="width:500px; height:auto;"></a>
    
    !!! note "Adding Gonka to Leap Wallet"
        Since Gonka network is still in an early stage, it is not included in Leap wallet by default. Because of this, we need to add it manually. When the prompt appears, approve it to add the Gonka chain to your wallet. For Leap you will see a prompt to add a custom Gonka chain to your wallet. Approve and add Gonka chain.
        
    <a href="/images/dashboard_ping_pub_3_3-leap.png" target="_blank"><img src="/images/dashboard_ping_pub_3_3-leap.png" style="width:500px; height:auto;"></a>
    
    3.4. Done! You successfully added your account to the wallet.
    
    <a href="/images/dashboard_ping_pub_3_4.png" target="_blank"><img src="/images/dashboard_ping_pub_3_4.png" style="width:500px; height:auto;"></a>
     
    ??? note "Optional: How to add an additional Gonka account in Keplr wallet — click to view steps"
        
        Open the extension and click on the account icon in the top-right corner of the extension window.
                        
        <a href="/images/dashboard_ping_pub_3_5_1.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_1.png" style="width:auto; height:337.5px;"></a>
                        
         Click the "Add wallet" button.
                        
        <a href="/images/dashboard_ping_pub_3_5_2.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_2.png" style="width:auto; height:337.5px; display:block;"></a>
                        
        Click "Import an Existing Wallet".
                        
        <a href="/images/dashboard_ping_pub_3_5_3.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_3.png" style="width:450px; height:auto; display:block;"></a>
                        
        Click "Use recovery phrase or private key"
                
        <a href="/images/dashboard_ping_pub_3_5_4.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_4.png" style="width:450px; height:auto;"></a>
                
        Paste your private key.
    
        ??? note "Important note on wallet-bridge compatibility. Please read carefully  if you intend to sell Gonka coins via the Ethereum bridge in the future"
            An Ethereum bridge is a system that lets you securely move assets or data between Ethereum and another blockchain, locking coins on one chain and minting or releasing equivalent coins on the other. Essentially, it’s the mechanism you need if you want to sell, trade, or use coins from another chain within the Ethereum ecosystem. At the moment, there is no bridge to Ethereum on Gonka. Any future deployment of such a bridge would require on-chain governance approval. If an Ethereum bridge is approved by on-chain governance, only accounts with a raw private key are expected to be eligible.
                        
            Eligible (you can export/use a raw private key):
                        
            - Accounts created via `inferenced` CLI tool
            - Accounts created via the “Connect with Google” flow in Keplr
            - Accounts created from a recovery phrase in Leap (Leap allows exporting the private key)
                    
            Not eligible (no private key export):
                        
            - Keplr wallets created from a recovery phrase. Keplr does not export the private key, so avoid creating mnemonic-based wallets there if future bridge compatibility matters.
                
        <a href="/images/dashboard_ping_pub_3_5_4.png" target="_blank"><img src="/images/dashboard_keplr_step_3_5_5_private_key.png" style="width:450px; height:auto;"></a>
                        
        Give your wallet a name for easy reference.
                        
        <a href="/images/dashboard_ping_pub_3_5_5.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_5.png" style="width:450px; height:auto;"></a>
                        
        Make sure Gonka chain is selected.
    
        <a href="/images/keplr_deselect_chains.PNG" target="_blank"><img src="/images/keplr_deselect_chains.PNG" style="width:500px; height:auto;"></a>
    
        Done — your Gonka account has been successfully imported into Keplr!
                        
        <a href="/images/dashboard_ping_pub_3_5_7.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_7.png" style="width:450px; height:auto;"></a>
    
    ??? note "Optional: How to add an additional Gonka account to Leap wallet — click to view steps"            
        Open the extension and click on the frog icon and wallet name in the top center button of the extension window.
                        
        <a href="/images/dashboard_leap_step_3_5_1.png" target="_blank"><img src="/images/dashboard_leap_step_3_5_1.png" style="width:250px; height:auto;"></a>
                        
         Click the "Create/Import wallet" button.
                        
        <a href="/images/dashboard_leap_step_3_5_2.png" target="_blank"><img src="/images/dashboard_leap_step_3_5_2.png" style="width:250px; height:auto;"></a>
                        
        Choose "Import using private key". You can import an account created using a recovery (mnemonic/seed) phrase.  
                        
        <a href="/images/dashboard_leap_step_3_5_3.png" target="_blank"><img src="/images/dashboard_leap_step_3_5_3.png" style="width:250px; height:auto;"></a>
                
        Paste your private key or a recovery (mnemonic/seed) phrase.
                
        <a href="/images/dashboard_leap_step_3_5_3.png" target="_blank"><img src="/images/dashboard_leap_step_3_5_4_private_key.png" style="width:250px; height:auto;"></a>
                        
        Done — your Gonka account has been successfully imported into Leap wallet (click on the frog icon and wallet name in the top center button to switch between wallets).
                        
        <a href="/images/dashboard_leap_step_3_5_4.png" target="_blank"><img src="/images/dashboard_leap_step_3_5_4.png" style="width:250px; height:auto;"></a>
