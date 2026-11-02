# 高可用 devshard 主机设置

由多个 `versiond` 实例支持的持续可用的 devshard 推理服务。

## 目录

- [为什么这很重要](#why-this-matters)
- [发布和镜像](#release-and-images)
- [前提条件](#prerequisites)
- [安装 HA](#install-ha)
- [更新 v6 部署](#update-a-v6-deployment)
- [添加远程副本](#add-a-remote-replica)
- [添加本地副本](#add-a-local-replica)
- [操作部署](#operate-the-deployment)
- [故障排除](#troubleshooting)

## 为什么这很重要

单个 `versiond` 进程是一个单点故障（SPOF）：如果该机器或容器宕机，网关将无法访问该协议版本的主机。

在路由器集群后运行多个 `versiond` 实例，并共享 PostgreSQL。如果一个实例失败，路由器会将请求发送到其余实例。

本地副本可应对容器故障，但不能应对机器故障。即使有远程副本，主主机的公共代理仍然是单点故障。

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

## 发布和镜像

本指南涵盖新的 HA 安装、从 SQLite 主机首次迁移至 HA，以及在 [Devshard v6.0.0](https://github.com/gonka-ai/gonka/releases/tag/devshard%2Fv6.0.0) 上运行 HA 部署。

以下组件镜像运行主机基础设施。其提供的协议由 `VERSIOND_VERSIONS` 单独选择。

编辑 `deploy/join/config.env`。将以下变量设置为所示值。

```bash
export VERSIOND_IMAGE=ghcr.io/gonka-ai/versiond:0.2.16-devshard-v6
export VERSIOND_ROUTER_IMAGE=ghcr.io/gonka-ai/versiond-router:0.2.16-devshard-v6
export PROXY_ROUTER_IMAGE=ghcr.io/gonka-ai/proxy-router:0.2.16-devshard-v6
export PROXY_POLICY_IMAGE=ghcr.io/gonka-ai/proxy:0.2.16-devshard-v6
export ORACLE_FILTER_IMAGE=python:3.12-alpine
```

对于新安装，请保持 `DEVSHARD_POSTGRES_IMAGE` 未设置，以使用 Compose 中锁定的 PostgreSQL 镜像。

## 前提条件

1. 主机上已正常运行的 `node` + `api` (dapi) + `proxy`（标准加入部署）。
2. 加入文件和主机/网关镜像来自[同一版本](#release-and-images)。
3. 每个 HA `versiond` 副本上的相同参与者身份：
   - 相同的 `KEY_NAME` 和密钥环。
   - 相同的 `ACCOUNT_PUBKEY`。
4. 共享 PostgreSQL；每个副本拥有独立的数据目录。不要用相同的密钥启动第二个 dapi。
5. 运行 `versiond` 副本的每个主机，包括远程副本主机，都需要对外访问每个对等节点的公共地址和端口（`PUBLIC_URL`）。无需额外的公共端口。
6. Docker Compose **2.24.4+**、Bash、Python 3、Git、`tar`、`curl`、`jq`、`flock`、`sha256sum`、`timeout`、`xargs`。远程主机还需要 `ssh`、`psql` 以及从**主主机**到**副本主机**的 SSH 访问权限。

本指南支持 v4.1、v4.2 和 v6 协议的本地 HA。

以下滚动容器更新和远程副本流程仅支持 v6 协议。所有提供的协议必须为 v6；v4.1 和 v4.2 协议不提供所需的共享数据库检查。仅运行 v6 基础设施镜像不满足此要求。

## 安装 HA

此流程适用于新的 HA 部署或现有 SQLite 主机的首次 HA 设置，包括运行 v4.1 和 v4.2 的主机。使用 [发布和镜像](#release-and-images) 中的检出版本和镜像。要更新现有的 v6 HA 部署，请使用 [更新 v6 部署](#update-a-v6-deployment)。要添加另一台机器，请使用 [添加远程副本](#add-a-remote-replica)。

对于现有 SQLite 主机，在替换加入文件或编辑设置前，请私密备份 `config.env` 和每个活动的 Compose 文件。保留参与者身份、支持的协议列表和原始 `versiond` 数据挂载。在启动 HA 服务前，请完成 [在现有 SQLite 主机上首次设置 HA](#first-ha-setup-on-an-existing-sqlite-host)。此迁移需要停机。

### 步骤 1：安装 PostgreSQL（最好也是 HA 的）

共享 PostgreSQL 也必须保持可用。建议使用托管或复制的数据库。

#### 选择数据库

**托管 PostgreSQL（推荐）。** 选择 HA 配置并创建数据库和用户。

**自托管 PostgreSQL。** 在专用主机或集群上安装 PostgreSQL，创建角色/数据库，并配置复制和故障转移以实现数据库 HA。

对于托管或自管理的PostgreSQL，获取主端点、端口、数据库、用户名和密码。允许所有副本连接，并配置[§2.2](#22-external-or-managed-postgresql)。

**本地Compose PostgreSQL。** `docker-compose.versiond.yml` 在加入主机上启动 `devshard-postgres`。如果机器宕机，数据库也随之宕机。

#### 调整 `max_connections` 大小

devshardd 针对协议 v4.1 和 v4.2 的版本会根据主机的CPU数量调整PostgreSQL连接池大小，因此这些版本的PostgreSQL默认100个连接对于高可用性来说太小。将 `max_connections` 设置为250；这足以覆盖在最多16个CPU的主机上运行的两个副本和三个协议。对于更多CPU、副本或协议，请按比例增加。对于托管或自管理的PostgreSQL，请在服务器或提供商设置中设置。对于本地Compose PostgreSQL，[§2.1](#21-same-machine-two-replicas) 中的覆盖设置会应用此值。该值仅在PostgreSQL重启后生效。

#### 配置PostgreSQL凭证

在 `deploy/join` 中运行以下命令，将PostgreSQL密码保存到 `config.env`。对于新的本地数据库，请选择一个密码；对于现有数据库，请输入其当前密码：

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

数据库和用户名默认为 `devshardd`；可通过 `DEVSHARD_POSTGRES_DB` 和 `DEVSHARD_POSTGRES_USER` 覆盖。

本地数据路径：`${DEVSHARD_POSTGRES_DATA_DIR:-./devshards/postgres}/data`。对于外部PostgreSQL，请完成[§2.2](#22-external-or-managed-postgresql)。

#### 准备PostgreSQL目录

仅适用于本地Compose PostgreSQL。在首次启动前在 `deploy/join` 中运行，通过Docker创建数据目录。PostgreSQL入口点在启动时设置其所有者：

```bash
source ./config.env
pg_dir="${DEVSHARD_POSTGRES_DATA_DIR:-./devshards/postgres}"
[[ "$pg_dir" = /* ]] || pg_dir="$PWD/$pg_dir"
pg_image=$(docker compose -f docker-compose.yml -f docker-compose.versiond.yml \
  config --format json | jq -er '.services["devshard-postgres"].image') &&
docker run --rm --network none --read-only \
  --security-opt label=disable \
  --volume "$pg_dir:/target:ro" \
  --entrypoint /bin/true \
  "$pg_image"
```

如果命令失败，请停止并检查目录权限：

```bash
ls -ld -- "$(dirname "$pg_dir")" "$pg_dir"
```

请勿手动更改数据库所有者。

### 步骤2：运行多个 `versiond` 实例 + 路由器集群

基础安装文件位于 `deploy/join`：

| 文件 | 用途 |
| --- | --- |
| `docker-compose.yml` | 基础加入部署，随发布版本提供 |
| `docker-compose.versiond.yml` | 共享PostgreSQL和高可用副本设置，随发布版本提供 |
| `docker-compose.devshard-ha.override.yml` | 目录过滤器；在下方创建 |
| `docker-compose.devshard-pg-external.override.yml` | 外部数据库设置；仅在§2.2中创建 |

#### 2.1 同一台机器，两个副本

**1. 将高可用设置保存在 `config.env` 中。**

先应用[发布和镜像](#release-and-images)。

列出节点上批准的协议名称：

```bash
curl -fsS http://127.0.0.1:9100/versions | jq -er '.versions[].name'
```

在 `VERSIOND_VERSIONS` 中使用批准的协议名称 `v4.1` 和 `v4.2`。仅在 `v6` 出现在节点的批准列表中后（按照[添加协议](#add-a-protocol)）再添加它。更新时，请保留现有的支持协议列表。

在 `config.env` 中编辑这些变量。保留现有的身份和数据库设置。

```bash
# Protocol list for a new host on this release; keep the existing list when updating.
export VERSIOND_VERSIONS="v4.1 v4.2"
# Deployment settings (retain these across component updates)
export VERSIOND_NON_HA_VERSIONS=""
# Use the same filtered catalog for replicas and both routing tiers.
export VERSIOND_ROUTING_CATALOG_URL=http://oracle-filter:9100/versions
export COMPOSE_FILE=docker-compose.yml:docker-compose.versiond.yml:docker-compose.devshard-ha.override.yml
# Append every additional override used by this deployment, in the same order.
```

保持 `VERSIOND_NON_HA_VERSIONS` 为空。在每次运行时，将所有覆盖项包含在 `COMPOSE_FILE` 中，且顺序保持一致。

**2. 在 `deploy/join` 中创建 `docker-compose.devshard-ha.override.yml`。**

```bash
cat > docker-compose.devshard-ha.override.yml <<'EOF'
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

  # Local Compose PostgreSQL: size for every replica and protocol; see Step 1.
  devshard-postgres:
    command: ["postgres", "-c", "max_connections=250"]

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

#### 2.2 外部或托管PostgreSQL

如果使用本地Compose PostgreSQL，请跳过本节，直接前往[步骤3](#step-3-start-the-deployment)。

直接连接到PostgreSQL。如果使用连接池（如PgBouncer），请配置会话池；事务池不被支持。

此部署不支持通过 `PGSSL*` 变量配置PostgreSQL TLS；仅接受 `PGSSLMODE=disable`。如果您的提供商要求显式TLS设置，则本流程不适用。请勿禁用必需的TLS。

通过提供商创建数据库和角色，或运行：

```sql
CREATE USER devshardd WITH PASSWORD '...';
CREATE DATABASE devshardd OWNER devshardd;
```

允许来自每个副本的访问。按照[配置PostgreSQL凭证](#configure-postgresql-credentials)中的说明保存凭证。创建 `docker-compose.devshard-pg-external.override.yml`，包含数据库主机和端口：

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
export COMPOSE_FILE=docker-compose.yml:docker-compose.versiond.yml:docker-compose.devshard-ha.override.yml:docker-compose.devshard-pg-external.override.yml
```

### 步骤3：启动部署

#### 在现有SQLite主机上首次设置高可用

在新主机上跳过此块。仅用于从未使用过PostgreSQL的单个 `versiond`。协议 v4.1 和 v4.2 支持此迁移。在PoC/cPoC之外安排维护，完成步骤1–2，并在替换现有容器前在 `deploy/join` 中运行：

```bash
(
  set -euo pipefail
  umask 077
  source ./config.env
  : "${COMPOSE_FILE:?set the complete Compose file list in config.env}"
  mkdir -p backups
  backup_dir=$(mktemp -d "$PWD/backups/pre-ha.XXXXXXXX")
  echo "SQLite backup directory: $backup_dir"
  docker inspect versiond > "$backup_dir/versiond.json"
  docker compose config --format json > "$backup_dir/compose.json"
  python3 - "$backup_dir" <<'PYTHON'
import json, pathlib, sys
backup = pathlib.Path(sys.argv[1])
old = json.loads((backup / "versiond.json").read_text())[0]
new = json.loads((backup / "compose.json").read_text())["services"]["versiond"]
env = dict(item.split("=", 1) for item in old["Config"]["Env"])
if env.get("PGHOST"):
    sys.exit("This procedure is for a SQLite host that has never used PostgreSQL")
old_mounts = [(v["Type"], v["Source"]) for v in old["Mounts"]
              if v["Destination"] == "/opt/versiond/data"]
new_mounts = [(v["type"], v["source"]) for v in new["volumes"]
              if v["target"] == "/opt/versiond/data"]
if len(old_mounts) != 1 or old_mounts != new_mounts:
    sys.exit("Keep the original versiond data mount before starting HA")
PYTHON

  docker stop -t 1800 versiond
  docker cp versiond:/opt/versiond/data "$backup_dir/data"
  test -d "$backup_dir/data"
  pg_bound=$(find "$backup_dir/data" -type f -name .pg-bound -print -quit)
  if [[ -n "$pg_bound" ]]; then
    echo 'PostgreSQL-owned sessions exist; restore that database before continuing.' >&2
    exit 1
  fi

  ./versiond-router-fleet.sh prepare-networks
  # Local PostgreSQL only: explicitly allow its first initialization.
  services=$(docker compose config --services)
  if grep -qx devshard-postgres <<<"$services"; then
    DEVSHARD_POSTGRES_ALLOW_EMPTY_INIT=true \
      docker compose up -d --no-deps --wait --wait-timeout 2100 devshard-postgres
  fi
)
```

下载的 `versiond` 二进制文件会导致本地PostgreSQL初始化失败。上述一次性标志用于确认首次启用高可用性；请勿将其保存在 `config.env` 中。如果之前使用过PostgreSQL，或存在 `.pg-bound` 标记，请保留并恢复该数据库，而非初始化空的替代数据库。请参阅发布版本的[PostgreSQL存储流程](https://github.com/gonka-ai/gonka/blob/release/devshard/v6.0.0/devshard/docs/postgres-persistence-migration.md)。对于外部PostgreSQL，请使用专为此主机副本的新数据库。

在下方继续使用原始的 `versiond`，其已停止且数据挂载保持不变。HA 配置设置 `DEVSHARD_STORAGE_MODE=postgres`：每个子节点在提供服务前导入其本地 SQLite 会话，并将迁移的 SQLite 数据库文件重命名为 `*.migrated.<TS>`，其中 `<TS>` 为 Unix 时间戳。第一个副本必须就绪后才能启动第二个副本。保留备份文件和迁移文件，直到第 4 步中的检查通过。一旦 PostgreSQL 接受了新写入，旧的 SQLite 备份就不再是当前的回滚副本。

#### 启动 HA

在加入主机上运行。在首次失败时停止：

```bash
(
  set -euo pipefail
  cd /path/to/gonka/deploy/join
  source ./config.env
  : "${COMPOSE_FILE:?set the complete Compose file list in config.env}"
  : "${VERSIOND_VERSIONS:?set the approved HA protocol list}"
  ./versiond-router-fleet.sh prepare-networks

  # Settle the database configuration before starting either replica.
  services=$(docker compose config --services)
  if grep -qx devshard-postgres <<<"$services"; then
    docker compose up -d --no-deps --wait --wait-timeout 2100 devshard-postgres
  fi
  docker compose up -d --no-deps oracle-filter
  docker compose up -d --no-deps --wait --wait-timeout 2100 versiond
  for version in $VERSIOND_VERSIONS; do
    docker exec versiond wget -qO- "http://127.0.0.1:8080/readyz?version=$version"
  done
  docker compose up -d --no-deps --wait --wait-timeout 2100 versiond2

  # Start the public listener before its private policy workers.
  docker compose up -d --no-deps proxy
  docker compose up -d --no-deps --wait --wait-timeout 2100 proxy-policy2 proxy-policy proxy

  ./versiond-router-fleet.sh apply
)
```

### 第 4 步：验证是否正常工作

#### 4.1 检查正在运行的服务

在安装或更新后，在加入主机上运行。列出 `replicas` 中的每个本地副本；在远程主机上重复副本检查。

```bash
cd /path/to/gonka/deploy/join
source ./config.env
(
  set -euo pipefail
  : "${VERSIOND_VERSIONS:?set the approved HA protocol list}"
  : "${PUBLIC_URL:?set the public HTTP or HTTPS URL advertised by this host}"
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
    curl -fsS "${PUBLIC_URL%/}/devshard/$version/healthz"
  done
)
```

所有命令必须成功；就绪和公共健康端点必须返回 HTTP 200。保留提供的 `/readyz` Docker 健康检查。

使用 `PUBLIC_URL` 进行公共检查，包括仅 HTTPS 主机。如果主机无法访问其自身的公共地址，请从另一台机器运行这些检查。

有关推理和认证对等检查，请参阅 [健康检查通过但推理失败](#health-checks-pass-but-inference-fails)。

新加入或替换的远程成员：在池准入前通过 [数据库检查](#check-the-remote-database)。

#### 4.2 检查路由故障转移

在安装或池更改后，对 `VERSIOND_VERSIONS` 中的每种协议运行。其余副本必须能够处理负载。

1. 在公共代理主机上，请求协议的健康端点：

   ```bash
   source ./config.env
   version='<protocol from VERSIOND_VERSIONS>'
   : "${PUBLIC_URL:?set the public HTTP or HTTPS URL advertised by this host}"
   url="${PUBLIC_URL%/}/devshard/$version/healthz"
   curl -sS -D - -o /dev/null "$url"
   ```

   预期返回 HTTP 200。将 `X-Upstream-Addr` 匹配到本地容器或远程端点。包含每个本地副本：

   ```bash
   docker inspect -f '{{.Name}} {{range .NetworkSettings.Networks}}{{.IPAddress}} {{end}}' versiond versiond2
   ```

2. 在 `X-Upstream-Addr` 显示的副本所在主机上停止该副本：

   ```bash
   replica='<serving-container>'
   docker stop -t 1800 "$replica"
   ```

3. 在公共代理主机上重复相同的请求：

   ```bash
   curl -sS -D - -o /dev/null "$url"
   ```

   预期返回 HTTP 200 和不同的 `X-Upstream-Addr`。

4. 即使检查失败，也要在主机上恢复已停止的副本：

   ```bash
   docker start "$replica"
   ```

   在停止另一个副本前，先通过 [服务检查](#41-check-the-running-services)。

对于常规更新，仅运行 §4.1 中的服务检查。

## 更新 v6 部署

此过程适用于已运行 v6 基础设施的 HA 部署，具有共享的 PostgreSQL、路由器集群，以及位于 `config.env` 中的站点设置和独立的 Compose 覆盖文件。

当所有服务协议均为 v6 且 PostgreSQL 无需重启时，使用 [滚动更新](#rolling-update)。如果主机提供 v4.1 或 v4.2，或需要重新创建本地 PostgreSQL，则使用 [带停机时间的更新](#update-with-downtime)。

### 备份 PostgreSQL 和部署文件

在替换发布文件前，在现有主机的 `deploy/join` 中运行。保持 `versiond` 运行，并保存打印出的备份目录。

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

仅在 `Backup complete.` 之后继续。备份包含密码；请保持私密。归档检查不测试完整恢复。

### 准备发布

完成 [备份](#back-up-postgresql-and-deployment-files)。在 `deploy/join` 中输入其打印的目录。将站点设置保存在 `config.env` 中，并保持独立的、未跟踪的 Compose 覆盖文件。

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
  git fetch https://github.com/gonka-ai/gonka.git refs/tags/release/devshard/v6.0.0
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

如果跟踪的文件有本地修改，此步骤将停止。不涵盖自动合并；请保留保存的补丁，不要运行 `git reset --hard`。

应用 [发布和镜像](#release-and-images)。站点覆盖必须使用这些镜像变量，而不是硬编码的应用程序镜像。

在替换服务之前，请在将运行它们的机器上下载应用程序镜像。从主主机上的 `deploy/join` 拉取全部四个：

```bash
(
  set -euo pipefail
  source ./config.env
  : "${VERSIOND_IMAGE:?set the release image}"
  : "${VERSIOND_ROUTER_IMAGE:?set the release image}"
  : "${PROXY_ROUTER_IMAGE:?set the release image}"
  : "${PROXY_POLICY_IMAGE:?set the release image}"
  for image in "$VERSIOND_IMAGE" "$VERSIOND_ROUTER_IMAGE" "$PROXY_ROUTER_IMAGE" "$PROXY_POLICY_IMAGE"; do
    docker pull "$image"
  done
)
```

在远程副本主机上，在替换该成员之前拉取其配置的 `VERSIOND_IMAGE`。如果无法下载所需镜像，请停止。提前拉取可确保更新器即使之后需要使用本地缓存，也能获取预期的镜像。

保留现有的 `config.env`、协议列表和 Compose 覆盖文件。更新后单独添加协议。不要将此更新与数据库迁移、PostgreSQL 主版本升级或集群重新配置合并。

检查 [`max_connections`](#size-max_connections) 中配置的副本和协议数量。对本地 PostgreSQL 镜像、设置或挂载的更改可能会重新创建其容器并同时断开所有副本的连接。请使用 [带停机时间的更新](#update-with-downtime) 应用此类更改。

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

外部 PostgreSQL：保持相同的数据库端点和凭据，保持数据库运行，并前往 [更新部署](#3-update-the-deployment)。

对于本地 PostgreSQL，请检查数据目录和挂载：

```bash
docker inspect devshard-postgres --format '{{json .Mounts}}'
docker inspect devshard-postgres --format '{{json .Config.Env}}' |
  jq -r '.[] | select(startswith("PGDATA="))'
```

v6 布局使用 `PGDATA=/var/lib/postgresql/gonka/data`，并将 `${DEVSHARD_POSTGRES_DATA_DIR:-./devshards/postgres}` 挂载在 `/var/lib/postgresql/gonka`。如果 Compose 配置将更改该主机目录或其挂载，请停止。

### 更新部署

一次更新一台主机，避开 PoC/cPoC。安排维护：替换公共代理会拒绝并断开连接数秒，而网关在收到拒绝连接后可能在最多 30 分钟内停止向此主机发送请求。

如果主机运行 v4.1 或 v4.2，或需要重新创建本地 PostgreSQL，请使用下面的停机程序。否则，请使用滚动更新程序。保持 `UPDATE_SKIP_POSTGRES_PROBE` 和 `UPDATE_ACCEPT_DATABASE_CHANGE` 禁用。

#### 带停机时间的更新

针对**一个已运行 v6 基础设施的加入主机**，使用相同的外部数据库或在其现有持久路径上的本地 PostgreSQL。保持数据库设置、参与者身份、副本数据挂载和协议不变。此程序不涵盖数据库迁移或多主机更新。

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

  ./versiond-router-fleet.sh prepare-networks
  if [[ $(jq -r '.services.versiond.environment.PGHOST' "$backup_dir/compose.json") == devshard-postgres ]]; then
    docker compose up -d --no-deps --wait --wait-timeout 2100 devshard-postgres
  fi
  # Check capacity against the restarted PostgreSQL and its new settings.
  ./update-devshard.sh --check
  docker compose up -d --no-deps oracle-filter
  docker compose up -d --no-deps --wait --wait-timeout 2100 "${replicas[@]}"
  docker compose up -d --no-deps proxy
  docker compose up -d --no-deps --wait --wait-timeout 2100 proxy-policy2 proxy-policy proxy
  ./versiond-router-fleet.sh apply
  ./versiond-router-fleet.sh verify-admission
)
```

预检检查数据库访问和容量，而非数据库身份。如果镜像下载失败，[取消准备](#cancel-before-maintenance) 仅在未发生任何容器停止或替换的情况下进行。

运行 [服务检查](#41-check-the-running-services)，然后在此处停止。

#### 滚动更新

此程序通过 `update-devshard.sh` 更新部署容器，仅支持协议 v6。每个服务的协议必须为 v6，且 PostgreSQL 不需要重启。如果主机服务 v4.1 或 v4.2，或需要重新创建本地 PostgreSQL，请使用 [带停机时间的更新](#update-with-downtime)。保持 PostgreSQL、过滤器、副本和路由器集群运行。

检查每个副本上的每个协议：

```bash
(
  set -euo pipefail
  source ./config.env
  # Include every local member; repeat on remote hosts.
  : "${VERSIOND_VERSIONS:?set the approved HA protocol list}"
  for replica in versiond versiond2; do
    for version in $VERSIOND_VERSIONS; do
      docker exec "$replica" /bin/busybox wget -qO- -T 5 \
        "http://127.0.0.1:8080/readyz?version=$version"
    done
  done
)
```

每个检查都应返回 HTTP 200。如果检查失败，请不要继续。一次更新一个副本；在更新过程中，必须有另一个副本为每个协议提供服务。

运行预检并预览替换。预检写入数据库探测，但不替换服务：

```bash
source ./config.env
./update-devshard.sh --dry-run
```

更新器先替换路由器集群，然后是公共代理和 nginx 工作进程，最后是 `versiond` 副本。保持这些组件在同一版本上，并让脚本管理其顺序。

对等 RPC 在更新期间可能使用 HTTP/1.1。在开始负载测试之前，请完成所有替换和服务检查。调查 HTTP 503 响应；HTTP/2 池不可用本身并不会启用回退到 HTTP/1.1。

审查建议的镜像和更改。如果预检失败或无法确认副本使用相同的数据库，请不要继续。然后运行：

```bash
./update-devshard.sh
```

在最终验证之前，[逐个替换远程成员](#replace-a-member)。

运行 [服务检查](#41-check-the-running-services)。要启用新协议，请遵循 [添加协议](#add-a-protocol)。

## 添加远程副本

此程序要求主机上的每个 `devshardd` 进程都运行协议 v6。协议 v4.1 和 v4.2 不支持此程序所需的共享数据库检查。

在机器之间使用私有网络。不要使用相同密钥启动第二个 dapi。

新部署：首先在**主主机**上完成 [启动](#step-3-start-the-deployment) 和 [验证](#step-4-verify-it-works)。

| 机器 | 运行 |
| --- | --- |
| **主主机** | 本地 `versiond` 副本 + node/api/proxy + 路由器集群 |
| **副本主机** | `versiond` 仅限 |
| 共享 | PostgreSQL 可从每个 `versiond` 实例访问 |

在副本检查通过之前，将其排除在路由器池之外。

### 准备主主机

在**主主机**上，为**副本主机**在私有网络上发布以下端口：

- PostgreSQL `5432`，或外部数据库端口。
- Node-manager `9400`。
- Chain RPC/gRPC `26657`，`9090`。
- 过滤的目录 `19100`。

**副本主机**需要对外访问每个对等节点的公共地址和端口（`PUBLIC_URL`）。根据下文所述，将入站访问限制为其端口 `8080`，仅允许路由器访问。

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

外部 PostgreSQL：删除 `devshard-postgres` 条目；**副本主机**使用真实端点。将此覆盖添加到**主主机**的 `COMPOSE_FILE`。

新主机：在 [启动](#step-3-start-the-deployment) 之前包含此覆盖。现有主机：

安排端口更改的维护。在**主主机**和每个现有**副本主机**上，在 `deploy/join` 中运行以停止副本：

```bash
source ./config.env &&
mapfile -t replicas < <(docker compose ps --services | grep -E '^versiond[0-9]*$') &&
((${#replicas[@]} > 0)) &&
docker compose stop "${replicas[@]}"
```

在**主主机**上应用端口更改：

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

在每个主机上，使用停止副本时相同的 shell 重启副本：

```bash
docker compose up -d --no-deps --wait --wait-timeout 2100 "${replicas[@]}"
```

在**主主机**上恢复集群并运行[服务检查](#41-check-the-running-services)：

```bash
./versiond-router-fleet.sh apply && ./update-devshard.sh --check
```

### 配置并启动副本主机

对于新**副本主机**，在**主主机**上于 `deploy/join` 中运行。将**副本主机**的 SSH 登录信息输入为 `user@host`。**副本主机**上的检出目录将创建在 `~/gonka`，使用**主主机**的提交版本。

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
                      ("DEVSHARD_POSTGRES_USER", "devshardd"), ("NODE_MANAGER_GRPC_PORT", "9400")]:
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

在**副本主机**上运行 `cd ~/gonka/deploy/join`。对于现有**副本主机**，请使用[替换成员](#replace-a-member)。

将以下内容添加到**副本主机**的 `config.env`，使用真实私有地址：

```bash
export NETWORK_NODE_PRIVATE_IP='<primary-host-private-ip>'
export VERSIOND_BIND_IP='<replica-host-private-ip>'
export COMPOSE_FILE=docker-compose.versiond-remote.yml:docker-compose.versiond-remote-filter.yml
```

外部 PostgreSQL：同时设置 `DEVSHARD_POSTGRES_HOST` 和 `DEVSHARD_POSTGRES_PORT`。将**副本主机**的端口 8080 限制为仅允许路由器访问。

在**副本主机**的 `deploy/join` 中创建过滤器覆盖：

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

当容器健康且每个检查均返回 HTTP 200 时继续。

### 检查远程数据库

在将副本添加到路由器池之前，检查**副本主机**的数据库。在**副本主机**上运行以下两个代码块；将 `/path/to/gonka` 替换为其检出目录（对于上述创建的主机为 `~/gonka`）：

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

使用**主主机**的数据库设置或数据库管理员提供的值，填写检出目录中的 `deploy/join/pool-postgres.env` 中的 `PGHOST`、`PGPORT`、`PGDATABASE`、`PGUSER` 和 `PGPASSWORD`。运行：

```bash
(
  set -euo pipefail
  cd /path/to/gonka/deploy/join
  ./update-devshard.sh --check-storage --reference-env ./pool-postgres.env
)
```

预期 `Storage check passed` 和退出码 0。该检查会向数据库写入测试数据；请将其与其他检查和更新分开运行。对于其他容器，请重复 `--container NAME`。

### 将副本添加到路由器池

在**主主机**上于 `deploy/join` 中创建 `versiond-endpoints.json`。将 `10.0.0.12` 替换为**副本主机**的私有 IP，并包含所有副本。所有路由器必须能够连接到这些地址：

```bash
cat > versiond-endpoints.json <<'EOF'
[
  {"id": "local-a", "host": "versiond", "port": 8080},
  {"id": "local-a-2", "host": "versiond2", "port": 8080},
  {"id": "remote-b", "host": "10.0.0.12", "port": 8080}
]
EOF
```

在**主主机**的 `config.env` 中设置 `export VERSIOND_POOL_ENDPOINTS_FILE=./versiond-endpoints.json`；`source ./config.env`。新集群：运行 `./versiond-router-fleet.sh apply`。现有集群：在维护期间运行：

```bash
VERSIOND_ROUTER_ALLOW_MAINTENANCE_OUTAGE=true \
  ./versiond-router-fleet.sh maintenance-rollout
./versiond-router-fleet.sh verify-admission
```

滚动更新会中断新请求。在替换同一端点上的主机时，请保留成员 ID。端点文件的更改仅通过滚动更新生效。

添加副本后，运行[服务检查](#41-check-the-running-services)和[路由故障转移检查](#42-check-routing-failover)。

## 添加本地副本

在[启动和验证](#step-3-start-the-deployment)后，添加 `versiond3`：

1. 在 `config.env` 中，将 `docker-compose.versiond3.yml` 立即插入 `COMPOSE_FILE` 中 `docker-compose.versiond.yml` 之后。保留其后的过滤器、数据库和站点覆盖：

   ```bash
   export COMPOSE_FILE=docker-compose.yml:docker-compose.versiond.yml:docker-compose.versiond3.yml:docker-compose.devshard-ha.override.yml
   # External PostgreSQL: append :docker-compose.devshard-pg-external.override.yml
   # Retain every other site override after these files.
   ```

2. 在 `services` 下添加 `docker-compose.devshard-ha.override.yml`：

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

   外部 PostgreSQL：也在 `services` 下的 `docker-compose.devshard-pg-external.override.yml` 中添加，位于现有锚点下方：

   ```yaml
   versiond3:
     <<: *external-postgres
   ```

3. 本地 PostgreSQL：对现有副本运行 [带停机时间的更新](#update-with-downtime) 以应用新的 PostgreSQL 挂载。外部数据库跳过此步骤。
4. 启动新副本：

   ```bash
   source ./config.env
   docker compose config --quiet
   docker compose pull versiond3
   docker compose up -d --no-deps --wait --wait-timeout 2100 versiond3
   ```

5. 如果使用 `versiond-endpoints.json`，请添加 `versiond3` 并 [应用更新后的列表](#3-add-the-replica-to-the-router-pool)。默认 Docker 发现会自动找到它。运行 [服务检查](#41-check-the-running-services)，包括 `versiond3`。

对于第四个副本，复制 `docker-compose.versiond3.yml`，将 `3` 替换为 `4`，并重复上述覆盖操作。

## 操作部署

每个 `versiond` 副本都是路由器池的成员。

从 `deploy/join` 运行以下命令。在公共代理主机上管理路由器，在运行副本的主机上管理 `versiond` 副本。

### 管理路由器

使用 `versiond-router-fleet.sh` 管理路由器。该脚本读取 `config.env` 并在单独的 Docker Compose 项目中运行每个路由器。因此，为主要加入部署运行 `docker compose down` 会保持路由器运行。

要停止所有路由器，请运行 `./versiond-router-fleet.sh stop-all --maintenance`。默认关闭超时时间为每个路由器 30 分钟（`VERSIOND_ROUTER_DRAIN_TIMEOUT_SECONDS`）。

每个路由器实例占用一个编号的 **插槽**。当其容器被替换时，插槽编号保持不变。在集群命令中使用此编号：

| 任务 | 命令 |
| --- | --- |
| 查看路由器状态和插槽编号 | `./versiond-router-fleet.sh status` |
| 停止插槽 0 中的路由器 | `./versiond-router-fleet.sh stop 0` |
| 启动插槽 0 中的路由器 | `./versiond-router-fleet.sh start 0` |
| 更改后验证路由 | `./versiond-router-fleet.sh verify-admission` |
| 应用路由器镜像和配置更改 | `./versiond-router-fleet.sh apply` |

完整发布更新：请遵循 [更新部署](#3-update-the-deployment)。

在操作中断后，请保留之前的已停止容器和目录卷；使用相同的镜像和配置重新运行。对于池或解析器更改，请遵循 [成员维护](#3-add-the-replica-to-the-router-pool)。

在机器维护前，请优雅地停止路由器，然后停止主栈：

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

一次重启一个副本。其余副本必须处理所有协议并承担负载。在 `COMPOSE_FILE` 中包含所有活动覆盖项：

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

在重启另一个副本之前，先运行上述就绪检查。

### 替换一个成员

使用此过程替换仅服务 v6 协议的现有 v6 部署中的副本。如果主机服务 v4.1 或 v4.2，请使用 [带停机时间的更新](#update-with-downtime)。

保留相同的数据库、参与者身份、协议列表和数据挂载。一次替换一个副本；每个协议必须由另一个副本提供服务。

1. 在运行副本的主机上，在其现有的 `deploy/join` 目录中运行，以获取并检出发布版本：

   ```bash
   (
     set -euo pipefail
     git diff --exit-code
     git diff --cached --exit-code
     git fetch https://github.com/gonka-ai/gonka.git refs/tags/release/devshard/v6.0.0
     git switch --detach FETCH_HEAD
   )
   ```

   如果 Git 报告本地更改或冲突文件，请停止；不要强制检出。将 `config.env` 和站点覆盖项保留在单独的未跟踪文件中。检出成功后，应用 [发布和镜像](#release-and-images) 中的变量。
2. 对于远程成员，请从 **主主机** 的 `versiond-endpoints.json` 中删除其条目，并运行 [成员维护](#3-add-the-replica-to-the-router-pool)。在成员机器上，在 `deploy/join` 中运行以选择并替换副本：

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

   对于远程成员，在恢复其在 **主主机** 端点文件中的条目并应用成员维护之前，请先通过 [数据库检查](#check-the-remote-database)。
3. 在替换下一个成员之前，通过 [服务检查](#41-check-the-running-services)。如果检查失败，请在替换另一个成员前停止。回滚镜像不会回滚数据库更改；任何回滚版本都必须支持当前数据库。

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

对于额外副本，从 `COMPOSE_FILE` 中删除其 Compose 文件名，并从过滤器/数据库覆盖中删除其服务块。保留其数据目录。如果使用 `versiond-endpoints.json`，请从 **主主机** 中删除其条目并运行 [成员维护](#3-add-the-replica-to-the-router-pool)。对剩余副本运行 [服务检查](#41-check-the-running-services)。

### 添加协议

1. 查看 [发布指南](https://github.com/gonka-ai/gonka/blob/release/devshard/v6.0.0/devshard/docs/release-0.2.16-v6.md#what-this-release-is) 以确认主机/网关版本。一旦其出现在节点的 [批准协议列表](#21-same-machine-two-replicas) 中，请在每个主机的 `config.env` 中的 `VERSIOND_VERSIONS` 中添加它。保留现有协议。
2. 在 **主主机** 上：`source ./config.env`，然后使用完整的 `COMPOSE_FILE` 运行 `docker compose up -d --no-deps oracle-filter`。
3. `./versiond-router-fleet.sh wait-version <new-protocol>`，然后使用更新后的列表运行 [服务检查](#41-check-the-running-services)。

无需重启路由器。下一次主机更新会将保存的协议列表应用到路由器集群和公共代理；将其安排为维护任务。

为每个路由器插槽保留 `proxy-router-state` 和 `router-state` 卷。仅在维护期间、在不再需要其会话时移除协议：过滤器更改可停止子进程，而接受的路由器路由默认保持不变。

## 故障排除

### 健康检查通过，但推理失败

`/healthz`、`/readyz`、`verify-admission` 和 `update-devshard.sh --check` 不发送推理请求或验证对等体。

1. 通过包含此主机的保管库发送 [网关测试请求](../developer/gateway-developer-quickstart.md#5-send-a-test-request)。每次使用不同的消息，例如包含当前时间戳的消息，以避免网关响应缓存。确认主机日志中已处理该请求。
2. 停止一个副本后重复此操作，遵循 [路由故障转移检查](#42-check-routing-failover)，即使请求失败也要恢复副本。预期会收到模型响应，并且请求会到达剩余副本。
3. 对于 v6 及更高版本，确认现有对等体完成 `Attach`，保持 `Watch` 打开，完成后续 RPC 并续订其会话。在对等体上，`devshard_peer_attach_total{result="ok"}` 应增加，而 `devshard_peer_session_state{state="ready"}` 对此主机和版本应保持为 1。检查对等体和 `versiond` 日志中的身份验证或会话错误；参见发布版的 [对等 RPC 检查](https://github.com/gonka-ai/gonka/blob/release/devshard/v6.0.0/devshard/docs/release-0.2.16-v6.md#switching-the-wrapping)。

在显式 HTTP/2 协议不匹配后，对等体约 30 分钟后重试发现；模糊的连接关闭会启动 30 秒的指数退避。发现期间的正常 HTTP/1.1 会话是预期的。

将 `DEVSHARD_RPC_GRPC` 留空以使用默认对等传输选择。

### 取消维护前

仅在准备失败 **且尚未停止或替换任何容器** 时使用。此操作仅恢复文件。在 `deploy/join` 中运行；使用预更新备份打印的 `Backup directory`：

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

成功恢复后，打开新的终端或 SSH 登录会话，返回 `deploy/join`，并运行：

```bash
source ./config.env
```

不要重用更新 shell：它可能保留了恢复文件中不存在的导出设置。在该 shell 中启动另一个 Bash 也会继承这些设置。保留备份。在镜像下载期间处理 `denied` 或 `manifest unknown` 时，请等待对发布镜像的访问；不要替换其他标签。


### 恢复中断的滚动更新

如果更新器报告待恢复，请在 `deploy/join` 中重新运行它。使用相同的 OS 用户、发布版本和配置，包括任何 `UPDATE_STATE_DIR` 或 `XDG_STATE_HOME` 设置。不要在 sudo 和非 sudo 运行之间切换。保留更新器打印的恢复目录。运行时不带 `--check` 或 `--dry-run` 以恢复并继续更新：

```bash
source ./config.env
./update-devshard.sh
```

### 解决缺失的数据库

在针对空数据库启动副本之前停止。对于本地数据库，检查容器及其挂载：

```bash
docker compose logs --tail=100 devshard-postgres
docker inspect devshard-postgres --format '{{json .Mounts}}' | jq .
```

如果容器已被删除，请从预更新备份中检查其保存的挂载：

```bash
(
  set -euo pipefail
  read -r -p 'Pre-update backup directory: ' backup_dir
  test -s "$backup_dir/postgres.json"
  jq -e '.[0].Mounts' "$backup_dir/postgres.json"
)
```

将挂载与 [v6 数据库布局](#2-check-the-database-layout) 和保存的配置进行比较。如果主机数据目录缺失或为空，请保持副本停止，并在重启前从备份中恢复数据库。数据库恢复程序取决于 PostgreSQL 部署，不在本指南范围内。不要使用 `DEVSHARD_POSTGRES_ALLOW_EMPTY_INIT` 绕过恢复。
