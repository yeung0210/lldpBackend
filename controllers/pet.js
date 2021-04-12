const Pet = require('../models/pet')
const userController = require('../controllers/user')
const common = require('../common')
const async = require('async');

module.exports = {  
    add: async (req, res) => {
        userController.authenticate(req, res, function() {
            const newPet = new Pet({
                pet_id: req.body.pet_id,
                user_id: req.user.user_id,
                name: req.body.name,
                gender: req.body.gender,
                date_of_birth: req.body.date_of_birth,
                type: req.body.type, 
                breed: req.body.breed, 
                image_url: req.body.image_url, 
            })
            newPet.save();
            res.send(common.response(200, '成功加入', ''))
        })
    },
    getByUserId: (req, res) => {
        userController.authenticate(req, res, function() {
            const user_id = req.user.user_id
            Pet.find({ 'user_id': user_id }, function (err, docs) {
                res.send(common.response(200, 'Pet', docs))
            });
        })
    },
}