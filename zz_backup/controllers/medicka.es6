const MedickaModle = require('../models/medicka.es6')

exports.getMedicka = async(req, res, next) => {
  const geojson = await MedickaModle.query()
  res.send(geojson)
}
