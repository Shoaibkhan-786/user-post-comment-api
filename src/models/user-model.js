const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = Schema({
    username: {
        type: String,
        required: true,
        lowercase: true,
    },
    role: {
        type: String,
        default: 'user'
    },
    email: {
        type: String,
        required: true,
        unique: true,
        
    },
    password: {
        type: String,
        required: [true, 'password is required field']
    },
    isDeleted: {
        type: Boolean,
        default: 'false'
    },
    deletedBy: {
       type: String,
    },
    deleteAt: {
        type: Date,
    }
}, { timestamps: true, versionKey: false})


userSchema.pre('save', async function(next) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.checkPassword = async function(password) {
    return  bcrypt.compare(password, this.password);
}


module.exports = userModel = model('userModel', userSchema);