const express = require('express');
const {
  bookAppointment,
  getMyAppointments,
  getAllAppointments,
  rescheduleAppointment,
  cancelAppointment,
  updateAppointmentStatus,
} = require('../controllers/appointmentController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const validateBody = require('../middleware/validateBody');

const router = express.Router();

// Demonstrates the middleware chain:
//   protect → validateBody → bookAppointment
router.post(
  '/',
  protect,
  validateBody({ required: ['doctor', 'slot'] }),
  bookAppointment
);

router.get('/my', protect, getMyAppointments);
router.get('/', protect, adminOnly, getAllAppointments);

router.put(
  '/:id/reschedule',
  protect,
  validateBody({ required: ['newSlotId'] }),
  rescheduleAppointment
);

router.put('/:id/cancel', protect, cancelAppointment);

router.put(
  '/:id/status',
  protect,
  adminOnly,
  validateBody({ required: ['status'] }),
  updateAppointmentStatus
);

module.exports = router;