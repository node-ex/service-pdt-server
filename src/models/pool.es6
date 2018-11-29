const config = require('../config/default.es6')

const { Pool } = require('pg')

const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database
})

module.exports = pool
