#!/usr/bin/env bash
set -eu
set -E
# set -x
# set -o pipefail

# .env file

if [ ! -f '.env' ]; then
  echo '>>> Create .env file from .env.*.template .'
  cp -a '.env.dev.template' '.env'
fi
