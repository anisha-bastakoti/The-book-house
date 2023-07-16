const express =require('express');
const app =express(); 
const path= require('path');
const morgan =require('morgan');
const cookieParser = require('cookie-parser');
const flash =require('connect-flash');
require('express-messages');
 require('dotenv').config();
 const expressvalidator= require('express-validator');

 const methodOverride = require('method-override')
 app.use(methodOverride('_method'));

 //mongodb connection 
 const mongoose = require('mongoose');
 //databaseconnection
 mongoose.connect("mongodb://127.0.0.1:27017/loginreg", 
 { useNewUrlParser: true,  
  useUnifiedTopology: true, 
  
   });
   const connection = mongoose.connection;

connection.on('error', (err) => {
  console.error('Connection error:', err);
});

connection.once('open', () => {
  console.log('Database connected...');
});

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

// Session store
const store = new MongoStore({
  mongooseConnection: connection,
  collection: 'sessions',
});

app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // Set the session cookie's expiration time (e.g., 24 hours)
    },
  })
);



const {json} = require('body-parser');
//create new user in database
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());


//setting ejs 
app.set('view engine','ejs')

//for displaying error msg

app.use(flash());
app.get('*',function(req,res,next){
res.locals.session=req.session;
next(); 
})
app.get('*',function(req,res,next){
  res.locals.cart=req.session.cart;
  next(); 
  })
app.get('*',function(req,res,next){
  res.locals.products=req.session.products;
  next();
  })
  
      app.get('*',function(req,res,next){
        res.locals.users=req.session.users;
        next();
        })
        app.get('*',function(req,res,next){
          res.locals.data=req.session.data;
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
app.get('/categories',(req,res)=>{
  res.render('categories');
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
app.get('/carts/shippingdetail',(req,res)=>{
  
  res.render('shippingdetail')
})
app.get("/payment_success",(req,res)=>{
  console.log("req.query",req.query);
  res.render("payment_success",{query:req.query})
})
app.get('/verifyotp',(req,res)=>{
  res.render('otp');

})
app.get('/pages',(req,res)=>{
  res.render('pages');
});
app.get('/addcategory',(req,res)=>{
  res.render('categories');
});


//for middleware
app.use(morgan('tiny'));

//getting user detail

//routes
const adminLogin=require('./routes/adminlogin');
app.use('/admin',adminLogin);
const ShippingRoute=require('./routes/shppingRoute');
app.use('/',ShippingRoute);
const userRoute= require('./routes/userRoute');
app.use('/',userRoute);
const cartRoute=require('./routes/cartRoute');
app.use('/',cartRoute);
const myprofileRoute= require('./routes/profileRoute');
app.use('/',myprofileRoute);
const productroute=require('./routes/productRoute');
app.use('/',productroute);
const pageRoute= require('./routes/pageRoute');
app.use('/',pageRoute);
const catRoute= require('./routes/categoryRoute');
const { Auth } = require('two-step-auth');
app.use('/',catRoute);
 



//for middleware
const PORT= process.env.PORT || 3000
    app.listen(PORT,()=>{
        console.log("server stated at port "+PORT );
    });

