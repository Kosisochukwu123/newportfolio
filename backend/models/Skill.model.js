const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Skill name is required"],
      trim: true,
    },

    group: {
      type: String,
      required: true,
      enum: [
        "Development",
        "Design",
        "Infrastructure",
        "Business Solutions",
      ],
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Skill ||
  mongoose.model("Skill", skillSchema);