const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");

dotenv.config();

const products = [
  {
    name: "Classic Aviator",
    brand: "Ray-Ban",
    category: "Sunglasses",
    description: "Classic metal-frame aviator sunglasses.",
    price: 5999,
    discountPrice: 4999,
    stock: 25,
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083"
    ],
    frameShape: "Aviator",
    frameType: "Full Rim",
    lensType: "UV Protection",
    color: "Black",
    gender: "Unisex",
    featured: true,
  },

  {
    name: "Urban Black",
    brand: "Oakley",
    category: "Sunglasses",
    description: "Modern black sunglasses for everyday wear.",
    price: 4499,
    discountPrice: 3799,
    stock: 30,
    images: [
      "https://images.unsplash.com/photo-1577803645773-f96470509666"
    ],
    frameShape: "Rectangle",
    frameType: "Full Rim",
    lensType: "Polarized",
    color: "Black",
    gender: "Men",
    featured: false,
  },

  {
    name: "Elegant Round",
    brand: "Vogue",
    category: "Eyeglasses",
    description: "Elegant round frame designed for everyday use.",
    price: 2999,
    discountPrice: 2499,
    stock: 40,
    images: [
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371"
    ],
    frameShape: "Round",
    frameType: "Full Rim",
    lensType: "Clear",
    color: "Brown",
    gender: "Women",
    featured: true,
  },

  {
    name: "Minimal Black",
    brand: "Fastrack",
    category: "Eyeglasses",
    description: "Minimal lightweight black frame.",
    price: 1999,
    discountPrice: 1599,
    stock: 50,
    images: [
      "https://images.unsplash.com/photo-1508296695146-257a814070b4"
    ],
    frameShape: "Rectangle",
    frameType: "Full Rim",
    lensType: "Blue Light",
    color: "Black",
    gender: "Unisex",
    featured: false,
  },

  {
    name: "Retro Brown",
    brand: "Titan",
    category: "Eyeglasses",
    description: "Retro-inspired brown frame.",
    price: 2499,
    discountPrice: 1999,
    stock: 35,
    images: [
      "https://images.unsplash.com/photo-1556306535-38febf6782e7"
    ],
    frameShape: "Round",
    frameType: "Full Rim",
    lensType: "Clear",
    color: "Brown",
    gender: "Unisex",
    featured: false,
  },

  {
    name: "Sport Pro",
    brand: "Puma",
    category: "Sunglasses",
    description: "Sporty sunglasses with lightweight construction.",
    price: 3499,
    discountPrice: 2999,
    stock: 28,
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083"
    ],
    frameShape: "Wrap",
    frameType: "Full Rim",
    lensType: "Polarized",
    color: "Black",
    gender: "Men",
    featured: true,
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    await Product.deleteMany();

    await Product.insertMany(products);

    console.log(`${products.length} products inserted successfully`);

    process.exit();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedProducts();