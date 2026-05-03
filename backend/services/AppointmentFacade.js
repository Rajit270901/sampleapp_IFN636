// services/AppointmentFacade.js
//
// Facade Pattern: provides a simplified interface to the complex
// appointment booking subsystem.
//
// Booking an appointment involves orchestrating 4 subsystems:
//   1. Slot subsystem — validate slot exists & isn't booked
//   2. Appointment subsystem — create the appointment record
//   3. Slot subsystem (again) — mark slot as booked
//   4. Notification subsystem — dispatch a notification via Factory
//
// Without the Facade, every controller calling these subsystems would
// repeat the orchestration logic. The Facade wraps it in one method:
// `bookAppointmentForPatient()` — the controller just calls that.
//
// Mirrors Tutorial 7's SmartHomeFacade.start_movie_night() example:
// the user calls one method, and the facade internally coordinates
// TV, sound, lights, and AC.

const Appointment = require("../models/Appointment");
const Slot = require("../models/Slot");
const { NotificationFactory } = require("./NotificationFactory");

class AppointmentFacade {
  // ─── Subsystem 1: Slot validation ─────────────────────────
  static async _validateSlot(slotId) {
    const slot = await Slot.findById(slotId).populate("doctor", "name");
    if (!slot) {
      const err = new Error("Slot not found");
      err.statusCode = 404;
      throw err;
    }
    if (slot.isBooked) {
      const err = new Error("Slot is already booked");
      err.statusCode = 400;
      throw err;
    }
    return slot;
  }

  // ─── Subsystem 2: Appointment creation ────────────────────
  static async _createAppointment(patientId, doctorId, slotId) {
    return await Appointment.create({
      patient: patientId,
      doctor: doctorId,
      slot: slotId,
      status: "Booked",
    });
  }

  // ─── Subsystem 3: Mark slot as booked ─────────────────────
  static async _markSlotBooked(slot) {
    slot.isBooked = true;
    await slot.save();
  }

  // ─── Subsystem 4: Dispatch notification (uses Factory) ───
  static async _notifyPatient(patientId, appointment, slot) {
    try {
      const notification = NotificationFactory.create("Booked", {
        recipient: patientId,
        appointment: appointment._id,
        doctorName: slot.doctor?.name || "your doctor",
        slotInfo: `${slot.date} ${slot.startTime}-${slot.endTime}`,
      });
      await notification.save();
    } catch (err) {
      // Notifications are best-effort — never fail the booking because of a notification problem
      console.error("Notification dispatch failed (Booked):", err.message);
    }
  }

  // ─── PUBLIC FACADE METHOD ─────────────────────────────────
  // Single high-level method that orchestrates all 4 subsystems.
  // Controllers call this instead of coordinating the subsystems themselves.
  static async bookAppointmentForPatient({ patientId, doctorId, slotId }) {
    const slot = await this._validateSlot(slotId);
    const appointment = await this._createAppointment(patientId, doctorId, slotId);
    await this._markSlotBooked(slot);
    await this._notifyPatient(patientId, appointment, slot);

    // Return the populated appointment for the response
    return await Appointment.findById(appointment._id)
      .populate("patient", "name email role")
      .populate("doctor", "name specialization email phone")
      .populate("slot", "date startTime endTime isBooked");
  }
}

module.exports = AppointmentFacade;