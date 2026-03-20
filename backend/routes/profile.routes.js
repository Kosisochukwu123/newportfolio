const express = require("express");
const router = express.Router();
const { getProfile, updateProfile, uploadAvatar } = require("../controllers/profile.controller");
const { protect } = require("../middleware/authMiddleware");
const { uploadAvatar: avatarUpload } = require("../config/cloudinary");

router.get("/", getProfile);
router.put("/", protect, updateProfile);
router.post("/avatar", protect, avatarUpload.single("avatar"), uploadAvatar);

module.exports = router;
