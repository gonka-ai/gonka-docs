#Developer instruction (inference consumer)
##Prerequisites**

1. Install `inferenced` app
2. Create `$HOME/.inference` folder (The keys will be stored there.)
3. Create `$HOME/inference-requests` folder. Inside, you can place your requests. See the example below.

=== "request_payload.json"
    ```
    {
      "temperature" : 0.8,
      "model" : "unsloth/llama-3-8b-Instruct",
      "messages": [{
          "role": "system",
          "content": "Regardless of the language of the question, answer in english"
        },
        {
            "role": "user",
            "content": "When did Hawaii become a state?."
        }
      ],
      "stream": true
    }
    ```
   
4. Run our docker container in terminal mode to access `inferenced` binary

```
docker run -it --rm \
 -v $HOME/.inference:/root/.inference \
 -v $HOME/inference-requests:/root/inference-requests \
  gcr.io/decentralized-ai/inferenced-join \
  sh
```

**Steps**

1. Create your account
```
inferenced create-client --node-address http://34.72.225.168:8080 <local-account-name>
```

!!! Note
    In step 1, the account name is provided, resulting in an account address (starting with “cosmos…”) that will be used in step 2.
    
2. Send a signed inference request
```
inferenced signature send-request --account-address <account-address> --node-address http://34.72.225.168:8080 --file /root/inference-requests/request_payload.json
```
