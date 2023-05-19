const express= require('express');
const { model } = require('mongoose');
const routers =express.Router();
routers.post('/login',(req,resp,)=>{
resp.render('./login');
});

module.exports =routers;

