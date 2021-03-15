const Clinic = require('../models/clinic')
const common = require('../common')
const async = require('async');
const Moment = require('moment');
const MomentRange = require('moment-range');

const moment = MomentRange.extendMoment(Moment);



module.exports = { 
    add: (req, res) => {
        const newClinic = new Clinic({
            clinic_id: req.body.clinic_id,
            name: req.body.name,
            address: req.body.address,
            phone: req.body.phone, 
            website: req.body.website, 
            opening_hour: req.body.opening_hour, 
            district: req.body.district, 
            // availability_times: req.body.availability_times,
            latitude: req.body.latitude, 
            longitude: req.body.longitude,
            image_url: req.body.image_url,
        })
        newClinic.save();
        res.send(common.response(200, '成功加入', ''))

    },
    getAll: (req, res) => {
        Clinic.find({}, function (err, docs) {
            res.send(common.response(200, 'All Clinics', docs))
        });

    },
    getByDistrict: (req, res) => {
        const district = req.body.district
        Clinic.find({ 'district': district }, function (err, docs) {
            res.send(common.response(200, 'Clinic in ' + district, docs))
        });
    },
    getClinicNearby: (req, res) => {
        var current = new Date()
        var availableClinics = []
        Clinic.find({}, function (err, allClinics) {
            allClinics.forEach( function(clinic) {
                const opening_hour_session = clinic.availability_times[current.getDay()]
                // console.log(clinic.availability_times[current.getDay()])
                const matched = opening_hour_session.some( function(timeObj) {
                    const start_time = moment(timeObj["start_time"], 'HH:mm a')
                    const end_time = moment(timeObj["end_time"], 'HH:mm a')
                    const range = moment.range(start_time, end_time)
                    return range.contains(current)
                })
                console.log(matched)
                if (matched) availableClinics.push(clinic)
            } )
            // res.send(availableClinics)
        });
    }
}

