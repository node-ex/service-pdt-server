const express = require('express')
const router = express.Router()

const secretController = require('../controllers/secret.es6')

router.get('/', secretController.getSecrets)

module.exports = router
