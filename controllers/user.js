const User = require('../models/user')
const bcrypt = require('bcryptjs')
const common = require('../common')
const express = require("express");
const bodyParser = require("body-parser");

module.exports = { 
    register: async (req, res) => {
        const user = await User.findOne({ email: req.body.email })
        if (user) {
            const result = common.standardResponse(409, '帳號已註冊過，請直接登入', '')
            return res.send(result)
        }
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(req.body.password, salt)
        const newUser = new User({
            userId: req.body.userId,
            email: req.body.email,
            name: req.body.name,
            password: hash,
          })
          newUser.save();
          const result = common.standardResponse(200, '成功註冊', '')
          res.send(result)
    },
    login: (req, res) => {

    }
}

