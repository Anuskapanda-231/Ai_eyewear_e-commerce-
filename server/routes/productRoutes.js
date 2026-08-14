const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

router.post(
  "/",
  protect,
  admin,
  upload.array("images", 5),
  createProduct
);

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.put(
  "/:id",
  protect,
  admin,
  upload.array("images", 5),
  updateProduct
);
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;