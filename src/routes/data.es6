const express = require('express')
const router = express.Router()

const dataController = require('../controllers/data.es6')

router.get('/parks', dataController.getAllParks)
router.get('/park/:id', dataController.getParkWithId)
router.get('/park/:id/markers', dataController.getParkMarkers)
router.get('/park/:id/buses', dataController.getBusMarkers)
router.post('/population', dataController.getPopulation)

module.exports = router
