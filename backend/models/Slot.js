const mongoose = require('mongoose'); // importing mongoose for schema and model https://www.w3schools.com/nodejs/nodejs_mongodb.asp

const slotSchema = new mongoose.Schema( // schema defines how slot data is stored
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId, // stores the doctor id for this slot
      ref: 'Doctor', // links this field with Doctor model
      required: true,
    },
    date: {
      type: String, // date is stored as text for display
      required: true,
    },
    startTime: {
      type: String, // start time stored as text like 10:00 AM
      required: true,
    },
    endTime: {
      type: String, // end time stored as text like 10:30 AM
      required: true,
    },
    isBooked: {
      type: Boolean, // true or false value https://www.w3schools.com/js/js_booleans.asp
      default: false, // new slot is available unless booked
    },
  },
  { timestamps: true } // automatically adds createdAt and updatedAt
);

module.exports = mongoose.model('Slot', slotSchema); // creates and exports slot model https://www.w3schools.com/nodejs/nodejs_modules.asp