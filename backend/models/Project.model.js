const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: [true, "FAQ question is required"] },
    answer: { type: String, required: [true, "FAQ answer is required"] },
    order: { type: Number, default: 0 },
  },
  { _id: true }
);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Project title is required"], trim: true },
    subtitle: { type: String, trim: true, default: "" },
    description: { type: String, required: [true, "Description is required"] },

    imageUrl: { type: String, default: "" },
    imagePublicId: { type: String, default: "" }, // Cloudinary public_id for deletion

    tags: { type: [String], default: [] },
    liveUrl: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    year: { type: String, default: () => String(new Date().getFullYear()) },

    faqs: { type: [faqSchema], default: [] },

    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 }, // controls display order
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Sort FAQs by order before returning
projectSchema.pre(/^find/, function () {
  this.sort({ order: 1, createdAt: -1 });
});

module.exports = mongoose.model("Project", projectSchema);
