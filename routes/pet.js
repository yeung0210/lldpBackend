const express = require('express')
const router = express.Router()

const petController = require('../controllers/pet')

router.post('/add', petController.add)

module.exports = router