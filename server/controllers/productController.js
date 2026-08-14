const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
const createProduct = async (req, res) => {
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
      featured,
    } = req.body;

    // Validate required fields
    if (!name || !brand || !category || !description || !price) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // Check images
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one product image",
      });
    }

    // Upload images to Cloudinary
    const imageUrls = [];

    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "AI_Eyewear_e-commerce/products",
      });

      imageUrls.push(result.secure_url);
       fs.unlinkSync(file.path);
    }

    // Create product
    const product = await Product.create({
      name,
      brand,
      category,
      description,
      price,
      discountPrice,
      stock,
      images: imageUrls,
      frameShape,
      frameType,
      lensType,
      color,
      gender,
      featured,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });

  } catch (error) {
    console.error("Create Product Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getAllProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
      sort,
    } = req.query;

    const query = {};

    // Search by product name
    if (search) {
      query.name = {
        $regex: search,
        $options: "i",
      };
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by price
    if (minPrice || maxPrice) {
      query.price = {};

      if (minPrice) query.price.$gte = Number(minPrice);

      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let productsQuery = Product.find(query);

    // Sorting
    if (sort) {
      productsQuery = productsQuery.sort(sort);
    }

    // Pagination
    const skip = (page - 1) * limit;

    productsQuery = productsQuery
      .skip(skip)
      .limit(Number(limit));

    const products = await productsQuery;

    const totalProducts = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      totalProducts,
      currentPage: Number(page),
      totalPages: Math.ceil(totalProducts / limit),
      products,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
}; 

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Update normal product fields
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
      featured,
    } = req.body;

    if (name !== undefined) product.name = name;
    if (brand !== undefined) product.brand = brand;
    if (category !== undefined) product.category = category;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (discountPrice !== undefined) product.discountPrice = discountPrice;
    if (stock !== undefined) product.stock = stock;
    if (frameShape !== undefined) product.frameShape = frameShape;
    if (frameType !== undefined) product.frameType = frameType;
    if (lensType !== undefined) product.lensType = lensType;
    if (color !== undefined) product.color = color;
    if (gender !== undefined) product.gender = gender;
    if (featured !== undefined) product.featured = featured;

    // Upload new images if provided
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "AI_Eyewear_e-commerce/products",
        });

        product.images.push(result.secure_url);

        // Delete temporary file
        fs.unlinkSync(file.path);
      }
    }

    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });

  } catch (error) {
    console.error("Update Product Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
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
  getProductById,
  updateProduct,
  deleteProduct,

};