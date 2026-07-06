const Testimonial = require("../models/Testimonial.model");

// GET /api/testimonials — published only, for the public site
exports.getPublicTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ published: true })
      .sort({ order: 1, createdAt: 1 })
      .select("name role quote photoUrl");

    res.json({ success: true, data: testimonials });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/testimonials/admin/all
exports.getAllForAdmin = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json({ success: true, data: testimonials });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/testimonials/admin (multipart/form-data, field "photo")
exports.createTestimonial = async (req, res) => {
  try {
    const { name, role, quote, published, order } = req.body;

    if (!name?.trim() || !quote?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Name and quote are required." });
    }

    // NOTE: adjust to match your existing upload URL convention
    // (mirrors uploadMiddleware.js used by the Team invite flow).
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const testimonial = await Testimonial.create({
      name: name.trim(),
      role: role?.trim() || "",
      quote: quote.trim(),
      photoUrl,
      published: published === "false" ? false : true,
      order: Number(order) || 0,
    });

    res.json({ success: true, data: testimonial });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/testimonials/admin/:id
exports.updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    const { name, role, quote, published, order } = req.body;

    if (name !== undefined) testimonial.name = name.trim();
    if (role !== undefined) testimonial.role = role.trim();
    if (quote !== undefined) testimonial.quote = quote.trim();
    if (published !== undefined) testimonial.published = published === "true" || published === true;
    if (order !== undefined) testimonial.order = Number(order) || 0;
    if (req.file) testimonial.photoUrl = `/uploads/${req.file.filename}`;

    await testimonial.save();
    res.json({ success: true, data: testimonial });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/testimonials/admin/:id
exports.deleteTestimonial = async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ success: true, data: null });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};