# 高可用 devshard 主机设置

由多个 `versiond` 实例支持的始终可用的 Devshard 推理服务。

## 目录

- [为什么这很重要](#why-this-matters)
- [发布与镜像](#release-and-images)
- [前提条件](#prerequisites)
- [安装新主机](#install-a-new-host)
- [升级现有主机](#upgrade-an-existing-host)
- [添加远程副本](#add-a-remote-replica)
- [添加本地副本](#add-a-local-replica)
- [操作部署](#operate-the-deployment)
- [故障排除](#troubleshooting)

## 为什么这很重要

单个 `versiond` 进程是一个单点故障（SPOF）：如果该机器或容器宕机，网关将无法通过该协议版本访问您的主机。

在路由器集群后运行多个 `versiond` 实例，并共享 PostgreSQL。如果一个实例失败，路由器会将请求发送到其余实例。

```text
Public proxy (/devshard/...)
        │
        ▼
 versiond-router fleet
        │
        ├── versiond  ──► devshardd ──┐
        ├── versiond2 ──► devshardd ──┤
        ├── versiond3 ──► devshardd ──┼── shared PostgreSQL
        │       ⋮                    │
        └── versiondN ──► devshardd ──┘
```

## 发布与镜像

本指南涵盖 [Devshard v5.0.1](https://github.com/gonka-ai/gonka/releases/tag/devshard%2Fv5.0.1)。

编辑 `deploy/join/config.env`。将以下变量设置为所示值。

```bash
export VERSIOND_IMAGE=ghcr.io/gonka-ai/versiond:0.2.15-devshard-v5
export VERSIOND_ROUTER_IMAGE=ghcr.io/gonka-ai/versiond-router:0.2.15-devshard-v5
export PROXY_ROUTER_IMAGE=ghcr.io/gonka-ai/proxy-router:0.2.15-devshard-v5
export PROXY_POLICY_IMAGE=ghcr.io/gonka-ai/proxy:0.2.15-devshard-v5
export ORACLE_FILTER_IMAGE=python:3.12-alpine
export DEVSHARD_POSTGRES_IMAGE=postgres:16-alpine
```

## 前提条件

1. 主机上已正常运行的 `node` + `api` (dapi) + `proxy`（标准加入部署）。
2. 使用来自[同一发布版本](#release-and-images)的加入文件和主机/网关镜像。
3. 每个 HA `versiond` 副本使用相同的参与者身份：
   - 相同的 `KEY_NAME` 和密钥环。
   - 相同的 `ACCOUNT_PUBKEY`。
4. 共享 PostgreSQL；每个副本使用独立的数据目录。不要用相同的密钥启动第二个 dapi。
5. Docker Compose **2.24.4+**、Bash、Python 3、Git、`tar`、`curl`、`jq`、`flock`、`sha256sum`、`timeout`、`xargs`。远程主机还需 `ssh`、`psql` 以及来自**主主机**到**副本主机**的 SSH 访问权限。

本地 HA 要求协议 v4 或更高版本。滚动更新和远程副本要求所有服务协议为 v5 或更高版本。此处不涵盖从 v4 之前协议的迁移。

## 安装新主机

### 步骤 1：安装 PostgreSQL（最好本身也具备高可用性）

HA `versiond` 消除了对单个**应用**服务器的依赖，但如果 PostgreSQL 是单个虚拟机，**PostgreSQL 将成为您的新 SPOF**。建议使用托管或复制的数据库。

#### 选择数据库

**托管 PostgreSQL（推荐）。** 选择高可用配置并创建数据库和用户。

**自托管 PostgreSQL。** 在专用主机或集群上安装 PostgreSQL，创建角色/数据库，并配置数据库高可用的复制和故障转移。

对于托管或自托管 PostgreSQL，请获取主端点、端口、数据库、用户和密码。允许来自每个副本的连接，并配置 [§2.2](#22-external-or-managed-postgresql)。

**本地 Compose PostgreSQL。** `docker-compose.versiond.yml` 在加入主机上启动 `devshard-postgres`。如果机器宕机，数据库也随之宕机。

#### 配置 PostgreSQL 凭据

在 `deploy/join` 中运行以下命令，将 PostgreSQL 密码保存到 `config.env`。对于新的本地数据库，请选择一个密码；对于现有数据库，请输入其当前密码：

```bash
(
  set -euo pipefail
  read -r -s -p 'PostgreSQL password: ' DEVSHARD_POSTGRES_PASSWORD
  printf '\n'
  [[ -n "$DEVSHARD_POSTGRES_PASSWORD" ]] || exit 1
  DEVSHARD_POSTGRES_PASSWORD="$DEVSHARD_POSTGRES_PASSWORD" python3 <<'PYTHON'
import os, pathlib, re, shlex
path = pathlib.Path("config.env")
name = "DEVSHARD_POSTGRES_PASSWORD"
lines = path.read_text().splitlines()
lines = [line for line in lines if not re.match(r"^\s*(?:export\s+)?" + name + r"\s*=", line)]
lines.append("export " + name + "=" + shlex.quote(os.environ[name]))
path.chmod(0o600)
path.write_text("\n".join(lines) + "\n")
PYTHON
)
```

数据库和用户默认为 `devshardd`；可通过 `DEVSHARD_POSTGRES_DB` 和 `DEVSHARD_POSTGRES_USER` 覆盖。

本地数据路径：`${DEVSHARD_POSTGRES_DATA_DIR:-./devshards/postgres}/data`。对于外部 PostgreSQL，请完成 [§2.2](#22-external-or-managed-postgresql)。

#### 准备 PostgreSQL 目录

仅本地 Compose PostgreSQL。在首次启动或迁移前，在 `deploy/join` 中运行，以通过 Docker 创建数据目录。PostgreSQL 入口脚本在启动时设置其所有者：

```bash
source ./config.env
pg_dir="${DEVSHARD_POSTGRES_DATA_DIR:-./devshards/postgres}"
[[ "$pg_dir" = /* ]] || pg_dir="$PWD/$pg_dir"
docker run --rm --network none --read-only \
  --security-opt label=disable \
  --volume "$pg_dir:/target:ro" \
  --entrypoint /bin/true \
  "$DEVSHARD_POSTGRES_IMAGE"
```

如果命令失败，请停止并检查目录权限：

```bash
ls -ld -- "$(dirname "$pg_dir")" "$pg_dir"
```

请勿手动更改数据库所有者。

### 步骤 2：运行多个 `versiond` 实例 + 路由器集群

`deploy/join` 中的基础安装文件：

| 文件 | 用途 |
| --- | --- |
| `docker-compose.yml` | 基础加入部署，随发布版本提供 |
| `docker-compose.versiond.yml` | 共享 PostgreSQL 和 HA 副本设置，随发布版本提供 |
| `docker-compose.devshard-v5.override.yml` | 目录过滤器；在下方创建 |
| `docker-compose.devshard-pg-external.override.yml` | 外部数据库设置；仅在 §2.2 中创建 |

#### 2.1 同一台机器，两个副本

**1. 将 HA 设置保存在 `config.env` 中。**

先应用 [发布版本和镜像](#release-and-images)。

列出节点上批准的协议名称：

```bash
curl -fsS http://127.0.0.1:9100/versions | jq -er '.versions[].name'
```

对于此版本，请在 `VERSIOND_VERSIONS` 中使用列出的名称 `v4`、`v4.1`，以及一旦可用的 `v5`。排除预 HA 版本，如 `v3`。更新时保留现有列表；添加时使用 [添加协议](#add-a-protocol)。

在 `config.env` 中编辑这些变量。保留现有的身份和数据库设置。

```bash
# Protocol list for a new host on this release; keep the existing list when updating.
export VERSIOND_VERSIONS="v4 v4.1"
# Deployment settings (retain these across component updates)
export VERSIOND_NON_HA_VERSIONS=""
# Use the same filtered catalog for replicas and both routing tiers.
export VERSIOND_ROUTING_CATALOG_URL=http://oracle-filter:9100/versions
export COMPOSE_FILE=docker-compose.yml:docker-compose.versiond.yml:docker-compose.devshard-v5.override.yml
# Append every additional override used by this deployment, in the same order.
```

保持 `VERSIOND_NON_HA_VERSIONS` 为空。在每次运行时，将所有覆盖项包含在 `COMPOSE_FILE` 中，并保持相同顺序。

**2. 在 `deploy/join` 中创建 `docker-compose.devshard-v5.override.yml`。**

```bash
cat > docker-compose.devshard-v5.override.yml <<'EOF'
services:
  # Shared catalog of selected HA protocols for replicas and routers.
  oracle-filter:
    container_name: oracle-filter
    image: ${ORACLE_FILTER_IMAGE:?set the component images in config.env}
    environment:
      - ORACLE_UPSTREAM=http://api:9100/versions
      - ORACLE_ALLOW=${VERSIOND_VERSIONS:?set the approved HA protocol list}
      - LISTEN_PORT=9100
    command:
      - python
      - -c
      - |
        import json, os, urllib.request
        from http.server import BaseHTTPRequestHandler, HTTPServer
        UP = os.environ["ORACLE_UPSTREAM"]
        ALLOW = set(x.strip() for x in os.environ["ORACLE_ALLOW"].replace(",", " ").split() if x.strip())
        PORT = int(os.environ.get("LISTEN_PORT", "9100"))
        class H(BaseHTTPRequestHandler):
            def do_GET(self):
                if self.path.split("?",1)[0] not in ("/versions", "/"):
                    self.send_response(404); self.end_headers(); return
                with urllib.request.urlopen(UP, timeout=10) as r:
                    data = json.load(r)
                vers = [v for v in data.get("versions", []) if v.get("name") in ALLOW]
                body = json.dumps({"versions": vers}).encode()
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                self.wfile.write(body)
            def log_message(self, *args):
                pass
        HTTPServer(("0.0.0.0", PORT), H).serve_forever()
    depends_on:
      api:
        condition: service_started
    networks:
      default: {}
      versiond-router-back: {}
    restart: always

  versiond:
    environment:
      - VERSIOND_ORACLE_URL=http://oracle-filter:9100/versions
      - VERSIOND_NON_HA_VERSIONS=${VERSIOND_NON_HA_VERSIONS-}
    depends_on:
      oracle-filter:
        condition: service_started
      devshard-postgres:
        condition: service_healthy

  versiond2:
    environment:
      - VERSIOND_ORACLE_URL=http://oracle-filter:9100/versions
      - VERSIOND_NON_HA_VERSIONS=${VERSIOND_NON_HA_VERSIONS-}
    depends_on:
      oracle-filter:
        condition: service_started
      devshard-postgres:
        condition: service_healthy

  # Give every extra replica the same oracle-filter environment and dependencies.

  proxy:
    environment:
      - VERSIOND_NON_HA_VERSIONS=${VERSIOND_NON_HA_VERSIONS-}
      - VERSIOND_ROUTING_CATALOG_URL=${VERSIOND_ROUTING_CATALOG_URL:?set the routing catalog URL}
      - VERSIOND_VERSIONS=${VERSIOND_VERSIONS:?set the approved HA protocol list}
EOF
```

#### 2.2 外部或托管 PostgreSQL

如果使用本地 Compose PostgreSQL，请跳过本节，前往 [步骤 3](#step-3-start-the-deployment)。

直接连接到 PostgreSQL。如果使用连接池（如 PgBouncer），请配置会话池；事务池不受支持。

此部署不支持通过 `PGSSL*` 变量配置 PostgreSQL TLS；仅接受 `PGSSLMODE=disable`。如果您的提供商要求显式 TLS 设置，则本流程不适用。请勿禁用必需的 TLS。

通过提供商创建数据库和角色，或运行：

```sql
CREATE USER devshardd WITH PASSWORD '...';
CREATE DATABASE devshardd OWNER devshardd;
```

允许来自每个副本的访问。按 [配置 PostgreSQL 凭据](#configure-postgresql-credentials) 中所述保存凭据。创建 `docker-compose.devshard-pg-external.override.yml`，包含数据库主机和端口：

```yaml
services:
  devshard-postgres:
    profiles: [local-postgres]  # Leave this profile disabled.

  versiond: &external-postgres
    environment:
      PGHOST: your-managed-pg.example.com
      PGPORT: "5432"
    depends_on: !override
      api:
        condition: service_started
      oracle-filter:
        condition: service_started

  versiond2:
    <<: *external-postgres
```

额外副本：使用 `<<: *external-postgres` 添加服务名称。

在 `config.env` 中设置 `COMPOSE_FILE`，追加任何其他覆盖项：

```bash
export COMPOSE_FILE=docker-compose.yml:docker-compose.versiond.yml:docker-compose.devshard-v5.override.yml:docker-compose.devshard-pg-external.override.yml
```

### 步骤 3：启动部署

在加入主机上运行。首次失败时停止：

```bash
(
  set -euo pipefail
  cd /path/to/gonka/deploy/join
  source ./config.env
  : "${COMPOSE_FILE:?set the complete Compose file list in config.env}"
  ./versiond-router-fleet.sh prepare-networks

  docker compose up -d --wait --wait-timeout 2100

  ./versiond-router-fleet.sh apply
)
```

### 步骤 4：验证是否正常工作

#### 4.1 检查正在运行的服务

在安装或更新后，在加入主机上运行。列出 `replicas` 中的每个本地副本；在远程主机上重复副本检查。

```bash
cd /path/to/gonka/deploy/join
source ./config.env
(
  set -euo pipefail
  : "${VERSIOND_VERSIONS:?set the approved HA protocol list}"
  replicas=(versiond versiond2)

  ./versiond-router-fleet.sh verify-admission
  for replica in "${replicas[@]}"; do
    docker exec "$replica" wget -qO- http://127.0.0.1:8080/readyz
    for version in $VERSIOND_VERSIONS; do
      docker exec "$replica" wget -qO- "http://127.0.0.1:8080/readyz?version=$version"
    done
  done
  for version in $VERSIOND_VERSIONS; do
    ./versiond-router-fleet.sh wait-version "$version"
    curl -fsS "http://127.0.0.1:${API_PORT:-8000}/devshard/$version/healthz"
  done
)
```

所有命令必须成功；就绪和公共健康端点必须返回 HTTP 200。保留提供的 `/readyz` Docker 健康检查。

新的或替换的远程成员：在加入池之前，请通过 [远程数据库检查](#check-the-remote-database)。

#### 4.2 检查路由故障转移

在安装或池更改后，对 `VERSIOND_VERSIONS` 中的每个协议运行。其余副本必须能够处理负载。

1. 在公共代理主机上，请求协议的健康端点：

   ```bash
   source ./config.env
   version='<protocol from VERSIOND_VERSIONS>'
   url="http://127.0.0.1:${API_PORT:-8000}/devshard/$version/healthz"
   curl -sS -D - -o /dev/null "$url"
   ```

   预期返回 HTTP 200。将 `X-Upstream-Addr` 与本地容器或远程端点匹配。包含每个本地副本：

   ```bash
   docker inspect -f '{{.Name}} {{range .NetworkSettings.Networks}}{{.IPAddress}} {{end}}' versiond versiond2
   ```

2. 在主机上停止 `X-Upstream-Addr` 中显示的副本：

   ```bash
   replica='<serving-container>'
   docker stop -t 1800 "$replica"
   ```

3. 在公共代理主机上，重复相同的请求：

   ```bash
   curl -sS -D - -o /dev/null "$url"
   ```

   预期 HTTP 200 和不同的 `X-Upstream-Addr`。

4. 即使检查失败，也要在主机上恢复已停止的副本：

   ```bash
   docker start "$replica"
   ```

   在停止另一个副本之前，先通过[服务检查](#41-check-the-running-services)。

对于常规更新，仅运行第 4.1 节中的服务检查。

## 升级现有主机

滚动更新要求每个服务协议的版本为 v5 或更高。服务较早协议的主机必须使用[带停机时间的更新](#update-with-downtime)。

此升级程序支持使用 PostgreSQL 后端、服务 v4 或更高版本、站点设置在 `config.env` 中、且在 Git 检出中使用独立 Compose 覆盖的主机。v4 之前的协议需要单独的迁移程序。

### 备份 PostgreSQL 和部署文件

在替换发布文件之前，在现有主机的 `deploy/join` 中运行。保持 `versiond` 运行，并保存打印的备份目录。

```bash
(
  set -euo pipefail
  source ./config.env
  mkdir -p backups
  BACKUP_DIR=$(mktemp -d "$PWD/backups/pre-update.XXXXXXXX")
  printf 'Backup directory: %s\n' "$BACKUP_DIR"
  git rev-parse HEAD > "$BACKUP_DIR/previous-commit"
  docker inspect versiond > "$BACKUP_DIR/versiond.json"
  python3 - "$BACKUP_DIR" <<'PYTHON'
import json, os, pathlib, shutil, subprocess, sys
backup = pathlib.Path(sys.argv[1])
container = json.loads((backup / "versiond.json").read_text())[0]
labels = container["Config"]["Labels"]
files = [pathlib.Path("config.env").resolve()]
files += [pathlib.Path(p) for p in labels["com.docker.compose.project.config_files"].split(",")]
if os.environ.get("VERSIOND_POOL_ENDPOINTS_FILE"):
    files.append(pathlib.Path(os.environ["VERSIOND_POOL_ENDPOINTS_FILE"]).resolve())
manifest, local_files = [], []
for src in dict.fromkeys(files):
    if not src.is_file():
        sys.exit(f"Missing deployment file: {src}")
    dst = backup / "files" / str(src).lstrip("/")
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dst)
    manifest.append(str(src))
    tracked = subprocess.run(["git", "ls-files", "--error-unmatch", str(src)],
                             stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL).returncode == 0
    if not tracked or src.name == "config.env" or str(src) == str(pathlib.Path(os.environ.get("VERSIOND_POOL_ENDPOINTS_FILE", "")).resolve()):
        local_files.append(str(src))
(backup / "files.json").write_text(json.dumps(manifest, indent=2))
(backup / "local-files.json").write_text(json.dumps(local_files, indent=2))
env = dict(item.split("=", 1) for item in container["Config"]["Env"])
pg = {k: v for k, v in env.items() if k.startswith("PG") and k != "PG_POOL_MAX_CONNS"}
if not pg.get("PGHOST") or any("\n" in v or "\r" in v for v in pg.values()):
    sys.exit("Expected an existing PostgreSQL-backed versiond")
(backup / "postgres.env").write_text("".join(f"{k}={v}\n" for k, v in pg.items()))
(backup / "project").write_text(labels["com.docker.compose.project"])
PYTHON
  project=$(cat "$BACKUP_DIR/project")
  docker ps -aq --filter "label=com.docker.compose.project=$project" |
    xargs -r docker inspect > "$BACKUP_DIR/containers.json"
  if docker inspect devshard-postgres > "$BACKUP_DIR/postgres.json" 2>/dev/null; then
    [[ $(docker inspect devshard-postgres --format '{{index .Config.Labels "com.docker.compose.project"}}') == "$project" ]]
    docker exec devshard-postgres sh -c \
      'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Atc "SELECT system_identifier FROM pg_control_system();"' \
      > "$BACKUP_DIR/postgres-system-identifier"
  fi
  docker pull postgres:16-alpine
  pg_args=(--rm --network container:versiond --env-file "$BACKUP_DIR/postgres.env")
  pg_major=$(docker run "${pg_args[@]}" postgres:16-alpine \
    psql -XAtw -v ON_ERROR_STOP=1 -c "SELECT current_setting('server_version_num')::int / 10000")
  [[ "$pg_major" =~ ^[1-9][0-9]*$ ]]
  pg_client="postgres:$pg_major-alpine"
  docker pull "$pg_client"
  docker run "${pg_args[@]}" "$pg_client" pg_dump -w -Fc > "$BACKUP_DIR/database.dump"
  docker run -i --rm "$pg_client" pg_restore --list < "$BACKUP_DIR/database.dump" \
    > "$BACKUP_DIR/database.contents"
  test -s "$BACKUP_DIR/database.contents"
  printf '%s\n' "$pg_client" > "$BACKUP_DIR/pg-client"
  echo 'Backup complete.'
)
```

仅在 `Backup complete.` 后继续。备份包含密码；请保密。存档检查不测试完整恢复。

### 准备发布版本

完成[备份](#back-up-postgresql-and-deployment-files)。在 `deploy/join` 中，输入其打印的目录。保留站点设置在 `config.env` 中，并单独保留未跟踪的 Compose 覆盖。

```bash
(
  set -euo pipefail
  read -r -p 'Pre-update backup directory: ' BACKUP_DIR
  test -d "$BACKUP_DIR"
  test -s "$BACKUP_DIR/database.contents"
  test -s "$BACKUP_DIR/previous-commit"
  git diff --binary > "$BACKUP_DIR/tracked.patch"
  git diff --cached --binary > "$BACKUP_DIR/staged.patch"
  git diff --exit-code
  git diff --cached --exit-code
  git fetch https://github.com/gonka-ai/gonka.git refs/tags/devshard/v5.0.1
  git switch --detach FETCH_HEAD
  # Confirm that config.env and the separate site overrides survived unchanged.
  python3 - "$BACKUP_DIR" <<'PYTHON'
import json, pathlib, sys
backup = pathlib.Path(sys.argv[1])
for name in json.loads((backup / "local-files.json").read_text()):
    path = pathlib.Path(name)
    if not path.is_file() or path.read_bytes() != (backup / "files" / name.lstrip("/")).read_bytes():
        sys.exit(f"Local configuration changed: {path}; stop before updating containers")
PYTHON
)
```

如果跟踪的文件有本地修改，此步骤将停止。不涵盖自动合并；保留保存的补丁，不要运行 `git reset --hard`。

应用[发布和镜像](#release-and-images)。站点覆盖必须使用这些镜像变量，而不是硬编码的应用程序镜像。

不要用新安装示例替换 `config.env`。先更新，之后再添加协议。不要将此更新与数据库迁移、PostgreSQL 主版本升级或集群重新配置结合。

<details>
<summary><strong>如果旧的 config.env 没有 VERSIOND_VERSIONS</strong></summary>

读取现有 `versiond` 上运行的协议：

```bash
(
  set -euo pipefail
  versions=$(docker exec versiond /bin/busybox wget -qO- http://127.0.0.1:8080/healthz |
    jq -er 'if length > 0 and all(.[]; .status == "running" and (.name == "v4" or .name == "v4.1" or .name == "v5")) then map(.name) | join(" ") else error("Expected running HA protocols only; stop") end')
  VERSIOND_VERSIONS="$versions" python3 <<'PYTHON'
import os, pathlib, re, shlex
path = pathlib.Path("config.env")
name = "VERSIOND_VERSIONS"
lines = path.read_text().splitlines()
lines = [line for line in lines if not re.match(r"^\s*(?:export\s+)?" + name + r"\s*=", line)]
lines.append("export " + name + "=" + shlex.quote(os.environ[name]))
path.chmod(0o600)
path.write_text("\n".join(lines) + "\n")
PYTHON
)
```

如果任何协议未运行或列表中包含 HA 之前的版本，则停止。

</details>

首次 HA 设置：完成[§2.1](#21-same-machine-two-replicas) 以设置 HA 变量并创建过滤器覆盖；保留当前协议列表。对于外部数据库，还请使用现有数据库完成[§2.2](#22-external-or-managed-postgresql)。然后继续下面步骤；不要运行安装步骤 3–4。

重新加载并验证：

```bash
(
  set -euo pipefail
  cd /path/to/gonka/deploy/join
  source ./config.env
  # Keep every active override in the ordered COMPOSE_FILE saved in config.env.
  : "${COMPOSE_FILE:?set the complete Compose file list in config.env}"
  : "${VERSIOND_VERSIONS:?retain the approved HA protocol list in config.env}"
  docker compose config --quiet
)
```

### 检查数据库布局

外部 PostgreSQL：保持其运行并前往[更新部署](#3-update-the-deployment)。对于本地 PostgreSQL，检查数据目录和挂载：

```bash
docker inspect devshard-postgres --format '{{json .Mounts}}'
docker inspect devshard-postgres --format '{{json .Config.Env}}' |
  jq -r '.[] | select(startswith("PGDATA="))'
```

现有的持久路径 `${DEVSHARD_POSTGRES_DATA_DIR:-./devshards/postgres}/data` 无需复制。位于 `/var/lib/postgresql/data` 的 Docker 卷需要以下过程。

<details>
<summary><strong>一次性从旧 PostgreSQL 卷复制</strong></summary>

适用于一个加入主机，且所有写入者均列在 `replicas` 中。使用发布提供的 PostgreSQL 镜像，针对现有的 PostgreSQL 16 Alpine 集群。先完成[目录准备](#prepare-the-postgresql-directory)。

在 `deploy/join` 中运行：

```bash
(
  set -euo pipefail
  source ./config.env
  : "${COMPOSE_FILE:?set the complete Compose file list}"
  replicas=(versiond versiond2)
  mkdir -p backups
  backup_dir=$(mktemp -d "$PWD/backups/postgres-copy.XXXXXXXX")
  echo "Backup directory: $backup_dir"
  docker inspect devshard-postgres > "$backup_dir/postgres.json"
  source_id=$(docker exec devshard-postgres sh -c \
    'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Atc "SELECT system_identifier FROM pg_control_system();"')
  printf '%s\n' "$source_id" > "$backup_dir/system-identifier"
  bash ./devshard-postgres-migration-preflight.sh \
    --source-container devshard-postgres \
    --target-dir "${DEVSHARD_POSTGRES_DATA_DIR:-./devshards/postgres}"

  ./versiond-router-fleet.sh stop-all --maintenance
  docker stop --time 1800 "${replicas[@]}"
  docker exec devshard-postgres sh -c \
    'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc' > "$backup_dir/database.dump"
  docker exec -i devshard-postgres pg_restore --list < "$backup_dir/database.dump" >/dev/null
  docker stop --time 300 devshard-postgres
  ./versiond-router-fleet.sh prepare-networks
  # The PostgreSQL entrypoint copies the old volume into the persistent directory.
  docker compose up -d --no-deps --wait --wait-timeout 2100 devshard-postgres
  target_id=$(docker exec devshard-postgres sh -c \
    'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Atc "SELECT system_identifier FROM pg_control_system();"')
  [[ -n "$source_id" && "$target_id" == "$source_id" ]]
)
```

失败时，保持副本停止并检查 `docker compose logs --tail=100 devshard-postgres`。保留源卷和备份：不要 `down -v`、`rm -v`、修剪或 `--renew-anon-volumes`。

如果 Compose 在复制继续时停止等待，保持 PostgreSQL 运行。等待此命令报告 `healthy`：

```bash
docker inspect --format '{{.State.Health.Status}}' devshard-postgres
```

然后使用上述打印的备份目录重复标识符检查：

```bash
(
  set -euo pipefail
  backup_dir='<printed-backup-directory>'
  [[ $(docker inspect --format '{{.State.Health.Status}}' devshard-postgres) == healthy ]]
  source_id=$(cat "$backup_dir/system-identifier")
  target_id=$(docker exec devshard-postgres sh -c \
    'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Atc "SELECT system_identifier FROM pg_control_system();"')
  [[ -n "$source_id" && "$target_id" == "$source_id" ]]
  echo 'System identifiers match.'
)
```

成功后，继续[带停机时间的更新](#update-with-downtime)。保持旧副本停止。

<details>
<summary><strong>如果旧卷已分离</strong></summary>

保持所有副本停止。完成[目录准备](#prepare-the-postgresql-directory)，然后进入预更新备份目录：

```bash
(
  set -euo pipefail
  source ./config.env || exit 1
  read -r -p 'Pre-update backup directory: ' BACKUP_DIR
  DEVSHARD_POSTGRES_LEGACY_VOLUME=$(jq -er '[.[0].Mounts[] | select(.Type == "volume" and .Destination == "/var/lib/postgresql/data") | .Name] | if length == 1 then .[0] else error("Expected one old PostgreSQL volume") end' "$BACKUP_DIR/postgres.json")
  export DEVSHARD_POSTGRES_LEGACY_VOLUME
  [[ -n "$DEVSHARD_POSTGRES_LEGACY_VOLUME" ]] || exit 1
  test -s "$BACKUP_DIR/postgres-system-identifier" || exit 1
  # Command-line -f replaces COMPOSE_FILE, so pass the complete list explicitly.
  files=()
  IFS=':' read -ra parts <<<"$COMPOSE_FILE"
  for f in "${parts[@]}"; do files+=(-f "$f"); done
  bash ./devshard-postgres-migration-preflight.sh \
  --source-volume "$DEVSHARD_POSTGRES_LEGACY_VOLUME" \
  --target-dir "${DEVSHARD_POSTGRES_DATA_DIR:-./devshards/postgres}"
  docker compose "${files[@]}" -f docker-compose.versiond-postgres-recovery.yml \
  up -d --no-deps --wait --wait-timeout 2100 devshard-postgres

  # Compare the system identifier with the backup before proceeding.
  source_id=$(cat "$BACKUP_DIR/postgres-system-identifier")
  target_id=$(docker exec devshard-postgres sh -c \
    'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Atc "SELECT system_identifier FROM pg_control_system();"')
  [[ -n "$source_id" && "$target_id" == "$source_id" ]]
  echo 'System identifiers match.'
)
```

在 `System identifiers match.` 后，使用正常的 `COMPOSE_FILE` 继续[带停机时间的更新](#update-with-downtime)，不使用恢复叠加层。保持副本停止；保留源卷和备份。不要启用 `DEVSHARD_POSTGRES_ALLOW_EMPTY_INIT`。

</details>

</details>

### 更新部署

安排维护：替换公共代理可能会中断连接。

滚动更新要求每个服务协议的版本为 v5 或更高。如果任何服务协议早于 v5，请使用下面的停机程序。保持 `UPDATE_SKIP_POSTGRES_PROBE` 和 `UPDATE_ACCEPT_DATABASE_CHANGE` 禁用。

#### 更新带停机时间

对于**一个加入主机**，使用相同的外部数据库或持久路径上的本地 PostgreSQL。如有需要，先复制[旧的本地卷](#2-check-the-database-layout)。保持数据库设置、参与者身份、副本数据挂载和协议不变。此过程不涉及数据库迁移或多主机更新。

在 `deploy/join` 中运行；将每个本地副本包含在 `replicas` 中。备份包含凭据；请保持其目录私密。

```bash
(
  set -euo pipefail
  source ./config.env
  : "${COMPOSE_FILE:?set the complete Compose file list}"
  replicas=(versiond versiond2)
  mkdir -p backups
  backup_dir=$(mktemp -d "$PWD/backups/ha-update.XXXXXXXX")
  echo "Backup directory: $backup_dir"

  # Save the old settings and reject changes to PostgreSQL connections.
  docker inspect "${replicas[@]}" > "$backup_dir/containers.json"
  docker compose config --format json > "$backup_dir/compose.json"
  python3 - "$backup_dir" <<'PYTHON'
import json, sys
from pathlib import Path
path = Path(sys.argv[1])
model = json.loads((path / "compose.json").read_text())
reference = None
for container in json.loads((path / "containers.json").read_text()):
    service = container["Config"]["Labels"]["com.docker.compose.service"]
    old = dict(item.split("=", 1) for item in container["Config"]["Env"])
    new = model["services"][service]["environment"]
    old = {key: value for key, value in old.items() if key.startswith("PG") and key != "PG_POOL_MAX_CONNS"}
    new = {key: value for key, value in new.items() if key.startswith("PG") and key != "PG_POOL_MAX_CONNS"}
    old.setdefault("PGPORT", "5432")
    new.setdefault("PGPORT", "5432")
    if old != new or (reference is not None and old != reference):
        sys.exit(f"{service}: PostgreSQL settings differ; keep the existing connection")
    if model["networks"]["default"]["name"] not in container["NetworkSettings"]["Networks"]:
        sys.exit(f"{service}: deployment network changed; stop")
    reference = old
if not reference or any("\n" in value or "\r" in value for value in reference.values()):
    sys.exit("Cannot export PostgreSQL settings to a Docker env file")
(path / "postgres.env").write_text("".join(f"{key}={value}\n" for key, value in reference.items()))
PYTHON
  pg_network=$(jq -er '.networks.default.name' "$backup_dir/compose.json")
  pg_args=(--rm --network "$pg_network" --env-file "$backup_dir/postgres.env")

  # Select pg_dump for the running server's major version; pull before downtime.
  docker pull postgres:16-alpine
  pg_major=$(docker run "${pg_args[@]}" postgres:16-alpine \
    psql -XAtw -v ON_ERROR_STOP=1 -c "SELECT current_setting('server_version_num')::int / 10000")
  [[ "$pg_major" =~ ^[1-9][0-9]*$ ]]
  pg_client="postgres:$pg_major-alpine"
  docker pull "$pg_client"
  docker compose pull "${replicas[@]}" proxy proxy-policy proxy-policy2

  echo "Starting maintenance"
  ./versiond-router-fleet.sh stop-all --maintenance
  docker compose stop "${replicas[@]}"
  docker run "${pg_args[@]}" "$pg_client" pg_dump -w -Fc > "$backup_dir/database.dump"
  docker run -i --rm "$pg_client" pg_restore --list < "$backup_dir/database.dump" >/dev/null
  ./update-devshard.sh --check

  ./versiond-router-fleet.sh prepare-networks
  if [[ $(jq -r '.services.versiond.environment.PGHOST' "$backup_dir/compose.json") == devshard-postgres ]]; then
    docker compose up -d --no-deps --wait --wait-timeout 2100 devshard-postgres
  fi
  docker compose up -d --no-deps oracle-filter
  docker compose up -d --no-deps --wait --wait-timeout 2100 "${replicas[@]}"
  docker compose up -d --no-deps proxy
  docker compose up -d --no-deps --wait --wait-timeout 2100 proxy-policy2 proxy-policy proxy
  ./versiond-router-fleet.sh apply
  ./versiond-router-fleet.sh verify-admission
  project=$(jq -er '.name | select(length > 0)' "$backup_dir/compose.json")
  if legacy_project=$(docker inspect --format '{{index .Config.Labels "com.docker.compose.project"}}' \
      versiond-router 2>/dev/null); then
    if [[ "$legacy_project" == "$project" ]]; then
      docker rm -f versiond-router
    fi
  fi
)
```

预检检查数据库访问和容量，而非数据库身份。如果镜像下载失败，请仅在未发生数据库副本、容器停止或替换的情况下[取消准备](#cancel-before-maintenance)。

运行[服务检查](#41-check-the-running-services)，然后在此处停止。

#### 滚动更新

每个服务协议均需 v5 或更高版本。保持 PostgreSQL、过滤器、副本和路由器集群运行。

在首次滚动更新前准备过滤器：

```bash
source ./config.env
./versiond-router-fleet.sh prepare-networks
docker compose up -d --no-deps oracle-filter
```

滚动更新要求每个服务协议均为 v5 或更高版本。如果任何服务协议低于 v5，请使用[带停机时间的更新](#update-with-downtime)。如果检查超时、返回 HTTP 503 或无法确认副本使用相同的数据库，请勿继续。

检查每个副本上的每个协议：

```bash
(
  set -euo pipefail
  # Include every local member; repeat on remote hosts.
  (
  set -e
  : "${VERSIOND_VERSIONS:?set the approved HA protocol list}"
  for replica in versiond versiond2; do
    for version in $VERSIOND_VERSIONS; do
      if output=$(docker exec "$replica" /bin/busybox wget -S -O /dev/null -T 5 \
        "http://127.0.0.1:8080/readyz?version=$version" 2>&1); then
        continue
      fi
      case "$output" in
        *"HTTP/"*" 404 "*)
          docker exec "$replica" /bin/busybox wget -qO- -T 5 \
            "http://127.0.0.1:8080/$version/healthz" ;;
        *) printf '%s/%s: %s\n' "$replica" "$version" "$output" >&2; exit 1 ;;
      esac
    done
  done
  )
)
```

每个检查都应返回 HTTP 200。一次更新一个副本；在更新过程中，另一个副本必须持续服务每个协议。

运行预检并预览替换操作。预检会写入数据库探测，但不会替换服务：

```bash
./update-devshard.sh --dry-run
```

审查建议的镜像和变更。若出现目录创建错误，请运行[目录准备](#prepare-the-postgresql-directory)后重试。预检失败时请勿继续。然后运行：

```bash
./update-devshard.sh
```

[逐个替换远程成员](#replace-a-member)，在最终验证前完成。

运行[服务检查](#41-check-the-running-services)。如需启用新协议，请遵循[添加协议](#add-a-protocol)。

## 添加远程副本

此过程要求主机上的每个 `devshardd` 进程均运行 v5 或更高版本的协议。早期协议不支持本过程所需的共享数据库检查。

在机器间使用私有网络。不要使用相同密钥启动第二个 dapi。

新部署：请先在**主主机**上完成[启动](#step-3-start-the-deployment)和[验证](#step-4-verify-it-works)。

| 机器 | 运行 |
| --- | --- |
| **主主机** | 本地 `versiond` 副本 + node/api/proxy + 路由器集群 |
| **副本主机** | 仅 `versiond` |
| 共享 | PostgreSQL 可被每个 `versiond` 实例访问 |

在副本检查通过前，将其排除在路由器池外。

### 准备主主机

在**主主机**上，为**副本主机**在私有网络上发布以下端口：

- PostgreSQL `5432`，或外部数据库端口。
- Node-manager `9400`。
- Chain RPC/gRPC `26657`，`9090`。
- 过滤目录 `19100`。

确认 `PGPASSWORD` 和 `KEYRING_PASSWORD` 与正在运行的本地 `versiond` 容器匹配。

在**主主机**的 `config.env` 中设置 `export GONKA_PRIVATE_BIND_IP=<primary-host-private-ip>`。在 `deploy/join` 中运行：

```bash
cat > docker-compose.devshard-private.override.yml <<'EOF'
services:
  node:
    ports:
      - "${GONKA_PRIVATE_BIND_IP:?set the primary host private IP}:26657:26657"
      - "${GONKA_PRIVATE_BIND_IP:?set the primary host private IP}:9090:9090"
  api:
    ports:
      - "${GONKA_PRIVATE_BIND_IP:?set the primary host private IP}:${NODE_MANAGER_GRPC_PORT:-9400}:${NODE_MANAGER_GRPC_PORT:-9400}"
  devshard-postgres:
    ports:
      - "${GONKA_PRIVATE_BIND_IP:?set the primary host private IP}:5432:5432"
  oracle-filter:
    ports:
      - "${GONKA_PRIVATE_BIND_IP:?set the primary host private IP}:19100:9100"
EOF
```

外部 PostgreSQL：删除 `devshard-postgres` 条目；**副本主机**使用真实端点。将此覆盖追加到**主主机**的 `COMPOSE_FILE`。

新主机：在[启动](#step-3-start-the-deployment)前包含此覆盖。现有主机：

为端口变更安排维护。在**主主机**和每个现有**副本主机**上，在 `deploy/join` 中运行以停止副本：

```bash
source ./config.env &&
mapfile -t replicas < <(docker compose ps --services | grep -E '^versiond[0-9]*$') &&
((${#replicas[@]} > 0)) &&
docker compose stop "${replicas[@]}"
```

在**主主机**上应用端口变更：

```bash
(
  set -e
  source ./config.env
  ./versiond-router-fleet.sh stop-all --maintenance
  if docker compose config --services | grep -qx devshard-postgres; then
    docker compose up -d --no-deps --wait --wait-timeout 2100 devshard-postgres
  fi
  docker compose up -d --no-deps --wait --wait-timeout 2100 node api oracle-filter
)
```

在每台主机上，使用停止副本时相同的 shell 重启副本：

```bash
docker compose up -d --no-deps --wait --wait-timeout 2100 "${replicas[@]}"
```

在**主主机**上恢复集群并运行[服务检查](#41-check-the-running-services)：

```bash
./versiond-router-fleet.sh apply && ./update-devshard.sh --check
```

### 配置并启动副本主机

对于新的**副本主机**，在`deploy/join`中的**主主机**上运行。将**副本主机**的SSH登录信息输入为`user@host`。**副本主机**上的检出目录将创建在`~/gonka`，并使用**主主机**的提交版本。

```bash
(
  set -euo pipefail
  source ./config.env
  read -r -p 'SSH login for the replica host (user@host): ' REPLICA_SSH
  [[ "${KEYRING_BACKEND:-file}" == file ]] || { echo "This copy procedure requires a file keyring"; exit 1; }
  ssh "$REPLICA_SSH" 'test ! -e "$HOME/gonka"'
  ssh "$REPLICA_SSH" 'git clone --no-checkout https://github.com/gonka-ai/gonka.git "$HOME/gonka"'
  release_commit=$(git rev-parse HEAD)
  ssh "$REPLICA_SSH" "git -C \"\$HOME/gonka\" checkout --detach $release_commit"
  remote_env=$(mktemp)
  trap 'rm -f "$remote_env"' EXIT
  python3 > "$remote_env" <<'PYTHON'
import os, shlex
names = ["KEY_NAME", "ACCOUNT_PUBKEY", "KEYRING_PASSWORD", "VERSIOND_VERSIONS",
         "DEVSHARD_POSTGRES_PASSWORD"]
for name in names:
    value = os.environ[name]
    if not value:
        raise SystemExit(f"Missing {name}")
    print(f"export {name}={shlex.quote(value)}")
for name, default in [("KEYRING_BACKEND", "file"), ("DEVSHARD_POSTGRES_DB", "devshardd"),
                      ("DEVSHARD_POSTGRES_USER", "devshardd")]:
    print(f"export {name}={shlex.quote(os.environ.get(name, default))}")
print('export VERSIOND_NON_HA_VERSIONS=""')
if os.environ.get("VERSIOND_IMAGE"):
    print("export VERSIOND_IMAGE=" + shlex.quote(os.environ["VERSIOND_IMAGE"]))
PYTHON
  ssh "$REPLICA_SSH" 'touch "$HOME/gonka/deploy/join/config.env" && chmod 600 "$HOME/gonka/deploy/join/config.env" && cat > "$HOME/gonka/deploy/join/config.env"' < "$remote_env"
  docker exec versiond /bin/busybox tar -C /root/.inference -cf - keyring-file |
    ssh "$REPLICA_SSH" 'mkdir -p "$HOME/gonka/deploy/join/.inference"; tar --no-same-owner -xf - -C "$HOME/gonka/deploy/join/.inference"'
)
```

在**副本主机**上运行`cd ~/gonka/deploy/join`。对于现有的**副本主机**，请使用[替换成员](#replace-a-member)。

将以下内容添加到**副本主机**的`config.env`中，并使用真实的私有地址：

```bash
export NETWORK_NODE_PRIVATE_IP='<primary-host-private-ip>'
export VERSIOND_BIND_IP='<replica-host-private-ip>'
export COMPOSE_FILE=docker-compose.versiond-remote.yml:docker-compose.versiond-remote-filter.yml
```

外部PostgreSQL：还需设置`DEVSHARD_POSTGRES_HOST`和`DEVSHARD_POSTGRES_PORT`。将**副本主机**的8080端口限制为仅允许路由器访问。

在**副本主机**的`deploy/join`中创建过滤器覆盖：

```bash
cat > docker-compose.versiond-remote-filter.yml <<'EOF'
services:
  versiond:
    environment:
      VERSIOND_ORACLE_URL: http://${NETWORK_NODE_PRIVATE_IP:?set the primary host private IP}:19100/versions
EOF
```

启动远程副本并检查每个选定协议：

```bash
source ./config.env
docker compose up -d --wait --wait-timeout 2100
(
  set -e
  : "${VERSIOND_VERSIONS:?set the approved HA protocol list}"
  for version in $VERSIOND_VERSIONS; do
    curl -fsS "http://${VERSIOND_BIND_IP}:8080/readyz?version=$version"
  done
)
```

当容器健康且所有检查均返回HTTP 200时，继续。

### 检查远程数据库

在将副本添加到路由器池之前，检查**副本主机**的数据库。在**副本主机**上运行以下两个模块；将`/path/to/gonka`替换为其检出目录（对于上述创建的主机，使用`~/gonka`）：

```bash
(
  set -euo pipefail
  cd /path/to/gonka/deploy/join
  command -v psql
  test ! -e pool-postgres.env || exit 1
  cp pool-postgres.env.template pool-postgres.env
  chmod 600 pool-postgres.env
)
```

使用**主主机**的数据库设置或数据库管理员提供的值，填写检出目录中`deploy/join/pool-postgres.env`的`PGHOST`、`PGPORT`、`PGDATABASE`、`PGUSER`和`PGPASSWORD`。运行：

```bash
(
  set -euo pipefail
  cd /path/to/gonka/deploy/join
  ./update-devshard.sh --check-storage --reference-env ./pool-postgres.env
)
```

预期`Storage check passed`和退出码0。该检查会向数据库写入测试数据；请将其与其他检查和更新分开运行。对于其他容器，请重复`--container NAME`。

### 将副本添加到路由器池

在**主主机**上，在`deploy/join`中创建`versiond-endpoints.json`。将`10.0.0.12`替换为**副本主机**的私有IP，并包含所有副本。所有路由器都必须能够连接到这些地址：

```bash
cat > versiond-endpoints.json <<'EOF'
[
  {"id": "local-a", "host": "versiond", "port": 8080},
  {"id": "local-a-2", "host": "versiond2", "port": 8080},
  {"id": "remote-b", "host": "10.0.0.12", "port": 8080}
]
EOF
```

在**主主机**的`config.env`中设置`export VERSIOND_POOL_ENDPOINTS_FILE=./versiond-endpoints.json`；`source ./config.env`。新集群：运行`./versiond-router-fleet.sh apply`。现有集群：在维护期间运行：

```bash
VERSIOND_ROUTER_ALLOW_MAINTENANCE_OUTAGE=true \
  ./versiond-router-fleet.sh maintenance-rollout
./versiond-router-fleet.sh verify-admission
```

滚动更新会中断新请求。在相同端点上替换主机时，请保留成员ID。端点文件的更改仅通过滚动更新生效。

添加副本后，运行[服务检查](#41-check-the-running-services)和[路由故障转移检查](#42-check-routing-failover)。

## 添加本地副本

在[启动和验证](#step-3-start-the-deployment)之后，添加`versiond3`：

1. 在`config.env`中，将`docker-compose.versiond3.yml`插入`COMPOSE_FILE`中`docker-compose.versiond.yml`之后。在其后保留过滤器、数据库和站点覆盖：

   ```bash
   export COMPOSE_FILE=docker-compose.yml:docker-compose.versiond.yml:docker-compose.versiond3.yml:docker-compose.devshard-v5.override.yml
   # External PostgreSQL: append :docker-compose.devshard-pg-external.override.yml
   # Retain every other site override after these files.
   ```

2. 在`docker-compose.devshard-v5.override.yml`的`services`下添加：

   ```yaml
   versiond3:
     environment:
       VERSIOND_ORACLE_URL: http://oracle-filter:9100/versions
       VERSIOND_NON_HA_VERSIONS: ${VERSIOND_NON_HA_VERSIONS-}
     depends_on:
       oracle-filter:
         condition: service_started
       devshard-postgres:
         condition: service_healthy
   ```

   外部PostgreSQL：还在`docker-compose.devshard-pg-external.override.yml`的`services`下，现有锚点下方添加：

   ```yaml
   versiond3:
     <<: *external-postgres
   ```

3. 本地PostgreSQL：为现有副本运行[带停机时间的更新](#update-with-downtime)以应用新的PostgreSQL挂载。外部数据库跳过此步骤。
4. 启动新的副本：

   ```bash
   source ./config.env
   docker compose config --quiet
   docker compose pull versiond3
   docker compose up -d --no-deps --wait --wait-timeout 2100 versiond3
   ```

5. 如果使用`versiond-endpoints.json`，请添加`versiond3`并[应用更新后的列表](#3-add-the-replica-to-the-router-pool)。默认的Docker发现会自动识别它。运行[服务检查](#41-check-the-running-services)，包括`versiond3`。

对于第四个副本，复制`docker-compose.versiond3.yml`，将`3`替换为`4`，并重复上述覆盖设置。

## 操作部署

每个`versiond`副本都是路由器池的成员。

从`deploy/join`运行以下命令。在公共代理主机上管理路由器，在运行副本的主机上管理`versiond`副本。

### 管理路由器

使用`versiond-router-fleet.sh`管理路由器。该脚本读取`config.env`并在单独的Docker Compose项目中运行每个路由器。因此，为主要联合部署运行`docker compose down`会保持路由器运行。

要停止所有路由器，请运行`./versiond-router-fleet.sh stop-all --maintenance`。默认关闭超时时间为每个路由器30分钟（`VERSIOND_ROUTER_DRAIN_TIMEOUT_SECONDS`）。

每个路由器实例占用一个编号的**插槽**。当其容器被替换时，插槽编号保持不变。在集群命令中使用此编号：

| 任务 | 命令 |
| --- | --- |
| 查看路由器状态和插槽编号 | `./versiond-router-fleet.sh status` |
| 停止插槽0中的路由器 | `./versiond-router-fleet.sh stop 0` |
| 启动插槽0中的路由器 | `./versiond-router-fleet.sh start 0` |
| 更改后验证路由 | `./versiond-router-fleet.sh verify-admission` |
| 应用路由器镜像和配置更改 | `./versiond-router-fleet.sh apply` |

完整发布更新：请遵循[更新部署](#3-update-the-deployment)。

操作中断后，保留之前已停止的容器和目录卷；使用相同的镜像和配置重新运行。对于池、解析器或传统路由的更改，请遵循[成员维护](#3-add-the-replica-to-the-router-pool)。

在机器维护前，优雅地停止路由器，然后停止主栈：

```bash
(
  set -euo pipefail
  ./versiond-router-fleet.sh stop-all --maintenance
  # Stop the main stack after the fleet has drained.
  source ./config.env || exit 1
  : "${COMPOSE_FILE:?set the complete Compose file list}"
  docker compose stop
  # Only when decommissioning, after the main stack is down:
  # ./versiond-router-fleet.sh down --maintenance
)
```

### 重启一个成员

一次重启一个副本。其余副本必须服务所有协议并处理负载。在 `COMPOSE_FILE` 中包含每个活动的覆盖项：

```bash
(
  set -euo pipefail
  cd /path/to/gonka/deploy/join
  source ./config.env
  # COMPOSE_FILE must include every active override, including external PG,
  # private ports and additional replicas; keep this list in config.env.
  : "${COMPOSE_FILE:?set the complete Compose file list in config.env}"
  dc=(docker compose)

  # Stop only one member, keeping enough other replicas ready to handle the load.
  "${dc[@]}" stop versiond2
  # Restart the same member with its existing data:
  "${dc[@]}" up -d --no-deps --wait --wait-timeout 2100 versiond2
  (
  set -e
  : "${VERSIOND_VERSIONS:?set the approved HA protocol list}"
  for version in $VERSIOND_VERSIONS; do
    docker exec versiond2 wget -qO- "http://127.0.0.1:8080/readyz?version=$version"
  done
  )
)
```

在重启另一个副本前，先运行上述就绪检查。

### 替换一个成员

要更新副本的镜像，请使用以下流程替换其容器。

保留相同的数据库、参与者身份、协议列表和数据挂载。一次替换一个副本；另一个副本必须服务每个协议。

1. 在运行副本的主机上，在其现有的 `deploy/join` 目录中运行，以获取并检出发布版本：

   ```bash
   (
     set -euo pipefail
     git diff --exit-code
     git diff --cached --exit-code
     git fetch https://github.com/gonka-ai/gonka.git refs/tags/devshard/v5.0.1
     git switch --detach FETCH_HEAD
   )
   ```

   如果 Git 报告本地更改或冲突文件，请停止；不要强制检出。将 `config.env` 和站点覆盖项保存在独立的未跟踪文件中。检出成功后，应用 [发布和镜像](#release-and-images) 中的变量。
2. 对于远程成员，请在**主主机**上从 `versiond-endpoints.json` 中删除其条目，并运行 [成员维护](#3-add-the-replica-to-the-router-pool)。在成员机器上，在 `deploy/join` 中运行以选择并替换副本：

   ```bash
   (
     set -euo pipefail
     source ./config.env
     docker compose ps --services
     read -r -p 'Replica service from the list (for example versiond2): ' service
     [[ "$service" =~ ^versiond[0-9]*$ ]] || exit 1
     docker compose stop "$service"
     docker compose pull "$service" &&
     docker compose up -d --no-deps --wait --wait-timeout 2100 "$service"
   )
   ```

   对于远程成员，在恢复其在**主主机**端点文件中的条目并应用成员维护前，请先通过[数据库检查](#check-the-remote-database)。
3. 在替换下一个成员前，请通过[服务检查](#41-check-the-running-services)。如果检查失败，请在替换另一个成员前停止。回滚镜像不会回滚数据库更改；任何回滚版本都必须支持当前数据库。

### 移除一个成员

在副本的主机上，在 `deploy/join` 中运行：

```bash
(
  set -euo pipefail
  source ./config.env
  docker compose ps --services
  read -r -p 'Replica service to remove (for example versiond2): ' service
  [[ "$service" =~ ^versiond[0-9]*$ ]] || exit 1
  docker compose stop "$service" && docker compose rm -f "$service"
)
```

编辑 `config.env`。要禁用 `versiond2`，请设置：

```bash
export VERSIOND2_REPLICAS=0
```

对于额外的副本，从 `COMPOSE_FILE` 中删除其 Compose 文件名，并从过滤器/数据库覆盖中删除其服务块。保留其数据目录。如果使用 `versiond-endpoints.json`，请在**主主机**上删除其条目并运行 [成员维护](#3-add-the-replica-to-the-router-pool)。对剩余副本运行[服务检查](#41-check-the-running-services)。

### 添加协议

1. 检查主机/网关版本的[发布二进制兼容性要求](https://github.com/gonka-ai/gonka/blob/devshard/v5.0.1/devshard/docs/release-0.2.15-v5.md#binary-upgrade-compatibility)。一旦其出现在节点的[批准协议列表](#21-same-machine-two-replicas)中，请在每个主机的 `config.env` 中的 `VERSIOND_VERSIONS` 中添加它。保留现有协议。
2. 在**主主机**上：`source ./config.env`，然后使用完整的 `COMPOSE_FILE` 运行 `docker compose up -d --no-deps oracle-filter`。
3. `./versiond-router-fleet.sh wait-version <new-protocol>`，然后使用更新后的列表运行[服务检查](#41-check-the-running-services)。

无需重启路由器。下一次主机更新会将保存的协议列表应用到路由器集群和公共代理；将其安排为维护任务。

为每个路由器插槽保留 `proxy-router-state` 和 `router-state` 卷。仅在维护期间、且其会话不再需要时才移除协议：过滤器更改可停止子进程，而接受的路由器路由默认保持不变。

## 故障排除

### 维护前取消

仅在准备失败**且未执行任何数据库复制、容器停止或容器替换**时使用。数据库复制流程在 `Starting maintenance` 之前运行，因此仅凭缺少该消息是不够的。此操作仅恢复文件。在 `deploy/join` 中运行；使用预更新备份打印的 `Backup directory`：

```bash
read -r -p 'Pre-update backup directory: ' BACKUP_DIR
export BACKUP_DIR
(
  set -euo pipefail
  test -s "$BACKUP_DIR/previous-commit"
  git switch --detach "$(cat "$BACKUP_DIR/previous-commit")"
  python3 - "$BACKUP_DIR" <<'PYTHON'
import json, pathlib, shutil, sys
backup = pathlib.Path(sys.argv[1])
for name in json.loads((backup / "files.json").read_text()):
    target = pathlib.Path(name)
    source = backup / "files" / name.lstrip("/")
    if not source.is_file():
        sys.exit(f"Missing backup file: {source}")
    shutil.copy2(source, target)
PYTHON
)
```

如果 `git switch` 因本地更改而拒绝，请停止并保留这些更改；不要强制检出或运行 `git reset --hard`。

成功恢复后，打开一个新的终端或 SSH 登录会话，返回 `deploy/join` 并运行：

```bash
source ./config.env
```

不要重复使用更新 shell：它可能保留了还原文件中不存在的导出设置。在该 shell 中启动另一个 Bash 也会继承这些设置。保留备份。在镜像下载期间对 `denied` 或 `manifest unknown`，请等待对发布镜像的访问；不要替换为其他标签。


### 恢复中断的滚动更新

如果更新程序报告待处理的恢复，请在 `deploy/join` 中重新运行它。使用相同的 OS 用户、发布版本和配置，包括任何 `UPDATE_STATE_DIR` 或 `XDG_STATE_HOME` 设置。不要在 sudo 和非 sudo 运行之间切换。保留更新程序打印的恢复目录。不使用 `--check` 或 `--dry-run` 来恢复并继续更新：

```bash
source ./config.env
./update-devshard.sh
```

### 解决缺失的数据库

在针对空数据库启动副本之前停止。对于本地数据库，请检查容器及其挂载：

```bash
docker compose logs --tail=100 devshard-postgres
docker inspect devshard-postgres --format '{{json .Mounts}}' | jq .
```

如果容器已被删除，请从更新前的备份中检查其保存的挂载：

```bash
(
  set -euo pipefail
  read -r -p 'Pre-update backup directory: ' backup_dir
  test -s "$backup_dir/postgres.json"
  jq -e '.[0].Mounts' "$backup_dir/postgres.json"
)
```

如果旧的 Docker 卷已分离，请使用 [检查数据库布局](#2-check-the-database-layout) 中的恢复块配合更新前的备份。缺少存储且没有保留源卷，以及外部数据库灾难恢复，不在本指南范围内。不要使用 `DEVSHARD_POSTGRES_ALLOW_EMPTY_INIT` 绕过恢复。
