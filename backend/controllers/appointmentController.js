const Appointment = require('../models/Appointment');
const Slot = require('../models/Slot');

const bookAppointment = async (req, res) => {
  try {
    const { doctor, slot } = req.body;

    const selectedSlot = await Slot.findById(slot);

    if (!selectedSlot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    if (selectedSlot.isBooked) {
      return res.status(400).json({ message: 'Slot is already booked' });
    }

    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor,
      slot,
      status: 'Booked',
    });

    selectedSlot.isBooked = true;
    await selectedSlot.save();

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patient', 'name email role')
      .populate('doctor', 'name specialization email phone')
      .populate('slot', 'date startTime endTime isBooked');

    res.status(201).json(populatedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    const newSlot = await Slot.findById(newSlotId);

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
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.patient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only cancel your own appointment' });
    }

    const slot = await Slot.findById(appointment.slot);
    if (slot) {
      slot.isBooked = false;
      await slot.save();
    }

    appointment.status = 'Cancelled';
    await appointment.save();

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