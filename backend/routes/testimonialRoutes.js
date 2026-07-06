const express = require("express");
const router = express.Router();

const {
  getPublicTestimonials,
  getAllForAdmin,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require("../controllers/testimonialcontroller");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// ── Public ──
router.get("/", getPublicTestimonials);

// ── Admin (protected) ──
router.get("/admin/all", protect, getAllForAdmin);
router.post("/admin", protect, upload.single("photo"), createTestimonial);
router.put("/admin/:id", protect, upload.single("photo"), updateTestimonial);
router.delete("/admin/:id", protect, deleteTestimonial);

module.exports = router;

// Mount in server.js alongside your other routers:
//   const testimonialRoutes = require("./routes/testimonialRoutes");
//   app.use("/api/testimonials", testimonialRoutes);