const { Router } = require("express");
const passport = require("passport");
const { validate } = require("express-validation");

const { registerUser, getUserById, udpdateUser,  deleteUser, getAllUser,  loginUser,} = require("../controllers/user-controller");

const {  registerValidate, loginValidate,  updateUserValidate,  getUserByIdValidate,  deleteUserValidate,} = require("../validations/user-validation");

require("../middlewares/user-auth");

const userRouter = Router({ mergeParams: true });

const authenticate = passport.authenticate("auth", { session: false });
const authenticateLogin = passport.authenticate("login", { session: false });

userRouter.post("/", validate(registerValidate), registerUser);
userRouter.post("/login", validate(loginValidate), authenticateLogin, loginUser);
userRouter.get("/:userid", validate(getUserByIdValidate), authenticate, getUserById);
userRouter.get("/", authenticate, getAllUser);
userRouter.put(  "/:userid", validate(updateUserValidate), authenticate, udpdateUser);
userRouter.delete(  "/:userid",  validate(deleteUserValidate), authenticate, hasRole(["admin", "user"]), deleteUser);

module.exports = userRouter;
