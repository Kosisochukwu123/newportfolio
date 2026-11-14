const Profile = require("../models/Profile.model");
const { cloudinary, uploadToCloudinary } = require("../config/cloudinary");

const getOrCreateProfile = async () => {
  let profile = await Profile.findOne();

  if (!profile) {
    profile = await Profile.create({});
  }

  return profile;
};

// GET /api/profile — public
const getProfile = async (req, res) => {
  const profile = await getOrCreateProfile();

  res.json({
    success: true,
    data: profile,
  });
};

// PUT /api/profile — protected
const updateProfile = async (req, res) => {
  const allowedFields = [
    // Company identity
    "name",
    "tagline",

    // Hero
    "heroBio",
    "availableForWork",

    // About
    "aboutHeadline",
    "aboutDescription",
    "aboutBio",
    "mission",
    "vision",

    // Statistics
    "yearsExperience",
    "projectsShipped",
    "clientsServed",

    // Services and milestones
    "services",
    "milestones",

    // Contact
    "email",
    "phone",
    "location",
    "timezone",

    // Socials
    "socials",

    // SEO
    "metaTitle",
    "metaDescription",
    "ogImageUrl",

    // Legacy compatibility
    "terminalLines",
    "resumeUrl",
  ];

  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const profile = await Profile.findOneAndUpdate(
    {},
    { $set: updates },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  );

  res.json({
    success: true,
    data: profile,
  });
};

// POST /api/profile/avatar — protected
const uploadAvatar = async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No image file provided");
  }

  const profile = await getOrCreateProfile();

  // Upload the replacement before deleting the previous image.
  const { url, publicId } = await uploadToCloudinary(
    req.file.path,
    "gh-studios/brand",
  );

  const previousPublicId = profile.avatarPublicId;

  profile.avatarUrl = url;
  profile.avatarPublicId = publicId;

  await profile.save();

  // Delete the old image only after the new one has been saved.
  if (previousPublicId) {
    await cloudinary.uploader.destroy(previousPublicId).catch(() => {});
  }

  res.json({
    success: true,
    avatarUrl: profile.avatarUrl,
    data: profile,
  });
};

module.exports = {
  getProfile,
  updateProfile,
  uploadAvatar,
};