require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

const userRoutes = require('./routes/user')
const clinicRoutes = require('./routes/clinic')

mongoose.connect("mongodb://localhost:27017/lldpDB", {
    useNewUrlParser: true, useUnifiedTopology: true,  useFindAndModify: false 
});

app.use('/users', userRoutes)
app.use('/clinics', clinicRoutes)


app.listen(3000, function() {
  console.log("Server started on port 3000");
});