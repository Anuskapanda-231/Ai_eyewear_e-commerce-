const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
  getDashboardStats,
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteProduct,
  updateOrderStatus,
  getAdminOrders,
} = require("../controllers/adminController");


router.get("/test", protect, admin, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin access granted",
    user: req.user,
  });
});


router.get(
  "/dashboard",
  protect,
  admin,
  getDashboardStats
);


router.get(
  "/products",
  protect,
  admin,
  getAdminProducts
);

router.get(
  "/orders",
  protect,
  admin,
  getAdminOrders
);


// ADD PRODUCT
router.post(
  "/products",
  protect,
  admin,
  createAdminProduct
);

router.put(
  "/products/:id",
  protect,
  admin,
  updateAdminProduct
);

// DELETE PRODUCT
router.delete(
  "/products/:id",
  protect,
  admin,
  deleteProduct
);

router.put(
  "/orders/:id/status",
  protect,
  admin,
  updateOrderStatus
);

module.exports = router;