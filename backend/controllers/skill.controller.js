const Skill = require("../models/Skill.model");

// GET /api/skills  (public)
const getSkills = async (req, res) => {
  const skills = await Skill.find({}).sort({ group: 1, order: 1 });

  // Group them for the frontend
  const grouped = skills.reduce((acc, skill) => {
    if (!acc[skill.group]) acc[skill.group] = [];
    acc[skill.group].push(skill);
    return acc;
  }, {});

  res.json({ success: true, data: skills, grouped });
};

// POST /api/skills  (protected)
const createSkill = async (req, res) => {
  const { name, group, order } = req.body;
  const skill = await Skill.create({ name, group, order });
  res.status(201).json({ success: true, data: skill });
};

// PUT /api/skills/:id  (protected)
const updateSkill = async (req, res) => {
  const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!skill) {
    res.status(404);
    throw new Error("Skill not found");
  }
  res.json({ success: true, data: skill });
};

// DELETE /api/skills/:id  (protected)
const deleteSkill = async (req, res) => {
  const skill = await Skill.findByIdAndDelete(req.params.id);
  if (!skill) {
    res.status(404);
    throw new Error("Skill not found");
  }
  res.json({ success: true, message: "Skill deleted" });
};

// POST /api/skills/bulk  (protected) — seed or bulk replace
const bulkUpsertSkills = async (req, res) => {
  const { skills } = req.body; // [{ name, group, order }]
  await Skill.deleteMany({});
  const created = await Skill.insertMany(skills);
  res.status(201).json({ success: true, count: created.length, data: created });
};

module.exports = { getSkills, createSkill, updateSkill, deleteSkill, bulkUpsertSkills };
