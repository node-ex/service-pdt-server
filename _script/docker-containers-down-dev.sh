#!/usr/bin/env bash
set -eu
set -E
# set -x
# set -o pipefail

docker-compose \
  --file docker-compose.dev.yml \
  down \
    --timeout 0

# Remove dummy Docker volumes.
bash -c "$(
cat <<'EOF'

$(sed 's/^/export /g' .env)
docker volume rm $(docker volume ls --quiet | grep --regexp "${DOCKER_REPOSITORY_USERNAME}-${DOCKER_REPOSITORY_NAME}-dummy-.*") 2> /dev/null

EOF
)"
