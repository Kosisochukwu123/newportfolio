const Admin = require("../models/Admin.model");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/generateToken");

// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email }).select("+password");

  if (!admin) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({
    success: true,
    token: generateToken(admin._id),
    admin: { id: admin._id, email: admin.email },
  });
};

// CHANGE PASSWORD
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const admin = await Admin.findById(req.admin._id).select("+password");

  const isMatch = await bcrypt.compare(currentPassword, admin.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Wrong current password" });
  }

  admin.password = newPassword;
  await admin.save();

  res.json({ message: "Password updated" });
};

// ME
const getMe = async (req, res) => {
  res.json({
    admin: req.admin,
  });
};

module.exports = {
  login,
  changePassword,
  getMe,
};
