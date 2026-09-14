const express = require("express");
// const router = express.Router();

const {
  createClass,
  getClasses
} = require("../controllers/classController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// Admin creates class
router.post(
  "/",
  protect,
  authorizeRoles("Admin", "Teacher"),
  createClass
);


// All authenticated users can view classes
router.get(
  "/",
  protect,
  authorizeRoles("Admin", "Teacher", "CR"),
  getClasses
);


module.exports = router;