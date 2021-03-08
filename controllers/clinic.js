const Clinic = require('../models/clinic')
const common = require('../common')
const async = require('async');


module.exports = { 
    add: (req, res) => {
        const newClinic = new Clinic({
            name: req.body.name,
            address: req.body.address,
            phone: req.body.phone, 
            website: req.body.website, 
            opening_hour: req.body.opening_hour, 
            district: req.body.district, 
            availability_times: req.body.availability_times,
            latitude: req.body.latitude, 
            longitude: req.body.longitude,
        })
        newClinic.save();
        res.send(common.response(200, '成功加入', ''))

    },
    getByDistrict: (req, res) => {
        const district = req.body.district
        Clinic.find({ 'district': district }, function (err, docs) {
            res.send(common.response(200, 'Clinic in ' + district, docs))
        });

    }
}

