const userModel = require('../models/user-model');
const postModel = require('../models/post-model');
const commentModel = require('../models/comment-model');
const createError = require('http-errors');

exports.registerUser = async (req,res,next) => {
    try {
        const newUser = await userModel.create(req.body);
        res.json(newUser);
    } catch (error) {
        next(error)
    }
}

exports.loginUser = async (req,res,next) => {
    try {
        res.json({message: "Logged in Successfully", token: req.user});
    } catch (error) {
        next(error)
    }
}

exports.getUserById = async (req,res,next) => {
    try {
        const { userid } = req.params;
        const user = await userModel.findById(userid, 'username email isDeleted').lean();
        if(!user) throw createError.NotFound('User not found', 404);
        if(user.isDeleted !== 'true') return res.json(user);
        res.json('user not found');       
    } catch (error) {
        next(error)
    }
}

exports.getAllUser = async (req,res,next) => {
    try {
        const users = await userModel.find().lean();
        res.json(users);       
    } catch (error) {
        next(error)
    }
}

exports.udpdateUser = async (req,res,next) => {
    try {
        const { userid } = req.params;
        if(userid !== req.user._id) throw createError.BadRequest('You cannot update another user', 400);
        const { username, email, password } = req.body; 
        await userModel.findByIdAndUpdate(userid, {username,email,password}, { new:  true }).lean();
        res.json('updated successfully');
    } catch (error) {
        next(error)
    }
}

exports.deleteUser = async (req,res,next) => {
    try {
        const { userid } = req.params;

        // const user = await userModel.findById(userid).lean();
        // if(!user) throw createError.NotFound('User not found for delete.', 404)
        
        if((req.user.role != 'admin') &&  (req.user._id != userid)) {
            throw createError.BadRequest('you cannot delete another user',400)
        }

        await userModel.findByIdAndUpdate(userid, {$set: {
            isDeleted: 'true', deletedBy: req.user.role, deleteAt: Date.now()
        }});
        await postModel.updateMany({userid}, {$set: {
            isDeleted: 'true', deletedBy: req.user.role, deleteAt: Date.now()
        }});
        await commentModel.updateMany({commentBy: userid} , {$set: {
            isDeleted: 'true', deletedBy: req.user.role, deleteAt: Date.now()
        }});

        res.json('User Deleted Successfully');
    } catch (error) {
        next(error)
    }
}