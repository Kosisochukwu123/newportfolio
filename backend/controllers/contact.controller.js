const Message = require("../models/Message.model");

// POST /api/contact  (public — visitor sends message)
const sendMessage = async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    res.status(400);
    throw new Error("Name, email, and message are required");
  }

  const saved = await Message.create({ name, email, subject, message });
  res.status(201).json({ success: true, message: "Message sent successfully!", data: saved });
};

// GET /api/contact  (protected — admin reads inbox)
const getMessages = async (req, res) => {
  const { unread } = req.query;
  const filter = unread === "true" ? { read: false } : {};
  const messages = await Message.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: messages.length, data: messages });
};

// PATCH /api/contact/:id/read  (protected)
const markRead = async (req, res) => {
  const msg = await Message.findByIdAndUpdate(
    req.params.id,
    { read: true },
    { new: true }
  );
  if (!msg) {
    res.status(404);
    throw new Error("Message not found");
  }
  res.json({ success: true, data: msg });
};

// DELETE /api/contact/:id  (protected)
const deleteMessage = async (req, res) => {
  const msg = await Message.findByIdAndDelete(req.params.id);
  if (!msg) {
    res.status(404);
    throw new Error("Message not found");
  }
  res.json({ success: true, message: "Message deleted" });
};

module.exports = { sendMessage, getMessages, markRead, deleteMessage };
