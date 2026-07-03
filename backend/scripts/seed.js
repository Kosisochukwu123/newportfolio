require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Admin = require("../models/Admin.model");
const Profile = require("../models/Profile.model");
const Project = require("../models/Project.model");
const Skill = require("../models/Skill.model");

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    // ── 1. Admin account ──────────────────────────────────

    // Remove all existing admins
    await Admin.deleteMany({});
    console.log("🗑️ Existing admins removed");

    // Create new admin
    await Admin.create({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    });

    console.log(`✅ Admin created → ${process.env.ADMIN_EMAIL}`);

    // ── 2. Profile ────────────────────────────────────────

    // Remove old profile first
    await Profile.deleteMany({});
    console.log("🗑️ Existing profile removed");

    await Profile.create({
      name: "ByteCraft Studios",
      tagline: "Building Digital Products That Scale",
      heroBio:
        "We design and develop high-performance web applications, business platforms, and digital experiences for modern companies.",

      terminalLines: [
        "Web Applications",
        "UI/UX Design",
        "MERN Development",
        "Cloud Infrastructure",
      ],

      availableForWork: true,

      aboutBio: [
        "ByteCraft Studios is a software company focused on building modern digital solutions for startups and businesses.",

        "Our team specializes in scalable architectures, clean interfaces, and delivering products users love.",

        "From MVPs to enterprise systems, we turn ideas into reality.",
      ],

      yearsExperience: "5+",
      projectsShipped: "100+",

      email: "contact@bytecraft.com",
      location: "Zurich, Switzerland",
      timezone: "UTC+1",

      socials: [
        {
          label: "GitHub",
          url: "https://github.com/bytecraft",
        },
        {
          label: "LinkedIn",
          url: "https://linkedin.com/company/bytecraft",
        },
      ],

      metaTitle: "ByteCraft Studios",
      metaDescription: "Software company portfolio",
    });

    console.log("✅ Profile seeded");

    // ── 3. Projects ───────────────────────────────────────
    await Project.deleteMany({});
    console.log("🗑️ Existing projects removed");

    await Project.insertMany([
      {
        title: "DevConnect",
        subtitle: "Social Platform for Developers",
        description:
          "A full-featured social network built for developers — create profiles, share posts, follow other devs, and connect in real time.",
        tags: ["React", "Node.js", "MongoDB", "Express", "Socket.io", "JWT"],
        liveUrl: "https://your-live-link.com",
        githubUrl: "https://github.com/yourusername/devconnect",
        year: "2024",
        order: 1,
        featured: true,
        faqs: [
          {
            question: "What authentication system does this use?",
            answer:
              "JWT-based authentication with refresh token rotation. Passwords are hashed with bcrypt (12 rounds). Tokens are stored in httpOnly cookies to prevent XSS attacks.",
            order: 0,
          },
          {
            question: "How is real-time messaging implemented?",
            answer:
              "Socket.io handles bidirectional communication. Each user joins a personal room on connection, enabling direct messages and live notification delivery without polling.",
            order: 1,
          },
          {
            question: "What's the database structure?",
            answer:
              "MongoDB with Mongoose. Users, Posts, and Connections are separate collections. I used aggregation pipelines for the feed algorithm to prioritise posts from followed users.",
            order: 2,
          },
          {
            question: "How is the app deployed?",
            answer:
              "Frontend on Vercel with automatic CI/CD from GitHub. Backend on an AWS EC2 instance behind an Nginx reverse proxy with SSL via Let's Encrypt. Images stored in S3.",
            order: 3,
          },
        ],
      },
      {
        title: "ShopStack",
        subtitle: "E-Commerce Platform",
        description:
          "A production-ready e-commerce solution with product management, cart/checkout, Stripe payments, and an admin dashboard.",
        tags: [
          "React",
          "Redux",
          "Node.js",
          "MongoDB",
          "Stripe API",
          "Cloudinary",
        ],
        liveUrl: "https://your-live-link.com",
        githubUrl: "https://github.com/yourusername/shopstack",
        year: "2024",
        order: 2,
        featured: true,
        faqs: [
          {
            question: "How are payments processed?",
            answer:
              "Stripe Checkout handles all payment flows. Payment intents are created server-side to keep the secret key secure. Webhooks verify payment completion before fulfilling orders.",
            order: 0,
          },
          {
            question: "Where are product images stored?",
            answer:
              "Images are uploaded to Cloudinary via a Node.js middleware that handles compression and format optimisation. Only the returned CDN URL is stored in MongoDB.",
            order: 1,
          },
        ],
      },
      {
        title: "TaskFlow",
        subtitle: "Project Management Tool",
        description:
          "A Trello-inspired project management app with drag-and-drop boards, team collaboration, deadline tracking, and role-based permissions.",
        tags: [
          "React",
          "DnD Kit",
          "Node.js",
          "MongoDB",
          "Express",
          "WebSockets",
        ],
        liveUrl: "https://your-live-link.com",
        githubUrl: "https://github.com/yourusername/taskflow",
        year: "2023",
        order: 3,
        featured: false,
        faqs: [
          {
            question: "How does drag-and-drop work?",
            answer:
              "@dnd-kit/core powers the drag-and-drop. Card positions are stored as fractional indices in MongoDB, allowing re-ordering without shifting the entire array.",
            order: 0,
          },
        ],
      },
    ]);

    // ── 4. Skills ─────────────────────────────────────────
    await Skill.deleteMany({});
    console.log("🗑️ Existing skills removed");

    const skills = [
      // Web Development
      { name: "Custom Web Applications", group: "Development", order: 0 },
      { name: "MERN Stack Development", group: "Development", order: 1 },
      { name: "API Development", group: "Development", order: 2 },
      { name: "Admin Dashboards", group: "Development", order: 3 },
      { name: "E-Commerce Solutions", group: "Development", order: 4 },

      // Design
      { name: "UI/UX Design", group: "Design", order: 0 },
      { name: "Responsive Design", group: "Design", order: 1 },
      { name: "Wireframing", group: "Design", order: 2 },
      { name: "Brand Identity", group: "Design", order: 3 },

      // Infrastructure
      { name: "Cloud Deployment", group: "Infrastructure", order: 0 },
      { name: "Database Architecture", group: "Infrastructure", order: 1 },
      { name: "Authentication Systems", group: "Infrastructure", order: 2 },
      { name: "CI/CD Pipelines", group: "Infrastructure", order: 3 },

      // Business Services
      {
        name: "Startup MVP Development",
        group: "Business Solutions",
        order: 0,
      },
      { name: "Booking Platforms", group: "Business Solutions", order: 1 },
      { name: "Payment Integration", group: "Business Solutions", order: 2 },
      { name: "Maintenance & Support", group: "Business Solutions", order: 3 },
    ];

    await Skill.insertMany(skills);

    console.log(`✅ Skills seeded (${skills.length})`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
};

seed();
