const express = require("express");

const {
  getAttendanceReport
} = require("../controllers/reportController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


router.get(
  "/attendance",
  protect,
  authorizeRoles("Admin", "Teacher", "CR"),
  getAttendanceReport
);


module.exports = router;