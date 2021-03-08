const mongoose = require('mongoose');
const Schema = mongoose.Schema


const clinicSchema = new mongoose.Schema ({
    name: String,
    address: String,
    phone: String, 
    website: String, 
    opening_hour: String, 
    district: String, 
    availability_times: Array,
    latitude: Number, 
    longitude: Number

});
module.exports = mongoose.model('Clinic', clinicSchema)