require('dotenv').config();
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const jwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const userModel = require('../models/user-model');
const createError = require('http-errors');

passport.use('auth', new jwtStrategy(
    {
        secretOrKey: process.env.secretKey,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    },
    async (JwtPayload,done) => {
        try {
            const { _id } = JwtPayload;
            const isUser = await userModel.findById(_id).lean();
            if(!isUser) throw createError.Unauthorized('you are not registered User', 401);
            return done(null, JwtPayload);
        } catch (error) {
            done(error)
        }
    }
))


passport.use('login', new localStrategy(
    {
        usernameField: "email",
        passwordField: "password",
    },
    async ( email, password, done) => {
        try {
            const user = await userModel.findOne({email});
            console.log(user)
            // if(!user) throw createError.Unauthorized("please enter correct email or register first.", 401)

            const validatePassword = await user.checkPassword(password);
            // if(!validatePassword) throw createError.Unauthorized("please enter correct password.", 401)
                
            const payload = {_id: user._id, role: user.role}
            const token = jwt.sign(payload, process.env.secretKey)
        
            return done(null, token);
        } catch (error) {
            done(error, false) 
        }
    }
))


hasRole = function (roles) {
    return async (req, res, next) => {
        if(roles.includes(req.user.role)){
            return next();
        }
        else {
            return next(new Error('You don\'t have sufficient access to this route.'));
            
        }
    }
}

module.exports = hasRole;


  