
const express=require('express');
const myprofileRoute=express.Router();
const profileController=require('../controller/myprofileController');
myprofileRoute.get('/myprofile',profileController.getUser);

module.exports=myprofileRoute;