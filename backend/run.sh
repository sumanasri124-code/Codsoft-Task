#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
"$ROOT/compile.sh"
exec java --add-modules jdk.httpserver -cp "$ROOT/out" com.secureline.atm.Main