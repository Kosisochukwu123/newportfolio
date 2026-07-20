const crypto = require("crypto");
const TeamMember = require("../models/TeamMember");
const fs = require("fs");
const path = require("path");
const { uploadToCloudinary } = require("../config/cloudinary");

// ── PUBLIC ──────────────────────────────────────────────

// GET /api/team — approved members only, for the public Team page
exports.getPublicTeam = async (req, res) => {
  try {
    const members = await TeamMember.find({ status: "approved" })
      .sort({ order: 1, approvedAt: 1 })
      .select("name role bio photoUrl socials");

    res.json({ success: true, data: members });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/team/invite/:token — validate an invite link before showing the form
exports.getInviteByToken = async (req, res) => {
  try {
    const invite = await TeamMember.findOne({ inviteToken: req.params.token });

    if (!invite) {
      return res
        .status(404)
        .json({ success: false, message: "This invite link isn't valid." });
    }

    if (invite.status !== "invited") {
      return res.status(409).json({
        success: false,
        message:
          invite.status === "submitted"
            ? "This invite has already been submitted and is awaiting review."
            : "This invite has already been used.",
      });
    }

    res.json({ success: true, data: { token: invite.inviteToken } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/team/invite/:token — friend submits the form (multipart/form-data)

exports.submitInvite = async (req, res) => {
  try {
    const invite = await TeamMember.findOne({
      inviteToken: req.params.token,
    });

    if (!invite) {
      return res.status(404).json({
        success: false,
        message: "This invite link isn't valid.",
      });
    }

    if (invite.status !== "invited") {
      return res.status(409).json({
        success: false,
        message: "This invite has already been used.",
      });
    }

    const { name, role, bio } = req.body;

    let socials = [];

    try {
      socials = JSON.parse(req.body.socials || "[]");
    } catch {
      socials = [];
    }

    if (!name?.trim() || !role?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name and role are required.",
      });
    }

    // Build photo URL
    let photoUrl = "";

    if (req.file) {
      const uploaded = await uploadToCloudinary(
        req.file.path,
        "portfolio/team",
      );

      photoUrl = uploaded.secure_url;

      console.log("Cloudinary URL:", photoUrl);
    }
    // Debug upload
    if (req.file) {

      const expectedPath = path.join(
        __dirname,
        "..",
        "uploads",
        req.file.filename,
      );

      console.log("Expected path:", expectedPath);
      console.log("Exists at expected path:", fs.existsSync(expectedPath));
    } else {
      console.log("❌ req.file is undefined");
    }

    invite.name = name.trim();
    invite.role = role.trim();
    invite.bio = bio?.trim() || "";
    invite.photoUrl = photoUrl;
    invite.socials = socials;
    invite.status = "submitted";
    invite.submittedAt = new Date();

    await invite.save();

    console.log("Saved photoUrl:", invite.photoUrl);

    return res.json({
      success: true,
      data: invite,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ── ADMIN (protected) ───────────────────────────────────

// GET /api/team/admin/all — everything, every status
exports.getAllForAdmin = async (req, res) => {
  try {
    const members = await TeamMember.find().sort({ createdAt: -1 });
    res.json({ success: true, data: members });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/team/admin/invite — generate a new invite link
exports.createInvite = async (req, res) => {
  try {
    const inviteToken = crypto.randomBytes(20).toString("hex");

    const invite = await TeamMember.create({ inviteToken });

    res.json({ success: true, data: invite });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/team/admin/:id — admin edits name/role/bio, optionally replaces
// the photo. This is separate from approve/reject: those only ever change
// `status`, while this is a general content edit for minor corrections
// after a member has submitted (or after they've gone live).
exports.updateMemberByAdmin = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    const { name, role, bio } = req.body;

    // Only touch fields that were actually sent, so a partial edit
    // (e.g. just fixing a typo in the role) can't accidentally blank
    // out the other fields.
    if (name !== undefined) member.name = name.trim();
    if (role !== undefined) member.role = role.trim();
    if (bio !== undefined) member.bio = bio.trim();

    if (req.file) {
      const uploaded = await uploadToCloudinary(
        req.file.path,
        "portfolio/team",
      );

      member.photoUrl = uploaded.secure_url;
    }

    await member.save();

    res.json({ success: true, data: member });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/team/admin/:id/approve
exports.approveMember = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    if (member.status !== "submitted") {
      return res.status(400).json({
        success: false,
        message: "Only submitted invites can be approved.",
      });
    }

    member.status = "approved";
    member.reviewedAt = new Date();
    await member.save();

    res.json({ success: true, data: member });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/team/admin/:id/reject
exports.rejectMember = async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.id);

    if (!member) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    member.status = "rejected";
    member.reviewedAt = new Date();
    await member.save();

    res.json({ success: true, data: member });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/team/admin/:id — revoke an unused invite, or remove a member entirely
exports.deleteMember = async (req, res) => {
  try {
    await TeamMember.findByIdAndDelete(req.params.id);
    res.json({ success: true, data: null });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};