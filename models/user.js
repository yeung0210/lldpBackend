const mongoose = require('mongoose');
const Schema = mongoose.Schema


const userSchema = new mongoose.Schema ({
    userId: String,
    email: String,
    name: String,
    password: String
});
module.exports = mongoose.model('User', userSchema)