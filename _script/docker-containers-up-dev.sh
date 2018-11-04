#!/usr/bin/env bash
set -eu
set -E
# set -x
# set -o pipefail

# Create .env file, if it does not exist.
./_script/env-create-dev.sh

# Load environment variables from .env .
$(sed 's/^/export /g' .env)

# Build image, if it does not exist.
if [ "`docker image inspect ${DOCKER_REPOSITORY_USERNAME}/${DOCKER_REPOSITORY_NAME}-dev:latest 2> /dev/null || true`" = '[]' ]; then
  ./_script/docker-images-build-dev.sh
fi

echo ">>> Container up: ${DOCKER_REPOSITORY_USERNAME}-${DOCKER_REPOSITORY_NAME}-dummy ."
docker-compose \
  --file docker-compose.dev.yml \
  up \
    --no-build \
    --force-recreate \
    --detach
