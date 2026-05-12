const express = require('express'); // importing express to create server https://www.w3schools.com/nodejs/nodejs_express.asp
const dotenv = require('dotenv'); // loads env variables from .env file
const cors = require('cors'); // allows frontend and backend to talk from different origins
const connectDB = require('./config/db'); // importing database connection function

dotenv.config(); // loads .env values into process.env


const app = express(); // creates express app https://www.w3schools.com/nodejs/nodejs_express.asp

app.use(cors()); // enables cors for api requests
app.use(express.json()); // lets express read json request body https://www.w3schools.com/nodejs/nodejs_express.asp
app.use(require('./middleware/requestLogger')); // logs incoming requests before routes run
app.use('/api/auth', require('./routes/authRoutes')); // auth routes for register login and profile
app.use('/api/doctors', require('./routes/doctorRoutes')); // doctor api routes
app.use('/api/slots', require('./routes/slotRoutes')); // slot api routes
app.use('/api/appointments', require('./routes/appointmentRoutes')); // appointment api routes
app.use('/api/notifications', require('./routes/notificationRoutes')); // notification api routes

// exports app for testing without starting the server
if (require.main === module) {
    connectDB(); // connects to mongodb only when server file is run directly
    // starts server only when this file is run directly
    const PORT = process.env.PORT || 5001; // uses env port or 5001 as default
    app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`)); // starts listening for requests https://www.w3schools.com/nodejs/nodejs_http.asp
  }


module.exports = app // exporting app so tests can import it https://www.w3schools.com/nodejs/nodejs_modules.asp



