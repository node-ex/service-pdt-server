#!/usr/bin/env bash
set -Eeu
# set -x

# Create .env file.
./_script/env-create-dev.sh

# Build Docker container.
docker-compose \
  --file docker-compose.dev.yml \
  build \
    --force-rm \
    --no-cache \
    $(sed 's/^/--build-arg /g' .env | tr '\n' ' ')
