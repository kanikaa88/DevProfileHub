const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 8080;

// 🔹 Import Routes
const userRoutes = require("./routes/users");
const otpRoutes = require("./routes/otp"); // ✅ Added OTP route

// 🔹 Middleware
app.use(cors());
app.use(express.json());

// 🔹 Routes
app.use("/api/users", userRoutes);
app.use("/api/otp", otpRoutes); // ✅ Use OTP route

app.get("/", (req, res) => {
  res.send("It works!");
});

// 🔹 Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err);
  });
