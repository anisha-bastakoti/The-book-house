
const STATUS_CODE = {
  unAuthorized: 403,
};
const errorMessage = (res,statusCode, message) => {
  return res.status(statusCode).json({
    message,
  });
};

module.exports = {
  STATUS_CODE,
  errorMessage,
};
