const Product = require("../model/productModel");
const Seller = require("../model/image");
const image = require("../model/image");
const ApiFeature = require("../utlis/apifeatures");
const getAllProducts = async (req, res) => {
  const resultPerPage = 6;
  const productCount = await Product.countDocuments();
  const apiFeature = new ApiFeature(Product.find(), req.query)
    .filter()
    .search()
    .pagination(resultPerPage);
  // Handle Category Filter
  if (req.query.category) {
    apiFeature.query = apiFeature.query.find({ category: req.query.category });
  }

  const products = await apiFeature.query;
  console.log(products);
  const categories = [
    "Spiritual",
    "Frictional",
    "Nonfrictional",
    "Textbook",
    "Notebook",
  ];
  const searchQuery = req.query.keyword;
  let query = {};

  if (searchQuery) {
    query = {
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { author: { $regex: searchQuery, $options: "i" } },
      ],
    };
  }

  res.render("products", {
    data: products,
    productCount,
    resultPerPage,
    category: categories,
    match: searchQuery,
  });
};
// end of getAllProducts

const add_product = async (req, res) => {
  try {
    const seller = await Seller.findOne();
    if (seller) {
      const sellerId = seller._id;
      const product = new Product({
        name: req.body.name,
        // slug:req.body.title,
        pdescription: req.body.pdescription,
        category: req.body.category,
        location: req.body.location,
        author: req.body.author,
        delivery: req.body.delivery,
        price: req.body.price,
        expiredate: req.body.expiredate,
        image: req.file.filename,
        seller_id: sellerId,
      });
      const products = await product.save();
      res.redirect("/products", 200, { data: products });
    }
  } catch (error) {
    res.status(400).send({ sucess: false, msg: error.message });
  }
};
//getting all the products
const getProductDetail = async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await Product.find().select("name price image");
    // Return the products as a response
    res.render("products", { success: true, data: products });
  } catch (error) {
    res.status(400).send({ sucess: false, msg: error.message });
  }
};

//get single product
const singleProduct = async (req, res) => {
  try {
    const productId = await req.params._id.replace(":", "");
    const product = await Product.findOne({ _id: productId });
    console.log(product);
    if (!product) {
      return res.status(404).send({ success: false, msg: "Product not found" });
    }
    // Access the seller details
    const sellerId = product.seller_id;
    const seller = await image.findOne({ _id: sellerId });
    console.log(seller);
    console.log(productId);
    res.render("view_product_detail", {
      success: true,
      msg: "product found",
      data: product,
      datas: seller,
    });
  } catch (error) {
    console.log(error);
  }
};

//get display product
const getProduct = async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await Product.find();

    if (!products || products.length === 0) {
      // Handle case when no products are found
      return res.render("productManger", { products: [] });
    }

    console.log(products);

    // Render the productManger view with the products data
    res.render("productManger", { products: products });
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

//get edit product

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, pdescription, author, category, delivery, price } = req.body;

    // Find the product by ID
    const product = await Product.findById(productId);

    // Check if the product exists
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Update the product fields
    product.name = name;
    product.description = pdescription;
    product.author = author;
    product.category = category;
    product.delivery = delivery;
    product.price = price;

    // Save the updated product
    const updatedproduct = await product.save();

    res.redirect(
      "/productManger?success=true&data=" +
        encodeURIComponent(JSON.stringify(updatedproduct))
    );
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//deleting the product
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params._id; // Corrected parameter name

    // Delete the product from the database using the productId
    await Product.findByIdAndDelete(productId);

    res.redirect("/productManger"); // Redirect to the admin dashboard or any other page after successful deletion
  } catch (error) {
    console.error("Error:", error); // Add this line for debugging
    res.status(500).send({ success: false, msg: error.message });
  }
};
const editProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // Retrieve the product from the database using the productId
    const product = await Product.findById(productId);

    // Render the edit product form or perform any necessary logic
    res.render("editProduct", { product });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ success: false, msg: error.message });
  }
};

module.exports = {
  add_product,
  getAllProducts,
  getProductDetail,
  getProduct,
  updateProduct,
  deleteProduct,
  singleProduct,
  editProduct,
};
