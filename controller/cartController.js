const Cart = require('../model/cartModel')
const Product = require('../model/productModel');
 const addtocart = async(req,res)=>{
  try{
  var productId= req.params._id;
  Cart.find({product:productId});

  const product = req.body.productId; // Assuming you're getting the product from the request body
  const p = await Product.findOne({ product: product });
  if (!p) {
    // Product not found
    req.flash('error', 'Product not found');
    res.redirect('back');
    return;
  }
  if (typeof req.session.cart === 'undefined') {
    req.session.cart = [];
    req.session.cart.push({
      price: parseFloat(p.price).toFixed(2),
      quantity: 1,
      name:p.name,
      image: p.image
    });
  }
  else {
    var cart = req.session.cart;
    var newItem = true;
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].productId=== p._id) {
        cart[i].quantity++;
        newItem = false;
        i++;
      }
    }
  }
    if (newItem) {
      cart.push({
        name:p.name,
        price: parseFloat(p.price).toFixed(2),
        quantity: 1,
        image: p.image
      });
    }
    await Cart.findOneAndUpdate(
// Assuming you have a user associated with the cart
      { items: req.session.cart },
      { upsert: true }
    );

   
  console.log(req.session.cart);
  
  res.redirect('/products',200,{sucess:true,message:'Product added'});

} catch (err) {
  console.log(err);
  res.redirect('/products',400,{sucess:true,message:'An error occurred'});
  
}
}
//getcheckoutpage
const checkOut= async(req,res)=>{
  const cart=req.session.cart;
res.render('checkout',{carts:cart})
console.log(cart)
}
 const updatePage=async (req,res)=>{
  try{
    var product=req.params._id;
    var cart =req.session.cart;
    var action =req.query.action;
    for (var i=0;i<cart.length;i++){
      if(cart[i]._id==product._id){
        switch(action){
          case "add":
            cart[i].quantity++;
            break;
            case "remove":
              cart[i].quantity--;
              if(cart[i].quantity<1 )cart.splice(i,1)
              break;
              case "clear":
                cart[i].splice(i,1);
                break;
                default:
                  console.log("update problem")
                  break;
        }
        break;
  
      }
    }
   res.redirect('/carts/checkout');
  }catch(error){
    console.log(error);
  }
  };

module.exports = {
addtocart,checkOut,updatePage
};