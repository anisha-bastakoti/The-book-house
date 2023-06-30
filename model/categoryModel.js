const mongoose = require('mongoose');
let categorySchema = new mongoose.Schema({
    title:{
         type:String,
       },
       slug:{
            type:String
       }
    });
    
    module.exports = mongoose.model('categorie', categorySchema);