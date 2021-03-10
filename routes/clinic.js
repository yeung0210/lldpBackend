const express = require('express')
const router = express.Router()

const clinicController = require('../controllers/clinic')

router.post('/add', clinicController.add)

router.post('/getAll', clinicController.getAll)

router.post('/getByDistrict', clinicController.getByDistrict)




module.exports = router