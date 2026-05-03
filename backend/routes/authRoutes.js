const express = require('express');
const { registerUser, loginUser, updateUserProfile, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const validateBody = require('../middleware/validateBody');

const router = express.Router();

router.post(
  '/register',
  validateBody({ required: ['name', 'email', 'password'] }),
  registerUser
);

router.post(
  '/login',
  validateBody({ required: ['email', 'password'] }),
  loginUser
);

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateUserProfile);

module.exports = router;
