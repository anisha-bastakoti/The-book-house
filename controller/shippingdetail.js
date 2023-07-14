const shipping=require('../model/shipping');
const cartController=require('../controller/cartController')
const shippingMethod=async(req,res)=>{
    try{
     // const cartItem= cartControl
     const cartItems = req.session.cart;
     const name = req.body.name;
     const address = req.body.address;
     const city = req.body.city;
     const phone = req.body.phone;
     const country = req.body.country;

     const newShipping = new shipping({
         name,
         address,
         city,
         country,phone
       });
       
   console.log(cartItems);
       // Save the shipping information to MongoDB
      const detail= await newShipping.save();
      const orderLength = detail.order ? detail.order.length : 0;

      // Send a response back to the client
      //const orderLength = detail.order.length;
       // Send a response back to the client
       res.render('order',{sucess:true,message:"shipping process sucesfully",
       orders:[detail],
       cartitems: cartItems,
       orderLength: orderLength
     });

      } catch (error) {
         console.log
}
}
module.exports= {
    shippingMethod};