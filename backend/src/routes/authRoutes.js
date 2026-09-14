const express = require("express");

const {
  register,
  login,
  forgotPassword,
  resetPassword
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");



const router = express.Router();


// ==========================
// PUBLIC ROUTES
// ==========================

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Forgot Password
router.post("/forgot-password", forgotPassword);

// Reset Password
router.post("/reset-password/:token", resetPassword);




// ==========================
// PROTECTED TEST ROUTES
// ==========================

// Any logged-in user
router.get("/profile", protect, (req, res) => {

  res.json({
    success: true,
    message: "You are authenticated",
    user: req.user
  });

});


// Only Admin
router.get(
  "/admin",
  protect,
  authorizeRoles("Admin"),
  (req, res) => {

    res.json({
      success: true,
      message: "Welcome Admin"
    });

  }
);


// Admin + Teacher
router.get(
  "/teacher",
  protect,
  authorizeRoles("Admin", "Teacher"),
  (req, res) => {

    res.json({
      success: true,
      message: "Admin or Teacher access granted"
    });

  }
);


// Admin + Teacher + CR
router.get(
  "/attendance",
  protect,
  authorizeRoles("Admin", "Teacher", "CR"),
  (req, res) => {

    res.json({
      success: true,
      message: "Attendance access granted"
    });

  }
);


module.exports = router;


