const express = require('express')
const router = express.Router()

const medickaController = require('../controllers/medicka.es6')

router.get('/', medickaController.getMedicka)

module.exports = router
