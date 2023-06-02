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
        return res.redirect('/Register');
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


//for verying register
module.exports ={register,
  login,verfiyMail};
