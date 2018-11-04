#!/usr/bin/env bash
set -eu
set -E
# set -x
# set -o pipefail

./_script/submodule-commit.sh

echo '>>> Pull and push the submodule.'
git pull
git push
