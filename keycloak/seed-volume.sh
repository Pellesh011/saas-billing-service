#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VOLUME_NAME="${1:-saas-billing_keycloak_import}"

echo "Creating named volume: $VOLUME_NAME"
docker volume create "$VOLUME_NAME" 2>/dev/null || true

echo "Copying realm-export.json into volume..."
docker run --rm \
  -v "$VOLUME_NAME:/data" \
  -v "$SCRIPT_DIR/realm-export.json:/tmp/realm-export.json" \
  alpine sh -c "cp /tmp/realm-export.json /data/"

echo "Done. Volume '$VOLUME_NAME' is ready."
