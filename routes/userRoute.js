const express = require("express");
const userController = require("../controller/usercontroller");
const userRouter =express.Router();
const imageSchema= require('../model/image');
const Register= require('../model/schema');
//const optVerification=require('../model/otpVerification'); 
const bodyparser=require('body-parser');
userRouter.use(bodyparser.json());
userRouter.use(bodyparser.urlencoded({extended:false}));

const bcrypt=require('bcrypt');
//userRouter.get('/verify',userController.verfiyOTP);
userRouter.get('/Register',userController.register);
userRouter.post('/Register',userController.register);
userRouter.get('/login',userController.login);
userRouter.post('/login',userController.login);
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
    if (!req.body.name || !req.body.location || !req.body.phone || !req.file || !req.body.email || !req.body.password) {
      req.flash('message', 'Please fill in all the fields.');
      return res.redirect('/sellerAccount');
    }

    const { email, password } = req.body;

    const user = await Register.findOne({ email });
    if (!user) {
      req.flash('message', 'Invalid email address');
      return res.redirect('/selleraccount');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      req.flash('message', "Email and password didn't match");
      return res.redirect('/selleraccount');
    }

    const newImage = new imageSchema({
      name: req.body.name,
      location: req.body.location,
      phone: req.body.phone,
      image: req.file.filename,
      email: req.body.email,
      password: req.body.password,
    });

    const users= await newImage.save();
   res.render('userprofile',{users})
   
    
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
});
 userRouter.get('/userprofile',async(req,res)=>{ 
  try {
    const user = await imageSchema.find({});
    console.log([user]);
    res.send({ success: true, msg: 'error', user:user });
  } catch (error) {
    console.error(error);
    res.send({ success: false, msg: 'Error retrieving user', error });
  }
});
 
    
  

    



   










//   userRouter.post('/selleraccount',upload.single('image'),async (req, res) => {
//     console.log(req.file);
//     try {
//       // Check if the required fields are filled
//       if (!req.body.name || !req.body.location || !req.body.phone || !req.file||!req.body.email||!req.body.password) {
//         req.flash('message', 'Please fill in all the fields.');
//         return res.redirect('/sellerAccount');
//       }
//       const { email, password } = req.body;
//       const userEmail = await Register.findOne({ email });
//     if (userEmail) {
//       const passwordMatch = await bcrypt.compare(password, userEmail.password);
//       if (passwordMatch) {
//         return res.status(201).render('userprofile');
//       } else {
//         req.flash('message', "Email and password didn't match");
//         return res.redirect('/selleraccount');
//       }
//     }
//       const newImage = new imageSchema({
//         name: req.body.name,
//         location: req.body.location,
//         phone: req.body.phone,
//         image: req.file.filename,
//         email: req.body.email,
//         password: req.body.password,
//       });
//      const users=await newImage.save();
//       res.render('userprofile',{users:[users]});
//       console.log(users.name);
//       console.log(users.email);
//     }   
//      catch(error){
//           res.status(400).send({sucess:false,msg:error.message});
//      }
//   });
// userRouter.get('/userprofile',(req, res) => {
//     // Retrieve the users data from the session
//     const users = req.session.users;
    
//     // Render the EJS template and pass the users data
//     res.render('userprofile', { users: users });
//   });
userRouter.route("/review").put(userController.createProductReviews)
userRouter.route("/reviews").get(userController.getAllReviews).delete(userController.deleteReview)
module.exports =userRouter;