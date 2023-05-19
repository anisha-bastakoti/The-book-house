//register user
const asynchandler =require("express-async-handler");
const bcrypt =require("bcrypt");
const jwt =require('jsonwebtoken');
require('dotenv').config();

//import schememodel
const Register =require('../model/schema');
const { use } = require("../routes/login");
const { Cookie } = require("cookie-parser");

//for register
const register= async(req,res)=>{
    const{name,email,password,confirmpassword}= req.body;

 //checking all fields are filled out
    if (!name || !email || !password || !confirmpassword) {
      req.flash('message', 'All fields are required');
      return res.redirect('/Register');
      }
    try{
    const userAvailable = await Register.findOne({email});
 if(userAvailable){
   req.flash('message',"Already exist user");
   return res.redirect('/Register');
}
//checking invalid email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  req.flash('message', 'Invalid email format');
   return res.redirect('/Register');
}
if (password !== confirmpassword) {
    req.flash('message','Passwords do not match' );
   return res.redirect('/Register');
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
  });

  //generate a token
  const token = jwt.sign(
    {id:user._id,email:user.email}, process.env.SECRET_KEY,
    {expiresIn:"2h"}
  );
  user.tokens = user.tokens.concat({token:token});
  user.token = token
  await user.save();
  

  req.flash('message','Registration successful' );
   return res.render('login');
    }

  catch (error) {
    console.log(error);
         req.flash('message','Registration failed');
        return res.redirect('/Register');
  }
     
     
  };
  
 
//for login
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const userEmail = await Register.findOne({ email: email });
    if (userEmail) {
      const passwordMatch = await bcrypt.compare(password, userEmail.password);
      const token =jwt.sign(
        { id:userEmail._id},process.env.SECRET_KEY,
        {
        expiresIn :"2h"
        }
    );
    userEmail.token =token;

    //sending cookies

    res.cookie("token",token,{
      expiresIn: new Date(Date.now()+ 3*60*60*1000),
      httpOnly:true
    });
    
     
     
      if (passwordMatch) {
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
  
module.exports ={register,login};
