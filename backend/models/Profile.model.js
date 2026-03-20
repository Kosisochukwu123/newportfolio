const mongoose = require("mongoose");

const socialSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

const profileSchema = new mongoose.Schema(
  {
    // ── Hero ──────────────────────────────────────────────
    name: { type: String, default: "Your Name" },
    tagline: { type: String, default: "Full Stack MERN Developer" },
    heroBio: {
      type: String,
      default:
        "I architect and build fast, scalable web applications from database schemas to pixel-perfect UIs.",
    },
    terminalLines: {
      type: [String],
      default: ["MongoDB, Express.js, React.js, Node.js", "REST APIs, JWT Auth, Redux, Tailwind"],
    },
    availableForWork: { type: Boolean, default: true },

    // ── About ─────────────────────────────────────────────
    aboutBio: {
      type: [String], // array of paragraphs
      default: [
        "I'm a Full Stack MERN Developer with a passion for building complete web experiences.",
        "I care deeply about clean code, developer experience, and shipping products that are fast, accessible, and a joy to use.",
      ],
    },
    yearsExperience: { type: String, default: "3+" },
    projectsShipped: { type: String, default: "20+" },
    avatarUrl: { type: String, default: "" },
    avatarPublicId: { type: String, default: "" },

    // ── Contact ───────────────────────────────────────────
    email: { type: String, default: "yourname@email.com" },
    location: { type: String, default: "Your City, Country" },
    timezone: { type: String, default: "WAT / UTC+1" },
    socials: { type: [socialSchema], default: [] },

    // ── Meta ──────────────────────────────────────────────
    resumeUrl: { type: String, default: "" },
    metaTitle: { type: String, default: "Your Name — MERN Developer" },
    metaDescription: { type: String, default: "Full Stack MERN Developer portfolio" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
