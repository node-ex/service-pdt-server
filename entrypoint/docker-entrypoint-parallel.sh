#!/usr/bin/env bash
set -eu
# set -E
# set -x
set -o pipefail

# echo '>>> Wait until PostgreSQL is ready to accept connections.'
# select='0'
# echo ">>> select value: ${select}"
# while [ "$select" != '1' ]; do
#     echo ">>> Inside while loop."
#     sleep 1

#     host="$(hostname -i || echo '127.0.0.1')"
#     user="${POSTGRES_USER:-postgres}"
#     db="${POSTGRES_DB:-$POSTGRES_USER}"
#     export PGPASSWORD="${POSTGRES_PASSWORD:-}"

#     args=(
#         # force postgres to not use the local unix socket (test "external" connectibility)
#         --host "$host"
#         --username "$user"
#         --dbname "$db"
#         --quiet --no-align --tuples-only
#     )

#     select="$(echo 'SELECT 1' | psql "${args[@]}")"
#     echo ">>> select value: ${select}"
# done

echo '>>> Wait until PostgreSQL is ready to accept connections.'
wait-for-it.sh -t 0 --strict --quiet --host=localhost --port=5432 -- echo '>>> PostgreSQL is ready.' && {
    echo '>>> Execute commands that require PostgreSQL to be ready to accept connections.'
    update-postgis.sh
}