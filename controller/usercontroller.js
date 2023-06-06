//register user
const asynchandler =require("express-async-handler");
const bcrypt =require("bcrypt");
const jwt =require('jsonwebtoken');
require('dotenv').config();
const nodemailer=require('nodemailer');
//import schememodel
const Register =require('../model/schema');
//const { use } = require("../routes/login");
const { Cookie } = require("cookie-parser");
const user=require('../model/image')
const sendToken=require('../middelware/sendToken')
const imageSchema=require('../model/image');
//sendverfiymail
const sendVerfiyMail=async(name,email,user_id)=>{
try{

 const transporter = nodemailer.createTransport({

    service: 'gmail',
    auth:{
      user:'aneshabastakoti@gmail.com',
      pass:'teynxpicqfwqjndq'
    }
  });
  const mailOption={
    from:'aneshabastakoti@gmail.com',
    to:email,
    subject:'for verification mail',
    html:'<p>hello' +name+' please click here to <a href="http://localhost:3000/verify?id='+user_id+'"> verfiy </a> your mail.</p>'
    
  }
  transporter.sendMail(mailOption,function(error,info){
    if(error){
      console.log(error);
    }
    else{
      res.flash('message',"email has been sent ",info.response);
      res.redirect('/register');
    }
  })
  
res.redirect('/register');
}catch(error){
  console.log(error.message);
}
}
//for register
const register= async(req,res)=>{
    const{name,email,password,confirmpassword}= req.body;

 //checking all fields are filled out
    if (!name || !email || !password || !confirmpassword) {
      req.flash('message', 'All fields are required');
      return res.redirect('/register');
      }
    try{
    const userAvailable = await Register.findOne({email});
 if(userAvailable){
   req.flash('message',"Already exist user");
   return res.redirect('/register');
}
//checking invalid email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  req.flash('message', 'Invalid email format');
   return res.redirect('/register');
}
if (password !== confirmpassword) {
    req.flash('message','Passwords do not match' );
   return res.redirect('/register');
    }
  //creating hashpassword
  const hashPassword = await bcrypt.hash(password,10);
  console.log('hashpassword:',hashPassword);
  //creating new user
  const user =await Register.create({
      name,
      email,
      password: hashPassword,
      confirmpassword:hashPassword,
      is_verified:0,
  });

  await user.save();
  if(user){
     sendVerfiyMail(req.body.name, req.body.email, user._id);
  req.flash('message', 'Registration successful. Please check your email for verification.');
  return res.render('register', { message: req.flash('message') }); // Pass the message to the register pag
    }
    sendToken(user, 201, res);
  }
  catch (error) {
    console.log(error);
         req.flash('message','Registration failed');
        return res.redirect('/register');
  }
  
  };
  
 const verfiyMail=async(req,res)=>{
  try{
    const updateInfo = await Register.updateOne({ _id: req.query._id }, { $set: { is_verified: true } });
    console.log(updateInfo);
    req.flash('message', 'Email verified. You can now log in.');
    return res.render('login', { message: req.flash('message') }); // Pass the message to the login page
    
  }catch(error){
    console.log(error);
  }
 }
 
//for login
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const userEmail = await Register.findOne({ email: email });
    if (userEmail) {
      const passwordMatch = await bcrypt.compare(password, userEmail.password);
      
    
  if (passwordMatch) {
    sendToken(user, 201, res);
        return res.status(201).render('homepage');
      }
      else {
        req.flash('message', "password didn't match");
        return res.redirect('/login');
      }

    } 
    else {
      // User with the provided email does not exist
      req.flash('message', "user doesn't exist");
      return res.redirect('/login');
    }

  }
  catch (error) {
    console.log(error);
    return res.status(400).send("an error occured");

  }
}
const displayUser=async(req,res)=>{
    try{
      
      // Fetch all products from the database
     await imageSchema.find();
     const users = global.usersData;
     //const users = req.session.users;
  
   // Return the products as a response
  res.render('userprofile',{ success: true, data:users});

  }catch(error){
      res.status(400).send({sucess:false,msg:error.message});
  }
};
  
// Add reviews and ratings for Products
const createProductReviews = (async (req, res, next) => {
  const { rating, comment, userId } = req.body;
try{
  const review = {
    user: req.user._id,//sodhchu hai paxi 
    name: req.user.name,
    rating: Number(rating),
    comment
  };

  const userreview = await imageSchema.findById(userId);

  const isReviewed = userreview.reviews.find(
    (rev) => rev.user.toString() == req.user._id.toString()
  );
  if (isReviewed) {
    userreview.reviews.forEach((rev) => {
      if (rev.user.toString() == req.user._id.toString()) 
        (rev.rating = rating),
        (rev.comment = comment)
    });

  } else {
    userreview.reviews.push(review);
    userreview.numOfReview = userreview.reviews.length
  }
  
   
  let avg = 0;
   userreview.reviews.forEach(rev =>{
    avg = avg + rev.rating
  })
 
 userreview.ratings = avg / product.reviews.length
 userreview.save({validateBeforeSave:false})

 res.status(200).json({
  success: true,
 });
 }catch(error){
console.log(error);
 }
 })
 

// get all reviews 
const getAllReviews = (async(req, res, next)=>{
try{
  const userreview = await imageSchema.findById(req.query.id)

  if(!userreview){
    return next(new Error("Product not Found", 404));
  }
 
  res.status(200).json({
    success:true,
    reviews:userreview.review })

}catch(error){
  console.log(error);
}
});

// Delete reviews

const deleteReview = (async(req, res, next)=>{
  try{
 const userreview= await imageSchema.findById(req.query.userId)

 if(!userreview){
  return next(new Error("Product not found"))
 }

 const reviews = userreview.reviews.filter((rev)=> rev._id.toString() !== req.query.id.toString());
 let avg = 0;
   reviews.forEach(rev =>{
    avg = avg + rev.rating
  })
  let  ratings = 0;
  if(reviews.length === 0 ){
      ratings = 0
  }else{
    ratings = avg / userreview.reviews.length

  }

  const numOfReview = reviews.length
  await imageSchema.findByIdAndUpdate(req.query.productId,{
    reviews,
    ratings,
    numOfReview,
  },
  {
    new:true,
    runValidators:true,
    useFindAndModify:true
  }) 
  res.status(200).json({
    success:true,
    message:"Review deleted Successfully"
   })
  }catch(error){
    console.log(error);
  }
  })
//for verying register
module.exports ={register,
  login,verfiyMail,displayUser,
  deleteReview,getAllReviews,createProductReviews};
