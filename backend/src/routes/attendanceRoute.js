const express = require("express");

const {
  markAttendance,
  getAttendance
} = require("../controllers/attendanceController");

const protect = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// ==========================================
// MARK / UPDATE ATTENDANCE
// ==========================================

router.post(
  "/",
  protect,
  authorizeRoles("Admin", "Teacher", "CR"),
  markAttendance
);


// ==========================================
// GET ATTENDANCE
// ==========================================

router.get(
  "/",
  protect,
  authorizeRoles("Admin", "Teacher", "CR"),
  getAttendance
);


module.exports = router;