###4.4.1 功能与路由设计
在开发博客之前，我们首先需要明确博客要实现哪些功能。由于本教程面向初学者，所以只实现了博客最基本的功能，其余的功能（如归档、标签、分页等等）读者可自行实现。

##功能及路由设计如下：

注册
注册页：GET /signup
注册（包含上传头像）：POST /signup
登录
登录页：GET /signin
登录：POST /signin
登出：GET /signout
查看文章
主页：GET /posts
个人主页：GET /posts?author=xxx
查看一篇文章（包含留言）：GET /posts/:postId
发表文章
发表文章页：GET /posts/create
发表文章：POST /posts/create
修改文章
修改文章页：GET /posts/:postId/edit
修改文章：POST /posts/:postId/edit  
删除文章：GET /posts/:postId/remove
留言
创建留言：POST /comments
删除留言：GET /comments/:commentId/remove