#!/usr/bin/env python3
"""Derive the docs nav from the root mkdocs.yml and inject it into mkdocs.docs.yml.

This ensures mkdocs.yml is the single source of truth for navigation.
The script:
  1. Reads the nav from mkdocs.yml
  2. Strips every ``Home`` entry (landing lives at /, outside the docs build)
  3. Remaps ``Introduction: introduction.md`` → ``Introduction: index.md`` anywhere
     in the tree (prepare-stages.sh promotes introduction.md to index.md in _stage/docs/)
  4. Writes the transformed nav into mkdocs.docs.yml
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent


def transform_nav_entry(entry: dict) -> dict | None:
    """Transform one nav mapping. Return None to omit (e.g. Home in docs build)."""
    key = next(iter(entry))
    val = entry[key]
    if key == "Home":
        return None
    if key == "Introduction" and val == "introduction.md":
        return {"Introduction": "index.md"}
    if isinstance(val, list):
        children = transform_nav_list(val)
        return {key: children}
    return entry


def transform_nav_list(items: list) -> list:
    out: list = []
    for item in items:
        if isinstance(item, dict):
            mapped = transform_nav_entry(item)
            if mapped is not None:
                out.append(mapped)
        else:
            out.append(item)
    return out


def transform_nav(nav: list) -> list:
    """Strip Home and remap Introduction for the docs build (nested nav aware)."""
    return transform_nav_list(nav)


def strip_nav_block(lines: list[str]) -> list[str]:
    """Remove an existing top-level ``nav:`` block from a list of lines.

    A nav block starts with a line that is exactly ``nav:`` (possibly with
    trailing whitespace) and continues through every subsequent line that is
    blank, a comment, indented, or starts with ``- `` (YAML list item).
    """
    out: list[str] = []
    in_nav = False
    for line in lines:
        if not in_nav:
            if re.match(r"^nav:\s*$", line):
                in_nav = True
                continue
            out.append(line)
        else:
            # Still inside the nav block?
            if line.strip() == "" or re.match(r"^[ \t#-]", line):
                continue
            # Hit the next top-level key -- stop skipping.
            in_nav = False
            out.append(line)
    return out


def main() -> int:
    base = yaml.safe_load((ROOT / "mkdocs.yml").read_text(encoding="utf-8"))
    nav = base.get("nav")
    if not nav:
        print("error: mkdocs.yml has no nav key", file=sys.stderr)
        return 1

    docs_nav = transform_nav(nav)
    nav_yaml = yaml.dump(
        {"nav": docs_nav},
        default_flow_style=False,
        allow_unicode=True,
        sort_keys=False,
    )

    docs_yml = ROOT / "mkdocs.docs.yml"
    lines = docs_yml.read_text(encoding="utf-8").splitlines(keepends=True)

    cleaned = strip_nav_block(lines)
    text = "".join(cleaned).rstrip("\n") + "\n\n" + nav_yaml

    docs_yml.write_text(text, encoding="utf-8")
    print(f"Injected nav into {docs_yml.name} ({len(docs_nav)} top-level entries)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
