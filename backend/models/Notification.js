const mongoose = require("mongoose"); // importing mongoose for schema and model https://www.w3schools.com/nodejs/nodejs_mongodb.asp

const notificationSchema = new mongoose.Schema( // schema defines what a notification document looks like
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId, // stores the user id who gets the notification
      ref: "User", // links this field with User model
      required: true,
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId, // stores related appointment id if there is one
      ref: "Appointment", // links this field with Appointment model
      required: false, // some notifications may not be linked to an appointment
    },
    type: {
      type: String, // notification type stored as text
      enum: ["Booked", "Cancelled", "Rescheduled", "StatusUpdate"], // only these notification types are allowed
      required: true,
    },
    message: {
      type: String, // actual notification message
      required: true,
    },
    isRead: {
      type: Boolean, // true or false value https://www.w3schools.com/js/js_booleans.asp
      default: false, // new notifications start unread
    },
  },
  { timestamps: true } // automatically adds createdAt and updatedAt
);

module.exports = mongoose.model("Notification", notificationSchema); // creates and exports notification model https://www.w3schools.com/nodejs/nodejs_modules.asp