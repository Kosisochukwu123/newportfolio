require("dotenv").config();
require("express-async-errors");

const express = require("express");
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

// ── App setup ───────────────────────────────────────────
const app = express();

connectDB();

const allowedOrigins = [
  "http://localhost:5175", 
  "https://newportfolio-231g.onrender.com",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

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
  max: 10,
  message: { success: false, message: "Too many auth attempts, try again later." },
});

app.use(limiter);
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
  console.log(`\n🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`   http://localhost:${PORT}/api/health\n`);
});
