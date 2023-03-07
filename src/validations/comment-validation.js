const { Joi } = require("express-validation");

exports.commentValidate = {
    body: Joi.object({
        comment: Joi.string().required(),
      })
}

exports.updateCommentValidate = {
    body: Joi.object({
        comment: Joi.string().required(),
      })
}