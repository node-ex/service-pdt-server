const Model = require('../models/model.es6')

exports.getAllParks = async(req, res, next) => {
  const geojson = await Model.getAllParks()
  res.send(geojson)
}

exports.getParkWithPoint = async(req, res, next) => {
  console.log(req.body)
  const geojson = await Model.getParkWithPoint(req.body.lng, req.body.lat)
  res.send(geojson)
}

exports.getParkMarkers = async(req, res, next) => {
  console.log(req.body)
  const geojson = await Model.getParkMarkers(req.body.lng, req.body.lat)
  res.send(geojson)
}

exports.getBusMarkers = async(req, res, next) => {
  console.log(req.body)
  const geojson = await Model.getBusMarkers(req.body.lng, req.body.lat)
  res.send(geojson)
}

exports.getPopulation = async(req, res, next) => {
  console.log(req.body)
  const geojson = await Model.getPopulation(req.body.lng, req.body.lat)
  res.send(geojson)
}
