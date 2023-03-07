const { Joi } = require("express-validation");

exports.postValidate = {
  body: Joi.object({
    userPost: Joi.string().required(),
  }),
  params: Joi.object({
    userid: Joi.string().required(),
  }),
};

exports.getAllPostsValidate = {
  params: Joi.object({
    userid: Joi.string().required(),
  }),
};

exports.getPostValidate = {
  params: Joi.object({
    userid: Joi.string().required(),
    postid: Joi.string().required(),
  }),
};

exports.updatePostValidate = {
  body: Joi.object({
    userPost: Joi.string().required(),
  }),
  params: Joi.object({
    userid: Joi.string().required(),
    postid: Joi.string().required(),
  }),
};

exports.deletePostValidate = {
  params: Joi.object({
    userid: Joi.string().required(),
    postid: Joi.string().required(),
  }),
};
