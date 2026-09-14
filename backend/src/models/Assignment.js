// const mongoose = require("mongoose");

// const assignmentSchema = new mongoose.Schema(
//     {
//         title: {
//             type: String,
//             required: true,
//             trim: true
//         },

//         description: {
//             type: String,
//             trim: true
//         },

//         class: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Class",
//             required: true
//         },

//         subject: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Subject",
//             required: true
//         },

//         createdBy: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User",
//             required: true
//         },

//         deadline: {
//             type: Date,
//             required: true
//         },

//         isActive: {
//             type: Boolean,
//             default: true
//         }
//     },
//     {
//         timestamps: true
//     }
// );

// module.exports = mongoose.model("Assignment", assignmentSchema);



const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    // Assignment title
    title: {
      type: String,
      required: true,
      trim: true
    },

    // Assignment description
    description: {
      type: String,
      trim: true
    },

    // Which class
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true
    },

    // Which subject
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true
    },

    // Submission deadline
    dueDate: {
      type: Date,
      required: true
    },

    // Total marks
    totalMarks: {
      type: Number,
      default: 100,
      min: 0
    },

    // Teacher/Admin who created it
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // Student submission status
    submissions: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
          required: true
        },

        status: {
          type: String,
          enum: ["Not Submitted", "Submitted", "Late"],
          default: "Not Submitted"
        },

        submittedAt: {
          type: Date,
          default: null
        },

        marks: {
          type: Number,
          default: null
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Assignment", assignmentSchema);