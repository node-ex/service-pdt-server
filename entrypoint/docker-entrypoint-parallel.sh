#!/usr/bin/env bash
set -eu
# set -E
# set -x
set -o pipefail

echo '>>> Wait until ... .'
wait-for-it.sh -t 0 --strict --quiet --host=localhost --port=5432 -- echo '>>> ... is ready.'

echo '>>> Execute commands that require ... to be ready to accept connections.'
# ...
