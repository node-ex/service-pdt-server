#!/usr/bin/env bash
set -eu
set -E
# set -x
# set -o pipefail

if [ ! -f '.env' ]; then
  echo '>>> Create .env file from .env.dev.template .'
  cp -a '.env.dev.template' '.env'
fi
