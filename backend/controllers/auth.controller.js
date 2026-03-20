const Admin = require("../models/Admin.model");
const { generateToken } = require("../utils/generateToken");

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const admin = await Admin.findOne({ email }).select("+password");

  if (!admin || !(await admin.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json({
    success: true,
    token: generateToken(admin._id),
    admin: { id: admin._id, email: admin.email },
  });
};

// POST /api/auth/change-password  (protected)
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error("Both currentPassword and newPassword are required");
  }

  if (newPassword.length < 8) {
    res.status(422);
    throw new Error("New password must be at least 8 characters");
  }

  const admin = await Admin.findById(req.admin._id).select("+password");

  if (!(await admin.comparePassword(currentPassword))) {
    res.status(401);
    throw new Error("Current password is incorrect");
  }

  admin.password = newPassword;
  await admin.save();

  res.json({ success: true, message: "Password updated successfully" });
};

// GET /api/auth/me  (protected)
const getMe = async (req, res) => {
  res.json({
    success: true,
    admin: { id: req.admin._id, email: req.admin.email },
  });
};

module.exports = { login, changePassword, getMe };
