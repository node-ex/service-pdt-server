#!/usr/bin/env bash
set -eu
set -E
# set -x
# set -o pipefail

# Create .env file, if it does not exist.
./_script/env-create-dev.sh

# Load environment variables from .env .
$(sed 's/^/export /g' .env)

./_script/docker-containers-down-dev.sh || true

if [ "`docker container inspect ${DOCKER_CONTAINER_POSTGIS} 2> /dev/null || true`" != '[]' ]; then
  cd ../common-postgis
  ./_script/docker-containers-down-dummy.sh
  cd -
fi
