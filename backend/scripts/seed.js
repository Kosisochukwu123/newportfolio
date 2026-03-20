require("dotenv").config();
const mongoose = require("mongoose");

const Admin = require("../models/Admin.model");
const Profile = require("../models/Profile.model");
const Project = require("../models/Project.model");
const Skill = require("../models/Skill.model");

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    // ── 1. Admin account ──────────────────────────────────
    const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (existingAdmin) {
      console.log("⚠️  Admin already exists — skipping admin creation");
    } else {
      await Admin.create({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
      });
      console.log(`✅ Admin created → ${process.env.ADMIN_EMAIL}`);
    }

    // ── 2. Profile ────────────────────────────────────────
    const profileCount = await Profile.countDocuments();
    if (profileCount === 0) {
      await Profile.create({
        name: "Your Name",
        tagline: "Full Stack MERN Developer",
        heroBio:
          "I architect and build fast, scalable web applications — from MongoDB schemas and Express APIs to pixel-perfect React UIs.",
        terminalLines: [
          "MongoDB, Express.js, React.js, Node.js,",
          "REST APIs, JWT Auth, Redux, Tailwind,",
          "Docker, AWS, Git",
        ],
        availableForWork: true,
        aboutBio: [
          "I'm a Full Stack MERN Developer with a passion for building complete web experiences — from architecting MongoDB schemas and crafting Express REST APIs to designing fluid React interfaces.",
          "I care deeply about clean code, developer experience, and shipping products that are fast, accessible, and a joy to use.",
          "When I'm not coding, I'm exploring new libraries, contributing to open source, or reading about system design and engineering culture.",
        ],
        yearsExperience: "3+",
        projectsShipped: "20+",
        email: "yourname@email.com",
        location: "Your City, Country",
        timezone: "WAT / UTC+1",
        socials: [
          { label: "GitHub", url: "https://github.com/yourusername" },
          { label: "LinkedIn", url: "https://linkedin.com/in/yourusername" },
          { label: "Twitter / X", url: "https://twitter.com/yourusername" },
        ],
        metaTitle: "Your Name — MERN Developer",
        metaDescription: "Full Stack MERN Developer portfolio",
      });
      console.log("✅ Profile seeded");
    } else {
      console.log("⚠️  Profile already exists — skipping");
    }

    // ── 3. Projects ───────────────────────────────────────
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
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
          tags: ["React", "Redux", "Node.js", "MongoDB", "Stripe API", "Cloudinary"],
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
          tags: ["React", "DnD Kit", "Node.js", "MongoDB", "Express", "WebSockets"],
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
      console.log("✅ Projects seeded (3)");
    } else {
      console.log("⚠️  Projects already exist — skipping");
    }

    // ── 4. Skills ─────────────────────────────────────────
    const skillCount = await Skill.countDocuments();
    if (skillCount === 0) {
      const skills = [
        // Frontend
        { name: "React.js", group: "Frontend", order: 0 },
        { name: "Redux Toolkit", group: "Frontend", order: 1 },
        { name: "Next.js", group: "Frontend", order: 2 },
        { name: "Tailwind CSS", group: "Frontend", order: 3 },
        { name: "Framer Motion", group: "Frontend", order: 4 },
        { name: "TypeScript", group: "Frontend", order: 5 },
        // Backend
        { name: "Node.js", group: "Backend", order: 0 },
        { name: "Express.js", group: "Backend", order: 1 },
        { name: "REST APIs", group: "Backend", order: 2 },
        { name: "GraphQL", group: "Backend", order: 3 },
        { name: "Socket.io", group: "Backend", order: 4 },
        { name: "JWT / OAuth", group: "Backend", order: 5 },
        // Database
        { name: "MongoDB", group: "Database", order: 0 },
        { name: "Mongoose", group: "Database", order: 1 },
        { name: "Redis", group: "Database", order: 2 },
        { name: "PostgreSQL", group: "Database", order: 3 },
        { name: "Firebase", group: "Database", order: 4 },
        { name: "Prisma", group: "Database", order: 5 },
        // DevOps
        { name: "Git & GitHub", group: "DevOps & Tools", order: 0 },
        { name: "Docker", group: "DevOps & Tools", order: 1 },
        { name: "AWS (EC2, S3)", group: "DevOps & Tools", order: 2 },
        { name: "Nginx", group: "DevOps & Tools", order: 3 },
        { name: "CI/CD", group: "DevOps & Tools", order: 4 },
        { name: "Postman", group: "DevOps & Tools", order: 5 },
      ];
      await Skill.insertMany(skills);
      console.log(`✅ Skills seeded (${skills.length})`);
    } else {
      console.log("⚠️  Skills already exist — skipping");
    }

    console.log("\n🎉 Seed complete!\n");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
};

seed();
