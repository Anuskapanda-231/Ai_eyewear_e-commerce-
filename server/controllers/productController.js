const Product = require("../models/Product");

const createProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      category,
      description,
      price,
      stock,
    } = req.body;

    if (!name || !brand || !category || !description || !price) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  createProduct,
  getAllProducts,
};