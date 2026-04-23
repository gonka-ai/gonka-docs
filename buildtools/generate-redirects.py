#!/usr/bin/env python3
"""Generate legacy-URL redirect stubs for the split /docs/ deployment.

After mkdocs.home.yml has built the landing into _publish/ and
mkdocs.docs.yml has built the docs into _publish/docs/, we still need to
preserve every pre-split bookmark. On GitHub Pages there is no server-side
rewrite engine, so for each old URL we write a tiny HTML file that
meta-refreshes to the new /docs/ location.

Redirect rules (applied for both the English root and the Chinese /zh/):
    /introduction/               ->  /docs/
    /zh/introduction/            ->  /docs/zh/
    /<path>/                     ->  /docs/<path>/     (every other page)
    /zh/<path>/                  ->  /docs/zh/<path>/
    /docs/introduction/          ->  /docs/            (stale internal links)
    /docs/zh/introduction/       ->  /docs/zh/

The generator walks docs/ (the source tree, which still contains
introduction.md) and writes stubs in _publish/ that do not collide with
the landing build or the docs build.
"""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DOCS_SRC = ROOT / "docs"
PUBLISH = ROOT / "_publish"


def stub_html(target_url: str) -> str:
    """Return a static meta-refresh + JS redirect stub with a canonical link.

    The JS redirect re-attaches ``location.search`` and ``location.hash`` from
    the request URL so that bookmarks like ``/wallet/dashboard/#fees`` still
    land on ``/docs/wallet/dashboard/#fees`` instead of the bare target.
    """
    return (
        "<!doctype html>\n"
        '<html lang="en">\n'
        "<head>\n"
        '<meta charset="utf-8">\n'
        "<title>Redirecting\u2026</title>\n"
        f'<link rel="canonical" href="{target_url}">\n'
        f'<meta http-equiv="refresh" content="0; url={target_url}">\n'
        '<meta name="robots" content="noindex">\n'
        f'<script>location.replace({target_url!r} + location.search + location.hash);</script>\n'
        "</head>\n"
        f'<body>Redirecting to <a href="{target_url}">{target_url}</a>.</body>\n'
        "</html>\n"
    )


def write_stub(stub_path: Path, target: str) -> None:
    stub_path.parent.mkdir(parents=True, exist_ok=True)
    stub_path.write_text(stub_html(target), encoding="utf-8")


def target_for(rel: Path) -> str | None:
    """Map a source .md path (relative to docs/) to its new public URL.

    Returns None when the file should not produce a redirect (non-markdown,
    index pages, etc.).
    """
    if rel.suffix != ".md":
        return None
    if rel.name == "index.md":
        return None

    parts = list(rel.parent.parts) + [rel.stem]
    zh = bool(parts) and parts[0] == "zh"
    if zh:
        parts = parts[1:]

    # /introduction/ now lives at /docs/ (same for zh -> /docs/zh/).
    if parts == ["introduction"]:
        return "/docs/zh/" if zh else "/docs/"

    prefix = "/docs/zh/" if zh else "/docs/"
    return prefix + "/".join(parts) + "/"


def old_flat_stub(rel: Path) -> Path | None:
    """Location under _publish/ for the pre-split flat URL."""
    if rel.suffix != ".md" or rel.name == "index.md":
        return None
    parts = list(rel.parent.parts) + [rel.stem]
    return PUBLISH.joinpath(*parts, "index.html")


def docs_introduction_stub(rel: Path) -> Path | None:
    """Redirect /docs/introduction/ (and zh) to /docs/ for stale internal links."""
    if rel.suffix != ".md" or rel.stem != "introduction":
        return None
    parts = list(rel.parent.parts) + [rel.stem]
    return PUBLISH.joinpath("docs", *parts, "index.html")


def main() -> int:
    if not PUBLISH.exists():
        print(f"error: {PUBLISH} does not exist; run mkdocs builds first", file=sys.stderr)
        return 1

    written = 0
    skipped_existing = 0

    for md in DOCS_SRC.rglob("*.md"):
        rel = md.relative_to(DOCS_SRC)
        target = target_for(rel)
        if target is None:
            continue

        for stub in (old_flat_stub(rel), docs_introduction_stub(rel)):
            if stub is None:
                continue
            # Do not overwrite anything produced by either mkdocs build.
            if stub.exists():
                skipped_existing += 1
                continue
            write_stub(stub, target)
            written += 1

    print(f"redirect stubs written: {written}")
    print(f"redirect stubs skipped (existing): {skipped_existing}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
