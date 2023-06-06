const imageSchema=require('../model/image');
const getName=async(req,res)=>{
    try{
 return imageSchema.find();
 //console.log(image);
    }catch(error){
        console.log(error);
    }
}
module.exports={
    getName
}