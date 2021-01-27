const User = require('../models/user')
const bcrypt = require('bcryptjs')
const common = require('../common')
const express = require("express");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const response = require('../common');




module.exports = { 
    register: async (req, res) => {
        const sameEmailUser = await User.findOne({ email: req.body.email })
        if (sameEmailUser) {
            return res.send(common.response(409, '該電子郵件地址已有人使用', ''))
        }
        const sameUserId = await User.findOne({ userId: req.body.userId })
        if (sameUserId) {
            return res.send(common.response(409, '該用戶名稱已有人使用，請重新輸入', ''))
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
          res.send(common.response(200, '成功註冊', ''))
    },

    login: async (req, res) => {
        const userId = req.body.userId;
        const password = req.body.password;
        const user = await User.findOne({ userId })
        if (!user) { 
            return res.send(common.response(404, '用戶不存在', ''))  
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) { 
            return res.send(common.response(401, '密碼錯誤', ''))  
        }
        const accessToken = jwt.sign({ userId: user.userId }, process.env.SECRET)
        const data = {
            user: {
                userId: user.userId,
                email: user.email,
                name: user.name
            },
            token : accessToken
        };
        res.send(common.response(200, '成功登入', data))

        
    }
}

