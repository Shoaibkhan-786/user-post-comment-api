const { Router } = require("express");
const passport = require("passport");
const { validate } = require("express-validation");
const { createPost, getPostById,  getAllPost,  updatePost,  deletePost,  likePost,  dislikePost,  postLikes,} = require("../controllers/post-controller");

const {  postValidate, getPostValidate,  getAllPostsValidate,  updatePostValidate,  deletePostValidate,} = require("../validations/post-validation");

require("../middlewares/user-auth");
const postRouter = Router({ mergeParams: true });

const authenticate = passport.authenticate("auth", { session: false });

postRouter.post("/", validate(postValidate), authenticate, createPost);
postRouter.get("/:postid",  validate(getPostValidate),  authenticate,  getPostById);
postRouter.get("/", validate(getAllPostsValidate), authenticate, getAllPost);
postRouter.put(  "/:postid",  validate(updatePostValidate),  authenticate,  hasRole(["user"]),  updatePost);
postRouter.delete(  "/:postid",  validate(deletePostValidate),  authenticate,  hasRole(["admin", "user"]),  deletePost);

postRouter.post("/:postid/likes", likePost);
postRouter.post("/:postid/dislikes", dislikePost);
postRouter.get("/:postid/postlikes", postLikes);

module.exports = postRouter;
