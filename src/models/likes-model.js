const { Schema, model } = require('mongoose');

const likesSchema = Schema({
   likeBy: {
    type: Schema.Types.ObjectId, ref: "userModel"
   },
   likeOn: {
    type: Schema.Types.ObjectId, ref: "postModel"

   }
}, { versionKey: false})



module.exports = likesModel = model('likesModel', likesSchema);