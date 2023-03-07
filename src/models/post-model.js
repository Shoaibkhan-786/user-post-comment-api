const { Schema, model } = require("mongoose");

const postSchema = Schema(
  {
    userPost: {
      type: String,
      required: true,
    },
    userid: {
      type: Schema.Types.ObjectId,
      ref: "userModel",
    },
    isDeleted: {
      type: Boolean,
      default: "false",
    },
    deletedBy: {
      type: String,
    },
    deleteAt: {
      type: Date,
    },
    totalLikes: { type: Number },
  },
  { timestamps: true, versionKey: false }
);

module.exports = postModel = model("postModel", postSchema);
