const express = require("express");
const router = express.Router();
const {
  getProjects,
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addFaq,
  updateFaq,
  deleteFaq,
  reorderProjects,
} = require("../controllers/project.controller");
const { protect } = require("../middleware/authMiddleware");
const { uploadProjectImage } = require("../config/cloudinary");

// Public
router.get("/", getProjects);
router.get("/:id", getProject);

// Protected
router.get("/admin/all", protect, getAllProjects);
router.post("/", protect, uploadProjectImage.single("image"), createProject);
router.put("/:id", protect, uploadProjectImage.single("image"), updateProject);
router.delete("/:id", protect, deleteProject);
router.patch("/reorder", protect, reorderProjects);

// FAQ sub-routes
router.post("/:id/faqs", protect, addFaq);
router.put("/:id/faqs/:faqId", protect, updateFaq);
router.delete("/:id/faqs/:faqId", protect, deleteFaq);

module.exports = router;
