const Slot = require('../models/Slot'); // importing slot model https://www.w3schools.com/nodejs/nodejs_modules.asp

const getSlots = async (req, res) => { // async because database query takes time https://www.w3schools.com/js/js_async.asp
  try { // catches errors if something goes wrong https://www.w3schools.com/js/js_errors.asp
    const slots = await Slot.find().populate('doctor', 'name specialization email phone');
    res.status(200).json(slots); // sends all slots as json response https://www.w3schools.com/nodejs/nodejs_express.asp
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAvailableSlots = async (req, res) => {
  try {
    const slots = await Slot.find({ isBooked: false }).populate(
      'doctor',
      'name specialization email phone'
    );
    res.status(200).json(slots); // only returns slots that are not booked
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSlotById = async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id).populate(
      'doctor',
      'name specialization email phone'
    );

    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    res.status(200).json(slot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSlot = async (req, res) => {
  try {
    const { doctor, date, startTime, endTime, isBooked } = req.body; // taking slot details from request body https://www.w3schools.com/js/js_destructuring.asp

    const slot = await Slot.create({
      doctor,
      date,
      startTime,
      endTime,
      isBooked,
    });

    res.status(201).json(slot); // 201 means new slot was created
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSlot = async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id); // finds slot using id from url params

    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    slot.doctor = req.body.doctor || slot.doctor; // keeps old value if new one is not sent
    slot.date = req.body.date || slot.date;
    slot.startTime = req.body.startTime || slot.startTime;
    slot.endTime = req.body.endTime || slot.endTime;

    if (req.body.isBooked !== undefined) {
      slot.isBooked = req.body.isBooked; // this check allows false to be saved properly
    }

    const updatedSlot = await slot.save(); // saves updated slot back to database
    res.status(200).json(updatedSlot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSlot = async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id); // finds slot before deleting

    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    await slot.deleteOne(); // deletes this slot document
    res.status(200).json({ message: 'Slot deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { // exporting controller functions so routes can use them https://www.w3schools.com/nodejs/nodejs_modules.asp
  getSlots,
  getAvailableSlots,
  getSlotById,
  createSlot,
  updateSlot,
  deleteSlot,
};