#!/usr/bin/env bash
set -eu
set -E
# set -x
# set -o pipefail

# Create .env file, if it does not exist.
./_script/env-create-dev.sh

# Load environment variables from .env .
$(sed 's/^/export /g' .env)

echo ">>> Container down: ${DOCKER_REPOSITORY_USERNAME}-${DOCKER_REPOSITORY_NAME}-dev ."
docker-compose \
  --file docker-compose.dev.yml \
  down \
    --timeout 0 || true

echo '>>> Remove Docker volumes, if there are any.'
docker volume rm $(docker volume ls --quiet | grep --regexp "${DOCKER_REPOSITORY_USERNAME}-${DOCKER_REPOSITORY_NAME}-dev-.*") 2> /dev/null || true
