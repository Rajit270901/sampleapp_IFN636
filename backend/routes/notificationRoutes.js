const express = require("express"); // importing express for router https://www.w3schools.com/nodejs/nodejs_express.asp
const {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  deleteNotification,
} = require("../controllers/notificationController"); // importing notification controller functions
const { protect } = require("../middleware/authMiddleware"); // protect makes sure only logged in users can access these routes

const router = express.Router(); // creates express router https://www.w3schools.com/nodejs/nodejs_express.asp

router.get("/", protect, getMyNotifications); // gets all notifications for current user
router.get("/unread-count", protect, getUnreadCount); // gets unread notification count
router.patch("/:id/read", protect, markAsRead); // marks selected notification as read
router.delete("/:id", protect, deleteNotification); // deletes selected notification

module.exports = router; // exporting router so app can use notification routes https://www.w3schools.com/nodejs/nodejs_modules.asp