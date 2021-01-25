require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const md5 = require('md5')

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/lldpDB", {
    useNewUrlParser: true, useUnifiedTopology: true
});

const userSchema = new mongoose.Schema ({
    userId: String,
    email: String,
    name: String,
    password: String
});

const User = mongoose.model("users", userSchema);


app.post("/api/register", function(request, response) {
  const newUser = new User({
    userId: request.body.userId,
    email: request.body.email,
    name: request.body.name,
    password: md5(request.body.password),
  })
  newUser.save();
  response.send("ok");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});