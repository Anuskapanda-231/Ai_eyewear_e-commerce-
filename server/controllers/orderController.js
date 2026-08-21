const User = require("../models/User");
const Order = require("../models/Order");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// =====================================================
// CREATE ORDER
// =====================================================

const createOrder = async (req, res) => {
  try {
    const {
      shippingAddress,
      paymentMethod = "Razorpay",
    } = req.body;

    // Validate payment method
    if (!["Razorpay", "COD"].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    // Validate shipping address
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

    // Get logged-in user and cart
    const user = await User.findById(req.user.id).populate(
      "cart.product"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check cart
    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // Create order items
    const items = user.cart.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.images?.[0] || "",
      price: item.product.price,
      quantity: item.quantity,
    }));

    // Calculate total
    const totalAmount = items.reduce(
      (total, item) =>
        total + item.price * item.quantity,
      0
    );

    // =====================================================
    // INITIAL TRACKING TIMELINE
    // =====================================================

    const initialTrackingTimeline = [
      {
        status: "Placed",
        message: "Your order has been placed successfully",
        date: new Date(),
      },
      {
        status: "Processing",
        message: "Your order is being prepared",
        date: new Date(),
      },
    ];

    // =====================================================
    // CASH ON DELIVERY
    // =====================================================

    if (paymentMethod === "COD") {
      const order = await Order.create({
        user: user._id,
        items,
        shippingAddress,
        totalAmount,

        paymentMethod: "COD",
        paymentStatus: "Pending",

        orderStatus: "Processing",

        trackingTimeline: initialTrackingTimeline,
      });

      // Clear cart
      user.cart = [];
      await user.save();

      return res.status(201).json({
        success: true,
        message: "COD order placed successfully",
        order,
      });
    }

    // =====================================================
    // RAZORPAY
    // =====================================================

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

      paymentMethod: "Razorpay",
      paymentStatus: "Pending",

      orderStatus: "Processing",

      trackingTimeline: initialTrackingTimeline,

      razorpayOrderId: razorpayOrder.id,
    });

    return res.status(201).json({
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
  } catch (error) {
    console.error("Create order error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// GET MY ORDERS
// =====================================================

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get my orders error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// VERIFY RAZORPAY PAYMENT
// =====================================================

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    // Validate payment details
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

    // Generate signature
    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    // Verify signature
    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // Find user's order
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

    // Prevent duplicate verification
    if (order.paymentStatus === "Paid") {
      return res.status(400).json({
        success: false,
        message: "Payment has already been verified",
      });
    }

    // =====================================================
    // UPDATE PAYMENT
    // =====================================================

    order.paymentStatus = "Paid";
    order.orderStatus = "Confirmed";

    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;

    // =====================================================
    // ADD CONFIRMED TO TRACKING TIMELINE
    // =====================================================

    order.trackingTimeline.push({
      status: "Confirmed",
      message:
        "Payment received. Your order has been confirmed.",
      date: new Date(),
    });

    await order.save();

    // Clear cart after successful payment
    const user = await User.findById(req.user.id);

    if (user) {
      user.cart = [];
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order,
    });
  } catch (error) {
    console.error("Payment verification error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// EXPORT CONTROLLERS
// =====================================================

module.exports = {
  createOrder,
  getMyOrders,
  verifyPayment,
};