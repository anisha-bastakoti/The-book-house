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
   // Create token
  const token = jwt.sign(
    { user_id: user._id, email },
    'N234UTR5679',
    {
      expiresIn: "2h",
    }
  );
  user.token = token;
  console.log(token);
  await user.save();
  
  // Return response or perform further actions
 //res.status(200).json({ success: true, token });
  if(user){
    sendVerfiyMail(req.body.name, req.body.email, user._id);
  req.flash('message', 'Registration successful. Please check your email for verification.');
  return res.render('register', { message: req.flash('message') }); // Pass the message to the register pag
    }
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
    // Create token
    const token = jwt.sign(
      { user_id: userEmail._id, email },
      'N234UTR5679',
      {
        expiresIn: "2h",
      }
      
    );
   
    userEmail.token = token;
    console.log(token);
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
   
// Add reviews and ratings for Products
const createProductReviews = (async (req, res, next) => {
  const { rating, comment, userId } = req.body;
try{
  const review = {
    user: req.user.id,
    rating: Number(rating),
    comment
  };

  // Find the product by its ID
  const product = await imageSchema.findById(userId);

  // Add the review to the product's reviews array
  imageSchema.reviews.push(review);

  // Update the product's average rating
  const ratingsSum = product.reviews.reduce((sum, review) => sum + review.rating, 0);
  product.averageRating = ratingsSum / product.reviews.length;

  // Save the updated product
  await product.save();

  res.status(201).json({ success: true, message: 'Review created successfully' });
} catch (error) {
  console.log(error);
  res.status(500).json({ success: false, message: 'An error occurred while creating the review' });
}
});
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
  login,verfiyMail,
  deleteReview,getAllReviews,createProductReviews};
