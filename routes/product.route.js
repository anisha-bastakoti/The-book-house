const express = require("express");
const multer = require("multer");
const path = require("path");
const productController = require("../controller/productController");
const productReviewController = require("../controller/productReviewController");
const { isAuthenticated } = require("../middleware/auth");
const bodyparser = require("body-parser");
const productRoute = express.Router();
const { checkSession } = require("../middleware/checkSession.middleware");
const {
  productReviewValidator,
  getProductReview,
} = require("../validators/products/createProductReview.validator");

//Middleware

productRoute.use(bodyparser.json());
productRoute.use(bodyparser.urlencoded({ extended: false }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.join(__dirname, "../public/productImage"),
      function (err, sucess) {
        if (err) {
          throw err;
        }
      }
    );
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name, function (err, sucess) {
      if (err) {
        throw err;
      }
    });
  },
});
const upload = multer({ storage: storage });

productRoute.post(
  "/addproduct",
  upload.single("image"),
  productController.add_product
);
productRoute.get("/productmanger", productController.getProduct);
productRoute.get("/products", productController.getAllProducts);
productRoute.post("/products/edit/:id", productController.editProduct);
productRoute.post("/products/update/:id", productController.updateProduct);
productRoute.post("/products/delete/:_id", productController.deleteProduct);
productRoute.get("/products/:_id", productController.singleProduct);

// for product reviews
productRoute.post(
  "/product_review",
  [checkSession, productReviewValidator],
  productReviewController.createProductReviews
);

productRoute.get(
  "/product_review",
  [checkSession, getProductReview],
  productReviewController.getAllReviews
);

module.exports = productRoute;
