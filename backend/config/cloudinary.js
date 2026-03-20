const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Project image storage ────────────────────────────────
const projectStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "portfolio/projects",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1200, height: 750, crop: "fill", quality: "auto" }],
  },
});

// ── Avatar / profile photo storage ──────────────────────
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "portfolio/avatar",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 600, height: 750, crop: "fill", quality: "auto" }],
  },
});

const uploadProjectImage = multer({
  storage: projectStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3 MB
});

module.exports = { cloudinary, uploadProjectImage, uploadAvatar };
