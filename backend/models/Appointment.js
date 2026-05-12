const mongoose = require('mongoose'); // importing mongoose to create schema and model https://www.w3schools.com/nodejs/nodejs_mongodb.asp

const appointmentSchema = new mongoose.Schema( // schema defines how appointment data should look
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId, // stores reference id of patient
      ref: 'User', // links this field with User model
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId, // stores reference id of doctor
      ref: 'Doctor', // links this field with Doctor model
      required: true,
    },
    slot: {
      type: mongoose.Schema.Types.ObjectId, // stores reference id of selected slot
      ref: 'Slot', // links this field with Slot model
      required: true,
    },
    status: {
      type: String,
      enum: ['Booked', 'Rescheduled', 'Cancelled', 'Completed'], // only these status values are allowed
      default: 'Booked', // new appointment starts as booked by default
    },
  },
  { timestamps: true } // automatically adds createdAt and updatedAt
);

module.exports = mongoose.model('Appointment', appointmentSchema); // creates and exports appointment model https://www.w3schools.com/nodejs/nodejs_modules.asp