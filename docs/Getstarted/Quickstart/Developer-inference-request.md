**Developer instruction (inference consumer)**

**Prerequisites**

1. Install `inferenced` app (In this instruction I propose to use our docker image)
2. Create `$HOME/.inference` folder (we'll be storing the keys there)
3. Create `$HOME/inference-requests` folder. Inside you can place your requests. See the attached example: `request_payload.json`
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
2. Send a signed inference request
```
inferenced signature send-request --account-address <account-address> --node-address http://34.72.225.168:8080 --file /root/inference-requests/request_payload.json
```

!!!
Note: in step 1 you provide account name and you'll obtain an account address to be used in step 2 (address starts with cosmos...). I will later make it so you can use account name for step 2 as well 
