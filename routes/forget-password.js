const express = require('express');
const fogController = require('../controller/forgetpasswordController')
const forgetpasswordRoute = express.Router();
forgetpasswordRoute.get('/forgetpassword', (req, res) => {
    res.render('forget-password', { message: null });
  });
  forgetpasswordRoute.get('/resetpassword', (req, res) => {
    const token = req.query.token;
    res.render('reset-password', { token });
  });
forgetpasswordRoute.post('/forgetpassword',fogController.forgotPassword)
forgetpasswordRoute.post('/resetpassword',fogController.resetpassword)
forgetpasswordRoute.get('/logout',fogController.logOutUser)

module.exports=forgetpasswordRoute;
