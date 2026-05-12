const mongoose = require('mongoose'); // importing mongoose to create doctor schema and model https://www.w3schools.com/nodejs/nodejs_mongodb.asp

const doctorSchema = new mongoose.Schema( // schema defines the structure of doctor data
  {
    name: {
      type: String, // doctor name stored as text
      required: true, // this field must be provided
      trim: true, // removes extra spaces from start and end
    },
    specialization: {
      type: String, // specialization stored as text
      required: true,
      trim: true,
    },
    email: {
      type: String, // email stored as text
      required: true,
      trim: true,
      lowercase: true, // saves email in lowercase for consistency
    },
    phone: {
      type: String, // phone kept as string so formatting is not lost
      required: true,
      trim: true,
    },
    isAvailable: {
      type: Boolean, // true or false value https://www.w3schools.com/js/js_booleans.asp
      default: true, // doctor is available by default
    },
  },
  { timestamps: true } // automatically adds createdAt and updatedAt
);

module.exports = mongoose.model('Doctor', doctorSchema); // creates and exports doctor model https://www.w3schools.com/nodejs/nodejs_modules.asp