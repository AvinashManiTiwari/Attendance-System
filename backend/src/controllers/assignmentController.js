const Assignment = require("../models/Assignment");
const Class = require("../models/Class");
const Subject = require("../models/Subject");
const Student = require("../models/Student");


// ==========================================
// CREATE ASSIGNMENT
// ==========================================

const createAssignment = async (req, res) => {
  try {
    const {
      title,
      description,
      classId,
      subjectId,
      dueDate,
      totalMarks
    } = req.body;

    // Required fields
    if (!title || !classId || !subjectId || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "Title, class, subject and due date are required"
      });
    }

    // Check class
    const classExists = await Class.findById(classId);

    if (!classExists) {
      return res.status(404).json({
        success: false,
        message: "Class not found"
      });
    }

    // Check subject
    const subjectExists = await Subject.findById(subjectId);

    if (!subjectExists) {
      return res.status(404).json({
        success: false,
        message: "Subject not found"
      });
    }

    // Make sure subject belongs to selected class
    if (subjectExists.class.toString() !== classId.toString()) {
      return res.status(400).json({
        success: false,
        message: "Subject does not belong to selected class"
      });
    }

    // Get students of selected class
    const students = await Student.find({
      class: classId
    });

    // Create submission status for every student
    const submissions = students.map((student) => ({
      student: student._id,
      status: "Not Submitted"
    }));

    // Create assignment
    const assignment = await Assignment.create({
      title,
      description,
      class: classId,
      subject: subjectId,
      dueDate,
      totalMarks: totalMarks || 100,
      createdBy: req.user.userId,
      submissions
    });

    res.status(201).json({
      success: true,
      message: "Assignment created successfully",
      assignment
    });

  } catch (error) {
    console.error("Create Assignment Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


// ==========================================
// GET ASSIGNMENTS
// ==========================================

const getAssignments = async (req, res) => {
  try {
    const { classId, subjectId } = req.query;

    const filter = {};

    if (classId) {
      filter.class = classId;
    }

    if (subjectId) {
      filter.subject = subjectId;
    }

    const assignments = await Assignment.find(filter)
      .populate("class", "name section year academicYear")
      .populate("subject", "name code")
      .populate("createdBy", "name email")
      .populate("submissions.student", "name rollNumber")
      .sort({ dueDate: 1 });

    res.status(200).json({
      success: true,
      count: assignments.length,
      assignments
    });

  } catch (error) {
    console.error("Get Assignments Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


// ==========================================
// UPDATE SUBMISSION STATUS
// ==========================================

const updateSubmissionStatus = async (req, res) => {
  try {
    const { assignmentId, studentId } = req.params;
    const { status, marks } = req.body;

    // Validate status
    const validStatuses = [
      "Not Submitted",
      "Submitted",
      "Late"
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid submission status"
      });
    }

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found"
      });
    }

    const submission = assignment.submissions.find(
      (item) => item.student.toString() === studentId.toString()
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Student not found in this assignment"
      });
    }

    submission.status = status;

    if (status === "Submitted" || status === "Late") {
      submission.submittedAt = new Date();
    } else {
      submission.submittedAt = null;
    }

    if (marks !== undefined) {
      submission.marks = marks;
    }

    await assignment.save();

    res.status(200).json({
      success: true,
      message: "Submission status updated successfully",
      assignment
    });

  } catch (error) {
    console.error("Update Submission Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


module.exports = {
  createAssignment,
  getAssignments,
  updateSubmissionStatus
};