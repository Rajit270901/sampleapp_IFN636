const express = require('express');
const {
  getSlots,
  getAvailableSlots,
  getSlotById,
  createSlot,
  updateSlot,
  deleteSlot,
} = require('../controllers/slotController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const SearchService = require('../services/SearchService');

const router = express.Router();

// New search endpoint — uses Adapter pattern via SearchService
router.get('/search', async (req, res) => {
  try {
    const { doctorId, from, to, availableOnly } = req.query;
    const results = await SearchService.searchSlots({
      doctorId,
      from,
      to,
      availableOnly,
    });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', getSlots);
router.get('/available', getAvailableSlots);
router.get('/:id', getSlotById);
router.post('/', protect, adminOnly, createSlot);
router.put('/:id', protect, adminOnly, updateSlot);
router.delete('/:id', protect, adminOnly, deleteSlot);

module.exports = router;