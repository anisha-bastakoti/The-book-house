const express =require('express');
const app =express(); 
const path= require('path');
const morgan =require('morgan');
const cookieParser = require('cookie-parser');
const session =require("express-session");
const flash =require('connect-flash');
const multer=require('multer')
 require('dotenv').config();
 //const authisLoggedIn=require("./controller/auth");
 

//database connection 
require("./database1/conne");
const {json} = require('body-parser');
//create new user in database
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());

 
//setting ejs 
app.set('view engine','ejs')

//for displaying error msg
app.use(session({
  secret:'secret',
  resave:false,
  saveUninitialized:false,
}));
app.use(flash());

//flashing message
app.use(function(req,res,next){
res.locals.message =req.flash('message');
next();
});

//for user details
app.use(function(req,res,next){
  res.locals.user=req.user;
  next();
})

//set path
app.use(express.static('public'));
app.use('/', express.static(__dirname + "/public/" + '/images'));
app.use('/', express.static(__dirname + "/public/" + '/upload'));

//register and login page routes
app.get('/',(req,res)=>{
  res.render('homepage');
});

app.get('/login',(req,res)=>{
    res.render('login');
}); 
app.get('/Register',(req,res)=>{
    res.render('register');
});
 app.get('/sellerAccount',(req,res)=>{
      res.render('sellerAccount');
      
});
app.get('/addproduct',(req,res)=>{
  res.render('addproduct');
  
});
app.get('/userprofile',(req,res)=>{
  res.render('userprofile');
  
});

//for middleware
app.use(morgan('tiny'));

//getting user detail

//routes
const userRoute= require('./routes/userRoute');
app.use('/',userRoute);





//for middleware
const PORT= process.env.PORT || 3000
    app.listen(PORT,()=>{
        console.log("server stated at port "+PORT );
    });

