// const express = require("express");

// const router = express.Router();

// const {
//   createAssignment,
//   getAssignments,
//   updateSubmissionStatus
// } = require("../controllers/assignmentController");

// const {
//   protect
// } = require("../middleware/authMiddleware");


// const authorizeRoles = require("../middleware/roleMiddleware");

// // Create assignment
// router.post(
//   "/",
//   protect,
//   authorizeRoles("Admin", "Teacher"),
//   createAssignment
// );


// // Get assignments
// router.get(
//   "/",
//   protect,
//   authorizeRoles("Admin", "Teacher"),
//   getAssignments
// );


// // Update student submission status
// router.patch(
//   "/:assignmentId/student/:studentId",
//   protect,
//   authorizeRoles("Admin", "Teacher"),
//   updateSubmissionStatus
// );


// module.exports = router;



const express = require("express");

const router = express.Router();

const {
  createAssignment,
  getAssignments,
  updateSubmissionStatus
} = require("../controllers/assignmentController");

const protect = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");

router.post(
  "/",
  protect,
  authorizeRoles("Admin", "Teacher"),
  createAssignment
);


router.get(
  "/",
  protect,
  authorizeRoles("Admin", "Teacher"),
  getAssignments
);


router.patch(
  "/:assignmentId/student/:studentId",
  protect,
  authorizeRoles("Admin", "Teacher"),
  updateSubmissionStatus
);


module.exports = router;