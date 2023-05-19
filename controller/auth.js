const Register = require("../model/schema");
const jwt =require("jsonwebtoken");


//creating middleware
const authisLoggedIn = async(req,res,next)=>{
    const token =req.cookies.jwt;
    console.log(token)
    if(!token){
      next();
      
    }
    if(token){
      const verifyUser = jwt.verify(token,process.env.SECRET_KEY);
      const user =await Register.findOne({_id:verifyUser._id} ,(error,decoded)=>{
        console.log(user.firstname);
        req.token =token;
        req.user=user;
        res.status(200).json({
          sucess:true,
          token
        })
        if(error){
          console.log(error.message);
          res.redirect('/login');
        }
        else{
          console.log(decoded); 
          res.redirect('/');
          next();
        }
      });
    }

    else{
      res.redirect('/login');
    }
  }  

module.exports =authisLoggedIn;