
const product=require('../model/userproduct');
const getProduct = async(req,res)=>{
res.render('addproduct')
};

const postProduct=(req,res)=>{
  const productname =req.body.productname;
  const productdescription=req.body.productdescription;
  const price= req.body.price;
  const author=req.body.author;
  const expiredate=req.body.expiredate;
  const image=req.body.image;
 
  const prod = new product(productname,productdescription,price,author,expiredate,image)

  prod.save();
  const products =product.find({});

 res.setHeader('Cache-Control', 'no-store');
      res.status(201).render('shopnow',{
        sucess:true,
        products,
      
      });
console.log(products)
}
 //display product
const displayProduct=(req,res)=>{
   const products =product.find({});
   res.setHeader('Cache-Control', 'no-store');
      res.status(201).render('shopnow',{
        sucess:true,
        products,
      
    })
    console.log(products[0]); // Output: waiwai
//console.log(products[0].price); // Output: waiwai is a noodles
//console.log(products[0].expiredate); // Output: me

};
module.exports={
  getProduct,postProduct,displayProduct
}