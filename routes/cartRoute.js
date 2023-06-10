
const router = require("express").Router();
const bodyparser=require('body-parser');
router.use(bodyparser.json());
router.use(bodyparser.urlencoded({extended:true}));
const cartController = require("../controller/cartController");
router.post("/carts", cartController.addItemToCart);
router.get("/carts", cartController.getCart);
router.delete("/empty-cart", cartController.emptyCart);
module.exports = router;
