#!/usr/bin/env bash
set -eu
# set -E
# set -x
set -o pipefail

if [ "$*" = 'app' ]; then
    # docker-entrypoint-parallel.sh &

    echo '>>> Wait until PostgreSQL is ready to accept connections.'
    wait-for-it.sh \
        --strict \
        --quiet \
        --timeout=0 \
        --host="${DOCKER_CONTAINER_POSTGIS}" \
        --port=5432 \
        -- \
        echo '>>> External PostgreSQL is ready.'

    # Execute commands that require PostgreSQL to be ready to accept connections.

    export PGPASSWORD="${POSTGRES_PASSWORD:-}"
    echo '>>> Creating database.'
    createdb \
        --host "${DOCKER_CONTAINER_POSTGIS}" \
        --port 5432 \
        --username postgres \
        gis
    echo '>>> Initializing PostgreSQL extensions.'
    psql \
        --host "${DOCKER_CONTAINER_POSTGIS}" \
        --port 5432 \
        --username postgres \
        --dbname gis \
        --command 'CREATE EXTENSION postgis; CREATE EXTENSION hstore;'
    echo '>>> Importing data into PostgreSQL.'
    osm2pgsql \
        --host "${DOCKER_CONTAINER_POSTGIS}" \
        --port 5432 \
        --username postgres \
        --database gis \
        --create \
        /data/map.osm

    tail -f /dev/null
else
    exec "$@"
fi
