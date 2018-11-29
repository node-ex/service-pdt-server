const pool = require('./pool.es6')

class Model {
  static async getAllParks() {
    const query = {
      text: `
      with pop as (
        select
          pop."name"
          ,ST_Transform(pop.way, 4326) as way
          ,ST_Transform(ST_Centroid(pop.way), 4326) as center_point
          ,sum(pdat.tot_p) as population
        from planet_osm_polygon pop
        join population_geometry pgeo
          on st_dwithin(
            st_transform(pop.way, 3857),
            st_transform(pgeo.geom, 3857),
            0
          )
        join population_data pdat
          on pgeo.grd_newid = pdat.grd_newid
        where 1=1
          and pop.leisure = 'park'
          and pop."name" is not null
        group by pop."name", pop.way
      )
      select jsonb_build_object(
        'type', 'FeatureCollection',
        'features', jsonb_agg(features.feature)
      ) as "json"
      from (
        select jsonb_build_object(
          'type', 'Feature',
          'geometry', ST_AsGeoJSON(ST_Transform(pop.way, 4326), 15, 1)::jsonb,
          'properties', jsonb_build_object(
            'name', pop."name",
            'population', pop.population,
            'center_point', ST_AsGeoJSON(pop.center_point)::jsonb
          )
        ) as feature
        from pop
      ) features;
      `
    }

    try {
      const result = await pool.query(query)
      console.log(result)
      const json = JSON.stringify(result.rows[0].json, undefined, 2)
      console.log(json)
      return json
    } catch (error) {
      console.log(error.stack)
    }
  }

  static async getParkWithPoint(lng, lat) {
    const query = {
      text: `
        select jsonb_build_object(
          'type', 'FeatureCollection',
          'features', jsonb_agg(features.feature)
        ) as "json"
        from (
          select jsonb_build_object(
            'type', 'Feature',
            'id', osm_id,
            'geometry', ST_AsGeoJSON(
              ST_Transform(pop.way, 4326), 15, 1
            )::jsonb,
          'properties', jsonb_build_object(
              'name', "name",
              'center_point', ST_AsGeoJSON(
                ST_Transform(ST_Centroid(pop.way), 4326)
              )::jsonb
          )
          ) as feature
          from planet_osm_polygon as pop
          where 1=1
            and leisure = 'park'
            and st_contains(
              st_transform(pop.way, 4326),
            st_setsrid(st_point($1, $2), 4326)
            )
        ) features;
      `,
      values: [
        lng,
        lat
      ]
    }

    try {
      const result = await pool.query(query)
      const json = JSON.stringify(result.rows[0].json, undefined, 2)
      console.log(json)
      return json
    } catch (error) {
      console.log(error.stack)
    }
  }

  static async getParkMarkers(lng, lat) {
    const query = {
      text: `
      with popo as (
        select
          popo.osm_id
          ,popo.way
          ,popo.amenity as marker
        from planet_osm_point popo, planet_osm_polygon pop
        where 1=1
          and pop.leisure = 'park'
          and st_contains(
            st_transform(pop.way, 4326),
            st_setsrid(
              st_point($1, $2),
              4326
            )
          )
          and st_contains(
            pop.way,
            popo.way
          )
          and popo.amenity in (
            'bench',
            'drinking_water',
            'toilets'
          )
      )
      select jsonb_build_object(
        'type', 'FeatureCollection',
        'features', jsonb_agg(features.feature)
      ) as "json"
      from (
        select jsonb_build_object(
          'type', 'Feature',
          'id', popo.osm_id,
          'geometry', ST_AsGeoJSON(ST_Transform(popo.way, 4326), 15, 1)::jsonb,
          'properties', jsonb_build_object(
              'marker', popo.marker
          )
        ) as feature
        from popo
      ) features;
      `,
      values: [
        lng,
        lat
      ]
    }

    try {
      const result = await pool.query(query)
      const json = JSON.stringify(result.rows[0].json, undefined, 2)
      console.log(json)
      return json
    } catch (error) {
      console.log(error.stack)
    }
  }

  static async getBusMarkers(lng, lat) {
    const query = {
      text: `
      with popo as (
        select
          popo.osm_id
          ,popo."name"
          ,popo.way
          ,popo.highway as marker
        from planet_osm_point popo, planet_osm_polygon pop
        where 1=1
          and pop.leisure = 'park'
          and st_contains(
            st_transform(pop.way, 4326),
            st_setsrid(
              st_point($1, $2),
              4326
            )
          )
          and popo.highway = 'bus_stop'
          and st_dwithin(
            st_transform(pop.way, 3857),
            st_transform(popo.way, 3857),
            1000
          )
      )
      select jsonb_build_object(
        'type', 'FeatureCollection',
        'features', jsonb_agg(features.feature)
      ) as "json"
      from (
        select jsonb_build_object(
          'type', 'Feature',
          'id', popo.osm_id,
          'geometry', ST_AsGeoJSON(ST_Transform(popo.way, 4326), 15, 1)::jsonb,
          'properties', jsonb_build_object(
              'marker', popo.marker,
              'name', popo."name"
          )
        ) as feature
        from popo
      ) features;
      `,
      values: [
        lng,
        lat
      ]
    }

    try {
      const result = await pool.query(query)
      const json = JSON.stringify(result.rows[0].json, undefined, 2)
      console.log(json)
      return json
    } catch (error) {
      console.log(error.stack)
    }
  }

  static async getPopulation(lng, lat) {
    const query = {
      text: `
      with pgeo as (
        select
          pdat.tot_p as population
          ,st_transform(pgeo.geom, 4326) as way
        from
          planet_osm_polygon pop,
          population_geometry pgeo,
          population_data pdat
        where 1=1
          and pop.leisure = 'park'
          and st_contains(
            st_transform(pop.way, 4326),
            st_setsrid(
              st_point($1, $2),
              4326
            )
          )
          and st_dwithin(
            st_transform(pop.way, 3857),
            st_transform(pgeo.geom, 3857),
            1000
          )
          and pgeo.grd_newid = pdat.grd_newid
      )
      select jsonb_build_object(
        'type', 'FeatureCollection',
        'features', jsonb_agg(features.feature)
      ) as "json"
      from (
        select jsonb_build_object(
          'type', 'Feature',
          'geometry', ST_AsGeoJSON(ST_Transform(pgeo.way, 4326), 15, 1)::jsonb,
          'properties', jsonb_build_object(
              'population', pgeo.population
          )
        ) as feature
        from pgeo
      ) features;
      `,
      values: [
        lng,
        lat
      ]
    }

    try {
      const result = await pool.query(query)
      const json = JSON.stringify(result.rows[0].json, undefined, 2)
      console.log(json)
      return json
    } catch (error) {
      console.log(error.stack)
    }
  }
}

module.exports = Model
