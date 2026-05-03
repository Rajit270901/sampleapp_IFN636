// routes/notificationRoutes.js
const express = require("express");
const {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  deleteNotification,
} = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getMyNotifications);
router.get("/unread-count", protect, getUnreadCount);
router.patch("/:id/read", protect, markAsRead);
router.delete("/:id", protect, deleteNotification);

module.exports = router;