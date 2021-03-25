const mongoose = require('mongoose');
const Schema = mongoose.Schema

const petSchema = new mongoose.Schema ({
    pet_id: String,
    name: String,
    dateOfBirth: String,
    type: String, 
    breed: String, 
    image_url: String,
});
module.exports = mongoose.model('Pet', petSchema)