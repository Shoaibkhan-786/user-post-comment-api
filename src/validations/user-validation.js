const { Joi } = require("express-validation");
Joi.objectId = require('joi-objectid')(Joi)

exports.registerValidate = {
  body: Joi.object({
    username: Joi.string().min(3).max(30).required(),
    role: Joi.string(),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "in", "org"] },
    }),
    password: Joi.string().min(3).max(8).required(),
  }),
};

exports.loginValidate = {
  body: Joi.object({
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "in", "org"] },
    }),
    password: Joi.string().min(3).max(8).required(),
  }),
};

exports.updateUserValidate = {
  body: Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "in", "org"] },
    }),
  }),
  params: Joi.object({
    userid: Joi.objectId()
  }),
};

exports.getUserByIdValidate = {
  params: Joi.object({
    userid: Joi.objectId()
  }),
};

exports.deleteUserValidate = {
  params: Joi.object({
    userid: Joi.objectId(),
  }),
};
