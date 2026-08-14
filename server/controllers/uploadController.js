const cloudinary = require("../config/cloudinary");

const uploadImage = async (req, res) => {
  try {
    console.log(cloudinary.config());
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "AI_Eyewear_e-commerce",
    });

    res.status(200).json({
      success: true,
      imageUrl: result.secure_url,
      public_id: result.public_id,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  uploadImage,
};