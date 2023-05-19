const express= require('express');
const { model } = require('mongoose');
const user= require("../model/schema");
const routers =express.Router();
routers.get('/',(req,respo,)=>{
respo.render('./homepage');
});

module.exports =routers;