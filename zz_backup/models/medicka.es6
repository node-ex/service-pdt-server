const readFileAsync = require('../utils/readFileAsync.es6')
const pool = require('./pool.es6')

class MedickaModel {
  constructor() {
    ;
  }

  static async retrieveFile() {
    const data = await readFileAsync('../../data/medicka.json', 'utf8')
    return JSON.parse(data)
  }

  static async query() {
    const query = {
      text: `
        select
          row_to_json(fc)
        from (
          select
            'FeatureCollection' as type,
            array_to_json(array_agg(f)) as features
          from (
            select
              'Feature' as type,
              ST_AsGeoJSON(ST_Transform(pop.way, 4326))::json as geometry,
              row_to_json((osm_id, "name")) as properties
            from planet_osm_polygon as pop
            where 1=1
              and to_tsvector('english', name) @@ to_tsquery('english', $1)
          ) as f
        ) as fc;
      `,
      values: ['Medická']
    }

    try {
      const result = await pool.query(query)
      const json = JSON.stringify(result.rows[0].row_to_json, undefined, 2)
      return json
    } catch (error) {
      console.log(error.stack)
    }
  }
}

module.exports = MedickaModel
