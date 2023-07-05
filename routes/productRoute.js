const express=require('express');
const productRoute=express.Router();
const {isAuthenticated}=require('../middelware/auth');
const bodyparser=require('body-parser');
productRoute.use(bodyparser.json());
productRoute.use(bodyparser.urlencoded({extended:false}));

const multer =require('multer');
const path=require('path');

productRoute.use(express.static('public'));


const storage =multer.diskStorage({
    destination:function(req,file,cb){
cb(null,path.join(__dirname,'../public/productImage'),function(err,sucess){
    if(err){
        throw err
    }
});
    },
    filename:function(req,file,cb){
const name=Date.now()+'-'+file.originalname;
cb(null,name,function(err,sucess){
    if(err){
    throw err
    }
})
    }
});
const upload=multer({storage:storage});

const productController=require('../controller/productController');
productRoute.post('/addproduct',upload.single('image'),productController.add_product);
//productRoute.get('/products', productController.getProductDetail);
productRoute.get('/products', productController.getAllProducts);
productRoute.put('/products/:_id',productController.updateProduct);
productRoute.delete('/products/:_id',isAuthenticated ,productController.deleteProduct);
productRoute.get('/products/:_id' ,productController.singleProduct);


module.exports=productRoute;