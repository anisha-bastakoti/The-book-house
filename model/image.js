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
      type:String,  
    },
    email:{
      type:String,
      required:true,
    },
    password:{
      type:String,
      required:true
    },
    ratings: {
      type: Number,
      default: 0,
    },numOfReview: {
      type: Number,
      default: 0,
    },
  
    reviews: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
   
  
  
  });//Export the model
  module.exports = mongoose.model("image",imageSchema);