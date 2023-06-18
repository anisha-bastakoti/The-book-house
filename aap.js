const express =require('express');
const app =express(); 
const path= require('path');
const morgan =require('morgan');
const cookieParser = require('cookie-parser');
const session =require("express-session");
const flash =require('connect-flash');
const multer=require('multer')
require('express-messages');
 require('dotenv').config();
 const expressvalidator= require('express-validator');
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
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // Set the session cookie's expiration time (e.g., 24 hours)
  },
}));
app.use(flash());
app.get('*',function(req,res,next){
res.locals.cart=req.session.cart;
next();
})
app.get('*',function(req,res,next){
  res.locals.title=req.session.title;
  next();
  })
  app.get('*',function(req,res,next){
    res.locals.slug=req.session.slug;
    next();
    })
    app.get('*',function(req,res,next){
      res.locals.content=req.session.content;
      next();
      })
      app.get('*',function(req,res,next){
        res.locals.pages=req.session.pages;
        next();
        })

//flashing message
app.use(function(req,res,next){
res.locals.message =req.flash('message');
next();
});
//set global variable error
app.locals.errors= null;
//for user details
app.use(function(req,res,next){
  res.locals.user=req.user;
  next();
})
//express validator middleware
app.use(expressvalidator({
 errorFormatter:function(param,msg,value){
  var namespace=param.split('.'),
  root =namespace.shift(),
  formParam=root;
  while(namespace.length){
    formParam+='{'+namespace.shift()+'}';
  }
return{
  param:formParam,
  msg:msg,
  value:value
};
 }
}));
//express massage middleware
app.use(require('connect-flash')());
app.use(function(req,res,next){
  res.locals.messages=require('express-messages')(req,res);
  next();
});
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
app.get('/addpages',(req,res)=>{
  res.render('addpage');

})
app.get('/pages',(req,res)=>{
  res.render('pages');
});

//for middleware
app.use(morgan('tiny'));

//getting user detail

//routes

const userRoute= require('./routes/userRoute');
app.use('/',userRoute);

const productroute=require('./routes/productRoute');
app.use('/',productroute);

const cartroute=require('./routes/cartRoute');
app.use('/',cartroute);

const pageRoute= require('./routes/pageRoute');
app.use('/',pageRoute);


//for middleware
const PORT= process.env.PORT || 3000
    app.listen(PORT,()=>{
        console.log("server stated at port "+PORT );
    });

