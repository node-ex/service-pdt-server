#!/usr/bin/env bash
set -eu
set -E
# set -x
# set -o pipefail

# Create .env file, if it does not exist.
./_script/env-create-dev.sh

# Load environment variables from .env .
$(sed 's/^/export /g' .env)

if [ "`docker container inspect ${DOCKER_CONTAINER_POSTGIS} 2> /dev/null || true`" = '[]' ]; then
  cd ../common-postgis
  ./_script/docker-containers-up-dummy.sh
  cd -
fi

./_script/docker-containers-up-dev.sh
