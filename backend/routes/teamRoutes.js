const express = require("express");
const router = express.Router();

const {
  getPublicTeam,
  getInviteByToken,
  submitInvite,
  getAllForAdmin,
  createInvite,
  approveMember,
  rejectMember,
  deleteMember,
} = require("../controllers/teamController");

// ⚠️ Adjust these two import paths to match your actual project structure —
// they should be the same middleware your projects/auth routes already use.
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadmiddleware"); // multer instance, e.g. upload.single("photo")

// ── Public ──
router.get("/", getPublicTeam);
router.get("/invite/:token", getInviteByToken);
router.post("/invite/:token", upload.single("photo"), submitInvite);

// ── Admin (protected) ──
router.get("/admin/all", protect, getAllForAdmin);
router.post("/admin/invite", protect, createInvite);
router.put("/admin/:id/approve", protect, approveMember);
router.put("/admin/:id/reject", protect, rejectMember);
router.delete("/admin/:id", protect, deleteMember);

module.exports = router;

// In your main server file (app.js / server.js), mount this alongside
// your other routers, e.g.:
//   const teamRoutes = require("./routes/teamRoutes");
//   app.use("/api/team", teamRoutes);