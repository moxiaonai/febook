#!/usr/bin/env bash
set -euo pipefail

# Build the Rspress site and sync doc_build/ to a Baota static-site root.
#
# Required:
#   BT_HOST        SSH host, for example 1.2.3.4 or server.example.com
#   BT_TARGET_DIR  Baota site root, for example /www/wwwroot/fe.fenewbee.com
#
# Optional:
#   BT_USER          SSH user, default: root
#   BT_PORT          SSH port, default: 22
#   BT_SSH_KEY_FILE  Private key file path
#   BT_SOURCE_DIR    Build output directory, default: doc_build
#   BT_DRY_RUN       Set to 1 to preview rsync changes
#   SKIP_BUILD       Set to 1 if doc_build/ was already built

require_env() {
  local name="$1"
  if [[ -z "${!name:-}" ]]; then
    echo "Missing required environment variable: ${name}" >&2
    exit 1
  fi
}

quote_remote_path() {
  printf "%s" "$1" | sed "s/'/'\\''/g; 1s/^/'/; \$s/\$/'/"
}

require_env BT_HOST
require_env BT_TARGET_DIR

BT_USER="${BT_USER:-root}"
BT_PORT="${BT_PORT:-22}"
BT_SOURCE_DIR="${BT_SOURCE_DIR:-doc_build}"
BT_TARGET_DIR="${BT_TARGET_DIR%/}"

if [[ "$BT_TARGET_DIR" != /* || "$BT_TARGET_DIR" == "/" ]]; then
  echo "BT_TARGET_DIR must be an absolute site directory, not: ${BT_TARGET_DIR}" >&2
  exit 1
fi

if [[ "${SKIP_BUILD:-0}" != "1" ]]; then
  pnpm build
fi

if [[ ! -d "$BT_SOURCE_DIR" ]]; then
  echo "${BT_SOURCE_DIR}/ does not exist. Run pnpm build first." >&2
  exit 1
fi

ssh_args=(-p "$BT_PORT" -o StrictHostKeyChecking=accept-new)
rsync_rsh="ssh -p ${BT_PORT} -o StrictHostKeyChecking=accept-new"

if [[ -n "${BT_SSH_KEY_FILE:-}" ]]; then
  ssh_args+=(-i "$BT_SSH_KEY_FILE")
  rsync_rsh="${rsync_rsh} -i ${BT_SSH_KEY_FILE}"
fi

remote="${BT_USER}@${BT_HOST}"
remote_target="$(quote_remote_path "$BT_TARGET_DIR")"

if [[ "${BT_DRY_RUN:-0}" == "1" ]]; then
  rsync -azn --delete --checksum --itemize-changes \
    --exclude=".user.ini" \
    --exclude=".well-known/" \
    -e "$rsync_rsh" \
    "${BT_SOURCE_DIR}/" "${remote}:${BT_TARGET_DIR}/"
  exit 0
fi

ssh "${ssh_args[@]}" "$remote" "mkdir -p -- ${remote_target}"

rsync -az --delete --checksum --itemize-changes \
  --exclude=".user.ini" \
  --exclude=".well-known/" \
  -e "$rsync_rsh" \
  "${BT_SOURCE_DIR}/" "${remote}:${BT_TARGET_DIR}/"

echo "Deployed ${BT_SOURCE_DIR}/ to ${remote}:${BT_TARGET_DIR}/"
