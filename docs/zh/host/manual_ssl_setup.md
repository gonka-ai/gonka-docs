# 手动 SSL 设置说明

本指南介绍如何使用 `Let's Encrypt`（通过 Docker 化的 Certbot）手动颁发和配置 SSL 证书，并更新代理配置。

1. 导航到项目目录：
    ```
    cd gonka/deploy/join/
    ```

2. 切换到具有更新代理配置的分支：
    ```
    git fetch origin gl/service-proxy-ssl
    git switch -c gl/service-proxy-ssl --track origin/gl/service-proxy-ssl
    ```

3. 生成 SSL 证书。在一次性 Docker 容器中使用 Certbot 通过 `Let's Encrypt` 颁发证书：

    ```bash
    DOMAIN=<FULL_DOMAIN_NAME> # 如 gonka.productscience.ai
    ACCOUNT_EMAIL=<EMAIL_ADDRESS> # 用于在证书即将过期时接收通知
    mkdir -p secrets/nginx-ssl secrets/certbot
    docker run --rm -it \
      -v "$(pwd)/secrets/certbot:/etc/letsencrypt" \
      -v "$(pwd)/secrets/nginx-ssl:/mnt/nginx-ssl" \
      certbot/certbot certonly --manual --preferred-challenges dns \
      -d "$DOMAIN" --email "$ACCOUNT_EMAIL" --agree-tos --no-eff-email \
      --deploy-hook 'install -m 0644 "$RENEWED_LINEAGE/fullchain.pem" /mnt/nginx-ssl/cert.pem; install -m 0600 "$RENEWED_LINEAGE/privkey.pem" /mnt/nginx-ssl/private.key'
    ```

    当你运行 Certbot 命令时，容器将暂停并显示一个 TXT DNS 记录，你必须手动在你的 DNS 提供商处创建。这是域所有权验证所必需的。Certbot 将验证记录，如果成功，将新的 SSL 证书和私钥保存到 `./secrets/nginx-ssl/` 中。

    请查看下面的截图了解应该是什么样子。

    [![手动 SSL 设置提示](/images/manualsslsetup.png)](/images/manualsslsetup.png)

4. 编辑 `config.env` 并添加以下变量：

    ```bash
    export NGINX_MODE="both"
    export API_SSL_PORT="8443" # 用于 SSL 的额外端口
    export SERVER_NAME="gonka.productscience.ai" # 完整域名
    export SSL_CERT_SOURCE="./secrets/nginx-ssl"
    ```

5. 更新并重启代理。加载新的环境变量并使用更新的配置重启代理：

    ```bash
    source config.env && \
    docker compose -f docker-compose.mlnode.yml -f docker-compose.yml pull proxy && \
    docker compose -f docker-compose.mlnode.yml -f docker-compose.yml up -d proxy
    ```

6. 验证 SSL 配置。检查代理是否正在运行并监听 SSL 端口：

    ```bash
    docker compose -f docker-compose.mlnode.yml -f docker-compose.yml logs proxy
    ```

    你应该看到类似这样的输出：
    ```
    nginx: [notice] 1#1: using the "epoll" event method
    nginx: [notice] 1#1: nginx/1.25.3
    nginx: [notice] 1#1: OS: Linux 6.1.0-1022-azure
    nginx: [notice] 1#1: getrlimit(RLIMIT_NOFILE): 1048576:1048576
    nginx: [notice] 1#1: start worker processes
    nginx: [notice] 1#1: start worker process 7
    nginx: [notice] 1#1: start worker process 8
    ```

7. 测试 SSL 连接。使用 curl 测试 HTTPS 端点：

    ```bash
    curl -k https://gonka.productscience.ai:8443/v1/status
    ```

    如果一切正常，你应该收到一个 JSON 响应，表明 API 正在运行。

## 故障排除

如果遇到问题，请检查：

- DNS 记录是否正确设置
- 防火墙是否允许端口 8443
- 证书文件是否存在于 `./secrets/nginx-ssl/` 中
- 代理容器是否正在运行

## 证书续期

Let's Encrypt 证书每 90 天过期一次。要续期，请运行：

```bash
docker run --rm -it \
  -v "$(pwd)/secrets/certbot:/etc/letsencrypt" \
  -v "$(pwd)/secrets/nginx-ssl:/mnt/nginx-ssl" \
  certbot/certbot renew --deploy-hook 'install -m 0644 "$RENEWED_LINEAGE/fullchain.pem" /mnt/nginx-ssl/cert.pem; install -m 0600 "$RENEWED_LINEAGE/privkey.pem" /mnt/nginx-ssl/private.key'
```

然后重启代理以加载新证书。
