const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  verifyPayment,
} = require("../controllers/orderController");

const  protect  = require("../middleware/authMiddleware");

router.post("/", protect, createOrder);

router.get("/my-orders", protect, getMyOrders);

router.post("/verify-payment", protect, verifyPayment);

module.exports = router;