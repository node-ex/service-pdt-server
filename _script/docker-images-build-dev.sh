#!/usr/bin/env bash
set -eu
set -E
# set -x
# set -o pipefail

# Create .env file, if it does not exist.
./_script/env-create-dev.sh

# Load environment variables from .env .
$(sed 's/^/export /g' .env)

echo ">>> Build image: ${DOCKER_REPOSITORY_USERNAME}/${DOCKER_REPOSITORY_NAME}-dev:latest ."
docker-compose \
  --file docker-compose.dev.yml \
  build \
    --force-rm \
    --no-cache \
    $(sed 's/^/--build-arg /g' .env | tr '\n' ' ')

# --project-name service-pdt-server
