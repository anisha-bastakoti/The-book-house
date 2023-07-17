const { STATUS_CODE, errorMessage } = require("../common");

const productReviewValidator = (req, res, next) => {
  const { rating, comment, productId } = req.body;

  if (
    rating === undefined &&
    comment === undefined &&
    productId === undefined
  ) {
    return errorMessage(
      res,
      STATUS_CODE.unAuthorized,
      "Data is missing; {rating,comment,productID}"
    );
  }

  if (rating === undefined || rating.toString() === "")
    return errorMessage(
      res,
      STATUS_CODE.unAuthorized,
      "Rating value is required"
    );
  else if (comment === undefined || comment.toString() === "")
    return errorMessage(
      res,
      STATUS_CODE.unAuthorized,
      "Comment value is required"
    );
  else if (productId === undefined || productId.toString() === "")
    return errorMessage(
      res,
      STATUS_CODE.unAuthorized,
      "Product ID value is required"
    );

  next();
};

const getProductReview = (req, res, next) => {
  const { id: productId } = req.query;

  if (productId === undefined || productId.toString() === "")
    return errorMessage(
      res,
      STATUS_CODE.unAuthorized,
      "Product ID value is required"
    );

  next();
};

module.exports = {
  productReviewValidator,
  getProductReview,
};
