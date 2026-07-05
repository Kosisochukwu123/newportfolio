const mongoose = require("mongoose");

const socialSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

const teamMemberSchema = new mongoose.Schema(
  {
    // Unique token embedded in the invite link, e.g. /join/:inviteToken
    inviteToken: { type: String, required: true, unique: true, index: true },

    // invited   -> link generated, friend hasn't submitted yet
    // submitted -> friend filled the form, awaiting admin review
    // approved  -> visible on the public Team page
    // rejected  -> reviewed and declined, hidden everywhere
    status: {
      type: String,
      enum: ["invited", "submitted", "approved", "rejected"],
      default: "invited",
    },

    name: { type: String, default: "" },
    role: { type: String, default: "" },
    bio: { type: String, default: "" },
    photoUrl: { type: String, default: "" },
    socials: { type: [socialSchema], default: [] },

    // Controls display order on the public Team page
    order: { type: Number, default: 0 },

    invitedAt: { type: Date, default: Date.now },
    submittedAt: { type: Date },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TeamMember", teamMemberSchema);