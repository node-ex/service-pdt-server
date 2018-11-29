const pool = require('./pool.es6')

class TestModel {
  constructor() {
    ;
  }

  static async query() {
    const query = {
      text: 'select $1::text as message',
      values: ['Express']
    }

    try {
      const result = await pool.query(query)
      return result.rows[0].message
    } catch (error) {
      console.log(error.stack)
    }
  }
}

module.exports = TestModel
