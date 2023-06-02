const express=require('express');
const cotRoute= express.Router();

const categoryController=require('../controller/categoryController');
 const bodyParser =require('body-parser');
const { model } = require('mongoose');

cotRoute.use(bodyParser.json());
cotRoute.use(bodyParser.urlencoded({ extended:false,
}));
cotRoute.post('/category',categoryController.addcategory);
module.exports=cotRoute;