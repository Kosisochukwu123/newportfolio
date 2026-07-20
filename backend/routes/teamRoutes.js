const express = require("express");
const router = express.Router();

const {
  getPublicTeam,
  getInviteByToken,
  submitInvite,
  getAllForAdmin,
  createInvite,
  updateMemberByAdmin,
  approveMember,
  rejectMember,
  deleteMember,
} = require("../controllers/teamController");

// ⚠️ Adjust these two import paths to match your actual project structure —
// they should be the same middleware your projects/auth routes already use.
const { protect } = require("../middleware/authMiddleware");
// const upload = require("../middleware/uploadMiddleware"); 
const { upload } = require("../config/cloudinary");

// ── Public ──
router.get("/", getPublicTeam);
router.get("/invite/:token", getInviteByToken);
// router.post("/invite/:token", upload.single("photo"), submitInvite);
router.post(
  "/invite/:token",
  upload.single("photo"),
  submitInvite
);

// ── Admin (protected) ──
router.get("/admin/all", protect, getAllForAdmin);
router.post("/admin/invite", protect, createInvite);
router.put("/admin/:id/approve", protect, approveMember);
router.put("/admin/:id/reject", protect, rejectMember);
// General content edit (name/role/bio/photo) — distinct from the
// approve/reject status-only routes above.
router.put(
  "/admin/:id",
  protect,
  upload.single("photo"),
  updateMemberByAdmin
);
router.delete("/admin/:id", protect, deleteMember);

// console.log(__dirname);

module.exports = router;

// In your main server file (app.js / server.js), mount this alongside
// your other routers, e.g.:
//   const teamRoutes = require("./routes/teamRoutes");
//   app.use("/api/team", teamRoutes);