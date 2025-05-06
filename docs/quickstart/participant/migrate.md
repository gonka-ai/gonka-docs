# Migration Guide TestNet v0.1.0

Upgrading to **v0.1.0** requires a full node restart.
The script below handles migration of:

1.	**Environment variables** from `config.env`

2. **Configuration file** for the inference node. You might've choosen one of:
    - `node-config.json`
    - `node-config-qwq.json`
    - `node-config-qwq-4x3090.json`
    - `node-config-qwq-8x3090.json`

!!! note
    If you previously edited your config file by hand, make the same edits in the new file after the upgrade.


## Update

### 1. Navigate to your deployment directory

You should already have cloned `pivot-deploy` and deployed from `pivot-deploy/join`:

```
cd pivot-deploy/join
```

### 2. Verify your auth tokens

Make sure your **GitHub repository** token and **GHCR registry** token still work.
If either token has expired, follow the steps in Quickstart to refresh them.


### 3. Download the `update.sh`
```
curl -fsSL https://raw.githubusercontent.com/product-science/race-releases/main/update.sh -o update.sh
```

!!! note
    The script assumes you can run docker without sudo.
    If you normally run `sudo docker ...`, open `update.sh` and add sudo where needed.

    Full script:
    ```
    #!/usr/bin/env sh
    set -eu
    (set -o 2>/dev/null | grep -q pipefail) && set -o pipefail

    retry() {
    max="$1"; shift
    i=1
    while [ "$i" -le "$max" ]; do
        "$@" && return 0
        echo "[warn] attempt $i/$max failed" >&2
        sleep "$i"
        i=$((i + 1))
    done
    return 1
    }

    VER=0.0.1

    docker compose -f docker-compose.yml down
    docker volume rm join_tmkms_data 2>/dev/null || true
    sudo rm -rf .inference

    [ -e "config.env.backup.$VER" ] || cp config.env "config.env.backup.$VER"
    [ -e "docker-compose.yml.backup.$VER" ] || cp docker-compose.yml "docker-compose.yml.backup.$VER"

    git checkout .
    retry 5 git pull --ff-only

    cp config.env.template config.env
    sh ./migrate-env.sh "config.env.backup.$VER" config.env "docker-compose.yml.backup.$VER"

    retry 5 docker compose -f docker-compose.yml pull

    . ./config.env
    docker compose -f docker-compose.yml up -d
    docker compose -f docker-compose.yml logs -f
    ```


### 3. Run the upgrade

```
sh update.sh
```

The script will:
1.	Stop and remove the old containers
2.	Migrate your configs
3.	Launch the updated containers
