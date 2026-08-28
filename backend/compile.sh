#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT="$ROOT/out"
rm -rf "$OUT"
mkdir -p "$OUT"
javac --release 17 --add-modules jdk.httpserver -d "$OUT" \
  "$ROOT"/src/main/java/com/secureline/atm/*.java