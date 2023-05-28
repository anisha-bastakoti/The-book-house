const product=require('../model/userproduct');
const getProduct = async(req,res)=>{
res.render('addproduct')
};

const postProduct=async(req,res)=>{
    console.log(req.file);
    try{
      if (!req.body.productname || !req.body.expiredate|| !req.body.author|| !req.file
          ||!req.body.price||!req.body.productdescription) {
          req.flash('message', 'Please fill in all the fields.');
          return res.redirect('/addproduct');
        
        }
        const newProduct= new product({
          productname:req.body.productname,
          expiredate: req.body.expiredate,
          author:req.body.author,
          image: 
          {
            data:req.file.buffer,
            //data: Buffer.from(req.file.buffer),
            contentType:req.file.mimetype,
          },
          productdescription:req.body.productdescription,
          price:req.body.price,
          productcategori:req.body.productcategori
      });
      await newProduct.save();
      console.log(newProduct.findAll());
      res.send('sucesfully');
      next();
      }
      catch(error){
        console.log(error);
      }
  };

 module.exports={
    getProduct,postProduct
 }