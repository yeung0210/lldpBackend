const mongoose = require('mongoose');
const Schema = mongoose.Schema


const clinicSchema = new mongoose.Schema ({
    clinic_id: String,
    name: String,
    address: String,
    phone: String, 
    website: String, 
    opening_hour: String, 
    district: String, 
    // availability_times: Array,
    latitude: Number, 
    longitude: Number,
    image_url: String,

});
module.exports = mongoose.model('Clinic', clinicSchema)