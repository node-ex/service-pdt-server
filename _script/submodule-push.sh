#!/usr/bin/env bash
set -Eeu

./_script/submodule-commit.sh

git pull
git push
