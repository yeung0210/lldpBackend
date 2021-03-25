const mongoose = require('mongoose');
const Schema = mongoose.Schema

const petSchema = new mongoose.Schema ({
    pet_id: String,
    user_id: String,
    name: String,
    date_of_birth: String,
    type: String, 
    breed: String, 
    image_url: String,
});
module.exports = mongoose.model('Pet', petSchema)