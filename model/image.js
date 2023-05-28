const mongoose = require("mongoose");
var imageSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "Please Enter Your Name! "],
    },
    location: {
      type: String,
      required: [true, "Please Enter Your location"],
    },
    
  phone:{
    type: String,
    minLength: [8, "password should have 8 characters"],
  },
    image:{ 
      data: Buffer,
        contentType: String,
        
    },
    email:{
      type:String,
      required:true,
    },
    password:{
      type:String,
      required:true
    }
  });//Export the model
  module.exports = mongoose.model("image",imageSchema);