/* eslint-disable no-undef */
const express = require('express')
const router = express.Router()
const checkLogin = require('../middlewares/check').checkLogin


// GET /signout 登出
router.get('/', checkLogin, function (req, res) {
    
    req.session.user = null
    req.flash('success', '退出成功')
    res.redirect('/posts')
})


module.exports = router