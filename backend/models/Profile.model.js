const mongoose = require("mongoose");

const socialSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const profileSchema = new mongoose.Schema(
  {
    // HERO
    name: {
      type: String,
      default: "Your Company",
    },

    tagline: {
      type: String,
      default: "Building modern digital experiences",
    },

    heroBio: {
      type: String,
      default:
        "We design and build scalable web products, platforms, and digital experiences for businesses and startups.",
    },

    terminalLines: {
      type: [String],
      default: [
        "Web Applications",
        "UI/UX Design",
        "Cloud Infrastructure",
        "MERN Stack Solutions",
      ],
    },

    availableForWork: {
      type: Boolean,
      default: true,
    },

    // ABOUT
    aboutBio: {
      type: [String],
      default: [
        "We are a digital product studio focused on creating modern, scalable solutions.",
        "Our team specializes in building high-performance applications and meaningful user experiences.",
        "We combine strategy, design, and engineering to deliver products that solve real problems.",
      ],
    },

    yearsExperience: {
      type: String,
      default: "5+",
    },

    projectsShipped: {
      type: String,
      default: "100+",
    },

    clientsServed: {
      type: String,
      default: "50+",
    },

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
      default: "contact@company.com",
    },

    location: {
      type: String,
      default: "Global",
    },

    timezone: {
      type: String,
      default: "UTC",
    },

    socials: {
      type: [socialSchema],
      default: [],
    },

    // META
    resumeUrl: {
      type: String,
      default: "",
    },

    metaTitle: {
      type: String,
      default: "Your Company",
    },

    metaDescription: {
      type: String,
      default: "Modern digital products and web solutions",
    },
  },
  {
    timestamps: true,
  },
);

module.exports =
  mongoose.models.Profile || mongoose.model("Profile", profileSchema);
