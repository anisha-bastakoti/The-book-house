const Product=require('../model/productModel');
  const categoryController=require('../controller/categoryController');
  //const Category=require('../model/catagory');
const add_product=async(req,res)=>{
    try {
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
        });
await product.save();
 const products =await Product.find();
res.status(200).render('products',{msg:'product details',
      data:products});
      //console.log(products[0].name);
      

  }catch(error){
    res.status(400).send({sucess:false,msg:error.message});
  }
}
//getting all the products
 const getProductDetail=async(req,res)=>{
    try{
        // Fetch all products from the database
        const products = await Product.find()
        .select('name pdescription location author delivery price expiredate image');
     // Return the products as a response
    res.status(200).json({ success: true, data: products,});

    }catch(error){
        res.status(400).send({sucess:false,msg:error.message});
    }
 }

//getting product catergory wise
const getProduct = async (req, res) => {
    try {
      const sendData = [];
      const catData = await categoryController.getCategory();
      if (catData.length > 0) {
        for (let i = 0; i < catData.length; i++) {
          const productData = [];
          const catId = catData[i]['_id'].toString();
          const catPro = await Product.find({ category_id: catId });
          if (catPro.length > 0) {
            for (let j = 0; j < catPro.length; j++) {
              productData.push({
                prodductname: catPro[j]['name'],
                image: catPro[j]['image'],
                description: catPro[j]['pdescription'],
                location: catPro[j]['location'],
                author: catPro[j]['author'],
                delivery: catPro[j]['delivery'],
                price: catPro[j]['price'],
                expiredate: catPro[j]['expiredate'],
              });
            }
          }
          sendData.push({
            category: catData[i]['category'],
            product: productData,
          });
        }
  
        if (sendData.length > 0) {
          return res
            .status(200)
            .send({ success: true, message: 'product detail', data: sendData });
        } else {
          return res
            .status(200)
            .send({ success: false, message: 'No products found', data: sendData });
        }
      } else {
        return res
          .status(200)
          .send({ success: false, message: 'No categories found', data: sendData });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).send({ success: false, msg: error.message });
    }
  };

  // Update Product 
const updateProduct = (async (req, res) => {
    try{
    let product = await Product.findById(req.params.id);
    if (!product) {
      return next(new Error("Product not Found", 404));
    }
  
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true.valueOf,
      useFindAndModify: false,
    });
  
   return res.json({
      success: true,
      product,
    });
}catch(error){
    return res.status(400).send({ success: false, msg: error.message });
}
  });
  
  module.exports = {
    add_product,
    getProduct,
    getProductDetail,
    updateProduct
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