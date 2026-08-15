const User = require("../models/User");
const Product = require("../models/Product");


// ADD TO WISHLIST
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

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

    if (user.wishlist.includes(productId)) {
      return res.status(400).json({
        success: false,
        message: "Product already in wishlist",
      });
    }

    user.wishlist.push(productId);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      wishlist: user.wishlist,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// REMOVE FROM WISHLIST
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user.id);

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== productId
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      wishlist: user.wishlist,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET WISHLIST
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("wishlist");

    res.status(200).json({
      success: true,
      wishlist: user.wishlist,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
};