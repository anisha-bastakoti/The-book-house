const express = require("express");
const productController = require("../controller/product");
 require("./productitem");
const router = express.Router();
const multer=require('multer');
 //const upload=require('../model/image');
router.get('/shopnow',productController.displayProduct);
router.post('/shopnow',productController.displayProduct);
router.get('/addproduct',productController.getProduct);
const fileStorageEngine =multer.diskStorage({
  destination:(req,file,cb)=>{
  cb(null,'public/upload/')
  },
  filename:(req,file,cb)=>{
    cb(null,Date.now()+'-'+file.originalname)
  }
})
 const upload=multer({storage:fileStorageEngine })
router.post('/addproduct',upload.single('image'),productController.postProduct);

module.exports = router;