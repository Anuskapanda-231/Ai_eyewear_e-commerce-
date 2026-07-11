const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
  createProduct,
  getAllProducts,
} = require("../controllers/productController");

router.post("/", protect, admin, createProduct);
router.get("/", getAllProducts);

module.exports = router;