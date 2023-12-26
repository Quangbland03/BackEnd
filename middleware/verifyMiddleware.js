const AuthModel = require('../models/Auth');
const jwt = require('jsonwebtoken');

const verify = (requiredRole) => (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, "262003", (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Token is not valid!" });
      }
      req.user = user;
      const userId = req.user.userId;
      AuthModel.findById(userId, (err, user) => {
        if (err || !user) {
          return res.status(403).json({ message: "User not found!" });
        }
        if (user.role === requiredRole) {
          next(); 
        } else {
          res.status(403).json({ message: "Insufficient permissions!" });
        }
      });
    });
  } else {
    res.status(401).json({ message: "You are not authenticated!" });
  }
};
module.exports = verify;