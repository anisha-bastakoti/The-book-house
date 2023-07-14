
const Product = require('../model/productModel');
const getCart = async (req, res) => {
  try {
    const slug = req.params._id.replace(':', '');
    const product = await Product.findOne({ _id: slug });

    if (!product) {
      return res.status(404).send({ success: false, msg: "Product not found" });
    }

    if (typeof req.session.cart =='undefined') {
      req.session.cart = [];
    }

    const cart = req.session.cart;
    let newItem = true;

    for (let i = 0; i < cart.length; i++) {
      if (cart[i].title === slug) {
        cart[i].qty++;
        newItem = false;
        break;
      }
    }

    if (newItem) {
      cart.push({
        title: slug,
        name:product.name,
        qty: 1,
        price: parseFloat(product.price).toFixed(2),
        Image: '/productImage/'+product.image
      });
    }

    console.log(req.session.cart);
    res.redirect('/products')
    //res.send({ success: true, msg: "Added to cart successfully" });
  } catch (err) {
    console.log(err);
   // res.send({ success: false, msg: "An error occurred" });
  }
};

//checkoutpage
const checkOut= async(req,res)=>{
  if(req.session.cart && req.session.cart.lenth==0){
    delete req.session.cart
    res.redirect('/carts/checkout');
  }else{
 res.render('cart',{
  title:'checkout',
  cart:req.session.cart
 })
}
}
//updatepage
const updateCart=async(req,res)=>{
  var slug = req.params._id.replace(':', '');
  var cart=req.session.cart;
  var action= req.query.action;
   for(var i=0;i<cart.length;i++){
    if(cart[i].title===slug){
      switch(action){
        case"add":
        cart[i].qty++;
        break;
        case"sub":
        cart[i].qty--;
        break;
        case"delete":
        cart.splice(i,1);
        if(cart.length==0)delete req.session.cart;
        break;
        default:
          console.log('update problem  ')
          break;
      }
      break;
    }
   }
   res.redirect('/carts/checkout')
} 
//delete cart
const deleteCart=async(req,res)=>{
  try{
delete req.session.cart;
res.redirect('/carts/checkout')
  }catch(error){
console.log(error)
  }
}
module.exports = {
checkOut,getCart,updateCart,deleteCart
};