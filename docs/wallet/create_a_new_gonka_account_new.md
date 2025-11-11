# Create a new Gonka account

To start using Gonka Network, you first need to create a Gonka Account.
There are several ways to do this:

- Via external wallet (Keplr or Leap)
- Via `inferenced` CLI tool

!!! note "Important note" 
    At the moment, there is no bridge to Ethereum. Any potential bridge deployment would be subject to on-chain governance. If the network were to vote in favor of deploying an Ethereum bridge, only wallets created from a direct private key (not restored from a standard mnemonic/seed phrase) — such as those generated via `inferenced` CLI tool or the “Connect with Google” flow — would be eligible. Accounts created using a recovery (mnemonic/seed) phrase may not be compatible with the bridge. In that case, you would need to export the private key and create a wallet that uses that private key for direct transactions.

=== "External wallet"

    === "I do not have an external wallet"

        === "Keplr mobile app"

            Go to [the official Keplr website](https://www.keplr.app/){target=_blank} and click "Get Keplr wallet".
            
            <a href="/images/keplr_mobile_website_main.PNG" target="_blank"><img src="/images/keplr_mobile_website_main.PNG" style="width:auto; height:337.5px;"></a>
            
            Scroll down to the Mobile App section and choose your operating system. Download the app.
            
            <a href="/images/keplr_mobile_website_mobileos.PNG" target="_blank"><img src="/images/keplr_mobile_website_mobileos.PNG" style="width:auto; height:337.5px;"></a>
            
            Open the app. Click “Create a new wallet”.
            
            <a href="/images/keplr_mobile_create_new_wallet.PNG" target="_blank"><img src="/images/keplr_mobile_create_new_wallet.PNG" style="width:auto; height:337.5px;"></a>

            === "Via Connect with Google"

                Click "Connect with Google". Follow the instructions to sign in via Gmail.
                
                <a href="/images/keplr_mobile_recovery_phrase.PNG" target="_blank"><img src="/images/keplr_mobile_recovery_phrase.PNG" style="width:auto; height:337.5px;"></a>
                
                Backup your private key securely. Anyone with your private key can have access to your assets. If you lose access to your Gmail Account, the only way to recover your wallet is by using your private key. Store your private key in a safe and secure place. Never share your private key with anyone.
                
                <a href="/images/keplr_mobile_google_private_key_2.PNG" target="_blank"><img src="/images/keplr_mobile_google_private_key_2.PNG" style="width:auto; height:337.5px;"></a>

            === "Via recovery phrase"
            
                Choose “Create new recovery phrase”.
                
                <a href="/images/keplr_mobile_recovery_phrase.PNG" target="_blank"><img src="/images/keplr_mobile_recovery_phrase.PNG" style="width:auto; height:337.5px;"></a>
                
                DO NOT share your recovery phrase with ANYONE. Anyone with your recovery phrase can have full control over your assets. Back up the phrase safely. You will never be able to restore your account without your recovery phrase.
                
                <a href="/images/keplr_mobile_recovery_phrase_step_1.PNG" target="_blank"><img src="/images/keplr_mobile_recovery_phrase_step_1.PNG" style="width:auto; height:337.5px;"></a>
                
                Verify your recovery phrase, create a wallet name, and a password.
                
                <a href="/images/keplr_mobile_recovery_phrase_step_2.PNG" target="_blank"><img src="/images/keplr_mobile_recovery_phrase_step_2.PNG" style="width:auto; height:337.5px;"></a>
            
            Type “Gonka” into the search bar and select Gonka chain to add it to your wallet.

            <a href="/images/keplr_deselect_chains.PNG.PNG" target="_blank"><img src="/images/keplr_deselect_chains.PNG" style="width:auto; height:337.5px;"></a>

            You have created your wallet in Keplr. Now, follow the instructions below to find your account address.

            <a href="/images/keplr_mobile_all_set.PNG" target="_blank"><img src="/images/keplr_mobile_all_set.PNG" style="width:auto; height:337.5px;"></a>

            On the home screen, scroll down to the Gonka chain and tap it.

            <a href="/images/keplr_mobile_start_screen.PNG" target="_blank"><img src="/images/keplr_mobile_start_screen.PNG" style="width:auto; height:337.5px;"></a>

            Above your balance, you will see your Gonka account address. Tap the copy icon to copy your full Gonka account address.

            <a href="/images/keplr_mobile_address.PNG" target="_blank"><img src="/images/keplr_mobile_address.PNG" style="width:auto; height:337.5px;"></a>

            You copied your Gonka account address. You can share it with anyone who will send you payments. Sharing it is safe.

        === "Keplr browser extension"

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
            
            At this point, the extension is installed, but your wallet and Gonka account have not been created yet. Please continue to the next step to set them up.

            Open the Keplr browser extension. Click "Create a new wallet".
            
            <a href="/images/dashboard_keplr_step_2_4.png" target="_blank"><img src="/images/dashboard_keplr_step_2_4.png" style="width:500px; height:auto;"></a>
            
            === "Connect with Google"

                Click "Connect with Google".
                
                <a href="/images/keplr_welcome_to_keplr.png" target="_blank"><img src="/images/keplr_welcome_to_keplr.png" style="width:500px; height:auto;"></a>
                
                Set Up Your Wallet. Store your password in a safe and secure place.
                
                <a href="/images/keplr_set_up_your_wallet.png" target="_blank"><img src="/images/keplr_set_up_your_wallet.png" style="width:500px; height:auto;"></a>

                Backup your private key securely. Anyone with your private key can have access to your assets. If you lose access to your Gmail Account, the only way to recover your wallet is by using your private key. Store your private key in a safe and secure place. Never share your private key with anyone.
            
                <a href="/images/keplr_back_up_private_key.png" target="_blank"><img src="/images/keplr_back_up_private_key.png" style="width:500px; height:auto;"></a>

                Type “Gonka” into the search bar and select Gonka chain to add it to your wallet.

                <a href="/images/keplr_deselect_chains.png" target="_blank"><img src="/images/keplr_deselect_chains.png" style="width:500px; height:auto;"></a>

                You have created your wallet in Keplr. Now, follow the instructions below to find your account address.

                <a href="/images/dashboard_keplr_step_2_8.png" target="_blank"><img src="/images/dashboard_keplr_step_2_8.png" style="width:500px; height:auto;"></a>

            === "Create new recovery phrase"

                Click "Create new recovery phrase"
            
                <a href="/images/keplr_welcome_to_keplr.png" target="_blank"><img src="/images/keplr_welcome_to_keplr.png" style="width:500px; height:auto;"></a>
        
                DO NOT share your recovery phrase with ANYONE. Anyone with your recovery phrase can have full control over your assets. Back up the phrase safely. You will never be able to restore your account without your recovery phrase.
            
                <a href="/images/keplr_new_recovery_phrase.png" target="_blank"><img src="/images/keplr_new_recovery_phrase.png" style="width:500px; height:auto;"></a>
            
                Set Up Your Wallet. Store your password in a safe and secure place.
            
                <a href="/images/keplr_verify_your_recovery_phrase.png" target="_blank"><img src="/images/keplr_verify_your_recovery_phrase.png" style="width:500px; height:auto;"></a>

                Type “Gonka” into the search bar and select Gonka chain to add it to your wallet.

                <a href="/images/keplr_deselect_chains.png" target="_blank"><img src="/images/keplr_deselect_chains.png" style="width:500px; height:auto;"></a>

                You have created your wallet in Keplr. Now, follow the instructions below to find your account address.

                <a href="/images/dashboard_keplr_step_2_8.png" target="_blank"><img src="/images/dashboard_keplr_step_2_8.png" style="width:500px; height:auto;"></a>

            Open Keplr, navigate, and click on “Copy Address” in your wallet.

            <a href="/images/keplr_copy_address.png" target="_blank"><img src="/images/keplr_copy_address.png" style="width:auto; height:337.5px;"></a>

            Click the Copy button next to the Gonka chain.

            <a href="/images/keplr_copy_address_2.png" target="_blank"><img src="/images/keplr_copy_address_2.png" style="width:auto; height:337.5px;"></a>

            You copied your Gonka account address. You can share it with anyone who will send you payments. Sharing it is safe. 
            To access your wallet on a mobile device, download the Keplr app and log in using the same method you used during registration. Your Gonka Network account will automatically appear in the mobile wallet app.

            ??? note "Optional: How to add an additional Gonka account in Keplr wallet — click to view steps"
    
                Open the extension and click on the account icon in the top-right corner of the extension window.
                    
                <a href="/images/dashboard_ping_pub_3_5_1.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_1.png" style="width:auto; height:337.5px;"></a>
                    
                Click the "Add wallet" button.
                    
                <a href="/images/dashboard_ping_pub_3_5_2.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_2.png" style="width:auto; height:337.5px; display:block;"></a>
                    
                Click "Import an Existing Wallet".
                    
                <a href="/images/dashboard_ping_pub_3_5_3.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_3.png" style="width:450px; height:auto; display:block;"></a>
                    
                Click "Use recovery phrase or private key"
            
                <a href="/images/dashboard_ping_pub_3_5_4.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_4.png" style="width:450px; height:auto;"></a>
            
                Paste your private key. You can import an account created using a recovery (mnemonic/seed) phrase. 
            
                <a href="/images/dashboard_ping_pub_3_5_4.png" target="_blank"><img src="/images/dashboard_keplr_step_3_5_5_private_key.png" style="width:450px; height:auto;"></a>
                    
                Give your wallet a name for easy reference.
                    
                <a href="/images/dashboard_ping_pub_3_5_5.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_5.png" style="width:450px; height:auto;"></a>
                    
                Make sure Gonka chain is selected.

                <a href="/images/keplr_deselect_chains.png" target="_blank"><img src="/images/keplr_deselect_chains.png" style="width:500px; height:auto;"></a>

                Done — your Gonka account has been successfully imported into Keplr!
                    
                <a href="/images/dashboard_ping_pub_3_5_7.png" target="_blank"><img src="/images/dashboard_ping_pub_3_5_7.png" style="width:450px; height:auto;"></a>

        === "Leap browser extension"
    
            Go to [the official Leap website](https://www.leapwallet.io/){target=_blank} and click "Download Leap".
            
            <a href="/images/dashboard_leap_step_2_1.png" target="_blank"><img src="/images/dashboard_leap_step_2_1.png" style="width:500px; height:auto;"></a>
            
            Add the selected extension to your browser.
            
            <a href="/images/dashboard_leap_step_2_2.png" target="_blank"><img src="/images/dashboard_leap_step_2_2.png" style="width:500px; height:auto;"></a>
            
            After installing the extension, you should see it in the top-right panel of your browser. 
            
            <a href="/images/leap_extension.png" target="_blank"><img src="/images/leap_extension.png" style="width:500px; height:auto;"></a>
            
            At this point, the extension is installed, but your wallet and your Gonka account are not created yet. Please continue to the next step to set them up.

            Click "Create a new wallet".
            
            <a href="/images/dashboard_leap_step_2_3.png" target="_blank"><img src="/images/dashboard_leap_step_2_3.png" style="width:500px; height:auto;"></a>
        
            Save your secret recovery phrase. Write down these words, your secret recovery phrase is the only way to recover your wallet and funds!
        
            <a href="/images/leap_your_secret_recovery_phrase.png" target="_blank"><img src="/images/leap_your_secret_recovery_phrase.png" style="width:500px; height:auto;"></a>
        
            Choose a password to secure & lock your wallet. Agree to the Terms & Conditions.
        
            <a href="/images/leap_create_your_password.png" target="_blank"><img src="/images/leap_create_your_password.png" style="width:500px; height:auto;"></a>
        
            You have created your wallet in Leap. Now, follow the instructions below to add the Gonka network to your wallet and complete the creation of your Gonka network account.
        
            <a href="/images/leap_you_are_all_set.png" target="_blank"><img src="/images/leap_you_are_all_set.png" style="width:500px; height:auto;"></a>
        
            Here is the guide on how to add the Gonka network to your wallet and how your Gonka account will be created. Here is the list of genesis nodes. Choose a random node from the list below and open it in a new browser window.
            
            - [http://69.19.136.233:8000](http://69.19.136.233:8000)
            - [http://36.189.234.197:18026](http://36.189.234.197:18026)
            - [http://36.189.234.237:17241](http://36.189.234.237:17241)
            - [http://node1.gonka.ai:8000](http://node1.gonka.ai:8000)
            - [http://node2.gonka.ai:8000](http://node2.gonka.ai:8000)
            - [http://node3.gonka.ai:8000](http://node3.gonka.ai:8000)
            - [http://47.236.26.199:8000](http://47.236.26.199:8000)
            - [http://47.236.19.22:18000](http://47.236.19.22:18000)
            - [http://gonka.spv.re:8000](http://gonka.spv.re:8000)
            - [http://185.216.21.98:8000](http://185.216.21.98:8000)
            
            ??? note "An alternative, fully decentralized approach to choosing a random node from the list of active Hosts"
                Open the Hosts list: [http://node2.gonka.ai:8000/v1/epochs/current/participants](http://node2.gonka.ai:8000/v1/epochs/current/participants)
                
                Choose any active Host from the list.
                
                Copy their `inference_url` value.
                
                Paste the `inference_url` into your browser to load the dashboard.
            
            Once opened, you’ll see real-time data streamed directly from the Host’s node — including network statistics, active workloads, and inference metrics.
            
            In the top-right corner, click "Connect Wallet" to add the Gonka chain to your wallet.
            
            <a href="/images/dashboard_ping_pub_3_1.png" target="_blank"><img src="/images/dashboard_ping_pub_3_1.png" style="width:500px; height:auto;"></a>
            
            Select Leap and hit Connect.
            
            <a href="/images/dashboard_ping_pub_3_2.png" target="_blank"><img src="/images/dashboard_ping_pub_3_2.png" style="width:500px; height:auto;"></a>
            
            Since Gonka network is still in an early stage, it is not included in wallets by default. Because of this, we need to add it manually. When the prompt appears, approve it to add the Gonka chain to your wallet. Once the Gonka network is added, your Gonka account will be created automatically.
            
            <a href="/images/leap_add_network.png" target="_blank"><img src="/images/leap_add_network.png" style="width:500px; height:auto;"></a>
        
            Your Gonka account has been created. The last 4 characters of your wallet appear in the top-right corner. To copy your full wallet address, follow the steps below.
        
            <a href="/images/leap_created_gonka_account.png" target="_blank"><img src="/images/leap_created_gonka_account.png" style="width:500px; height:auto;"></a>
        
            Open the wallet extension. Below your zero (“-”) balance, you will see Gonka account address (for example, gonka...5e6r) — click that to copy your account address. You can safely share this with anyone who wants to send you payments. 
                    
            <a href="/images/leap_left_menu.png" target="_blank"><img src="/images/leap_left_menu.png" style="width:auto; height:337.5px;"></a>
        
            To access your wallet on a mobile device, download the Leap app and log in using the same method you used during registration. Your Gonka Network account will automatically appear in the mobile wallet app.            
                 
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

    === "I have an external wallet"

        === "Keplr mobile app"

            Open Keplr mobile app and log in to your wallet. Select the menu in the top left corner.
            
            <a href="/images/keplr_mobile_start_screen.PNG" target="_blank"><img src="/images/keplr_mobile_start_screen.PNG" style="width:auto; height:337.5px;"></a>

            Click “Add/Remove” Chains.

            <a href="/images/keplr_mobile_add_remove_chain.PNG" target="_blank"><img src="/images/keplr_mobile_add_remove_chain.PNG" style="width:auto; height:337.5px;"></a>

            Type “Gonka” in the search bar and select the Gonka chain.

            <a href="/images/keplr_mobile_add_remove_chain_gonka.PNG" target="_blank"><img src="/images/keplr_mobile_add_remove_chain_gonka.PNG" style="width:auto; height:337.5px;"></a>

            On the home screen, scroll down to the Gonka chain and tap it.

            <a href="/images/keplr_mobile_start_screen.PNG" target="_blank"><img src="/images/keplr_mobile_start_screen.PNG" style="width:auto; height:337.5px;"></a>

            Above your balance, you will see your Gonka account address. Tap the copy icon to copy your full Gonka account address.

            <a href="/images/keplr_mobile_copy_address_gonka.PNG" target="_blank"><img src="/images/keplr_mobile_copy_address_gonka.PNG" style="width:auto; height:337.5px;"></a>

            You copied your Gonka account address. You can share it with anyone who will send you payments. Sharing it is safe.

        === "Keplr browser extension"

            Install an extension for your browser (if you have extension installed, go to the step [“Add Gonka network to your wallet”](https://gonka.ai/wallet/create_a_new_gonka_account_new/#add-gonka-network-to-your-wallet)).
            
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

            #### Add Gonka network to your wallet

            Here is the guide on how to add the Gonka network to your wallet and how your Gonka account will be created.
            Open Keplr browser extension. Navigate to the menu on the top left corner”.

            <a href="/images/keplr_web_start.png" target="_blank"><img src="/images/keplr_web_start.png" style="width:auto; height:337.5px;"></a>

            Click “Add/Remove chains”.

            <a href="/images/keplr_web_add_remove_chains.png" target="_blank"><img src="/images/keplr_web_add_remove_chains.png" style="width:auto; height:337.5px;"></a>

            Type “Gonka” in serach bar and select “Gonka” chain.
                
            <a href="/images/keplr_web_add_remove_chains_gonka.png" target="_blank"><img src="/images/keplr_web_add_remove_chains_gonka.png" style="width:auto; height:337.5px;"></a>

            Open Keplr and click the “Copy Address” button located above your balance.

            <a href="/images/keplr_web_start.png" target="_blank"><img src="/images/keplr_web_start.png" style="width:auto; height:337.5px;"></a>

            Click the Copy button next to the Gonka chain.

            <a href="/images/keplr_web_copy_gonka_address.png" target="_blank"><img src="/images/keplr_web_copy_gonka_address.png" style="width:auto; height:337.5px;"></a>

            You copied your Gonka account address. You can share it with anyone who will send you payments. Sharing it is safe. 
            To access your wallet on a mobile device, download the Keplr app and log in using the same method you used during registration. Your Gonka Network account will automatically appear in the mobile wallet app.

        === "Leap browser extension"

            Go to [the official Leap website](https://www.leapwallet.io/){target=_blank} and click "Download Leap".
            
            <a href="/images/dashboard_leap_step_2_1.png" target="_blank"><img src="/images/dashboard_leap_step_2_1.png" style="width:500px; height:auto;"></a>
            
            Add the selected extension to your browser.
            
            <a href="/images/dashboard_leap_step_2_2.png" target="_blank"><img src="/images/dashboard_leap_step_2_2.png" style="width:500px; height:auto;"></a>
            
            After installing the extension, you should see it in the top-right panel of your browser. 
            
            <a href="/images/leap_extension.png" target="_blank"><img src="/images/leap_extension.png" style="width:500px; height:auto;"></a>
            
            At this point, the extension is installed, but not yet connected to your wallet.
            Next, open the extension and log in to your wallet. Once you are logged in, follow the steps below to add Gonka network to your wallet and continue with the setup process.
           
            ### Add Gonka network to your wallet
            Here is the guide on how to add the Gonka network to your wallet and how your Gonka account will be created.
            Here is the list of genesis nodes. Choose a random node from the list below and open it in a new browser window.
            
            - [http://69.19.136.233:8000](http://69.19.136.233:8000)
            - [http://36.189.234.197:18026](http://36.189.234.197:18026)
            - [http://36.189.234.237:17241](http://36.189.234.237:17241)
            - [http://node1.gonka.ai:8000](http://node1.gonka.ai:8000)
            - [http://node2.gonka.ai:8000](http://node2.gonka.ai:8000)
            - [http://node3.gonka.ai:8000](http://node3.gonka.ai:8000)
            - [http://47.236.26.199:8000](http://47.236.26.199:8000)
            - [http://47.236.19.22:18000](http://47.236.19.22:18000)
            - [http://gonka.spv.re:8000](http://gonka.spv.re:8000)
            - [http://185.216.21.98:8000](http://185.216.21.98:8000)
            
            ??? note "An alternative, fully decentralized approach to choosing a random node from the list of active Hosts"
                Open the Hosts list: [http://node2.gonka.ai:8000/v1/epochs/current/participants](http://node2.gonka.ai:8000/v1/epochs/current/participants)
                
                Choose any active Host from the list.
                
                Copy their `inference_url` value.
                
                Paste the `inference_url` into your browser to load the dashboard.
            
            Once opened, you’ll see real-time data streamed directly from the Host’s node — including network statistics, active workloads, and inference metrics.
            
            In the top-right corner, click "Connect Wallet" to add the Gonka chain to your wallet.
            
            <a href="/images/dashboard_ping_pub_3_1.png" target="_blank"><img src="/images/dashboard_ping_pub_3_1.png" style="width:500px; height:auto;"></a>
            
            Select Leap and hit Connect.
            
            <a href="/images/dashboard_ping_pub_3_2.png" target="_blank"><img src="/images/dashboard_ping_pub_3_2.png" style="width:500px; height:auto;"></a>
            
            Since Gonka network is still in an early stage, it is not included in wallets by default. Because of this, we need to add it manually. When the prompt appears, approve it to add the Gonka chain to your wallet. Once the Gonka network is added, your Gonka account will be created automatically..

            <a href="/images/leap_add_network.png" target="_blank"><img src="/images/leap_add_network.png" style="width:500px; height:auto;"></a>
        
            Your Gonka account has been successfully created. 

            <a href="/images/leap_created_gonka_account.png" target="_blank"><img src="/images/leap_created_gonka_account.png" style="width:500px; height:auto;"></a>
        
            Open the wallet extension. Below your zero (“-”) balance, you will see Gonka account address (for example, gonka...5e6r) — click that to copy your account address. You can safely share this with anyone who wants to send you payments. 
                    
            <a href="/images/leap_left_menu.png" target="_blank"><img src="/images/leap_left_menu.png" style="width:auto; height:337.5px;"></a>
        
            To access your wallet on a mobile device, download the Leap app and log in using the same method you used during registration. Your Gonka Network account will automatically appear in the mobile wallet app.            
                 
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

=== "Via `inferenced` CLI tool"
    
    This guide explains how to create a Gonka Network account using the inferenced CLI tool. Download the `inferenced` CLI tool (the latest `inferenced` binary for your system is [here](https://github.com/gonka-ai/gonka/releases)).

    !!! note "What is the inferenced CLI tool?"
        The `inferenced` CLI tool is a command-line interface utility used to interact with the Gonka network. It is a standalone, executable binary that allows users to create and manage Gonka accounts, perform inference tasks, upload models, and automate various operations through scripted commands.

    Before creating an account, set up the required environment variables:
    
    ```bash
    export ACCOUNT_NAME=<your-desired-account-name>
    export NODE_URL=<http://random-node-url>
    ```
    
    - Replace `<your-desired-account-name>` with your chosen account name.
    
    ??? note "Things to know about account names"
        This name is not recorded on-chain — it exists only in your local key store.
        Uniqueness is local: creating two keys with the same name will overwrite the existing one (with a CLI warning). If you proceed, the original key will be permanently lost. It is highly recommended to back up your public and private keys before performing this operation.
    
    - Replace `<http://random-node-url>` with a random Node URL. You can either:
        - Use one of the **genesis nodes** from the list below.
        - Fetch the **current list of active participants** and select a random node.
    
    Do not forget to write it down, you will need it in the next step.
    
    ??? note "Why a random node?"
        To avoid over-reliance on the genesis node and encourage decentralization, Gonka recommends selecting a random active node from the current epoch. This improves network load distribution and resilience to node outages.
    
    ??? note "How to choose a Node URL?"
        You can choose any node randomly — you **do not** need to consider which model it runs. At this point, the node is used purely as a gateway to fetch network state and broadcast transactions. All nodes expose the same public API.
    
    === "Genesis nodes"
        Set the `NODE_URL` to one of the genesis nodes:
        ```bash title="Genesis Node List"
        http://185.216.21.98:8000
        http://36.189.234.197:18026
        http://36.189.234.237:17241
        http://node1.gonka.ai:8000
        http://node2.gonka.ai:8000
        http://node3.gonka.ai:8000
        http://47.236.26.199:8000
        http://47.236.19.22:18000
        http://gonka.spv.re:8000
        ```
        
    === "Current list of active participants"
        Alternatively, you can select a random active participant from the current epoch. Open the link or run the following command to fetch the list of active participants along with a cryptographic proof for verification:
        === "Link"
            [http://node2.gonka.ai:8000/v1/epochs/current/participants](http://node2.gonka.ai:8000/v1/epochs/current/participants)
    
        === "Command"
            ```bash
            curl http://node2.gonka.ai:8000/v1/epochs/current/participants
            ```
        
    Create an account
        
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
        
    This command will:
        
    - Generate a keypair
    - Save it to `~/.inference`
    - Return your account address, public key, and mnemonic phrase (store it securely in a hard copy as well!)
    
    ```bash
    - address: <your-account-address>
      name: ACCOUNT_NAME
      pubkey: '{"@type":"...","key":"..."}'
      type: local
    ```
            
    You will use this account address to receive payments. This is your public address, and it is safe to share.
            
    To access your Gonka private key, export your private key and store it securely. The command below outputs a plain-text private key. A private key is a secret code that gives full access to your wallet and the funds inside it. It is used to confirm (sign) transactions and prove that you are the owner of the wallet.
        
    - Whoever has the private key controls the wallet.
    - If you lose it, you lose access.
    - If someone else gets it, they can take your funds.

    So the private key must always be stored securely and never shared with anyone.
        
    ```bash
    ./inferenced keys export $ACCOUNT_NAME --unarmored-hex --unsafe
    ```
        
    To retrieve a list of all locally stored accounts, execute the following command:
    ```
     inferenced keys list [--keyring-backend test]
    ```

    Now you can add your Gonka account to wallets like Keplr or Leap by importing it using your public and private keys.
