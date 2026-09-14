const express = require("express");

const {
  createSubject,
  getSubjectsByClass
} = require("../controllers/subjectController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// Admin creates subject
router.post(
  "/",
  protect,
  authorizeRoles("Admin","Teacher"),
  createSubject
);


// Get subjects
router.get(
  "/class/:classId",
  protect,
  authorizeRoles("Admin", "Teacher", "CR"),
  getSubjectsByClass
);


module.exports = router;