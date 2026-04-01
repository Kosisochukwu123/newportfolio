const Project = require("../models/Project.model");
const { cloudinary, uploadToCloudinary } = require("../config/cloudinary");

// ── GET /api/projects  (public) ──────────────────────────
const getProjects = async (req, res) => {
  const filter = { published: true };
  if (req.query.featured === "true") filter.featured = true;
  const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 });
  res.json({ success: true, count: projects.length, data: projects });
};

// ── GET /api/projects/admin/all  (protected) ────────────
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

  let imageUrl = "";
  let imagePublicId = "";

  if (req.file) {
    const result = await uploadToCloudinary(req.file.path, "portfolio/projects");
    imageUrl = result.url;
    imagePublicId = result.publicId;
  }

  const project = await Project.create({
    title, subtitle, description,
    tags: typeof tags === "string" ? JSON.parse(tags) : tags || [],
    liveUrl, githubUrl, year,
    faqs: typeof faqs === "string" ? JSON.parse(faqs) : faqs || [],
    featured, order, published,
    imageUrl,
    imagePublicId,
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

  // New image uploaded — delete old one from Cloudinary
  if (req.file) {
    if (project.imagePublicId) {
      await cloudinary.uploader.destroy(project.imagePublicId).catch(() => {});
    }
    const result = await uploadToCloudinary(req.file.path, "portfolio/projects");
    project.imageUrl = result.url;
    project.imagePublicId = result.publicId;
  }

  const fields = ["title", "subtitle", "description", "liveUrl", "githubUrl", "year", "featured", "order", "published"];
  fields.forEach((f) => { if (req.body[f] !== undefined) project[f] = req.body[f]; });

  if (req.body.tags !== undefined)
    project.tags = typeof req.body.tags === "string" ? JSON.parse(req.body.tags) : req.body.tags;

  if (req.body.faqs !== undefined)
    project.faqs = typeof req.body.faqs === "string" ? JSON.parse(req.body.faqs) : req.body.faqs;

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

// ── FAQ helpers ──────────────────────────────────────────

const addFaq = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) { res.status(404); throw new Error("Project not found"); }
  const { question, answer, order } = req.body;
  project.faqs.push({ question, answer, order: order ?? project.faqs.length });
  await project.save();
  res.status(201).json({ success: true, data: project.faqs });
};

const updateFaq = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) { res.status(404); throw new Error("Project not found"); }
  const faq = project.faqs.id(req.params.faqId);
  if (!faq) { res.status(404); throw new Error("FAQ not found"); }
  if (req.body.question !== undefined) faq.question = req.body.question;
  if (req.body.answer !== undefined) faq.answer = req.body.answer;
  if (req.body.order !== undefined) faq.order = req.body.order;
  await project.save();
  res.json({ success: true, data: project.faqs });
};

const deleteFaq = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) { res.status(404); throw new Error("Project not found"); }
  project.faqs = project.faqs.filter((f) => f._id.toString() !== req.params.faqId);
  await project.save();
  res.json({ success: true, data: project.faqs });
};

const reorderProjects = async (req, res) => {
  const { order } = req.body;
  await Promise.all(order.map(({ id, order: o }) => Project.findByIdAndUpdate(id, { order: o })));
  res.json({ success: true, message: "Order updated" });
};

module.exports = {
  getProjects, getAllProjects, getProject,
  createProject, updateProject, deleteProject,
  addFaq, updateFaq, deleteFaq, reorderProjects,
};
