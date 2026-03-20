const Project = require("../models/Project.model");
const { cloudinary } = require("../config/cloudinary");

// ── GET /api/projects  (public) ──────────────────────────
const getProjects = async (req, res) => {
  const filter = { published: true };
  if (req.query.featured === "true") filter.featured = true;

  const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 });
  res.json({ success: true, count: projects.length, data: projects });
};

// ── GET /api/projects/all  (protected — includes unpublished) ──
const getAllProjects = async (req, res) => {
  const projects = await Project.find({}).sort({ order: 1, createdAt: -1 });
  res.json({ success: true, count: projects.length, data: projects });
};

// ── GET /api/projects/:id  (public) ─────────────────────
const getProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }
  res.json({ success: true, data: project });
};

// ── POST /api/projects  (protected) ─────────────────────
const createProject = async (req, res) => {
  const { title, subtitle, description, tags, liveUrl, githubUrl, year, faqs, featured, order, published } = req.body;

  const project = await Project.create({
    title,
    subtitle,
    description,
    tags: typeof tags === "string" ? JSON.parse(tags) : tags || [],
    liveUrl,
    githubUrl,
    year,
    faqs: typeof faqs === "string" ? JSON.parse(faqs) : faqs || [],
    featured,
    order,
    published,
    imageUrl: req.file?.path || "",
    imagePublicId: req.file?.filename || "",
  });

  res.status(201).json({ success: true, data: project });
};

// ── PUT /api/projects/:id  (protected) ──────────────────
const updateProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  // If a new image was uploaded, delete the old one from Cloudinary
  if (req.file && project.imagePublicId) {
    await cloudinary.uploader.destroy(project.imagePublicId).catch(() => {});
  }

  const fields = ["title", "subtitle", "description", "liveUrl", "githubUrl", "year", "featured", "order", "published"];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) project[f] = req.body[f];
  });

  if (req.body.tags !== undefined) {
    project.tags = typeof req.body.tags === "string" ? JSON.parse(req.body.tags) : req.body.tags;
  }
  if (req.body.faqs !== undefined) {
    project.faqs = typeof req.body.faqs === "string" ? JSON.parse(req.body.faqs) : req.body.faqs;
  }
  if (req.file) {
    project.imageUrl = req.file.path;
    project.imagePublicId = req.file.filename;
  }

  const updated = await project.save();
  res.json({ success: true, data: updated });
};

// ── DELETE /api/projects/:id  (protected) ───────────────
const deleteProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  if (project.imagePublicId) {
    await cloudinary.uploader.destroy(project.imagePublicId).catch(() => {});
  }

  await project.deleteOne();
  res.json({ success: true, message: "Project deleted" });
};

// ── FAQ helpers ─────────────────────────────────────────

// POST /api/projects/:id/faqs
const addFaq = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  const { question, answer, order } = req.body;
  project.faqs.push({ question, answer, order: order ?? project.faqs.length });
  await project.save();

  res.status(201).json({ success: true, data: project.faqs });
};

// PUT /api/projects/:id/faqs/:faqId
const updateFaq = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  const faq = project.faqs.id(req.params.faqId);
  if (!faq) {
    res.status(404);
    throw new Error("FAQ not found");
  }

  if (req.body.question !== undefined) faq.question = req.body.question;
  if (req.body.answer !== undefined) faq.answer = req.body.answer;
  if (req.body.order !== undefined) faq.order = req.body.order;

  await project.save();
  res.json({ success: true, data: project.faqs });
};

// DELETE /api/projects/:id/faqs/:faqId
const deleteFaq = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  project.faqs = project.faqs.filter(
    (f) => f._id.toString() !== req.params.faqId
  );
  await project.save();

  res.json({ success: true, data: project.faqs });
};

// PATCH /api/projects/reorder  (protected)
const reorderProjects = async (req, res) => {
  // body: { order: [{ id, order }, ...] }
  const { order } = req.body;
  await Promise.all(
    order.map(({ id, order: o }) => Project.findByIdAndUpdate(id, { order: o }))
  );
  res.json({ success: true, message: "Order updated" });
};

module.exports = {
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
};
