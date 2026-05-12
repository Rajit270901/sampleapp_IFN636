const Notification = require("../models/Notification"); // importing notification model https://www.w3schools.com/nodejs/nodejs_modules.asp

// gets notifications for the logged in user
const getMyNotifications = async (req, res) => { // async because database query takes time https://www.w3schools.com/js/js_async.asp
  try { // catches errors if database request fails https://www.w3schools.com/js/js_errors.asp
    const notifications = await Notification.find({ recipient: req.user.id })
      .populate("appointment", "status")
      .sort({ createdAt: -1 });

    res.status(200).json(notifications); // sends notifications as json response https://www.w3schools.com/nodejs/nodejs_express.asp
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// gets number of unread notifications
const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user.id,
      isRead: false,
    });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// marks one notification as read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id); // gets notification id from url params

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.recipient.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only mark your own notifications as read" });
    }

    notification.isRead = true;
    await notification.save(); // saves updated read status

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// deletes one notification
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id); // finds notification before deleting

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.recipient.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only delete your own notifications" });
    }

    await notification.deleteOne(); // deletes this notification document
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { // exporting controller functions so routes can use them https://www.w3schools.com/nodejs/nodejs_modules.asp
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  deleteNotification,
};