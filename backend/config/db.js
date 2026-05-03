// config/db.js
// Singleton Pattern: ensures only ONE database connection instance
// exists across the entire application lifecycle.
const mongoose = require("mongoose");

class Database {
  // Private static field holds the single instance.
  // Using # would enforce true privacy, but underscore is the
  // conventional JavaScript indicator for "do not access directly".
  static _instance = null;

  // Private flag tracks whether we've already connected
  static _isConnected = false;

  constructor() {
    // Guard against external instantiation: if an instance exists,
    // return it instead of creating a new one.
    if (Database._instance) {
      return Database._instance;
    }
    Database._instance = this;
  }

  // Static accessor: the global access point required by the Singleton pattern.
  // Callers use Database.getInstance() rather than new Database().
  static getInstance() {
    if (!Database._instance) {
      Database._instance = new Database();
    }
    return Database._instance;
  }

  // Connects to MongoDB. Idempotent: calling it twice does NOT
  // open a second connection.
  async connect() {
    if (Database._isConnected) {
      console.log("MongoDB already connected, reusing existing connection");
      return;
    }

    try {
      await mongoose.connect(process.env.MONGO_URI);
      Database._isConnected = true;
      console.log("MongoDB connected successfully");
    } catch (error) {
      console.error("MongoDB connection error:", error.message);
      process.exit(1);
    }
  }

  // Returns the underlying mongoose connection if needed elsewhere.
  getConnection() {
    return mongoose.connection;
  }
}

// Export a function that delegates to the singleton.
// This preserves backward compatibility with the existing call site
// in server.js (`connectDB()`), so we don't have to refactor that too.
const connectDB = async () => {
  const db = Database.getInstance();
  await db.connect();
};

module.exports = connectDB;
module.exports.Database = Database; // Also export the class so tests/screenshots can reference it
