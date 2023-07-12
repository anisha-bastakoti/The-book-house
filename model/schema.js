const mongoose =require('mongoose');
require('dotenv').config(); 
// Load environment variables from .env file
const jwt =require('jsonwebtoken')
//define schema
 const RegisterSchema = new mongoose.Schema({
    name:{
        type:String ,
        required: [true ,"please add the  full name"]
    
    },
    email:{
        type:String ,
        required: [true ,"please add the email"],
        unique: [true,"email already exist"],
    },
    password:{
        type:String,
        required:true,
    },
    confirmpassword:{
        type:String,
        required: true,
    
    },
    tokens:[{
       token:{
        type:String,
        required:true,
    },
}],
is_verified: {
    type: String,
    
  },
  otp: {
    type: String,
    required: true
  }
}, { timestamps: true });

  
 
 //we need to create collection 
 const Register= new mongoose.model("LOGreg",RegisterSchema);
 module.exports = Register;
