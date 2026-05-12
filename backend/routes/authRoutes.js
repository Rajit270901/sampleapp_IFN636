const express = require('express'); // importing express for router https://www.w3schools.com/nodejs/nodejs_express.asp
const { registerUser, loginUser, updateUserProfile, getProfile } = require('../controllers/authController'); // importing auth controller functions
const { protect } = require('../middleware/authMiddleware'); // middleware used to protect logged in routes
const validateBody = require('../middleware/validateBody'); // middleware used to check required request body fields

const router = express.Router(); // creates express router https://www.w3schools.com/nodejs/nodejs_express.asp

router.post(
  '/register',
  validateBody({ required: ['name', 'email', 'password'] }), // checks required fields before registering
  registerUser
);

router.post(
  '/login',
  validateBody({ required: ['email', 'password'] }), // checks login details before controller runs
  loginUser
);

router.get('/profile', protect, getProfile); // only logged in user can view profile
router.put('/profile', protect, updateUserProfile); // only logged in user can update profile

module.exports = router; // exporting router so app can use these auth routes https://www.w3schools.com/nodejs/nodejs_modules.asp
