const express = require('express');
const router = express.Router();
const shippingController = require('../controller/shippingdetail');

router.post('/process-shipping', shippingController.shippingMethod);

module.exports = router;
