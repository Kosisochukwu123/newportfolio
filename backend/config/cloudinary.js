const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ── Cloudinary Config ─────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Ensure temp upload folder exists ─────────────
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// ── Multer — temp local storage ───────────────────
const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error("Only image files are allowed (jpg, png, webp)"));
  },
});

// same instance used for both avatar and project image uploads
const uploadAvatar = upload;
const uploadProjectImage = upload;

// ── Helper: upload a local temp file to Cloudinary ─────
const uploadToCloudinary = async (filePath, folder = "portfolio/uploads") => {
  const result = await cloudinary.uploader.upload(filePath, { folder });
  fs.unlink(filePath, () => {}); // delete temp file after upload
  return result;
};

// ── Generic upload route handler ──────────────────
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file provided" });
    }
    const result = await uploadToCloudinary(req.file.path);
    res.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  cloudinary,
  upload,
  uploadAvatar,
  uploadProjectImage,
  uploadToCloudinary,
  uploadImage,
};
