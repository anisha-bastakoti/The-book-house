const Product = require("../model/productModel");
const tryCatchError = require("../middleware/trycatchError");
const mongoose = require("mongoose");

// Add reviews and ratings for Products
const createProductReviews = tryCatchError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  if (rating > 5)
    res
      .status(401)
      .json({ message: "Rating should be less than or equal to 5" });

  let { id: userID, name: userName } = req.session.userDetail;

  const review = {
    user: userID,
    name: userName,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(
    new mongoose.Types.ObjectId(productId.toString())
  );

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() == userID.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() == userID.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReview = product.reviews.length;
  }

  let avg = 0;
  product.reviews.forEach((rev) => {
    avg = avg + rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Review Added",
  });
});

// get all reviews
const getAllReviews = tryCatchError(async (req, res, next) => {
  const product = await Product.findById(
    new mongoose.Types.ObjectId(req.query.id)
  );

  if (!product) {
    return next(new Error("Product not Found", 404));
  }

  const _obj = product.reviews.toObject();

  console.log("_obj", typeof _obj);

  res.status(200).json({
    success: true,
    reviews: _obj,
  });
});

// Delete reviews

const deleteReview = tryCatchError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new Error("Product not found"));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );
  let avg = 0;
  reviews.forEach((rev) => {
    avg = avg + rev.rating;
  });
  let ratings = 0;
  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / product.reviews.length;
  }

  const numOfReview = reviews.length;
  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReview,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: true,
    }
  );

  res.status(200).json({
    success: true,
    message: "Review deleted Successfully",
  });
});

module.exports = {
  createProductReviews,
  getAllReviews,
  deleteReview,
};
