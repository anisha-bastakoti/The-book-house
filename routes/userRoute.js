const express = require("express");
const userController = require("../controller/usercontroller");
const userRouter =express.Router();

userRouter.post('/Register',userController.register);
userRouter.post('/login',userController.login);

module.exports =userRouter;