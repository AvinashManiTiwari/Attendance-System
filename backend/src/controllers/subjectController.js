const Subject = require("../models/Subject");
const Class = require("../models/Class");


// ==========================================
// CREATE SUBJECT
// ==========================================

const createSubject = async (req, res) => {
  try {

    const {
      name,
      code,
      classId
    } = req.body;


    if (!name || !classId) {
      return res.status(400).json({
        success: false,
        message: "Subject name and class are required"
      });
    }


    const existingClass = await Class.findById(classId);

    if (!existingClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found"
      });
    }


    const existingSubject = await Subject.findOne({
      name,
      class: classId
    });


    if (existingSubject) {
      return res.status(409).json({
        success: false,
        message: "Subject already exists in this class"
      });
    }


    const subject = await Subject.create({
      name,
      code,
      class: classId
    });


    res.status(201).json({
      success: true,
      message: "Subject created successfully",
      subject
    });

  } catch (error) {

    console.error("Create Subject Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// ==========================================
// GET SUBJECTS BY CLASS
// ==========================================

const getSubjectsByClass = async (req, res) => {
  try {

    const { classId } = req.params;


    const subjects = await Subject.find({
      class: classId
    }).sort({
      name: 1
    });


    res.status(200).json({
      success: true,
      count: subjects.length,
      subjects
    });

  } catch (error) {

    console.error("Get Subjects Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


module.exports = {
  createSubject,
  getSubjectsByClass
};