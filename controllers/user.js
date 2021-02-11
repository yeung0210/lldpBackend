const User = require('../models/user')
const bcrypt = require('bcryptjs')
const common = require('../common')
const jwt = require('jsonwebtoken')
const response = require('../common')
const nodemailer = require('nodemailer')
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
        const sameUserId = await User.findOne({ user_id: req.body.user_id })
        if (sameUserId) {
            return res.send(common.response(409, '該用戶名稱已有人使用，請重新輸入', ''))
        }
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(req.body.password, salt)
        const newUser = new User({
            user_id: req.body.user_id,
            email: req.body.email,
            name: req.body.name,
            password: hash,
          })
          newUser.save();
          res.send(common.response(200, '成功註冊', ''))
    },

    login: async (req, res) => {
        const user_id = req.body.user_id
        const password = req.body.password
        const user = await User.findOne({ user_id })
        if (!user) { 
            return res.send(common.response(404, '用戶不存在', ''))  
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) { 
            return res.send(common.response(401, '密碼錯誤', ''))  
        }
        const accessToken = jwt.sign({ user_id: user.user_id }, process.env.SECRET)
        const data = {
            user: {
                user_id: user.user_id,
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
        const email = req.body.email;
        const user = await User.findOne({ email })
        if (!user) { 
            return res.send(common.response(404, '用戶不存在', ''))  
        }

        async.waterfall([
            function(next) {
                const charSet = 'abcdefghijklmnopqrstuvwxyz0123456789';
                var randomString = '';
                for (var i = 0; i < 6; i++) {
                    var randomPoz = Math.floor(Math.random() * charSet.length);
                    randomString += charSet.substring(randomPoz,randomPoz+1);
                }
                var verificationCode = randomString
                User.findByIdAndUpdate({ _id: user._id }, { reset_password_code: verificationCode, reset_password_expires: Date.now() + 86400000 }, { upsert: true, new: true }).exec(function(err, new_user) {
                    console.log(new_user.reset_password_code)
                  next(err, verificationCode, new_user)
                });
            },
            function(verificationCode, user, done) {
                var data = {
                  to: user.email,
                  from: email,
                  template: 'forgot-password-email',
                  subject: '主子萬歲：重設密碼',
                  html: '<h2>重設密碼</h2><p>在重設密碼時，請輸入電郵驗證碼</p><p><b>' + verificationCode + '<b></p>'
                };
          
                smtpTransport.sendMail(data, function(err) {
                  if (!err) {
                    return res.send(common.response(200, '已透過電郵將驗證碼傳送給用戶', ''));
                  } else {
                    return res.send(common.response(503, '網絡問題，無法傳送密碼重設驗證碼', err));
                  }
                });
              }

        ]);
        

    },
    resetPassword: async (req, res) => { 
        const user_id = req.body.user_id
        const new_psssword = req.body.new_password
        const reset_password_code = req.body.reset_password_code
        const user = await User.findOne({ user_id })
        const now = new Date()
        if (!user) { 
            return res.send(common.response(404, '用戶不存在', ''))  
        }
        if (reset_password_code == user.reset_password_code) {
            if (now <= user.reset_password_expires) {
                const salt = await bcrypt.genSalt(10)
                const hash = await bcrypt.hash(new_psssword, salt)
                if (hash == user.password) {
                    return res.send(common.response(403, '新密碼與現時密碼不能相同', ''))
                }
                user.password = hash
                user.reset_password_code = undefined
                user.reset_password_expires = undefined
                user.save(function(err) {
                    if (err) {
                        return res.send(common.response(422, '未能重設密碼，請稍後重試', ''))  
                    } else {
                        return res.send(common.response(200, '重設密碼成功', ''))  
                    }
                })
            } else {
                return res.send(common.response(410, '驗證碼已過時，請重新提出重設密碼的請求', '')) 
            }
        } else {
            return res.send(common.response(401, '驗證碼不符，請重新提出重設密碼的請求', ''))  
        }

    }
}

