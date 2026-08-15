const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} = require("../controllers/wishlistController");


router.post("/", protect, addToWishlist);

router.delete("/:productId", protect, removeFromWishlist);

router.get("/", protect, getWishlist);


module.exports = router;