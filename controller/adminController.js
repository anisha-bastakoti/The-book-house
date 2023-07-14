const Product=require('../model/productModel');
const Order=require('../model/shipping');
const OrderDetail = require('../model/orderStatus');
const getAdminLogin=async(req,res)=>{
    res.render('adminlogin');
}
// Render the admin login page
 const getAminDashboard=async(req,res)=>{
    res.render('admindashboard')
 }
 
  // Handle the admin login request
  const postAdmin=async(req,res)=>{
    try{

        const { email, password } = req.body;
  
    // Check if the email and password match
    if (email === 'admin@gmail.com' && password === 'adminpassword') {
      // Set the admin's authenticated state (e.g., session or token)
      req.session.isAdminLoggedIn = true;
      
      // Redirect to the admin dashboard or protected area
      res.redirect('/admin/dashboard');
     //res.send({sucess:true,message:"admin login in "})
    } else {
      // Invalid credentials
  
      res.render('adminlogin', { error: 'Invalid email or password' });
    }
    }
    catch(error){
        console.log(error)
    }
  }
  //get product details 
    const getProduct = async (req, res) => {
        try {
          // Fetch all products from the database
          const products = await Product.find();
      
          console.log('Products:', products); // Add this line for debugging
      
          if (!products || products.length === 0) {
            // Handle case when no products are found
            res.render('adminproduct', { products: [] });
            //res.send({success:false,msg:"no product found",products})
          } else {
            // Render the 'admindashboard' EJS template and pass the products data
            res.render('adminproduct', { products: products });
           // res.send({success:true,msg:" product found",products})
          }
        } catch (error) {
          console.error('Error:', error); // Add this line for debugging
          res.status(500).send({ success: false, msg: error.message });
        }
      }
      const deleteProduct = async (req, res) => {
        try {
          const productId = req.params.id;
      
          // Delete the product from the database using the productId
          await Product.findByIdAndDelete(productId);
      
          res.redirect('/admin/dashboard/product'); // Redirect to the admin dashboard or any other page after successful deletion
        } catch (error) {
          console.error('Error:', error); // Add this line for debugging
          res.status(500).send({ success: false, msg: error.message });
        }
      };
    //orderdetailpage

    const getOrder = async (req, res) => {
      try {
        // Fetch all orders from the database
        const orders = await Order.find();
        const cartItems = req.session.cart || []; 
        console.log(cartItems)// Set cartItems to an empty array if req.session.cart is undefined
    
        console.log('Orders:', orders); // For debugging
    
        if (!orders || orders.length === 0) {
          res.render('adminorderdetail', { orders: [], cartItems: cartItems }); // Render the order detail page with an empty orders array and cart items
        } else {
          res.render('adminorderdetail', { orders: orders, cartItems: cartItems }); // Render the order detail page with the retrieved orders and cart items
        }
      } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred while fetching order details.');
      }
    };
    // Server-side code


const statusChange= async (req, res) => {
  res.send("hello")
} 
  module.exports={
    getAdminLogin,getAminDashboard,
    postAdmin,getProduct,deleteProduct,
    getOrder,statusChange
  }
  