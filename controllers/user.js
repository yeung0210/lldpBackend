const User = require('../models/user')
const bcrypt = require('bcryptjs')
const common = require('../common')
const jwt = require('jsonwebtoken');
const response = require('../common');
const nodemailer = require('nodemailer');
const async = require('async');
const crypto = require('crypto');

var email = process.env.MAILER_EMAIL_ID || 'auth_email_address@gmail.com',
  pass = process.env.MAILER_PASSWORD || 'auth_email_pass'

var smtpTransport = nodemailer.createTransport({
  service: process.env.MAILER_SERVICE_PROVIDER || 'Gmail',
    auth: {
        user: email,
        pass: pass
    }
});




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
    }, 
    authenticate: (req, res, next) => {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null) { return res.sendStatus(401) }

        jwt.verify(token, process.env.SECRET, (err, user) => {
            if (err) { return res.sendStatus(403) }
            req.user = user
            next()
        })
    },
    forgotPassword: async (req, res) => {
        const userId = req.body.userId;
        const user = await User.findOne({ userId })
        if (!user) { 
            return res.send(common.response(404, '用戶不存在', ''))  
        }

        async.waterfall([
            function(next) { 
                crypto.randomBytes(20, function(err, buffer) {
                    var token = buffer.toString('hex');
                    console.log(token);
                    next(err, user, token);
                });
            },
            function(user, token, next) {
                User.findByIdAndUpdate({ _id: user._id }, { reset_password_token: token, reset_password_expires: Date.now() + 86400000 }, { upsert: true, new: true }).exec(function(err, new_user) {
                  next(err, token, new_user);
                });
            },
            function(token, user, done) {
                var data = {
                  to: user.email,
                  from: email,
                  template: 'forgot-password-email',
                  subject: 'Password help has arrived!',
                  html: '<h2>請透過以下連結進入應用程式重設密碼</h2><p><a>請按此重設密碼</a></p>'
                };
          
                smtpTransport.sendMail(data, function(err) {
                  if (!err) {
                    return res.send(common.response(200, '已透過電郵將密碼重設連結傳送給用戶', ''));
                  } else {
                    return res.send(common.response(503, '網絡問題，無法傳送密碼重設連結', err));
                  }
                });
              }

        ]);
        

    }
}

