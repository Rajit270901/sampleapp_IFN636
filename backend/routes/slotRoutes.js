const express = require('express'); // importing express for router https://www.w3schools.com/nodejs/nodejs_express.asp
const {
  getSlots,
  getAvailableSlots,
  getSlotById,
  createSlot,
  updateSlot,
  deleteSlot,
} = require('../controllers/slotController'); // importing slot controller functions
const { protect, adminOnly } = require('../middleware/authMiddleware'); // middleware for login and admin access
const SearchService = require('../services/SearchService'); // service used for slot search and filtering

const router = express.Router(); // creates express router https://www.w3schools.com/nodejs/nodejs_express.asp

// search route for filtering slots
// adapter is used inside SearchService to compare slot dates properly
router.get('/search', async (req, res) => {
  try { // catches search errors https://www.w3schools.com/js/js_errors.asp
    const { doctorId, from, to, availableOnly } = req.query; // gets query params from url https://www.w3schools.com/js/js_destructuring.asp
    const results = await SearchService.searchSlots({
      doctorId,
      from,
      to,
      availableOnly,
    });
    res.status(200).json(results); // sends filtered slots as json https://www.w3schools.com/nodejs/nodejs_express.asp
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', getSlots); // public route to get all slots
router.get('/available', getAvailableSlots); // public route to get only available slots
router.get('/:id', getSlotById); // public route to get one slot by id
router.post('/', protect, adminOnly, createSlot); // only admin can create slot
router.put('/:id', protect, adminOnly, updateSlot); // only admin can update slot
router.delete('/:id', protect, adminOnly, deleteSlot); // only admin can delete slot

module.exports = router; // exporting router so app can use slot routes https://www.w3schools.com/nodejs/nodejs_modules.asp