const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    role: {
      type: String,
      enum: ["Admin", "Teacher", "CR"],
      required: true
    },

    isActive: {
      type: Boolean,
      default: true
    },

    // Forgot Password fields
    resetPasswordToken: {
      type: String,
      default: null
    },

    resetPasswordExpire: {
      type: Date,
      default: null
    }

    
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);