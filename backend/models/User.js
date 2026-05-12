const mongoose = require('mongoose'); // importing mongoose for schema and model https://www.w3schools.com/nodejs/nodejs_mongodb.asp
const bcrypt = require('bcrypt'); // bcrypt is used to hash passwords before saving

const userSchema = new mongoose.Schema( // schema defines how user data is stored
  {
    name: {
      type: String, // name stored as text
      required: true, // name is required
      trim: true, // removes extra spaces from start and end
    },
    email: {
      type: String, // email stored as text
      required: true,
      unique: true, // no two users should have same email
      trim: true,
      lowercase: true, // saves email in lowercase for consistency
    },
    password: {
      type: String, // password is stored as hashed text
      required: true,
    },
    role: {
      type: String, // role decides what user can access
      enum: ['patient', 'admin'], // only patient or admin is allowed
      default: 'patient', // normal users become patient by default
    },
    address: {
      type: String, // address stored as text
      default: '',
    },
  },
  { timestamps: true } // automatically adds createdAt and updatedAt
);

userSchema.pre('save', async function (next) { // runs before saving user to database
  if (!this.isModified('password')) return next(); // only hash password if it was changed

  const salt = await bcrypt.genSalt(10); // creates salt with 10 rounds
  this.password = await bcrypt.hash(this.password, salt); // hashes the password before storing
  next(); // moves to the actual save step https://www.w3schools.com/nodejs/nodejs_express.asp
});

module.exports = mongoose.model('User', userSchema); // creates and exports user model https://www.w3schools.com/nodejs/nodejs_modules.asp
