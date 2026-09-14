const mongoose = require("mongoose");

const assignmentSubmissionSchema = new mongoose.Schema(
    {
        assignment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Assignment",
            required: true
        },

        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },

        status: {
            type: String,
            enum: ["Submitted", "Not Submitted"],
            default: "Not Submitted"
        },

        submittedAt: {
            type: Date
        },

        submissionLink: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

assignmentSubmissionSchema.index(
    { assignment: 1, student: 1 },
    { unique: true }
);

module.exports = mongoose.model(
    "AssignmentSubmission",
    assignmentSubmissionSchema
);