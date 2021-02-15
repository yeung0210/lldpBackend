const mongoose = require('mongoose');
const Schema = mongoose.Schema


const userSchema = new mongoose.Schema ({
    user_id: String,
    email: String,
    name: String,
    password: String,
    reset_password_code: String,
    reset_password_expires: Date

});
module.exports = mongoose.model('User', userSchema)