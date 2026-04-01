const Profile = require("../models/Profile.model");
const { cloudinary, uploadToCloudinary } = require("../config/cloudinary");

const getOrCreateProfile = async () => {
  let profile = await Profile.findOne();
  if (!profile) profile = await Profile.create({});
  return profile;
};

// GET /api/profile  (public)
const getProfile = async (req, res) => {
  const profile = await getOrCreateProfile();
  res.json({ success: true, data: profile });
};

// PUT /api/profile  (protected)
const updateProfile = async (req, res) => {
  const allowed = [
    "name", "tagline", "heroBio", "terminalLines", "availableForWork",
    "aboutBio", "yearsExperience", "projectsShipped",
    "email", "location", "timezone", "socials",
    "resumeUrl", "metaTitle", "metaDescription",
  ];

  const updates = {};
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  });

  const profile = await Profile.findOneAndUpdate(
    {},
    { $set: updates },
    { new: true, upsert: true, runValidators: true }
  );

  res.json({ success: true, data: profile });
};

// POST /api/profile/avatar  (protected — multipart)
const uploadAvatar = async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No image file provided");
  }

  const profile = await getOrCreateProfile();

  // Remove old image from Cloudinary
  if (profile.avatarPublicId) {
    await cloudinary.uploader.destroy(profile.avatarPublicId).catch(() => {});
  }

  // Upload temp file → Cloudinary
  const { url, publicId } = await uploadToCloudinary(req.file.path, "portfolio/avatar");

  profile.avatarUrl = url;
  profile.avatarPublicId = publicId;
  await profile.save();

  res.json({ success: true, avatarUrl: profile.avatarUrl, data: profile });
};

module.exports = { getProfile, updateProfile, uploadAvatar };
