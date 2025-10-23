# Create a new Gonka account

!!! note "Inference for free"
    During the initial network phase, controlled by the governance parameter GracePeriodEndEpoch (default: 90 epochs, ~90 days), the dynamic pricing system is bypassed, and all inference costs are set to zero (until ~ November 20, 2025).

To start using Gonka Network, you first need to create a Gonka Account.
There are several ways to do this:

- Via Keplr wallet — easier setup, supports Connect with Google (recommended) or mnemonic phrase (limited: no bridge support).
- Via Leap wallet — simple setup via mnemonic phrase, but also no bridge support.
- Via `inferenced` CLI tool — full functionality, including bridge transactions.

=== "Option 1: Via Keplr (external wallet)"

    Go to [the official Keplr website](https://www.keplr.app/){target=_blank} and click "Get Keplr wallet".
    
    <a href="/images/dashboard_keplr_step_2_1.png" target="_blank"><img src="/images/dashboard_keplr_step_2_1.png" style="width:500px; height:auto;"></a>
    
    Choose an extension for your browser.
    
    <a href="/images/dashboard_keplr_step_2_2.png" target="_blank"><img src="/images/dashboard_keplr_step_2_2.png" style="width:500px; height:auto;"></a>
    
    Add the selected extension to your browser.
    
    === "Firefox"
    
        <a href="/images/dashboard_keplr_step_2_3.png" target="_blank"><img src="/images/dashboard_keplr_step_2_3.png" style="width:500px; height:auto;"></a>
    
    === "Google Chrome"
    
        <a href="/images/dashboard_keplr_step_2_3_2.png" target="_blank"><img src="/images/dashboard_keplr_step_2_3_2.png" style="width:500px; height:auto;"></a>
    
    Click "Create a new wallet".

    <a href="/images/dashboard_keplr_step_2_4.png" target="_blank"><img src="/images/dashboard_keplr_step_2_4.png" style="width:500px; height:auto;"></a>

    === "Connect with Google"

        Click "Connect with Google".
    
        <a href="/images/keplr_welcome_to_keplr.png" target="_blank"><img src="/images/keplr_welcome_to_keplr.png" style="width:500px; height:auto;"></a>
    
        Set Up Your Wallet.
    
        <a href="/images/keplr_set_up_your_wallet.png" target="_blank"><img src="/images/keplr_set_up_your_wallet.png" style="width:500px; height:auto;"></a>
    
        Backup your private key securely. Anyone with your private key can have access to your assets. If you lose access to your Gmail Account, the only way to recover your wallet is using your private key. Keep this in a safe place.
    
        <a href="/images/keplr_back_up_private_key.png" target="_blank"><img src="/images/keplr_back_up_private_key.png" style="width:500px; height:auto;"></a>

    === "Create new recovery phrase"

        !!! note "Important Notice: Limited Functionality"

            This option creates an account using a mnemonic phrase and does not support transactions through the bridge. If you want to perform transactions via the bridge, please use Option 1: Via Keplr (external wallet, "Connect with Google") or Option 3: Via `inferenced` CLI tool instead.
        
        Click "Create new recovery phrase"
    
        <a href="/images/keplr_welcome_to_keplr.png" target="_blank"><img src="/images/keplr_welcome_to_keplr.png" style="width:500px; height:auto;"></a>

        DO NOT share your recovery phrase with ANYONE. Anyone with your recovery phrase can have full control over your assets. Please stay vigilant against phishing attacks at all times. Back up the phrase safely. You will never be able to restore your account without your recovery phrase.
    
        <a href="/images/keplr_new_recovery_phrase.png" target="_blank"><img src="/images/keplr_new_recovery_phrase.png" style="width:500px; height:auto;"></a>
    
        Verify your recovery phrase, create wallet name and password.
    
        <a href="/images/keplr_verify_your_recovery_phrase.png" target="_blank"><img src="/images/keplr_verify_your_recovery_phrase.png" style="width:500px; height:auto;"></a>
    
        Select Cosmos Hub and Ethereum.
        
        <a href="/images/dashboard_keplr_step_2_7.png" target="_blank"><img src="/images/dashboard_keplr_step_2_7.png" style="width:500px; height:auto;"></a>
            
        Your Keplr wallet has been created.
        
        <a href="/images/dashboard_keplr_step_2_8.png" target="_blank"><img src="/images/dashboard_keplr_step_2_8.png" style="width:500px; height:auto;"></a>
        
    Choose a random node from the `inference_url` list of genesis-nodes.

    - [http://185.216.21.98:8000](http://185.216.21.98:8000)
    - [http://36.189.234.197:18026](http://36.189.234.197:18026)
    - [http://36.189.234.237:17241](http://36.189.234.237:17241)
    - [http://node1.gonka.ai:8000](http://node1.gonka.ai:8000)
    - [http://node2.gonka.ai:8000](http://node2.gonka.ai:8000)
    - [http://node3.gonka.ai:8000](http://node3.gonka.ai:8000)
    - [http://47.236.26.199:8000](http://47.236.26.199:8000)
    - [http://47.236.19.22:18000](http://47.236.19.22:18000)
    - [http://gonka.spv.re:8000](http://gonka.spv.re:8000)
    
    ??? note "An alternative, fully decentralized approach to choosing a random node from the list of active Hosts"
        Open the Hosts list: [http://node2.gonka.ai:8000/v1/epochs/current/participants](http://node2.gonka.ai:8000/v1/epochs/current/participants).
        
        Choose any active Host from the list.
        
        Copy their `inference_url` value.
        
    Paste the `inference_url` into your browser to load the dashboard.
    
    Once opened, you’ll see real-time data streamed directly from the Host’s node — including network statistics, active workloads, and inference metrics.
    
    In the top-right corner, click "Connect Wallet" to get started.
    
    <a href="/images/dashboard_ping_pub_3_1.png" target="_blank"><img src="/images/dashboard_ping_pub_3_1.png" style="width:500px; height:auto;"></a>
    
    Select Keplr and hit Connect.
    
    <a href="/images/dashboard_ping_pub_3_2.png" target="_blank"><img src="/images/dashboard_ping_pub_3_2.png" style="width:500px; height:auto;"></a>
    
    You will see a prompt to add a custom Gonka chain to your wallet. Approve and add Gonka chain.
    
    <a href="/images/dashboard_ping_pub_3_3.png" target="_blank"><img src="/images/dashboard_ping_pub_3_3.png" style="width:500px; height:auto;"></a>
        
    Done! Your Gonka Developer account has been successfully created.
    
    <a href="/images/dashboard_ping_pub_3_4.png" target="_blank"><img src="/images/dashboard_ping_pub_3_4.png" style="width:500px; height:auto;"></a>

    Open Keplr, navigate to “Copy Address” in your wallet, tap or click “Copy Address,” and share the copied address — it’s a public key, so it’s safe. 
    
    <a href="/images/keplr_copy_address.png" target="_blank"><img src="/images/keplr_copy_address.png" style="width:auto; height:337.5px;"></a>

    Click on the account icon in the top-right corner of the extension window.
            
    <a href="/images/dashboard_ping_pub_3_5_1.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_1.png" style="width:auto; height:337.5px;"></a>

    Navigate three dots and click "View private key".

    <a href="/images/keplr_view_private_key.png" target="_blank"><img src="/images/keplr_view_private_key.png" style="width:auto; height:337.5px;"></a>

    Enter your password. 
   
    <a href="/images/keplr_enter_your_password.png" target="_blank"><img src="/images/keplr_enter_your_password.png" style="width:auto; height:337.5px;"></a>

    Copy your private key and store it securely (a hard copy is preferred).   

    ??? note "Optional: How to add an additional Gonka account in Keplr wallet — click to view steps"

        Open the extension and click on the account icon in the top-right corner of the extension window.
            
        <a href="/images/dashboard_ping_pub_3_5_1.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_1.png" style="width:auto; height:337.5px;"></a>
            
        Click the "Add wallet" button.
            
        <a href="/images/dashboard_ping_pub_3_5_2.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_2.png" style="width:auto; height:337.5px; display:block;"></a>
            
        Click "Import an Existing Wallet".
            
        <a href="/images/dashboard_ping_pub_3_5_3.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_3.png" style="width:450px; height:auto; display:block;"></a>
            
        Click "Use recovery phrase or private key"
    
        <a href="/images/dashboard_ping_pub_3_5_4.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_4.png" style="width:450px; height:auto;"></a>
    
        Paste your private key. You can import an account created using a recovery (mnemonic/seed) phrase. However, bridge functionality will be limited, as the bridge requires direct access to the raw private key to sign transactions and ensure full interoperability with Ethereum.
    
        <a href="/images/dashboard_ping_pub_3_5_4.png" target="_blank"><img src="/images/dashboard_keplr_step_3_5_5_private_key.png" style="width:450px; height:auto;"></a>
            
        Give your wallet a name for easy reference.
            
        <a href="/images/dashboard_ping_pub_3_5_5.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_5.png" style="width:450px; height:auto;"></a>
            
        Select Cosmos Hub and Ethereum.
    
        <a href="/images/dashboard_ping_pub_3_5_6.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_6.png" style="width:450px; height:auto; display:block;"></a>
            
        Done — your Gonka account has been successfully imported into Keplr!
            
        <a href="/images/dashboard_ping_pub_3_5_7.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_7.png" style="width:450px; height:auto;"></a>

=== "Option 2: Via Leap (external wallet)"

    !!! note "Important Notice: Limited Functionality"

        This option creates an account using a mnemonic phrase and does not support transactions through the bridge. If you want to perform transactions via the bridge, please use Option 1: Via Keplr (external wallet, "Connect with Google") or Option 3: Via `inferenced` CLI tool instead.
    
    Go to [the official Leap website](https://www.leapwallet.io/){target=_blank} and click "Download Leap".
    
    <a href="/images/dashboard_leap_step_2_1.png" target="_blank"><img src="/images/dashboard_leap_step_2_1.png" style="width:500px; height:auto;"></a>
    
    Add the selected extension to your browser.
    
    <a href="/images/dashboard_leap_step_2_2.png" target="_blank"><img src="/images/dashboard_leap_step_2_2.png" style="width:500px; height:auto;"></a>
    
    Click "Create a new wallet".
    
    <a href="/images/dashboard_leap_step_2_3.png" target="_blank"><img src="/images/dashboard_leap_step_2_3.png" style="width:500px; height:auto;"></a>

    Save your secret recovery phrase. Write down these words, your secret recovery phrase is the only way to recover your wallet and funds!

    <a href="/images/leap_your_secret_recovery_phrase.png" target="_blank"><img src="/images/leap_your_secret_recovery_phrase.png" style="width:500px; height:auto;"></a>

    Choose a password to secure & lock your wallet. Agree to the Terms & Conditions.

    <a href="/images/leap_create_your_password.png" target="_blank"><img src="/images/leap_create_your_password.png" style="width:500px; height:auto;"></a>

    Your Leap wallet has been created.

    <a href="/images/leap_you_are_all_set.png" target="_blank"><img src="/images/leap_you_are_all_set.png" style="width:500px; height:auto;"></a>

    Choose a random node from the `inference_url` list of genesis-nodes
    
    - [http://185.216.21.98:8000](http://185.216.21.98:8000)
    - [http://69.19.136.233:8000](http://69.19.136.233:8000)
    - [http://36.189.234.197:18026](http://36.189.234.197:18026)
    - [http://36.189.234.237:17241](http://36.189.234.237:17241)
    - [http://node1.gonka.ai:8000](http://node1.gonka.ai:8000)
    - [http://node2.gonka.ai:8000](http://node2.gonka.ai:8000)
    - [http://node3.gonka.ai:8000](http://node3.gonka.ai:8000)
    - [http://47.236.26.199:8000](http://47.236.26.199:8000)
    - [http://47.236.19.22:18000](http://47.236.19.22:18000)
    - [http://gonka.spv.re:8000](http://gonka.spv.re:8000)
    
    ??? note "An alternative, fully decentralized approach to choosing a random node from the list of active Hosts"
        Open the Hosts list: [http://node2.gonka.ai:8000/v1/epochs/current/participants](http://node2.gonka.ai:8000/v1/epochs/current/participants)
        
        Choose any active Host from the list.
        
        Copy their `inference_url` value.
        
    Paste the `inference_url` into your browser to load the dashboard.
    
    Once opened, you’ll see real-time data streamed directly from the Host’s node — including network statistics, active workloads, and inference metrics.
    
    In the top-right corner, click "Connect Wallet" to get started.
    
    <a href="/images/dashboard_ping_pub_3_1.png" target="_blank"><img src="/images/dashboard_ping_pub_3_1.png" style="width:500px; height:auto;"></a>
    
    Select Leap and hit Connect.
    
    <a href="/images/dashboard_ping_pub_3_2.png" target="_blank"><img src="/images/dashboard_ping_pub_3_2.png" style="width:500px; height:auto;"></a>
    
    You will see a prompt to add a custom Gonka chain to your wallet. Approve and add Gonka chain.
    
    <a href="/images/leap_add_network.png" target="_blank"><img src="/images/leap_add_network.png" style="width:500px; height:auto;"></a>

    Done! Your Gonka Developer account has been successfully created.

    <a href="/images/leap_created_gonka_account.png" target="_blank"><img src="/images/leap_created_gonka_account.png" style="width:500px; height:auto;"></a>

    Open the extension and navigate to the menu in the top-left corner.
            
    <a href="/images/leap_left_menu.png" target="_blank"><img src="/images/leap_left_menu.png" style="width:auto; height:337.5px;"></a>

    Click "Security & Privacy".

    <a href="/images/leap_security_privacy.png" target="_blank"><img src="/images/leap_security_privacy.png" style="width:auto; height:337.5px;"></a>

    Click "Show private key". 
   
    <a href="/images/leap_show_private_key.png" target="_blank"><img src="/images/leap_show_private_key.png" style="width:auto; height:337.5px;"></a>

    Enter your password.
    
    <a href="/images/leap_enter_password.png" target="_blank"><img src="/images/leap_enter_password.png" style="width:auto; height:337.5px;"></a>

    Copy your private key and store it securely (a hard copy is preferred).   

    ??? note "Optional: How to add an additional Gonka account to Leap wallet — click to view steps"            
        Open the extension and click on the frog icon and wallet name in the top center button of the extension window.
            
        <a href="/images/dashboard_leap_step_3_5_1.png" target="_blank"><img src="/images/dashboard_leap_step_3_5_1.png" style="width:250px; height:auto;"></a>
            
        Click the "Create/Import wallet" button.
            
        <a href="/images/dashboard_leap_step_3_5_2.png" target="_blank"><img src="/images/dashboard_leap_step_3_5_2.png" style="width:250px; height:auto;"></a>
            
        Choose "Import using private key". You can import an account created using a recovery (mnemonic/seed) phrase. However, bridge functionality will be limited, as the bridge requires direct access to the raw private key to sign transactions and ensure full interoperability with Ethereum. 
            
        <a href="/images/dashboard_leap_step_3_5_3.png" target="_blank"><img src="/images/dashboard_leap_step_3_5_3.png" style="width:250px; height:auto;"></a>
    
        Paste your private key or a recovery (mnemonic/seed) phrase.
    
        <a href="/images/dashboard_leap_step_3_5_3.png" target="_blank"><img src="/images/dashboard_leap_step_3_5_4_private_key.png" style="width:250px; height:auto;"></a>
            
        Done — your Gonka account has been successfully imported into Leap wallet (click on the frog icon and wallet name in the top center button to switch between wallets).
            
        <a href="/images/dashboard_leap_step_3_5_4.png" target="_blank"><img src="/images/dashboard_leap_step_3_5_4.png" style="width:250px; height:auto;"></a>

=== "Option 3: Via `inferenced` CLI tool"
    Download the `inferenced` CLI tool (the latest `inferenced` binary for your system is [here](https://github.com/gonka-ai/gonka/releases)).
    
    
    ??? note "Enabling Execution on Mac OS"
        On Mac OS, after downloading the inferenced binary, you may need to enable execution permissions manually. Follow these steps:
        
        1.	Open a terminal and navigate to the directory where the binary is located.
        
        2.	Run the following command to grant execution permission:
        ```
        chmod +x inferenced
        ```
        3.	Try running `./inferenced --help` to ensure it's working.
            
        4.	If you see a security warning when trying to run `inferenced`, go to System Settings → Privacy & Security.
        
        5.	Scroll down to the warning about `inferenced` and click "Allow Anyway".
    
    You can create an account with the following command:
    ```bash
    ./inferenced create-client $ACCOUNT_NAME \
      --node-address $NODE_URL
    ```
    
    Make sure to securely save your passphrase — you'll need it for future access.
    
    This command creates a new account, securely stores its keys in the `~/.inference` directory, and returns your new account address:
    
    ```bash
    - address: <your-account-address>
      name: ACCOUNT_NAME
      pubkey: '{"@type":"...","key":"..."}'
      type: local
    ```
    
    The account stores your balance, add it to environment variable `GONKA_ADDRESS`, or `.env` file.
    
    ```bash
    export GONKA_ADDRESS=<your-account-address>
    ```
    
    Add Private Key to environment variables
    
    If you'd like to perform the request:
    
    Export your private key (for demo/testing only).
    ```bash
    ./inferenced keys export $ACCOUNT_NAME --unarmored-hex --unsafe
    ```
    
    This command outputs a plain-text private key.
    
    Add it to environment variable `GONKA_PRIVATE_KEY`, or `.env` file.
    ```bash
    export GONKA_PRIVATE_KEY=<your-private-key>
    ```

Once your account is ready, you can [start using the network](https://gonka.ai/developer/quickstart/).

**Need help?** Join our [Discord server](https://discord.com/invite/RADwCT2U6R) for assistance with general inquiries, technical issues, or security concerns.  
