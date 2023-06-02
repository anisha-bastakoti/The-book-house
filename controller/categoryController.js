const Category=require('../model/catagory');

const addcategory=async(req,res)=>{
try{
const category = new Category({
    category:req.body.category
 })
 const catdata=await category.save();
 res.status(200).send({sucess:true,msg:"category data",data:catdata});
}catch(error){
    res.status(400).send({sucess:false,msg:error.message});
}
};
const getCategory=async(req,res)=>{
    try{return Category.find();
    }catch(error){
        res.status(400).send({sucess:false,msg:error.message});
    }
}
module.exports={
    addcategory,
getCategory}