


require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./src/config/db");

const authRoutes = require("./src/routes/authRoutes");
const studentRoutes = require("./src/routes/studentRoutes");

const attendanceRoute = require("./src/routes/attendanceRoute");

const classRoutes = require("./src/routes/classRoutes");
const subjectRoutes = require("./src/routes/subjectRoutes");

const reportRoutes = require("./src/routes/reportRoutes");

const assignmentRoutes = require("./src/routes/assignmentRoutes");


const app = express();


// Database
connectDB();


// Middleware
app.use(cors());
app.use(express.json());


// Routes
app.get("/", (req, res) => {
  res.send("Attendance SaaS Backend is Running 🚀");
});

app.use("/api/auth", authRoutes);

app.use("/api/students", studentRoutes);

app.use("/api/attendance", attendanceRoute);


app.use("/api/classes", classRoutes);
app.use("/api/subjects", subjectRoutes);

app.use("/api/reports", reportRoutes);

app.use("/api/assignments", assignmentRoutes);

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});