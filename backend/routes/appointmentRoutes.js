const express = require('express'); // importing express for router https://www.w3schools.com/nodejs/nodejs_express.asp
const {
  bookAppointment,
  getMyAppointments,
  getAllAppointments,
  rescheduleAppointment,
  cancelAppointment,
  updateAppointmentStatus,
} = require('../controllers/appointmentController'); // importing appointment controller functions
const { protect, adminOnly } = require('../middleware/authMiddleware'); // auth middleware for protected and admin routes
const validateBody = require('../middleware/validateBody'); // validation middleware for checking required fields

const router = express.Router(); // creates express router https://www.w3schools.com/nodejs/nodejs_express.asp

// middleware chain for booking appointment
// protect checks login then validateBody checks data then controller runs
router.post(
  '/',
  protect,
  validateBody({ required: ['doctor', 'slot'] }),
  bookAppointment
);

router.get('/my', protect, getMyAppointments); // logged in user gets their own appointments
router.get('/', protect, adminOnly, getAllAppointments); // only admin can view all appointments

router.put(
  '/:id/reschedule',
  protect,
  validateBody({ required: ['newSlotId'] }),
  rescheduleAppointment
);

router.put('/:id/cancel', protect, cancelAppointment); // user can cancel their own appointment

router.put(
  '/:id/status',
  protect,
  adminOnly,
  validateBody({ required: ['status'] }),
  updateAppointmentStatus
);

module.exports = router; // exporting router so app can use these routes https://www.w3schools.com/nodejs/nodejs_modules.asp