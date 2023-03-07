const postModel = require("../models/post-model");
const commentModel = require("../models/comment-model");
const createError = require("http-errors");

exports.createPost = async (req, res, next) => {
  try {
    const { userid } = req.params;
    const { userPost } = req.body;
    if (userid !== req.user._id)
      throw createError.BadRequest("You cannot post for another user.", 400);
    const post = await postModel.create({ userid, userPost });
    res.json(post);
  } catch (error) {
    next(error);
  }
};

exports.getPostById = async (req, res, next) => {
  try {
    const { postid } = req.params;
    const post = await postModel.findById(postid).lean();
    if (!post)
      throw createError.NotFound({ status: 404, message: "post not found" });
    res.json(post);
  } catch (error) {
    next(error);
  }
};

exports.getAllPost = async (req, res, next) => {
  try {
    const { userid } = req.params;
    const posts = await postModel.find({ userid: userid }).lean();

    if (posts.length == 0)
      throw createError.NotFound({ status: 404, message: "posts not found" });

    res.json(posts);
  } catch (error) {
    next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const { userid, postid } = req.params;
    const { userPost } = req.body;
    const post = await postModel.findById(postid);
    if (!post) throw createError.NotFound("post not found to update", 404);

    if (post.userid != userid) {
      throw createError.Forbidden(
        "you cannot update another  post. Plz enter correct id.",
        403
      );
    }
    const updated_post = await postModel.findByIdAndUpdate(
      postid,
      { $set: { userPost } },
      { new: true }
    );
    res.json(updated_post);
  } catch (error) {
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const { userid, postid } = req.params;
    const post = await postModel.findById(postid);
    if (!post) throw createError.NotFound("post not found to delete", 404);

    if (
      req.user.role == "admin" ||
      (req.user._id == userid && post.userid == userid)
    ) {
      await postModel.findByIdAndUpdate(postid, {
        $set: {
          isDeleted: "true",
          deletedBy: req.user.role,
          deleteAt: Date.now(),
        },
      });

      await commentModel.updateMany(
        { commentOn: postid },
        {
          $set: {
            isDeleted: "true",
            deletedBy: req.user.role,
            deleteAt: Date.now(),
          },
        }
      );
    } else throw createError.BadRequest("you can't delete another post.", 400);

    res.json("Post Deleted Successfully");
  } catch (error) {
    next(error);
  }
};

exports.likePost = async (req, res, next) => {
  try {
    const { userid, postid } = req.params;

    const checkUser = await likesModel
      .findOne({ likeBy: userid, likeOn: postid })
      .lean();
    if (checkUser)
      throw createError.Forbidden("you can't like a post twice.", 403);

    await likesModel.create({ likeBy: userid, likeOn: postid });
    await postModel.findByIdAndUpdate(postid, { $inc: { totalLikes: 1 } });

    res.json(`you like the post ${postid}.`);
  } catch (error) {
    next(error);
  }
};

exports.dislikePost = async (req, res, next) => {
  try {
    const { userid, postid } = req.params;
    const checkUser = await likesModel
      .findOne({ likeBy: userid, likeOn: postid })
      .lean();
    if (!checkUser)
      throw createError.Forbidden("plz like the post first.", 403);

    await likesModel.deleteOne({ likeBy: userid, likeOn: postid });
    await postModel.findByIdAndUpdate(postid, { $inc: { totalLikes: -1 } });
    res.json(`you dislike the post ${postid}`);
  } catch (error) {
    next(error);
  }
};

exports.postLikes = async (req, res, next) => {
  try {
    const { postid } = req.params;
    const post = await postModel.findById(postid).lean();
    const counts = post.totalLikes;
    res.json(`Total counts on this post are ${counts}`);
  } catch (error) {
    next(error);
  }
};
