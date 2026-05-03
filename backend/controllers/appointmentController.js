const Appointment = require('../models/Appointment');
const Slot = require('../models/Slot');
const { NotificationFactory } = require('../services/NotificationFactory');
const AppointmentFacade = require('../services/AppointmentFacade');

// ─── Helper: format slot for human-readable notification messages ──────
const formatSlotInfo = (slot) => {
  if (!slot) return "scheduled time";
  return `${slot.date} ${slot.startTime}-${slot.endTime}`;
};

// ─── Helper: dispatch a notification using the Factory pattern ─────────
// Wrapped in try/catch so notification failures never break the main operation.
const dispatchNotification = async (type, data) => {
  try {
    const notification = NotificationFactory.create(type, data);
    await notification.save();
  } catch (err) {
    console.error(`Notification dispatch failed (${type}):`, err.message);
  }
};

const bookAppointment = async (req, res) => {
  try {
    const { doctor, slot } = req.body;

    // Facade pattern: one call orchestrates slot validation,
    // appointment creation, slot marking, and notification dispatch.
    const populatedAppointment = await AppointmentFacade.bookAppointmentForPatient({
      patientId: req.user.id,
      doctorId: doctor,
      slotId: slot,
    });

    res.status(201).json(populatedAppointment);
  } catch (error) {
    // Facade throws errors with statusCode attached; respect them
    const status = error.statusCode || 500;
    res.status(status).json({ message: error.message });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id })
      .populate('patient', 'name email role')
      .populate('doctor', 'name specialization email phone')
      .populate('slot', 'date startTime endTime isBooked');

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patient', 'name email role')
      .populate('doctor', 'name specialization email phone')
      .populate('slot', 'date startTime endTime isBooked');

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rescheduleAppointment = async (req, res) => {
  try {
    const { newSlotId } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.patient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only reschedule your own appointment' });
    }

    const oldSlot = await Slot.findById(appointment.slot);
    const newSlot = await Slot.findById(newSlotId).populate('doctor', 'name');

    if (!newSlot) {
      return res.status(404).json({ message: 'New slot not found' });
    }

    if (newSlot.isBooked) {
      return res.status(400).json({ message: 'New slot is already booked' });
    }

    if (oldSlot) {
      oldSlot.isBooked = false;
      await oldSlot.save();
    }

    newSlot.isBooked = true;
    await newSlot.save();

    appointment.slot = newSlotId;
    appointment.status = 'Rescheduled';
    await appointment.save();

    // Factory pattern dispatch
    await dispatchNotification('Rescheduled', {
      recipient: req.user.id,
      appointment: appointment._id,
      doctorName: newSlot.doctor?.name || 'your doctor',
      slotInfo: formatSlotInfo(newSlot),
    });

    const updatedAppointment = await Appointment.findById(appointment._id)
      .populate('patient', 'name email role')
      .populate('doctor', 'name specialization email phone')
      .populate('slot', 'date startTime endTime isBooked');

    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('slot');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.patient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only cancel your own appointment' });
    }

    const slotData = appointment.slot;
    const doctor = await require('../models/Doctor').findById(appointment.doctor);

    const slot = await Slot.findById(appointment.slot);
    if (slot) {
      slot.isBooked = false;
      await slot.save();
    }

    appointment.status = 'Cancelled';
    await appointment.save();

    // Factory pattern dispatch
    await dispatchNotification('Cancelled', {
      recipient: req.user.id,
      appointment: appointment._id,
      doctorName: doctor?.name || 'your doctor',
      slotInfo: formatSlotInfo(slotData),
    });

    res.status(200).json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = status || appointment.status;
    await appointment.save();

    // Look up slot and doctor separately (after status check) so the
    // notification dispatch has the data it needs without breaking the
    // simple stub-based mocha test that doesn't chain .populate()
    let slotData = null;
    let doctorData = null;
    try {
      slotData = await Slot.findById(appointment.slot);
      doctorData = await require('../models/Doctor').findById(appointment.doctor);
    } catch (e) {
      // ignore — notification will use fallback values
    }

    // Factory pattern dispatch — notify the patient that admin updated their appointment
    await dispatchNotification('StatusUpdate', {
      recipient: appointment.patient,
      appointment: appointment._id,
      doctorName: doctorData?.name || 'your doctor',
      slotInfo: formatSlotInfo(slotData),
      newStatus: appointment.status,
    });

    const updatedAppointment = await Appointment.findById(appointment._id)
      .populate('patient', 'name email role')
      .populate('doctor', 'name specialization email phone')
      .populate('slot', 'date startTime endTime isBooked');

    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  bookAppointment,
  getMyAppointments,
  getAllAppointments,
  rescheduleAppointment,
  cancelAppointment,
  updateAppointmentStatus,
};