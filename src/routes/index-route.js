const { Router } = require('express');
const userRouter = require('./user-route');
const postRouter = require('./post-route');
const commentRouter = require('./comment-route');

const indexRouter = Router({mergeParams:true});

indexRouter.use('/users', userRouter)
indexRouter.use('/users/:userid/posts', postRouter)
indexRouter.use('/users/:userid/posts/:postid/comments', commentRouter)



module.exports = indexRouter;