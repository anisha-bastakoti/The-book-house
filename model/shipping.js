const mongoose = require("mongoose");
const shippingScheme= new  mongoose.Schema({
    name:{
        type:String,
        required:true
    },
   
    address:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    }
    ,  country:{
        type:String,
        required:true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'deleted'],
        default: 'pending',
      },

    
})
module.exports = mongoose.model("shipping",shippingScheme);