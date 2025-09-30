# Manual SSL Setup Instructions

This guide explains how to manually issue and configure SSL certificates with `Let’s Encrypt` (via Dockerized Certbot) and update the proxy configuration.

1. Navigate to the project directory:
  ```
  cd gonka/deploy/join/
  ```

2. Switch to the branch with the updated proxy configuration:
  ```
  git fetch origin gl/service-proxy-ssl
  git switch -c gl/service-proxy-ssl --track origin/gl/service-proxy-ssl
  ```

3. Generate SSL certificates. Use Certbot inside a disposable Docker container to issue certificates using `Let's Encrypt`:
  ```
  DOMAIN=<FULL_DOMAIN_NAME> // like gonka.productscience.ai
  ACCOUNT_EMAIL=<EMAIL_ADDRESS> // to receive notification when certificate is close to expiring
  mkdir -p secrets/nginx-ssl secrets/certbot
  docker run --rm -it \
    -v "$(pwd)/secrets/certbot:/etc/letsencrypt" \
    -v "$(pwd)/secrets/nginx-ssl:/mnt/nginx-ssl" \
    certbot/certbot certonly --manual --preferred-challenges dns \
    -d "$DOMAIN" --email "$ACCOUNT_EMAIL" --agree-tos --no-eff-email \
    --deploy-hook 'install -m 0644 "$RENEWED_LINEAGE/fullchain.pem" /mnt/nginx-ssl/cert.pem; install -m 0600 "$RENEWED_LINEAGE/privkey.pem" /mnt/nginx-ssl/private.key'
  ```
  See the screenshot below for how it should look.

        [![See the screenshot below for how it should look.](/images/manualsslsetup.png)](/images/manualsslsetup.png)

4. Edit `config.env` and add the following variables:
  ```
  export NGINX_MODE="both"
  export API_SSL_PORT="8443" // ADDITIONAL PORT TO USE FOR SSL
  export SERVER_NAME="gonka.productscience.ai" // FULL DOMAIN NAME
  export SSL_CERT_SOURCE="./secrets/nginx-ssl"
  ```

5. Update and restart the proxy. Load the new environment variables and restart the proxy with the updated configuration:
  ```
  source config.env && \
  docker compose -f docker-compose.mlnode.yml -f docker-compose.yml pull proxy && \
  docker compose -f docker-compose.mlnode.yml -f docker-compose.yml up -d --no-deps proxy
  ```
