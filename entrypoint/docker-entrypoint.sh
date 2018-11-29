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
        --command 'CREATE EXTENSION postgis; CREATE EXTENSION postgis_topology; CREATE EXTENSION hstore;'
    echo '>>> Importing OSM data into PostgreSQL.'
    osm2pgsql \
        --host "${DOCKER_CONTAINER_POSTGIS}" \
        --port 5432 \
        --username postgres \
        --database gis \
        --create \
        /data/map.osm
    echo '>>> Importing population geometry into PostgreSQL.'
    shp2pgsql \
      -s 3035 \
      /data/population/Grid_ETRS89_LAEA_SK_1K.shp \
      public.population_geometry \
  | psql \
      --host "${DOCKER_CONTAINER_POSTGIS}" \
      --port 5432 \
      --username postgres \
      --dbname gis
    echo '>>> Import population data into PosgreSQL.'
    psql \
      --host "${DOCKER_CONTAINER_POSTGIS}" \
      --port 5432 \
      --username postgres \
      --dbname gis \
      --command "
create table public.population_data (
	GRD_NEWID varchar(25) null,
	TOT_P numeric null,
	TOT_F numeric null,
	TOT_M numeric null,
	F_00_14 numeric null,
	F_15_64 numeric null,
	F_65 numeric null,
	M_00_14 numeric null,
	M_15_64 numeric null,
	M_65 numeric null,
	TOT_00_14 numeric null,
	TOT_15_64 numeric null,
	TOT_65 numeric null,
	TOT_EA numeric null,
	TOT_ENA numeric null,
	TOT_PRAC numeric null,
	TOT_VYS numeric null
);
"
    psql \
      --host "${DOCKER_CONTAINER_POSTGIS}" \
      --port 5432 \
      --username postgres \
      --dbname gis \
      --command "\copy public.population_data FROM '/data/population/Vybrane_agregovane_udaje_o_obyvateloch.csv' delimiter ';' csv header"


    # tail -f /dev/null
    npm run dev
else
    exec "$@"
fi
