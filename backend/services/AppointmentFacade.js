// facade pattern used here to keep appointment booking in one simple method
// https://www.w3schools.com/js/js_classes.asp

const Appointment = require("../models/Appointment"); // appointment model https://www.w3schools.com/nodejs/nodejs_modules.asp
const Slot = require("../models/Slot"); // slot model https://www.w3schools.com/nodejs/nodejs_modules.asp
const { NotificationFactory } = require("./NotificationFactory"); // factory used for creating notification objects

class AppointmentFacade { // class groups the booking steps in one place https://www.w3schools.com/js/js_classes.asp
  // checks if the slot exists and is still free
  static async _validateSlot(slotId) { // static async method because db lookup takes time https://www.w3schools.com/js/js_class_static.asp
    const slot = await Slot.findById(slotId).populate("doctor", "name");
    if (!slot) {
      const err = new Error("Slot not found"); // creates an error object https://www.w3schools.com/js/js_errors.asp
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

  // creates the appointment record
  static async _createAppointment(patientId, doctorId, slotId) {
    return await Appointment.create({
      patient: patientId,
      doctor: doctorId,
      slot: slotId,
      status: "Booked",
    });
  }

  // updates the slot so it cannot be booked again
  static async _markSlotBooked(slot) {
    slot.isBooked = true;
    await slot.save(); // saves the changed slot back to database https://www.w3schools.com/js/js_async.asp
  }

  // sends notification but booking should still work even if this fails
  static async _notifyPatient(patientId, appointment, slot) {
    try { // used because notification failure should be handled safely https://www.w3schools.com/js/js_errors.asp
      const notification = NotificationFactory.create("Booked", {
        recipient: patientId,
        appointment: appointment._id,
        doctorName: slot.doctor?.name || "your doctor", // optional chaining avoids error if doctor is missing https://www.w3schools.com/js/js_2020.asp
        slotInfo: `${slot.date} ${slot.startTime}-${slot.endTime}`, // template string for joining slot info https://www.w3schools.com/js/js_string_templates.asp
      });
      await notification.save();
    } catch (err) {
      // notification is extra so it should not cancel the booking
      console.error("Notification dispatch failed (Booked):", err.message);
    }
  }

  // main facade method used by controller
  // controller only calls this instead of doing all booking steps itself
  static async bookAppointmentForPatient({ patientId, doctorId, slotId }) {
    const slot = await this._validateSlot(slotId);
    const appointment = await this._createAppointment(patientId, doctorId, slotId);
    await this._markSlotBooked(slot);
    await this._notifyPatient(patientId, appointment, slot);

    // returning appointment with patient doctor and slot details included
    return await Appointment.findById(appointment._id)
      .populate("patient", "name email role")
      .populate("doctor", "name specialization email phone")
      .populate("slot", "date startTime endTime isBooked");
  }
}

module.exports = AppointmentFacade; // exporting facade so controller can use it https://www.w3schools.com/nodejs/nodejs_modules.asp