const { Router } = require("express");
const passport = require("passport");
const { validate } = require("express-validation");
const {  createComment,  getCommentById,  getallComment,  updateComment,  deleteComment,  likeComment,  dislikeComment,  commentLikes } = require("../controllers/comment-controller");

const {  commentValidate,  updateCommentValidate } = require("../validations/comment-validation");

const commentRouter = Router({ mergeParams: true });

const authenticate = passport.authenticate("auth", { session: false });

commentRouter.post("/", validate(commentValidate), authenticate, createComment);
commentRouter.get("/:commentid", authenticate, getCommentById);
commentRouter.get("/", authenticate, getallComment);
commentRouter.put("/:commentid", validate(updateCommentValidate), authenticate, updateComment);
commentRouter.delete(  "/:commentid", authenticate,  hasRole(["admin", "user"]),  deleteComment);

commentRouter.post("/:commentid/likes", likeComment);
commentRouter.post("/:commentid/dislikes", dislikeComment);
commentRouter.get("/:commentid/commentlikes", commentLikes);

module.exports = commentRouter;
