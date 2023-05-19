const express= require('express');
const { model } = require('mongoose');
const authisLoggedIn = require('../controller/auth');
const routers =express.Router();
routers.get('/sellerAccount',authisLoggedIn,(req,resp,)=>{
resp.render('./sellerAccount')

});

module.exports =routers;