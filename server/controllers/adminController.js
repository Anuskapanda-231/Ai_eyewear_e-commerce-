const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const pendingPayments = await Order.countDocuments({
      paymentStatus: "Pending",
    });

    const processingOrders = await Order.countDocuments({
      orderStatus: "Processing",
    });

    const shippedOrders = await Order.countDocuments({
      orderStatus: "Shipped",
    });

    const deliveredOrders = await Order.countDocuments({
      orderStatus: "Delivered",
    });

    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: "Paid" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0
        ? revenueResult[0].totalRevenue
        : 0;

    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        pendingPayments,
        processingOrders,
        shippedOrders,
        deliveredOrders,
      },
      recentOrders,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all orders for admin
const getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name images price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get admin orders error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all products
const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Get admin products error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// CREATE PRODUCT
const createAdminProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      category,
      description,
      price,
      discountPrice,
      stock,
      frameShape,
      frameType,
      lensType,
      color,
      gender,
      imageUrl,
    } = req.body;

    // Required fields
    if (
      !name ||
      !brand ||
      !category ||
      !description ||
      !price ||
      stock === undefined ||
      !imageUrl
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required product details",
      });
    }

    const product = await Product.create({
      name,
      brand,
      category,
      description,
      price: Number(price),
      discountPrice:
        discountPrice !== ""
          ? Number(discountPrice)
          : undefined,
      stock: Number(stock),
      frameShape,
      frameType,
      lensType,
      color,
      gender: gender || "Unisex",

      // Cloudinary URL
      images: [imageUrl],
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create admin product error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateAdminProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      category,
      description,
      price,
      discountPrice,
      stock,
      frameShape,
      frameType,
      lensType,
      color,
      gender,
      imageUrl,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.name = name;
    product.brand = brand;
    product.category = category;
    product.description = description;
    product.price = Number(price);
    product.discountPrice =
      discountPrice === ""
        ? undefined
        : Number(discountPrice);
    product.stock = Number(stock);
    product.frameShape = frameShape;
    product.frameType = frameType;
    product.lensType = lensType;
    product.color = color;
    product.gender = gender || "Unisex";

    // Only replace image if a new image was uploaded
    if (imageUrl) {
      product.images = [imageUrl];
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update product error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE PRODUCT
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// UPDATE ORDER STATUS
// =====================================================

const updateOrderStatus = async (req, res) => {
  try {
    const { status, message } = req.body;

    const allowedStatuses = [
      "Confirmed",
      "Processing",
      "Packed",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Update current order status
    order.orderStatus = status;

    // Add status to tracking timeline
    order.trackingTimeline.push({
      status,
      message: message || getDefaultTrackingMessage(status),
      date: new Date(),
    });

    // If delivered and COD, mark payment as paid
    if (
      status === "Delivered" &&
      order.paymentMethod === "COD"
    ) {
      order.paymentStatus = "Paid";
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// DEFAULT TRACKING MESSAGES
// =====================================================

const getDefaultTrackingMessage = (status) => {
  const messages = {
    Confirmed:
      "Your order has been confirmed.",

    Processing:
      "Your order is being prepared.",

    Packed:
      "Your order has been packed and is ready for shipment.",

    Shipped:
      "Your order has been shipped and is on its way.",

    "Out for Delivery":
      "Your order is out for delivery.",

    Delivered:
      "Your order has been delivered successfully.",

    Cancelled:
      "Your order has been cancelled.",
  };

  return messages[status] || "Order status updated.";
};
module.exports = {
  getDashboardStats,
  getAdminProducts,
  createAdminProduct,
  updateOrderStatus,
  getDefaultTrackingMessage,
  updateAdminProduct,
  deleteProduct,
  getAdminOrders,
};