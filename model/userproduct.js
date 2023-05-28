const mongoose = require("mongoose");
var productSchema = new mongoose.Schema({
    productname: {
      type: String,
      required: [true, "Please Enter Your product name "],
      unique: true,
      index: true,
      trim: true,
    },
    productdescription: {
      type: String,
      required: [true,],
      unique:true
      
    },
    productcategorie:{
    type: String,
    required:[true],
    
  },
  price:{
    type: Number,
    required:true,
    maxLength: [8, "price cannot exceed 8 character "],
  },
  author:{
    type: String,
    required:true,
  },
  expiredate:{
    type: Date,
    required:true,
  },
    image:{ 
      data: Buffer,
        contentType: String,
        
    },
   
  });//Export the model
  module.exports = mongoose.model("addProduct",productSchema );