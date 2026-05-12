const Doctor = require('../models/Doctor'); // importing doctor model https://www.w3schools.com/nodejs/nodejs_modules.asp

const getDoctors = async (req, res) => { // async because database query takes time https://www.w3schools.com/js/js_async.asp
  try { // handles errors if database request fails https://www.w3schools.com/js/js_errors.asp
    const doctors = await Doctor.find(); // gets all doctors from database
    res.status(200).json(doctors); // sends doctors as json response https://www.w3schools.com/nodejs/nodejs_express.asp
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id); // uses id from url params to find doctor

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createDoctor = async (req, res) => {
  try {
    const { name, specialization, email, phone, isAvailable } = req.body; // taking doctor details from request body https://www.w3schools.com/js/js_destructuring.asp

    const doctor = await Doctor.create({
      name,
      specialization,
      email,
      phone,
      isAvailable,
    });

    res.status(201).json(doctor); // 201 means new doctor was created
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id); // finds doctor before updating

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    doctor.name = req.body.name || doctor.name; // keeps old value if new one is not sent
    doctor.specialization = req.body.specialization || doctor.specialization;
    doctor.email = req.body.email || doctor.email;
    doctor.phone = req.body.phone || doctor.phone;

    if (req.body.isAvailable !== undefined) {
      doctor.isAvailable = req.body.isAvailable; // this check allows false to be saved properly
    }

    const updatedDoctor = await doctor.save(); // saves updated doctor back to database
    res.status(200).json(updatedDoctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id); // finds doctor before deleting

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    await doctor.deleteOne(); // deletes this doctor document
    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { // exporting controller functions so routes can use them https://www.w3schools.com/nodejs/nodejs_modules.asp
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};