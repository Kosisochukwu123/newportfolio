const mongoose = require("mongoose");

const bugReportSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" }, // optional — reporter may stay anonymous
    email: { type: String, default: "" }, // optional — for follow-up
    description: { type: String, required: true },
    pageUrl: { type: String, default: "" }, // auto-captured from window.location
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["new", "reviewed", "resolved"],
      default: "new",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BugReport", bugReportSchema);