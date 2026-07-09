require("dotenv").config();
require("express-async-errors");

const express = require("express");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

// ── Routes ──────────────────────────────────────────────
const authRoutes = require("./routes/auth.routes");
const profileRoutes = require("./routes/profile.routes");
const projectRoutes = require("./routes/project.routes");
const skillRoutes = require("./routes/skill.routes");
const contactRoutes = require("./routes/contact.routes");
const uploadRoutes = require("./routes/upload.routes");
const chatRoutes = require("./routes/chat.routes");
const teamRoutes = require("./routes/teamRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");

// ── App setup ───────────────────────────────────────────
const app = express();

connectDB();

const allowedOrigins = [
  "http://localhost:5175",
  "http://localhost:5173",
  "https://newportfolio-231g.onrender.com",
  "https://newportfolio-sand-five.vercel.app",
  "https://ghstudios.online",
  "https://www.ghstudios.online",


  // ADD BOTH VERCEL POSSIBILITIES
  "https://gh-studios.vercel.app",
  "https://ghstudios.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ Blocked CORS origin:", origin);

      return callback(null, false); // IMPORTANT: do NOT throw error
    },
    credentials: true,
  }),
);

app.options("*", cors());

// ── Rate limiting ───────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, try again later." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100000,
  message: {
    success: false,
    message: "Too many auth attempts, try again later.",
  },
});

// app.use(limiter);
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── API Routes ──────────────────────────────────────────
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/testimonials", testimonialRoutes);


const fs = require("fs");

app.use("/uploads", (req, res, next) => {
  const filePath = path.join(__dirname, "uploads", path.basename(req.path));

  console.log("Looking for:", filePath);
  console.log("Exists:", fs.existsSync(filePath));

  next();
});


// Serve uploaded images (team photos, testimonial photos, etc.)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Health check ────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Portfolio API is running 🚀" });
});

// ── Error handlers ──────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start ────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `\n🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`,
  );
  console.log(`   http://localhost:${PORT}/api/health\n`);
});