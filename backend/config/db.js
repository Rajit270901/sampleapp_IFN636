// Singleton Pattern: keeps only one database connection object for the app lifecycle.
// Reference: https://www.w3schools.com/nodejs/nodejs_mongodb.asp
const mongoose = require("mongoose"); // Imports mongoose so Node.js can connect to MongoDB.

class Database { // Class used to group database connection logic. Reference: https://www.w3schools.com/js/js_classes.asp
  static _instance = null; // Reference: https://www.w3schools.com/js/js_class_static.asp

  static _isConnected = false; // Reference: https://www.w3schools.com/js/js_class_static.asp

  constructor() { // Runs when new Database() is called. Reference: https://www.w3schools.com/js/js_class_intro.asp
    if (Database._instance) {
      return Database._instance;
    }
    Database._instance = this;
  }

  // main Singleton behaviour: callers use Database.getInstance().
  static getInstance() { // Reference: https://www.w3schools.com/js/js_class_static.asp
    if (!Database._instance) {
      Database._instance = new Database();
    }
    return Database._instance;
  }

  async connect() { // async allows await to be used inside this method. Reference: https://www.w3schools.com/js/js_async.asp
    if (Database._isConnected) {
      console.log("MongoDB already connected, reusing existing connection");
      return;
    }

    try { // try/catch handles connection errors without crashing silently. Reference: https://www.w3schools.com/js/js_errors.asp
      await mongoose.connect(process.env.MONGO_URI); // Waits for MongoDB connection before continuing. Reference: https://www.w3schools.com/js/js_async.asp
      Database._isConnected = true;
      console.log("MongoDB connected successfully");
    } catch (error) {
      console.error("MongoDB connection error:", error.message);
      process.exit(1);
    }
  }

  // Gives access to the active mongoose connection if another part of the app needs it.
  getConnection() {
    return mongoose.connection;
  }
}

const connectDB = async () => { // Arrow function syntax. Reference: https://www.w3schools.com/js/js_arrow_function.asp
  const db = Database.getInstance();
  await db.connect();
};

module.exports = connectDB; // Exports connectDB for use in other files. Reference: https://www.w3schools.com/nodejs/nodejs_modules.asp
module.exports.Database = Database; 
