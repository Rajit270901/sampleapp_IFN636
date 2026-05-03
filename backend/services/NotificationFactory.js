// services/NotificationFactory.js
//
// Factory Pattern: encapsulates creation logic for different notification types.
// Demonstrates Inheritance, Polymorphism, and Abstraction.
//
//   BaseNotification (abstract-ish base)
//        |
//   ┌────┼────────────────────────────┐
//   │    │              │             │
//   BookedN   CancelledN  RescheduledN  StatusUpdateN
//
// Each subclass overrides getMessage() to format its own message text.
// The Factory's create() method hides which subclass is instantiated:
// callers say `NotificationFactory.create("Booked", data)` without
// knowing or caring about the concrete class.
//
// This mirrors Tutorial 7's Factory example (VehicleFactory) and
// Tutorial 6's OOP examples (Job parent + EmailJob/DataProcessingJob children).

const Notification = require("../models/Notification");

// ─── Base class ───────────────────────────────────────────────
class BaseNotification {
  constructor({ recipient, appointment, doctorName, slotInfo }) {
    this.recipient = recipient;
    this.appointment = appointment;
    this.doctorName = doctorName;
    this.slotInfo = slotInfo;
    this.type = "Base"; // overridden by subclasses
  }

  // Polymorphism: each subclass implements its own version.
  // Base raises an error so subclasses are forced to override.
  getMessage() {
    throw new Error("getMessage() must be implemented by subclass");
  }

  // Persists the notification to MongoDB. Shared logic across all subclasses
  // (encapsulation: callers don't need to know about the Notification model).
  async save() {
    return await Notification.create({
      recipient: this.recipient,
      appointment: this.appointment,
      type: this.type,
      message: this.getMessage(),
    });
  }
}

// ─── Concrete subclasses ──────────────────────────────────────
class BookedNotification extends BaseNotification {
  constructor(data) {
    super(data);
    this.type = "Booked";
  }
  getMessage() {
    return `Your appointment with ${this.doctorName} on ${this.slotInfo} has been booked successfully.`;
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
    this.newStatus = data.newStatus; // e.g. "Completed"
  }
  getMessage() {
    return `Your appointment with ${this.doctorName} on ${this.slotInfo} is now marked as "${this.newStatus}".`;
  }
}

// ─── The Factory ─────────────────────────────────────────────
class NotificationFactory {
  // Static factory method — the canonical Factory pattern API.
  // Encapsulates which concrete subclass to return based on input.
  static create(type, data) {
    switch (type) {
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

module.exports = {
  NotificationFactory,
  BaseNotification,
  BookedNotification,
  CancelledNotification,
  RescheduledNotification,
  StatusUpdateNotification,
};