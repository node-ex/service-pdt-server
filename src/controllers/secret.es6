const config = require('../config/default.es6')

exports.getSecrets = async(req, res, next) => {
  res.send({
    token: config.mapbox.token
  })
}
