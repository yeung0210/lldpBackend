const express = require('express')
const router = express.Router()

const userController = require('../controllers/user')

router.post('/register', userController.register)

router.post('/login', userController.login)

router.post('/forgotPassword', userController.forgotPassword)

router.post('/resetPassword', userController.resetPassword)

router.post('/forgotUserId', userController.forgotUserId)

module.exports = router