const User = require('../models/User'); // importing user model https://www.w3schools.com/nodejs/nodejs_modules.asp
const jwt = require('jsonwebtoken'); // jwt used for login token
const bcrypt = require('bcrypt'); // bcrypt used for comparing hashed passwords

const generateToken = (id) => { // arrow function for making jwt token https://www.w3schools.com/js/js_arrow_function.asp
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => { // async because database actions take time https://www.w3schools.com/js/js_async.asp
  const { name, email, password, address } = req.body; // getting fields from request body https://www.w3schools.com/js/js_destructuring.asp

  try { // used to catch errors during registration https://www.w3schools.com/js/js_errors.asp
    const userExists = await User.findOne({ email }); // checks if email is already used

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      address,
      role: 'patient',
    });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address,
      token: generateToken(user.id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body; // taking login details from body https://www.w3schools.com/js/js_destructuring.asp

  try {
    const user = await User.findOne({ email }); // finds user by email

    if (user && (await bcrypt.compare(password, user.password))) { // checks user exists and password matches
      return res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
        token: generateToken(user.id),
      });
    }

    res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // gets logged in user using id from token

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // finds current logged in user

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, email, address } = req.body; // only these profile fields can be updated https://www.w3schools.com/js/js_destructuring.asp

    user.name = name || user.name; // keeps old value if no new name is sent
    user.email = email || user.email;
    user.address = address || user.address;

    const updatedUser = await user.save(); // saves updated user back to database

    res.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      address: updatedUser.address,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { // exporting controller functions so routes can use them https://www.w3schools.com/nodejs/nodejs_modules.asp
  registerUser,
  loginUser,
  updateUserProfile,
  getProfile,
};