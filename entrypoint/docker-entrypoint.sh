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
    echo '>>> Create a combined population table.'
    psql \
      --host "${DOCKER_CONTAINER_POSTGIS}" \
      --port 5432 \
      --username postgres \
      --dbname gis \
      --command "
select
  pdat.*
  ,pgeo.geom
into population_data_geometry
from public.population_geometry pgeo
join public.population_data pdat
  on pgeo.grd_newid = pdat.grd_newid;
"
    echo '>>> Create required indexes.'
    psql \
      --host "${DOCKER_CONTAINER_POSTGIS}" \
      --port 5432 \
      --username postgres \
      --dbname gis \
      --command "
begin;
drop index if exists population_geometry_transform_index;
drop index if exists planet_osm_polygon_transform_index;

create index population_geometry_transform_index
on public.population_data_geometry
using gist (st_transform(geom, 3857))
with (fillfactor='100');

create index planet_osm_polygon_transform_index
on public.planet_osm_polygon
using gist (st_transform(way, 3857))
with (fillfactor='100');

drop index if exists planet_osm_polygon_id_index;
drop index if exists planet_osm_polygon_leisure_index;

create index planet_osm_polygon_id_index
on public.planet_osm_polygon(osm_id)
with (fillfactor='100');

create index planet_osm_polygon_leisure_index
on public.planet_osm_polygon(leisure)
with (fillfactor='100');

drop index if exists planet_osm_point_amenity_index;

create index planet_osm_point_amenity_index
on public.planet_osm_point(amenity)
with (fillfactor='100');

drop index if exists planet_osm_point_transform_index;
drop index if exists planet_osm_point_highway_index;

create index planet_osm_point_transform_index
on public.planet_osm_point
using gist (st_transform(way, 3857))
with (fillfactor='100');

create index planet_osm_point_highway_index
on public.planet_osm_point(highway)
with (fillfactor='100');

commit;
"

    # tail -f /dev/null
    npm run dev
else
    exec "$@"
fi
