const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const { JWT_SECRET } = require("../config/env");

const User = require("../models/users.model");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const token = jwt.sign(
      {
        role: user.role,
        email: user.email,
        userId: user._id,
      },
      JWT_SECRET,
      { expiresIn: "24h" },
    );

    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const verifyJwt = require("../middleware/auth.middleware");

router.get("/admin", verifyJwt, (req, res) => {
  res.json({ message: "Protected route accessible." });
});

module.exports = router;
