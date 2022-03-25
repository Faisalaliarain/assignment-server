const JWT = require('jsonwebtoken');
const JWT_SECRET = require('../config/serverConfig').jwtSecret;

const verifyJwtToken = async (req, res, next) => {
  let token = req.headers["authorization"];
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  JWT.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.user? req.user._id = decoded.id : req._id = decoded.id;
    next();
  });
};


module.exports = {
  verifyJwtToken,
};
