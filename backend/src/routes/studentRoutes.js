const express = require("express");

const {
  addStudent,
  getStudentsByClass
} = require("../controllers/studentController");

const protect = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// ==========================================
// ADD STUDENT
// Admin and Teacher
// ==========================================

router.post(
  "/",
  protect,
  authorizeRoles("Admin", "Teacher"),
  addStudent
);


// ==========================================
// GET STUDENTS BY CLASS
// Admin, Teacher and CR
// ==========================================

router.get(
  "/class/:classId",
  protect,
  authorizeRoles("Admin", "Teacher", "CR"),
  getStudentsByClass
);


module.exports = router;