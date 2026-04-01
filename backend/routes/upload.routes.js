const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { uploadProjectImage, uploadToCloudinary, cloudinary } = require("../config/cloudinary");

// POST /api/upload/image  (protected)
router.post("/image", protect, uploadProjectImage.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file provided" });
  }
  const { url, publicId } = await uploadToCloudinary(req.file.path);
  res.status(201).json({ success: true, url, publicId });
});

// DELETE /api/upload/image  (protected)
router.delete("/image", protect, async (req, res) => {
  const { publicId } = req.body;
  if (!publicId) {
    return res.status(400).json({ success: false, message: "publicId is required" });
  }
  const result = await cloudinary.uploader.destroy(publicId);
  res.json({ success: true, result });
});

module.exports = router;
