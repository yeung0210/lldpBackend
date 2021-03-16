const Clinic = require('../models/clinic')
const common = require('../common')
const async = require('async');
const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);
const haversine = require('haversine')



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
    getClinicNearby: async (req, res) => {
        var current = new Date()
        var availableClinics = []

        async.waterfall([
            function(next) {
                Clinic.find({}, function (err, allClinics) {
                    allClinics.forEach( function(clinic) {
                        const opening_hour_session = clinic.availability_times[current.getDay()]
                        // console.log(clinic.availability_times[current.getDay()])
                        const matched = opening_hour_session.some( function(timeObj) {
                            if (timeObj["start_time"] == "24HOURS" && timeObj["end_time"] == "24HOURS") { return true}
                            else {
                                const start_time = moment(timeObj["start_time"], 'HH:mm a')
                                const end_time = moment(timeObj["end_time"], 'HH:mm a')
                                const range = moment.range(start_time, end_time)
                                return range.contains(current)
                            }
                        })
                        if (matched) availableClinics.push(clinic)
                    } )
                    
                    next(err, availableClinics, next)
                })
                
            },
            function(availableClinics, done) {
                const start = {
                    latitude: req.body.latitude,
                    longitude: req.body.longitude
                }
                const clinicsWithDistance = availableClinics.map( function(clinic) {
                    const end = {
                        latitude: clinic.latitude,
                        longitude: clinic.longitude
                    }
                    return {clinic, "distance" : haversine(start, end, {unit: 'meter'}) }
                }) 
                clinicsWithDistance.sort(function(a, b) {
                    return a.distance - b.distance
                })
                const availableClinicsNearby = clinicsWithDistance.filter(function(clinic)  {
                    return clinic.distance <= 2000
                })
                if (availableClinicsNearby.length == 0) {
                    res.send(common.response(200, 'Clinic Nearby', clinicsWithDistance.slice(0,3)))
                } else {
                    res.send(common.response(200, 'Clinic Nearby', availableClinicsNearby))
                }
                
            }
        ])

        
        
    }
}

