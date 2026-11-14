const mongoose = require("mongoose");

const socialSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true, required: true },
    url: { type: String, trim: true, required: true },
  },
  { _id: false },
);

const milestoneSchema = new mongoose.Schema(
  {
    year: { type: String, trim: true, default: "" },
    label: { type: String, trim: true, default: "" },
  },
  { _id: false },
);

const profileSchema = new mongoose.Schema(
  {
    // COMPANY IDENTITY
    name: {
      type: String,
      trim: true,
      default: "GH Studios",
    },
    tagline: {
      type: String,
      trim: true,
      default: "",
    },

    // HOMEPAGE HERO
    heroBio: {
      type: String,
      default: "",
    },
    availableForWork: {
      type: Boolean,
      default: true,
    },

    // COMPANY ABOUT
    aboutHeadline: {
      type: String,
      default: "",
    },
    aboutDescription: {
      type: String,
      default: "",
    },
    aboutBio: {
      type: [String],
      default: [],
    },
    mission: {
      type: String,
      default: "",
    },
    vision: {
      type: String,
      default: "",
    },

    // COMPANY STATISTICS
    yearsExperience: {
      type: String,
      default: "",
    },
    projectsShipped: {
      type: String,
      default: "",
    },
    clientsServed: {
      type: String,
      default: "",
    },

    // SERVICES AND MILESTONES
    services: {
      type: [String],
      default: [],
    },
    milestones: {
      type: [milestoneSchema],
      default: [],
    },

    // BRAND IMAGE
    avatarUrl: {
      type: String,
      default: "",
    },
    avatarPublicId: {
      type: String,
      default: "",
    },

    // CONTACT
    email: {
      type: String,
      trim: true,
      default: "",
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    timezone: {
      type: String,
      trim: true,
      default: "",
    },

    // SOCIAL MEDIA
    socials: {
      type: [socialSchema],
      default: [],
    },

    // SEO AND SHARING
    metaTitle: {
      type: String,
      trim: true,
      default: "GH Studios",
    },
    metaDescription: {
      type: String,
      default: "",
    },
    ogImageUrl: {
      type: String,
      default: "",
    },

    // LEGACY FIELDS — retained to avoid breaking older code/data
    terminalLines: {
      type: [String],
      default: [],
    },
    resumeUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports =
  mongoose.models.Profile || mongoose.model("Profile", profileSchema);