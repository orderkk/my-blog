/* eslint-disable no-undef */
const express = require('express')
const sha1 = require('sha1')
const UserModel = require('../models/users')
const router = express.Router()
const checkNotLogin = require('../middlewares/check').checkNotLogin


// GET /signin 登录页
router.get('/', checkNotLogin, function (req, res) {
    res.render('signin')
})

// POST /signin 用户登录
router.post('/', checkNotLogin, function (req, res) {
    const name = req.fields.name
    const password = req.fields.password

    try {
        if (!name.length) {
            throw new Error('请填写用户名')
        }
        if (!password.length) {
            throw new Error('请填写密码')
        }
    } catch (error) {
        req.flash('error', e.message)
        return res.redirect('back')
    }

    UserModel.getUserByName(name)
        .then((user) => {
            if (!user) {
                req.flash('error', '用户不存在')
                return res.redirect('back')
            }

            // 检查密码
            if (sha1(password) !== user.password) {
                req.flash('error', '用户名或者密码错误')
                return res.redirect('back')
            }

            req.flash('success', '登录成功')

            delete user.password
            req.session.user = user


            // 跳转主页
            res.redirect('/posts')
        }).catch(e => {
            throw new Error(e)
        })
})


module.exports = router