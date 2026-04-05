// server.js

const express = require("express");
const dotenv = require("dotenv");

// 🔐 Load env
dotenv.config();

// DB connection import
const connectDB = require("./src/config/db");

// Routes
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const recordRoutes = require("./src/routes/recordRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");

// Init app
const app = express();

// ================= MIDDLEWARE =================
app.use(express.json());

// ================= DB CONNECT =================
connectDB();

// ================= ROUTES =================
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/dashboard", dashboardRoutes);
// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});