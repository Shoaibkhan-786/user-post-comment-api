const createError = require('http-errors');
const commentModel = require('../models/comment-model');
const postModel = require('../models/post-model');



exports.createComment = async (req,res,next) => {
    try {
        const { userid, postid } = req.params;
        const { comment } = req.body;

        const userPost = await postModel.findById(postid);
        if(!userPost) throw createError.NotFound({status: 404, message: 'post not found to comment'});

        await commentModel.create({comment:comment,commentby:userid,commentOn:postid});
        res.json('Comment created Successfully');
    } catch (error) {
        next(error)
    }
}

exports.getCommentById = async (req,res,next) => {
    try {
        const { commentid } = req.params;
        const comment = await commentModel.findById(commentid);
        if(!comment) throw createError.NotFound({status: 404, message: 'comment not found'});
        res.json(comment);
    } catch (error) {
        next(error)
    }
}

exports.getallComment = async (req,res,next) => {
    try {
        const { userid,postid } = req.params;
        const comments = await commentModel.find({commentBy: userid,commentOn: postid});
        if(comments.length == 0) throw createError.NotFound({status: 404, message: 'comment not found'});
        res.json(comments);
    } catch (error) {
        next(error)
    }
}


exports.updateComment = async (req, res, next) => {
    try {
        const { userid, postid, commentid } = req.params;
        const { comment } = req.body;

        const userComment = await commentModel.findById(commentid).lean();
        if(!userComment) throw createError.NotFound({status: 404, message: 'comment not found to update'});

        const { commentBy, commentOn } = userComment;
        if(userid != commentBy || postid != commentOn) {
            throw createError.BadRequest({status: 400, message: 'you have no right to update another comment.'});
        }

        const updated_comment = await commentModel.findByIdAndUpdate(commentid, {$set: {comment}}, {new:true})
        res.json(updated_comment);
    } catch (error) {
        next(error)
    } 
}

exports.deleteComment = async (req,res,next) => {
    try {
        const { userid, commentid } = req.params;

        const userComment = await commentModel.findById(commentid);
        if(!userComment) throw createError.NotFound('comment not found to delete', 404);

        if((req.user.role == 'admin') ||  (req.user._id == userid && userComment.commentBy == userid ) ) {
            await commentModel.findByIdAndUpdate(commentid, {$set: {
                isDeleted: 'true', deletedBy: req.user.role, deleteAt: Date.now()
            }})
        } else throw createError.BadRequest('you can\'t delete another post.', 400);

        res.json('Comment Deleted Successfully.');
    } catch (error) {
        next(error)
    }
}


exports.likeComment = async (req,res,next) => {
    try {
        const { commentid } = req.params;
        await commentModel.findByIdAndUpdate(commentid, {$inc: {'totalLikes': 1}});
        res.json(`you like the ${commentid}`);
    } catch (error) {
         next(error)
    }
 }

 exports.dislikeComment = async (req,res,next) => {
    try {
        const { commentid } = req.params;
        await commentModel.findByIdAndUpdate(commentid, {$inc: {'totalLikes': -1}});
        res.json(`you dislike the ${commentid}`);
    } catch (error) {
         next(error)
    }
 }

 exports.commentLikes = async (req,res,next) => {
    try {
        const { commentid } = req.params;
        const comment = await commentModel.findById(commentid).lean();
        const totalLikes = comment.totalLikes;
        res.json(`Total Likes on comment ${commentid} are ${totalLikes}`);
    } catch (error) {
         next(error)
    }
 }