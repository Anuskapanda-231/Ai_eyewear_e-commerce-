const User = require("../models/User");
const Product = require("../models/Product");

// Add product to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const user = await User.findById(req.user.id);

    const existingItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      user.cart.push({
        product: productId,
        quantity: Number(quantity),
      });
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart: user.cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get user's cart
const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "cart.product"
    );

    res.status(200).json({
      success: true,
      cart: user.cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update cart quantity
const updateCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid product or quantity",
      });
    }

    const user = await User.findById(req.user.id);

    const item = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    item.quantity = Number(quantity);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Cart updated",
      cart: user.cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove product from cart
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user.id);

    user.cart = user.cart.filter(
      (item) => item.product.toString() !== productId
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart: user.cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCart,
  removeFromCart,
};