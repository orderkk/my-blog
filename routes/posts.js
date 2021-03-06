/* eslint-disable no-undef */
const express = require('express')
const router = express.Router()
const PostModel = require('../models/posts')
const CommentModel = require('../models/comments')
const checkLogin = require('../middlewares/check').checkLogin

// GET /posts 所有用户或者特定用户的文章页
router.get('/', function (req, res, next) {
    const author = req.query.author

    PostModel.getPosts(author)
        .then((posts) => {
            res.render('posts', {
                posts: posts
            })
        }).catch(next)
    // res.render('posts')
    // next()
})

// POST /posts/create 发表一篇文章
router.post('/create', checkLogin, function (req, res, next) {
    const author = req.session.user._id
    const title = req.fields.title
    const content = req.fields.content

    // 校验参数
    try {
        if (!title.length) {
            throw new Error('请填写标题啊铁纸')
        }
        if (!content.length) {
            throw new Error('请填写内容啊铁纸')
        }
    } catch (error) {
        req.flash('error', e.message)
        return res.redirect('back')
    }


    let post = {
        author: author,
        title: title,
        content: content
    }

    PostModel.create(post)
        .then((result) => {
            post = result.ops[0]
            req.flash('success', '发表成功')
            res.redirect(`/posts/${post._id}`)
        })
        .catch(next)
})


// GET /posts/create 发表文章页
router.get('/create', checkLogin, function (req, res,) {
    res.render('create')
})

// GET /posts/:postId 单独一篇的文章页
router.get('/:postId', function (req, res, next) {
    const postId = req.params.postId

    Promise.all([
        PostModel.getPostById(postId),
        CommentModel.getComments(postId), // 获取该文章下的所有留言
        PostModel.incPv(postId)
    ]).then((result) => {
        const post = result[0]
        const comments = result[1]
        if (!post) {
            throw new Error('该文章已存在')
        }
        res.render('post', {
            post: post,
            comments: comments
        })
    }).catch(next)
    // res.send('文章详情页')
    // next()
})

// GET /posts/:postId/edit 更新文章页
router.get('/:postId/edit', checkLogin, function (req, res, next) {
    const postId = req.params.postId
    const author = req.session.user._id

    PostModel.getRawPostById(postId)
        .then((post) => {
            if (!post) {
                throw new Error('该文章不存在')
            }
            if (author.toString() !== post.author._id.toString()) {
                throw new Error('权限不足')
            }

            res.render('edit', {
                post: post
            })
        }).catch(next)
})

// POST /posts/:postId/edit 更新一篇文章
router.post('/:postId/edit', checkLogin, function (req, res, next) {

    const postId = req.params.postId
    const author = req.session.user._id
    const title = req.fields.title
    const content = req.fields.content

    // 校验参数
    try {
        if (!title.length) {
            throw new Error('请填写标题')
        }
        if (!content.length) {
            throw new Error('请填写内容')
        }
    } catch (error) {
        req.flash('error', e.message)
        return res.redirect('back')
    }

    PostModel.getRawPostById(postId)
        .then(post => {
            if (!post) {
                throw new Error('文章不存在')
            }
            if (post.author._id.toString() !== author.toString()) {
                throw new Error('没有权限')
            }
            PostModel.updatePostById(postId, { title: title, content: content })
                .then(() => {
                    req.flash('success', '编辑成功')
                    res.redirect(`/posts/${postId}`)
                })
        }).catch(next)
})

// GET /posts/:postId/remove 删除一篇文章
router.get('/:postId/remove', checkLogin, function (req, res, next) {
    const postId = req.params.postId
    const author = req.session.user._id

    PostModel.getRawPostById(postId)
        .then(post => {
            if (!post) {
                throw new Error('文章不存在')
            }
            if (post.author._id.toString() !== author.toString()) {
                throw new Error('没有权限')
            }

            PostModel.delPostById(postId)
                .then(() => {
                    req.flash('success', '删除成功')
                    res.redirect('/posts')
                })
        }).catch(next)
})


module.exports = router
