const Cart = require('../model/cartModel')
const Product = require('../model/productModel');
const getCart=async(req,res,next)=>{
  const productId = req.params.id.replace(':', '');
const cart = new Cart(req.session.cart ? req.session.cart : {item:{}});

try {
  const product = await Product.findById(productId);

  if (!product) {
    res.redirect('/products');
    //res.status(404).send({ success: false, message: 'Product not found' });
    return;
  }
  cart.add(product, product._id);
  req.session.cart = cart; 
  // Update the session cart data
  console.log(req.session.cart);
  res.redirect('/products',200,{cart:cart});
  //res.send({ success: true,message:"sucessfully added to cart" });
} catch (err) {
  console.error(err);
  res.status(500).send({ success: false, message: 'An error occurred' });
}


}   
//getcheckoutpage
const shoppingCart= async(req,res)=>{
  if(!req.session.cart){
    res.render('checkout',)
  }
var cart= new Cart(req.session.cart);
res.render('checkout',{sucess:true,product:cart.generateArray().totalprice})
console.log(cart)
}
 

module.exports = {
shoppingCart,getCart
};