/* eslint-disable no-undef */
const marked = require('marked')
const Comment = require('../lib/mongo').Comment


// 将 comment 的 content 从 markdown 转换成 html
Comment.plugin('contentToHtml', {
    afterFind: function (comments) {
        return comments.map((comment) => {
            comment.content = marked(comment.content)
            return comment
        })
    }
})


module.exports = {
    // 创建一个留言
    create: function create(comment) {
        return Comment.create(comment).exec()
    },
    // 通过留言的id获取留言内容 
    getCommentById: function getCommentById(commentId) {
        return Comment.findOne({
            _id: commentId
        }).exec()
    },
    // 通过留言id删除留言
    delCommentById: function delCommentById(commentId) {
        return Comment.deleteOne({
            _id: commentId
        }).exec()
    },
    // 通过文章id删除文章所有的留言
    delCommentsByPostId: function delCommentsByPostId(postId) {
        return Comment.deleteMany({
            postId: postId
        }).exec()
    },
    // 通过文章id获取该文章下的所有的留言
    getComments: function getComments(postId) {
        return Comment
            .find({ postId: postId })
            .populate({
                path: 'author',
                model: 'User'
            })
            .sort({ _id: 1 })
            .addCreatedAt()
            .contentToHtml()
            .exec()
    },
    // 通过文章id获取该文章留言数
    getCommentsCount: function getCommentsCount(postId) {
        return Comment.count({
            postId: postId
        }).exec()
    }
}