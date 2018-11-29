const express = require('express')
const router = express.Router()

const dataController = require('../controllers/data.es6')

router.get('/parks', dataController.getAllParks)
router.post('/park', dataController.getParkWithPoint)
router.post('/markers', dataController.getParkMarkers)
router.post('/buses', dataController.getBusMarkers)
router.post('/population', dataController.getPopulation)

module.exports = router
