function checkSession(req, res, next) {
  console.log("req.session.user", req.session.user);
  if (!req.session.userDetail) {
    return res.status(401).json({
      message: "Authorized Access. Make sure you have valid user session",
    });
  }
  next();
}

module.exports = {
  checkSession,
};
