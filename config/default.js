/* eslint-disable no-undef */
module.exports = {
    port: 3005,
    session: {
        secret: 'myblog',
        key: 'myblog',
        maxAge: 259200000
    },
    mongodb: 'mongodb://localhost:27017/myblog'
}