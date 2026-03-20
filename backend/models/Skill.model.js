const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Skill name is required"], trim: true },
    group: {
      type: String,
      required: true,
      enum: ["Frontend", "Backend", "Database", "DevOps & Tools"],
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Skill", skillSchema);
