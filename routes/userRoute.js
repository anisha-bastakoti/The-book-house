const express = require("express");
const userController = require("../controller/usercontroller");
const userRouter =express.Router();
const imageSchema = require('../model/image');
const session =require('express-session');
const config =require("../config/config"); 
userRouter.use(session({secret:config.sessionSceret,
resave:false,
saveUninitialized:false}));

const auth=require('../middelware/auth');
userRouter.get('/verify',userController.verfiyMail);
userRouter.get('/Register',userController.register);
userRouter.post('/Register',userController.register);
userRouter.get('/login',userController.login);
userRouter.post('/login',userController.login);
userRouter.put("/review",userController.createProductReviews)
userRouter.get("/reviews",userController.getAllReviews)
userRouter.delete('/reviews',userController.deleteReview)
//upload image 
userRouter.use( express.static('public'));

require("../model/image");
const multer =require('multer');
const path=require('path');
userRouter.use(express.static('public'));
const storage =multer.diskStorage({
    destination:function(req,file,cb){
cb(null,path.join(__dirname,'../public/upload'),function(err,sucess){
    if(err){
        throw err
    }
});
    },
    filename:function(req,file,cb){
const name=Date.now()+'-'+file.originalname;
cb(null,name,function(err,sucess){
    if(err){
    throw err
    }
})
    }
});
const upload=multer({storage:storage});
  userRouter.post('/selleraccount', upload.single('image'), async (req, res) => {
    console.log(req.file);
    try {
      // Check if the required fields are filled
      if (!req.body.name || !req.body.location || !req.body.phone || !req.file) {
        req.flash('message', 'Please fill in all the fields.');
        return res.redirect('/sellerAccount');
      }
  
      const newImage = new imageSchema({
        name: req.body.name,
        location: req.body.location,
        phone: req.body.phone,
        image: req.file.filename,
        email: req.body.email,
        password: req.body.password,
      });
     const users=await newImage.save();
     
      //req.flash('message', 'Successfully created account');
      res.redirect('/userprofile',200,{data:users});
      console.log(users);
    }   
     catch(error){
          res.status(400).send({sucess:false,msg:error.message});
     }
  });
  
userRouter.get('/userprofile',userController.displayUser)
module.exports =userRouter;