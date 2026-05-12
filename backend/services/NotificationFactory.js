// factory pattern used here so notification objects are created in one place
// https://www.w3schools.com/js/js_classes.asp

const Notification = require("../models/Notification"); // importing notification model https://www.w3schools.com/nodejs/nodejs_modules.asp

// base class
class BaseNotification { // parent class for all notification types https://www.w3schools.com/js/js_class_inheritance.asp
  constructor({ recipient, appointment, doctorName, slotInfo }) { // constructor runs when object is created https://www.w3schools.com/js/js_class_intro.asp
    this.recipient = recipient;
    this.appointment = appointment;
    this.doctorName = doctorName;
    this.slotInfo = slotInfo;
    this.type = "Base"; // changed later by the child classes
  }

  // child classes should write their own message
  getMessage() {
    throw new Error("getMessage() must be implemented by subclass"); // error if subclass forgets this method https://www.w3schools.com/js/js_errors.asp
  }

  // saves the notification in mongodb
  async save() { // async is used because saving to db takes time https://www.w3schools.com/js/js_async.asp
    return await Notification.create({
      recipient: this.recipient,
      appointment: this.appointment,
      type: this.type,
      message: this.getMessage(),
    });
  }
}

// concrete notification classes
class BookedNotification extends BaseNotification { // extends means it inherits from BaseNotification https://www.w3schools.com/js/js_class_inheritance.asp
  constructor(data) {
    super(data); // calls the parent constructor first https://www.w3schools.com/js/js_class_inheritance.asp
    this.type = "Booked";
  }
  getMessage() {
    return `Your appointment with ${this.doctorName} on ${this.slotInfo} has been booked successfully.`; // template string used to insert values https://www.w3schools.com/js/js_string_templates.asp
  }
}

class CancelledNotification extends BaseNotification {
  constructor(data) {
    super(data);
    this.type = "Cancelled";
  }
  getMessage() {
    return `Your appointment with ${this.doctorName} on ${this.slotInfo} has been cancelled.`;
  }
}

class RescheduledNotification extends BaseNotification {
  constructor(data) {
    super(data);
    this.type = "Rescheduled";
  }
  getMessage() {
    return `Your appointment with ${this.doctorName} has been rescheduled to ${this.slotInfo}.`;
  }
}

class StatusUpdateNotification extends BaseNotification {
  constructor(data) {
    super(data);
    this.type = "StatusUpdate";
    this.newStatus = data.newStatus; // stores the updated appointment status
  }
  getMessage() {
    return `Your appointment with ${this.doctorName} on ${this.slotInfo} is now marked as "${this.newStatus}".`;
  }
}

// factory class
class NotificationFactory {
  // static method so it can be called without making a factory object
  static create(type, data) { // static method https://www.w3schools.com/js/js_class_static.asp
    switch (type) { // switch is cleaner here because there are multiple notification types https://www.w3schools.com/js/js_switch.asp
      case "Booked":
        return new BookedNotification(data);
      case "Cancelled":
        return new CancelledNotification(data);
      case "Rescheduled":
        return new RescheduledNotification(data);
      case "StatusUpdate":
        return new StatusUpdateNotification(data);
      default:
        throw new Error(`Unknown notification type: ${type}`);
    }
  }
}

module.exports = { // exporting all classes so other files and tests can use them https://www.w3schools.com/nodejs/nodejs_modules.asp
  NotificationFactory,
  BaseNotification,
  BookedNotification,
  CancelledNotification,
  RescheduledNotification,
  StatusUpdateNotification,
};