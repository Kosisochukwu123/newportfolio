const BugReport = require("../models/BugReport.model");

// POST /api/bugs — public submission
exports.submitBugReport = async (req, res) => {
  try {
    const { name, email, description, pageUrl, severity } = req.body;

    if (!description?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Please describe the bug." });
    }

    const report = await BugReport.create({
      name: name?.trim() || "",
      email: email?.trim() || "",
      description: description.trim(),
      pageUrl: pageUrl || "",
      severity: ["low", "medium", "high", "critical"].includes(severity)
        ? severity
        : "medium",
    });

    res.json({ success: true, data: report });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/bugs/admin/all
exports.getAllForAdmin = async (req, res) => {
  try {
    const reports = await BugReport.find().sort({ createdAt: -1 });
    res.json({ success: true, data: reports });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/bugs/admin/:id — update status (new / reviewed / resolved)
exports.updateStatus = async (req, res) => {
  try {
    const report = await BugReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    const { status } = req.body;
    if (!["new", "reviewed", "resolved"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    report.status = status;
    await report.save();

    res.json({ success: true, data: report });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/bugs/admin/:id
exports.deleteBugReport = async (req, res) => {
  try {
    await BugReport.findByIdAndDelete(req.params.id);
    res.json({ success: true, data: null });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};