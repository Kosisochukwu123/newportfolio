const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const UPLOAD_DIR = path.join(__dirname, "..", "uploads");

// Make sure the uploads folder exists (multer throws ENOENT otherwise)
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, UPLOAD_DIR);
//   },
//   filename: (req, file, cb) => {
//     const unique = crypto.randomBytes(8).toString("hex");
//     const ext = path.extname(file.originalname).toLowerCase();
//     cb(null, `${Date.now()}-${unique}${ext}`);
//   },
// });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Saving to:", UPLOAD_DIR);
    cb(null, UPLOAD_DIR);
  },

  filename: (req, file, cb) => {
    console.log("Incoming file:", file.originalname);

    const unique = crypto.randomBytes(8).toString("hex");
    const ext = path.extname(file.originalname).toLowerCase();

    const filename = `${Date.now()}-${unique}${ext}`;

    console.log("Generated filename:", filename);

    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, WebP, or GIF images are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB, matches the UI copy
});

module.exports = upload;
