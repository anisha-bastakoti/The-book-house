const express=require('express');
 const categoryRoute=express.Router();
  var categoryController =require('../controller/categoryController');
  const Product=require('../model/productModel');
  //get category index
 //add category
 categoryRoute.get('/category',categoryController.getCategory)
  categoryRoute.post('/addcategory',categoryController.addCategory);
  categoryRoute.get('/category/editpage/:_id',categoryController.editCategory);
  categoryRoute.post('/category/editpage/:_id',categoryController.updateCategory)
  categoryRoute.get('/category/deletepage/:_id',categoryController.deleteCategory)



 


 

 module.exports=categoryRoute;