const { Joi } = require("express-validation");
Joi.objectId = require('joi-objectid')(Joi)

exports.postValidate = {
  body: Joi.object({
    userPost: Joi.string().required(),
  }),
  params: Joi.object({
    userid: Joi.objectId()
  }),
};

exports.getAllPostsValidate = {
  params: Joi.object({
    userid: Joi.objectId()
  }),
};

exports.getPostValidate = {
  params: Joi.object({
    userid: Joi.objectId(),
    postid: Joi.objectId()
  }),
};

exports.updatePostValidate = {
  body: Joi.object({
    userPost: Joi.string().required()
  }),
  params: Joi.object({
    userid: Joi.objectId(),
    postid: Joi.objectId()
  }),
};

exports.deletePostValidate = {
  params: Joi.object({
    userid: Joi.objectId(),
    postid: Joi.objectId()
  }),
};
