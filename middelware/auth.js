
const tryCatch = require("./tryCatchError");
const jwt = require("jsonwebtoken");
const User = require("../model/schema");

const isAuthenticated = tryCatch(async (req, res, next) => {
    const { token } = req.cookies;
  
    if (!token) {
      return res.status(401).json({ error: "Please login to access any resources" });
    }
  
    try {
      const decodedData = jwt.verify(token, 'ertyb667ee4tv');
      req.user = await User.findById(decodedData.id);
      next();
    } catch (error) {
      return res.status(401).json({ error: "Invalid token" });
    }
  });

  
const authorizedRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      next(new Error(`Role: ${req.user.role} is not allowed `));
    }
    next();
  };
};
module.exports = { isAuthenticated, authorizedRoles };


