const express = require("express");
const userController = require("../controller/usercontroller");
//const productController=require('../controller/product');
const userRouter =express.Router();
const imageSchema = require('../model/image');
const session =require('express-session');
const config =require("../config/config"); 
userRouter.use(session({secret:config.sessionSceret,
resave:false,
saveUninitialized:false}));

const auth=require('../middelware/auth');
//userRouter.get('/shopnow',productController.displayproduct);
//userRouter.post('/shopnow',productController.displayproduct);

userRouter.get('/verify',userController.verfiyMail);
userRouter.get('/Register',userController.register);
userRouter.post('/Register',userController.register);
userRouter.get('/login',userController.login);
userRouter.post('/login',userController.login);
//userRouter.get('/addproduct',productController.getProduct);

//upload image 
userRouter.use( express.static('public'));
const multer=require('multer');
const user = require("../model/image");
//const userproduct = require("../model/userproduct");
const fileStorageEngine =multer.diskStorage({
  destination:(req,file,cb)=>{
  cb(null,'public/upload/')
  },
  filename:(req,file,cb)=>{
    cb(null,Date.now()+'-'+file.originalname)
  }
})
 const upload=multer({storage:fileStorageEngine })

userRouter.post('/selleraccount',upload.single('image'),async(req,res)=>{
  console.log(req.file);
try{
  // Check if the required fields are filled
  if (!req.body.name || !req.body.location || !req.body.phone || !req.file) {
    req.flash('message', 'Please fill in all the fields.');
    return res.redirect('/sellerAccount');
  }

  // Check if the user already exists
  const user = await imageSchema.findOne({ email: req.body.email });
  if (user) {
    req.flash('messsage', 'User account already exists.');
    return res.redirect('/sellerAccount');
  }
  const newImage = new imageSchema({
     name:req.body.name,
    location: req.body.location,
    phone :req.body.phone,
    image: 
    {
      data:req.file.buffer,
      //data: Buffer.from(req.file.buffer),
      //contentType:req.file.mimetype,
    },
    email:req.body.email,
    password:req.body.password
});
await newImage.save();
req.flash('message', 'Successfully created account');
res.redirect('/userprofile');
}
catch(error){
  console.log(error);
}
});
//userRouter.post('/addproduct',upload.single('image'),productController.postProduct);


 

module.exports =userRouter;