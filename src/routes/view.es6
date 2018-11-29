const express = require('express')
const router = express.Router()

const indexController = require('../controllers/view.es6')

router.get('/', indexController.getIndex)

module.exports = router
