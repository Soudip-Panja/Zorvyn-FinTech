const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const verifyJwt = require("../middleware/auth.middleware");
const { SECRET_KEY, JWT_SECRET, EMAIL: ADMIN_EMAIL } = require("../config/env");

router.post("/login", (req, res) => {
  const { email, secret } = req.body;

  if (email === ADMIN_EMAIL && secret === SECRET_KEY) {
    const token = jwt.sign({ role: "admin", email: email }, JWT_SECRET, {
      expiresIn: "24h",
    });

    return res.json({ token: token });
  } else {
    return res.status(401).json({ message: "Access Denied" });
  }
});

router.get("/admin", verifyJwt, (req, res) => {
  res.json({ message: "Protected route accessable." });
});

module.exports = router;
