const express = require('express');
const router = express.Router();
const adminController=require('../controller/adminController');
router.get('/login',adminController.getAdminLogin)
router.get('/dashboard',adminController.getAminDashboard)
router.post('/login',adminController.postAdmin)
router.get('/dashboard/product', adminController.getProduct);
router.delete('/delete/product/:id', adminController.deleteProduct);
router.get('/dashboard/orderdetail',adminController.getOrder)


module.exports = router;
