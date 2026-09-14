const Student = require("../models/Student");
const Class = require("../models/Class");

// ==========================================
// ADD STUDENT
// ==========================================

const addStudent = async (req, res) => {
  try {
    const { name, rollNumber, email, classId } = req.body;

    // Check required fields
    if (!name || !rollNumber || !classId) {
      return res.status(400).json({
        success: false,
        message: "Name, roll number and class are required"
      });
    }

    // Check if class exists
    const existingClass = await Class.findById(classId);

    if (!existingClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found"
      });
    }

    // Check duplicate roll number in same class
    const existingStudent = await Student.findOne({
      rollNumber,
      class: classId
    });

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: "Student with this roll number already exists in this class"
      });
    }

    // Create student
    const student = await Student.create({
      name,
      rollNumber,
      email,
      class: classId
    });

    return res.status(201).json({
      success: true,
      message: "Student added successfully",
      student
    });

  } catch (error) {
    console.error("Add Student Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// ==========================================
// GET STUDENTS BY CLASS
// ==========================================

const getStudentsByClass = async (req, res) => {
  try {
    const { classId } = req.params;

    // Check class
    const existingClass = await Class.findById(classId);

    if (!existingClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found"
      });
    }

    // Get students
    const students = await Student.find({
      class: classId
    }).sort({
      rollNumber: 1
    });

    return res.status(200).json({
      success: true,
      count: students.length,
      students
    });

  } catch (error) {
    console.error("Get Students Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


module.exports = {
  addStudent,
  getStudentsByClass
};