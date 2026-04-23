#!/usr/bin/env bash
# Stages two input trees used by the split build:
#   _stage/home -> minimal landing (just the hero, copied assets, CNAME)
#   _stage/docs -> full docs tree, with index.md replaced by introduction.md
#
# Both build outputs are later merged under _publish/ so that:
#   gonka.ai/            serves the landing
#   gonka.ai/docs/       serves the introduction page content
#   gonka.ai/docs/...    serves all other docs pages
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/docs"
STAGE="$ROOT/_stage"

rm -rf "$STAGE"
mkdir -p "$STAGE/home/zh"

# --- Home stage --------------------------------------------------------------
cp "$SRC/index.md"       "$STAGE/home/index.md"
cp "$SRC/zh/index.md"    "$STAGE/home/zh/index.md"

# Assets referenced by the landing (non-.md files are copied verbatim by mkdocs).
for dir in assets images stylesheets; do
  if [ -d "$SRC/$dir" ]; then
    cp -R "$SRC/$dir" "$STAGE/home/$dir"
  fi
done

# Keep the GitHub Pages custom domain at the site root.
if [ -f "$SRC/CNAME" ]; then
  cp "$SRC/CNAME" "$STAGE/home/CNAME"
fi

# --- Docs stage --------------------------------------------------------------
# Full copy of docs/, then overwrite the root index.md with introduction.md
# content so /docs/ serves the Introduction page directly.
mkdir -p "$STAGE/docs"
cp -R "$SRC/." "$STAGE/docs/"

cp "$STAGE/docs/introduction.md"    "$STAGE/docs/index.md"
cp "$STAGE/docs/zh/introduction.md" "$STAGE/docs/zh/index.md"

# Remove the now-duplicate introduction.md from the docs stage so the build
# produces a single canonical URL (/docs/ and /docs/zh/). A redirect stub is
# written later by generate-redirects.py at /docs/introduction/ -> /docs/ so
# any stale internal link keeps working.
rm -f "$STAGE/docs/introduction.md" "$STAGE/docs/zh/introduction.md"

# CNAME only belongs at the site root; remove the copy inside /docs/.
rm -f "$STAGE/docs/CNAME"

echo "Staged:"
echo "  $STAGE/home -> landing"
echo "  $STAGE/docs -> docs (introduction as index.md)"
