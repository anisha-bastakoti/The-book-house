const mongoose=require('mongoose');
const productSchema=mongoose.Schema({
    name:{
        type: String,
        required: [true, "please Enter Product Name"],
        unique: true,
        index: true,
        trim: true,
    },
    
    pdescription:{
        type: String,
        required: [true, "please Enter Product description"],
        unique: true,
    },
    price:{
        type: Number,
    required: true,
    maxLength: [8, "price cannot exceed 8 character "],
    },
    ratings: {
        type: Number,
        default: 0,
      },
      image:{
        type:String,
        required:true
    },
    category:{
        type: String,
        required: [true, "Please Enter Product category"],
    },
    location:{
        type:String,
        required:true
    },
    numOfReview: {
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
        
    author:{
        type:String,
        required:true
    },
     delivery:{
        type:String,
        required:true
    },
    
    seller_id: {
        type:mongoose.Schema.Types.ObjectId,
    },
    expiredate:{
        type:Date,
        required:true
    },
   
   
 
});
module.exports=mongoose.model('Product',productSchema);