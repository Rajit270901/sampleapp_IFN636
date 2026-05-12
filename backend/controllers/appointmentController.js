const Appointment = require('../models/Appointment'); // importing appointment model https://www.w3schools.com/nodejs/nodejs_modules.asp
const Slot = require('../models/Slot'); // importing slot model https://www.w3schools.com/nodejs/nodejs_modules.asp
const { NotificationFactory } = require('../services/NotificationFactory'); // using factory to create notifications
const AppointmentFacade = require('../services/AppointmentFacade'); // facade keeps booking logic in one place

// helper to make the slot date and time readable for notification messages
const formatSlotInfo = (slot) => {
  if (!slot) return "scheduled time";
  return `${slot.date} ${slot.startTime}-${slot.endTime}`; // template string used to join slot values https://www.w3schools.com/js/js_string_templates.asp
};

// helper for sending notification using factory pattern
const dispatchNotification = async (type, data) => { // async because saving notification takes time https://www.w3schools.com/js/js_async.asp
  try { // handles errors safely https://www.w3schools.com/js/js_errors.asp
    const notification = NotificationFactory.create(type, data);
    await notification.save();
  } catch (err) {
    console.error(`Notification dispatch failed (${type}):`, err.message);
  }
};

const bookAppointment = async (req, res) => {
  try {
    const { doctor, slot } = req.body; // getting doctor and slot from request body https://www.w3schools.com/js/js_destructuring.asp

    const populatedAppointment = await AppointmentFacade.bookAppointmentForPatient({
      patientId: req.user.id,
      doctorId: doctor,
      slotId: slot,
    });

    res.status(201).json(populatedAppointment); // sends created response as json https://www.w3schools.com/nodejs/nodejs_express.asp
  } catch (error) {
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

    // creating rescheduled notification through factory
    await dispatchNotification('Rescheduled', {
      recipient: req.user.id,
      appointment: appointment._id,
      doctorName: newSlot.doctor?.name || 'your doctor', // https://www.w3schools.com/js/js_2020.asp
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

    // creating cancelled notification through factory
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

    appointment.status = status || appointment.status; // keeps old status if no new status is sent
    await appointment.save();

    // getting extra slot and doctor details for notification
    let slotData = null;
    let doctorData = null;
    try {
      slotData = await Slot.findById(appointment.slot);
      doctorData = await require('../models/Doctor').findById(appointment.doctor);
    } catch (e) {
    }

    // creating status update notification for the patient
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

module.exports = { // exporting controller functions so routes can use them https://www.w3schools.com/nodejs/nodejs_modules.asp
  bookAppointment,
  getMyAppointments,
  getAllAppointments,
  rescheduleAppointment,
  cancelAppointment,
  updateAppointmentStatus,
};