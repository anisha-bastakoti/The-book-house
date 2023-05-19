const express =require('express');
const app =express(); 
const path= require('path');
const morgan =require('morgan');
const cookieParser = require('cookie-parser');
const session =require("express-session");
const flash =require('connect-flash');
 require("./controller/usercontroller");
 require('dotenv').config();
 const authisLoggedIn=require("./controller/auth");
 

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
//app.get('/Register', (req, res) => {
  //res.send(req.flash('message'));
//});


//set path
app.use(express.static('public'));
app.use('/', express.static(__dirname + "/public/" + '/images'));

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
 app.get('/sellerAccount',authisLoggedIn,async(req,res)=>{
      res.render('sellerAccount');
      
});
app.get('/logout',authisLoggedIn,async(req,res)=>{
try{
  res.clearCookie("jwt");
console.log("logout sucessfully");
 await req.user.save();
 res.render('login');
}catch(error){
res.status(500).send(error);
}
});
//for middleware
app.use(morgan('tiny'));

//routes
const loginRoute= require('./routes/login');
app.use('/login',loginRoute);
const RegRoute= require('./routes/register');
app.use('/Register',RegRoute);
const userRoute= require('./routes/userRoute');
app.use('/',userRoute);
const sellerRotue= require('./routes/sellerAccount');
app.use('/sellerAccount',sellerRotue);




//for middleware
const PORT= process.env.PORT || 3000
    app.listen(PORT,()=>{
        console.log("server stated at port "+PORT );
    });

