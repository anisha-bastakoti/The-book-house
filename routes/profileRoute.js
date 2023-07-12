
const express=require('express');
const myprofileRoute=express.Router();
const userContoller=require('../controller/usercontroller')
//const profileController=require('../controller/myprofileController');
myprofileRoute.get('/myprofile',userContoller.getProfile);

module.exports=myprofileRoute;