const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { uploadProjectImage, cloudinary } = require("../config/cloudinary");

// POST /api/upload/image  (protected)
// Generic image upload — returns the Cloudinary URL + public_id
router.post(
  "/image",
  protect,
  uploadProjectImage.single("image"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file provided" });
    }
    res.status(201).json({
      success: true,
      url: req.file.path,
      publicId: req.file.filename,
    });
  }
);

// DELETE /api/upload/image  (protected)
// Delete an image by its Cloudinary public_id
router.delete("/image", protect, async (req, res) => {
  const { publicId } = req.body;
  if (!publicId) {
    return res.status(400).json({ success: false, message: "publicId is required" });
  }
  const result = await cloudinary.uploader.destroy(publicId);
  res.json({ success: true, result });
});

module.exports = router;
