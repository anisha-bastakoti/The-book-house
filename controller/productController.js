const Product=require('../model/productModel');
const NameController=require('../controller/nameController');
const Seller=require('../model/image');
const image = require('../model/image');
const add_product=async(req,res)=>{
    try { 
      const seller = await Seller.findOne();
    if (seller) {
      const sellerId = seller._id;
       const product = new Product({
          name: req.body.name,
          pdescription: req.body.pdescription,
          category:req.body.category,
          location: req.body.location,
          author: req.body.author,
          delivery: req.body.delivery,
          price: req.body.price,
          expiredate: req.body.expiredate,
          image: req.file.filename,
          seller_id:sellerId,
        });
 const products = await product.save();
 res.redirect('/products',200,{ data:products})
  
      } 
  }catch(error){
    res.status(400).send({sucess:false,msg:error.message});
  }
}
//getting all the products
 const getProductDetail=async(req,res)=>{
    try{
        // Fetch all products from the database
        const products = await Product.find()
        .select('name price image');
     // Return the products as a response
    res.render('products',{ success: true, data: products,});

    }catch(error){
        res.status(400).send({sucess:false,msg:error.message});
    }
 }

 //get single product
 
 const singleProduct=async(req,res)=>{
  try {
    const productId = await req.params._id.replace(':', '');
    const product = await Product.findOne({_id:productId});
    console.log(product);
    if (!product) {
      return res.status(404).send({ success: false, msg: 'Product not found' });
    }
    // Access the seller details
    const sellerId = product.seller_id;
    const seller =await image.findOne({_id:sellerId});
    console.log(seller);
     console.log(productId);
     res.render('view',{success:true,msg:"product found",data:product,datas:seller})
  }catch(error){
    console.log(error);
  }
};
 const updateProduct = async (req, res) => {
  try {
    let id = req.params._id.replace(':', '');
    const product = await Product.findById(id); // Add 'await' to wait for the asynchronous operation to complete

    if (product != null) { 
      // Check if the product exists
      product.name=req.body.name;
      product.pdescription=req.body.pdescription;
      product.location=req.body.location;
      product.author=req.body.author;
      product.delivery=req.body.delivery;
      product.price =req.body.price;
      product.expiredate =req.body.expiredate;
      product.image =req.body.image;
      product.category=req.body.category;
      // Add more properties as needed

      console.log("Updated product:", product);

      // Save the updated product
      await product.save();
      console.log(product);

      res.status(200).send({ success: true, msg: "Product updated successfully", product });
    } else {
      res.status(404).send({ success: false, msg: "Product not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, msg: "Internal server error" });
  }
}
//deleting the product
const deleteProduct = async (req, res) => {
  try {
    const id = req.params._id.replace(':', '');
    
    // Find the product by ID and remove it
    const deletedProduct = await Product.findByIdAndRemove(id);
    
    if (deletedProduct) {
      res.status(200).send({ success: true, msg: "Product deleted successfully" });
    } else {
      res.status(404).send({ success: false, msg: "Product not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, msg: "Internal server error" });
  }
}
//search 
//search product
const searchProduct = async(req,res)=>{
  try {
   var search = req.body.search;
    var product_data = await Product.find({
      $or: [
        { name: { $regex: ".*" + search + ".*", $options: "i" } },
        { author: { $regex: ".*" + search + ".*", $options: "i" } }
      ]
    })
    if (product_data.length > 0){
     res.status(200).send({success:true,msg:"products Datails",data:product_data});
    }
    else{
     res.status(200).send({success:true,msg:"products not found!"});
    }
 
 
  } catch(error){
   res.status(400).send({success:false,msg:error.message})
  }
 }

  module.exports = {
    add_product,
    getProductDetail,
    updateProduct,deleteProduct,singleProduct,searchProduct
  };



// const getProduct=async(req,res)=>{
//  try{
//        var sendData=[];
//        var catData =await categoryController.getCategory();
//        if(catData.length > 0){
//            res.status(200).send({sucess:false,msg:"product details",data:sendData});
//           for(let i=0 ;i<catData.length;i++){
//             var productData=[];
//             var catId =catData[i]['_id'].toString();
//               var catPro = await Product.find({category_id:catId});
//               if(catPro.length >0){
//                 for(let j=0;j<catPro.length;j++){
//                     productData.push({
//                        "prodductname":catPro[j]['name'],
//                        "image":catPro[j]['image'], 
//                        "descrption":catPro[j]['pdescription'],   
//                        "location":catPro[j]['location'],
//                        "author":catPro[j]['author'],
//                        "delivery":catPro[j]['delivery'],
//                        "price":catPro[j]['price'],
//                        "expiredate":catPro[j]['expiredate']             
//                        })
//                      }
//                      }
//             sendData.push({
//             "category":catData[i]['category'],
//             "product":productData
//             });
//         }

//             if (sendData.length > 0) {
//                 return res.status(200) .send({ success: true, message: 'product detail', data: sendData });
//               } else {
//                 return res
//                   .status(200)
//                   .send({ success: false, message: 'No products found', data: sendData });
//               }
//             } else {
//               return res
//                 .status(200)
//                 .send({ success: false, message: 'No categories found', data: sendData });
//             }
//           } catch (error) {
//             //return res.status(400).send({ success: false, msg: error.message });
//             console.log(error);
//           }
//         };
        
// module.exports={
//     add_product,getProduct
// }