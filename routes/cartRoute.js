
const router = require("express").Router();
const bodyparser=require('body-parser');
router.use(bodyparser.json());
router.use(bodyparser.urlencoded({extended:true}));
const cartController = require("../controller/cartController");
router.get('/addtocarts/:id', cartController.getCart);
//router.post('/carts', cartController.addtocart);
router.get('/checkout', cartController.shoppingCart);
//get checkoutpage

module.exports = router;
