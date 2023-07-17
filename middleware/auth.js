// Secret key for JWT
const secretKey = 'your-secret-key';

// Middleware to validate and retrieve the user from the token
function verifyToken(req, res, next) {
  // Get the token from the request headers or query parameters or cookies
  const token = req.headers.authorization?.split(' ')[1] || req.query.token || req.cookies.token;

  if (!token) {
    // Token not provided
    return res.status(401).json({ message: 'Authentication token required' });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, secretKey);

    // Attach the user to the request object
    req.user = decoded.user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Token verification failed
    return res.status(401).json({ message: 'Invalid token' });
  }
}



