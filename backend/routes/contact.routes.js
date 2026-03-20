const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getMessages,
  markRead,
  deleteMessage,
} = require("../controllers/contact.controller");
const { protect } = require("../middleware/authMiddleware");

router.post("/", sendMessage);                       // public — visitor sends message
router.get("/", protect, getMessages);               // admin — read inbox
router.patch("/:id/read", protect, markRead);        // admin — mark as read
router.delete("/:id", protect, deleteMessage);       // admin — delete message

module.exports = router;
