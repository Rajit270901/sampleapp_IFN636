const express = require('express'); // importing express for router https://www.w3schools.com/nodejs/nodejs_express.asp
const {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} = require('../controllers/doctorController'); // importing doctor controller functions
const { protect, adminOnly } = require('../middleware/authMiddleware'); // middleware for login and admin access
const SearchService = require('../services/SearchService'); // service used for doctor search logic

const router = express.Router(); // creates express router https://www.w3schools.com/nodejs/nodejs_express.asp

// search route for filtering doctors
// uses query values from url like specialization and availableOnly
router.get('/search', async (req, res) => {
  try { // handles errors if search fails https://www.w3schools.com/js/js_errors.asp
    const { specialization, availableOnly } = req.query; // getting query params from url https://www.w3schools.com/js/js_destructuring.asp
    const results = await SearchService.searchDoctors({ specialization, availableOnly });
    res.status(200).json(results); // sends search results as json https://www.w3schools.com/nodejs/nodejs_express.asp
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', getDoctors); // public route to get all doctors
router.get('/:id', getDoctorById); // public route to get one doctor by id
router.post('/', protect, adminOnly, createDoctor); // only admin can create doctor
router.put('/:id', protect, adminOnly, updateDoctor); // only admin can update doctor
router.delete('/:id', protect, adminOnly, deleteDoctor); // only admin can delete doctor

module.exports = router; // exporting router so app can use doctor routes https://www.w3schools.com/nodejs/nodejs_modules.asp