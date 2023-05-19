const express= require('express');
const { model } = require('mongoose');
const router =express.Router();
router.get('/Register',function(req,res,){
    res.render("./register");
})

module.exports= router;
