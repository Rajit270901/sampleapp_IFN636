const jwt = require('jsonwebtoken'); // jwt package used for checking login token
const User = require('../models/User'); // importing user model https://www.w3schools.com/nodejs/nodejs_modules.asp

const protect = async (req, res, next) => { // middleware function for protected routes https://www.w3schools.com/nodejs/nodejs_express.asp
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) { // checks if auth header has bearer token https://www.w3schools.com/jsref/jsref_startswith.asp
    try { // used because token verification can fail https://www.w3schools.com/js/js_errors.asp
      token = req.headers.authorization.split(' ')[1]; // splits bearer token and takes only the token part https://www.w3schools.com/jsref/jsref_split.asp
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password'); // gets user but removes password field from result
      return next(); // token is valid so request can continue https://www.w3schools.com/nodejs/nodejs_express.asp
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  return res.status(401).json({ message: 'Not authorized, no token' });
};

const adminOnly = (req, res, next) => { // middleware for admin routes only
  if (req.user && req.user.role === 'admin') {
    return next(); // user is admin so continue to controller
  }

  return res.status(403).json({ message: 'Admin access only' });
};

module.exports = { protect, adminOnly }; // exporting auth middleware for routes https://www.w3schools.com/nodejs/nodejs_modules.asp
