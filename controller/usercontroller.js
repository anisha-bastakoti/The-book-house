//register user
const asynchandler =require("express-async-handler");
const bcrypt =require("bcrypt");
const generateOTP = require("../server/services/generateOTP");
require('dotenv').config();
const nodemailer=require('nodemailer');
//import schememodel
const Register =require('../model/schema');
const { Cookie } = require("cookie-parser");
const imageSchema=require('../model/image');
const jwt =require('jsonwebtoken');

//sendverfiymail
let transporter = nodemailer.createTransport({
  service:"gmail",
  secure: false,
  auth: {
    user: "barshapoddar986@gmail.com",
    pass: "mrlbsansrghpfilq"
  },
});

const sendEmail = (async (req, res) => {
    const { email } = req.body;
    console.log(email);
  
    const otp = generateOTP();
  
    var mailOptions = {
      from: process.env.SMTP_MAIL,
      to: email,
      subject: "OTP form The book house ",
      text:` Your OTP is: ${otp}`,
    };
  
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent successfully!");
      }
    });
  });

//for register
const register= async(req,res)=>{
    const{name,email,password,confirmpassword}= req.body;

 //checking all fields are filled out
    if (!name || !email || !password || !confirmpassword) {
      req.flash('message', 'All fields are required');
      return res.redirect('/register');
      //res.send({sucess:true,message:"All fields are required"})
      }
    try{
    const userAvailable = await Register.findOne({email});
 if(userAvailable){
  res.send({sucess:true,message:"Already exist user"})
   req.flash('message',"Already exist user");
   return res.redirect('/register');
}
//checking invalid email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  req.flash('message', 'Invalid email format');
  //res.send({sucess:true,message:"Invalid email format"})
   return res.redirect('/register');
}
if (password !== confirmpassword) {
   req.flash('message','Passwords do not match' );
   return res.redirect('/register');
    }
  //creating hashpassword
  const hashPassword = await bcrypt.hash(password,10);
  console.log('hashpassword:',hashPassword);
  const otp= generateOTP();
  //creating new user
  const user =await Register.create({
      name,
      email,
      password: hashPassword,
      confirmpassword:hashPassword,
      otp,
     
  });
  //create token 
  const token = jwt.sign(
    { user_id: user._id, email },
    'jwduedhnjnxjkks',
    {
      expiresIn: "2h",
    }
  );
  // save user token
  user.tokens.push({ token });
  await user.save()
  .then(() => {
    console.log('Token saved successfully');
    // Continue with your logic
  })
  .catch((error) => {
    console.log('Error saving token:', error);
    // Handle the error
  });
  console.log(token)

  if(user){
     // Send the OTP email after successful registration
     const mailOptions = {
      from: "barshapoddar986@gmail.com",
      to: email,
      subject: "OTP Verification",
      text: `Your OTP for registration is: ${otp}.
      this code expires in 1 hr `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        req.flash('message','Email sent successfully.');
        //req.flash('message','Email sent successfully")
        res.redirect('/verifyotp');
      }
    });
    res.render('otp');
   // res.send({ success: true, message: "Registered successfully" });
    return;
  //req.flash('message','Registration successful.');
  //res.send({success:true,message:"register sucessfully "})
  //return res.render('login', { message: req.flash('message') }); // Pass the message to the register pag
     }
  }
  catch (error) {
    console.log(error);
         req.flash('message','Registration failed');
       return res.redirect('/register');
  }
  };
 
//for login
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const userEmail = await Register.findOne({ email: email });
    if (userEmail) {
      const passwordMatch = await bcrypt.compare(password, userEmail.password);
      
     userEmail.is_verified=true;
     await userEmail.save();
    
  if (passwordMatch) {
    // Create token
    const token = jwt.sign(
      { user_id: userEmail._id, email },
      'jwduedhnjnxjkks',
      {
        expiresIn: "2h",
      }
    );
    // save user token
    userEmail.tokens.push({ token });
userEmail.save()
  .then(() => {
    console.log('Token saved successfully');
    // Continue with your logic
  })
  .catch((error) => {
    console.log('Error saving token:', error);
    // Handle the error
  });
    userEmail.token = token;
        return res.status(201).redirect('products');
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
   const verifyOtp= async(req,res)=>{
try {
  const { email,otp } = req.body;
  const userEmail = await Register.findOne({ email: email });

  if (userEmail) {
    if (userEmail.otp !== otp) {
      req.flash('message', 'Invalid OTP');
      return res.redirect('/verifyotp');
    }

    // OTP is correct
    // Set the session variable to indicate successful OTP verification
    req.session.otpVerified = true;
req.flash('message'," now you can login ")
    return res.redirect('/login');
  } else {
    // User with the provided email does not exist
    res.send({sucess:false,msg:"User doesn't exist"})
    req.flash('message', "User doesn't exist");
    return res.redirect('/verifyotp');
  }
} catch (error) {
  console.log(error);
  return res.status(400).send('An error occurred');
}
   }
// Add reviews and ratings for Products
const createProductReviews = (async (req, res, next) => {
  const { rating, comment, userId } = req.body;
try{
  const review = {
    user: req.user._id,
    rating: Number(rating),
    comment
  };
//console.log(user._id);
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
  login,sendEmail,verifyOtp,
  deleteReview,getAllReviews,createProductReviews};
