const express = require('express');
const {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} = require('../controllers/doctorController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const SearchService = require('../services/SearchService');

const router = express.Router();

// New search endpoint — uses Adapter pattern via SearchService
router.get('/search', async (req, res) => {
  try {
    const { specialization, availableOnly } = req.query;
    const results = await SearchService.searchDoctors({ specialization, availableOnly });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', getDoctors);
router.get('/:id', getDoctorById);
router.post('/', protect, adminOnly, createDoctor);
router.put('/:id', protect, adminOnly, updateDoctor);
router.delete('/:id', protect, adminOnly, deleteDoctor);

module.exports = router;