const express = require("express");
const router = express.Router();

const verifyJWT = require("../middleware/auth.middleware");
const {
  adminLogin,
  getProtectedData,
} = require("../controllers/admin.controller");

router.post("/login", adminLogin);
router.get("/api/data", verifyJWT, getProtectedData);

module.exports = router;
