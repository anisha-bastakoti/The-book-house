
const express = require('express');
const router = express.Router();
const cartController = require('../controller/cartController');

router.get('/carts/addtocarts/:_id', cartController.getCart);
router.get('/carts/checkout',cartController.checkOut) 
router.get('/update/:_id',cartController.updateCart) 
router.get('/carts/clear',cartController.deleteCart)
module.exports = router;

module.exports=router;
