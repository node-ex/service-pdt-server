const Model = require('../models/model.es6')

exports.getAllParks = async(req, res, next) => {
  const geojson = await Model.getAllParks()
  res.send(geojson)
}

exports.getParkWithId = async(req, res, next) => {
  const geojson = await Model.getParkWithId(req.params.id)
  res.send(geojson)
}

exports.getParkMarkers = async(req, res, next) => {
  const geojson = await Model.getParkMarkers(req.params.id)
  res.send(geojson)
}

exports.getBusMarkers = async(req, res, next) => {
  const geojson = await Model.getBusMarkers(req.params.id)
  res.send(geojson)
}

exports.getPopulation = async(req, res, next) => {
  const geojson = await Model.getPopulation(req.body.lng, req.body.lat)
  res.send(geojson)
}
