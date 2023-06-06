const mongoose=require('mongoose');
const productSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    pdescription:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
     delivery:{
        type:String,
        required:true
    },
     price:{
        type:Number,
        default:0
    },
    seller_id: {
        type:mongoose.Schema.Types.ObjectId,
    },
    expiredate:{
        type:Date,
        required:true
    },
    image:{
        type:String,
        required:true
    },
 
});
module.exports=mongoose.model('Product',productSchema);