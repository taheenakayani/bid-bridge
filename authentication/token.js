const jwt = require("jsonwebtoken");
// const {expressJwt} = require('express-jwt');

const secretKey = "bid-project-jwt";

// Middleware to check for a valid JWT token in the Authorization header
// const authenticateJwt = expressJwt({ secret: secretKey, algorithms: ['HS256'] });

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    secretKey,
    { expiresIn: "1h" }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, secretKey);
};

const validateTokenMiddleware = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(401).json({ message: "Invalid Token", errorCode: 5003 });
  }

  try {
    const decodedToken = verifyToken(token);
  } catch (error) {
    return res.status(401).json({ message: "Invalid Token", errorCode: 5003 });
  }

  next();
};

module.exports = { generateToken, verifyToken, validateTokenMiddleware };
