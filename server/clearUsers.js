const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");

async function clearUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
    
    const result = await User.deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} users from database`);
    
    await mongoose.connection.close();
    console.log("✅ Database connection closed");
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

clearUsers(); 