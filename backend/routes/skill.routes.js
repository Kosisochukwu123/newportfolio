const express = require("express");
const router = express.Router();
const {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  bulkUpsertSkills,
} = require("../controllers/skill.controller");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getSkills);
router.post("/", protect, createSkill);
router.post("/bulk", protect, bulkUpsertSkills);
router.put("/:id", protect, updateSkill);
router.delete("/:id", protect, deleteSkill);

module.exports = router;
