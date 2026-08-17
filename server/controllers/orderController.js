const User = require("../models/User");
const Order = require("../models/Order");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
const createOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    if (
      !shippingAddress ||
      !shippingAddress.name ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide complete shipping information",
      });
    }

    const user = await User.findById(req.user.id).populate(
      "cart.product"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const items = user.cart.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.images?.[0] || "",
      price: item.product.price,
      quantity: item.quantity,
    }));

    const totalAmount = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const razorpayOrder = await razorpay.orders.create({
  amount: Math.round(totalAmount * 100),
  currency: "INR",
  receipt: `receipt_${Date.now()}`,
});
    const order = await Order.create({
  user: user._id,
  items,
  shippingAddress,
  totalAmount,
  razorpayOrderId: razorpayOrder.id,
});

    res.status(201).json({
  success: true,
  message: "Order created successfully",
  order,
  razorpayOrder: {
    id: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
  },
  razorpayKeyId: process.env.RAZORPAY_KEY_ID,
});
}catch (error) {
    console.error("Create order error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !orderId
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment details are incomplete",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.paymentStatus = "Paid";
    order.orderStatus = "Confirmed";
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  createOrder,
  getMyOrders,
  verifyPayment,
};