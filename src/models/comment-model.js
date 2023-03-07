const { Schema, model } = require('mongoose');

const commentSchema = Schema({
    comment: {
        type: String,
        lowercase: true,
        minlength: 3
    },
    commentby: {
        type: Schema.Types.ObjectId, ref: "userModel"
    },
    commentOn: {
        type: Schema.Types.ObjectId, ref: "postModel"
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedby: {
        type: String
    },
    deleteAt: {
        type: Date
    },
    totalLikes: {
        type: Number
    }
}, { timestamps: true, versionKey: false});


module.exports = commentModel = model('commentModel', commentSchema);