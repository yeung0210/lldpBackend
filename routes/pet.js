const express = require('express')
const pet = require('../controllers/pet')
const router = express.Router()

const petController = require('../controllers/pet')

router.post('/add', petController.add)

router.post('/getByUserId', petController.getByUserId)

module.exports = router