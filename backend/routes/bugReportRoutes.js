const express = require("express");
const router = express.Router();

const {
  submitBugReport,
  getAllForAdmin,
  updateStatus,
  deleteBugReport,
} = require("../controllers/bugReportController");

const { protect } = require("../middleware/authMiddleware");

// ── Public ──
router.post("/", submitBugReport);

// ── Admin (protected) ──
router.get("/admin/all", protect, getAllForAdmin);
router.put("/admin/:id", protect, updateStatus);
router.delete("/admin/:id", protect, deleteBugReport);

module.exports = router;

// Mount in server.js:
//   const bugReportRoutes = require("./routes/bugReportRoutes");
//   app.use("/api/bugs", bugReportRoutes);