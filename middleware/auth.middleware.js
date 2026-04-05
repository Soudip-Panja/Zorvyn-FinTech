const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");

const verifyJWT = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);

    if (decodedToken.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid Token" });
  }
};

module.exports = verifyJWT;
