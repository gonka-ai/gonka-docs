#!/usr/bin/env python3
"""Inject the live on-chain inference price table into the STAGED docs.

Runs in CI after buildtools/prepare-stages.sh (which copies docs/ -> _stage/docs)
and before `mkdocs build`. It edits the staged copy only, so the source tree on
`main` never changes -- no per-epoch commit litter. The published site is what
carries the table.

Data comes from the chain over HTTPS:
  GET /v1/epochs/latest      -> current epoch index + phase (trigger context)
  GET /v1/governance/pricing -> per-model price_per_token (ngonka)

The displayed figure is GNK per 1M tokens:
  gnk_per_1m = price_per_token * 1_000_000 / 1_000_000_000

Failure handling depends on GITHUB_EVENT_NAME:
  * schedule            -> exit non-zero on fetch failure, so the deploy aborts
                           and the last-published table stays live.
  * push / dispatch / _ -> render a "temporarily unavailable" note and exit 0,
                           so routine doc deploys are never blocked by a node
                           being down.
"""

import os
import re
import sys
from datetime import datetime, timezone

import requests

# Chain endpoints, tried in order. node3 serves HTTPS + CORS; node2:8000 is a
# plain-HTTP fallback (fine here because the fetch is server-side, not a browser).
BASE_URLS = [
    "https://node3.gonka.ai",
    "http://node2.gonka.ai:8000",
]

NGONKA_PER_GONKA = 1_000_000_000
TOKENS = 1_000_000  # price is shown per 1M tokens
TIMEOUT = 20

MARK_START = "<!-- PRICES_START -->"
MARK_END = "<!-- PRICES_END -->"

# stage dir -> path of each localized pricing page, plus its language.
STAGE_DIR = os.environ.get("PRICING_STAGE_DIR", "_stage/docs")
PAGES = [
    {"lang": "en", "path": os.path.join(STAGE_DIR, "wallet", "pricing.md")},
    {"lang": "zh", "path": os.path.join(STAGE_DIR, "zh", "wallet", "pricing.md")},
]
EPOCH_FILE = os.path.join(STAGE_DIR, "wallet", "price-epoch.txt")

# Per-language strings. Header text and the "last updated" / "unavailable" lines.
STRINGS = {
    "en": {
        "header": "| Model | Price per 1M tokens (GNK) |",
        "sep": "|-------|--------------------------:|",
        "stamp": "_Per-epoch on-chain snapshot — epoch {epoch}, updated {ts} UTC. "
                 "Prices are recalculated every block; query the endpoint in the "
                 "**Query current pricing** section below for live values._",
        "unavailable": "_Live prices are temporarily unavailable. See the "
                       "**Query current pricing** section below._",
    },
    "zh": {
        "header": "| 模型 | 每 100 万 tokens 价格 (GNK) |",
        "sep": "|------|---------------------------:|",
        "stamp": "_按 epoch 的链上快照 —— epoch {epoch}，更新于 {ts} UTC。"
                 "价格在每个区块重新计算；实时数值请查询下方 **查询当前定价** 部分的接口。_",
        "unavailable": "_实时价格暂时不可用。请参见下方 **查询当前定价** 部分。_",
    },
}


def is_scheduled_run() -> bool:
    return os.environ.get("GITHUB_EVENT_NAME", "") == "schedule"


def fetch_json(path: str) -> dict:
    """GET `path` from the first base URL that answers; raise if all fail."""
    last_err = None
    for base in BASE_URLS:
        url = base + path
        try:
            resp = requests.get(url, headers={"Accept": "application/json"}, timeout=TIMEOUT)
            resp.raise_for_status()
            return resp.json()
        except Exception as exc:  # noqa: BLE001 - report and try the next node
            last_err = exc
            print(f"  ! {url} failed: {exc}", file=sys.stderr)
    raise RuntimeError(f"all endpoints failed for {path}: {last_err}")


def fmt_price(gnk: float) -> str:
    """Format GNK with enough significant digits (0.001 must not round to 0.00)."""
    if gnk == 0:
        return "0"
    s = f"{gnk:.6f}".rstrip("0").rstrip(".")
    return s or "0"


def display_name(model_id: str) -> str:
    """Strip the `org/` prefix, matching the retired landing widget."""
    if not model_id:
        return ""
    return model_id.split("/")[-1]


def render_table(lang: str, models: list, epoch, ts: str) -> str:
    s = STRINGS[lang]
    rows = [s["header"], s["sep"]]
    for m in models:
        gnk = (float(m.get("price_per_token", 0)) * TOKENS) / NGONKA_PER_GONKA
        rows.append(f"| {display_name(m.get('id'))} | {fmt_price(gnk)} GNK |")
    table = "\n".join(rows)
    stamp = s["stamp"].format(epoch=epoch, ts=ts)
    return f"{table}\n\n{stamp}"


def replace_block(path: str, body: str) -> None:
    with open(path, "r", encoding="utf-8") as fh:
        text = fh.read()
    if MARK_START not in text or MARK_END not in text:
        raise RuntimeError(f"markers {MARK_START}/{MARK_END} not found in {path}")
    pattern = re.compile(
        re.escape(MARK_START) + r".*?" + re.escape(MARK_END), re.DOTALL
    )
    replacement = f"{MARK_START}\n{body}\n{MARK_END}"
    new_text = pattern.sub(lambda _: replacement, text, count=1)
    with open(path, "w", encoding="utf-8") as fh:
        fh.write(new_text)
    print(f"  - injected table into {path}")


def main() -> int:
    scheduled = is_scheduled_run()
    try:
        epochs = fetch_json("/v1/epochs/latest")
        pricing = fetch_json("/v1/governance/pricing")
    except Exception as exc:  # noqa: BLE001
        print(f"pricing fetch failed: {exc}", file=sys.stderr)
        if scheduled:
            # Abort the scheduled deploy; the previously published site stays up.
            print("scheduled run: aborting so last-published table is kept.", file=sys.stderr)
            return 1
        # Push/dispatch: degrade gracefully so the doc deploy still succeeds.
        for page in PAGES:
            replace_block(page["path"], STRINGS[page["lang"]]["unavailable"])
        return 0

    epoch = epochs.get("latest_epoch", {}).get("index")
    phase = epochs.get("phase")
    models = pricing.get("models") or []
    ts = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M")
    print(f"epoch={epoch} phase={phase} models={len(models)}")

    for page in PAGES:
        replace_block(page["path"], render_table(page["lang"], models, epoch, ts))

    # Publish the epoch marker used by the deploy gate to detect a new epoch.
    if epoch is not None:
        os.makedirs(os.path.dirname(EPOCH_FILE), exist_ok=True)
        with open(EPOCH_FILE, "w", encoding="utf-8") as fh:
            fh.write(str(epoch))
        print(f"  - wrote {EPOCH_FILE} ({epoch})")

    return 0


if __name__ == "__main__":
    sys.exit(main())
