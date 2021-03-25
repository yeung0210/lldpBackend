const Pet = require('../models/pet')
const userController = require('../controllers/user')
const common = require('../common')
const async = require('async');

module.exports = {  
    add: async (req, res) => {
        userController.authenticate(req, res, function() {
            res.sendStatus(200)
        })
    }
}