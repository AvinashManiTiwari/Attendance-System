const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const Class = require("../models/Class");
const Subject = require("../models/Subject");


// ==========================================
// HELPER: GET DATE IN INDIA
// ==========================================

const getTodayIST = () => {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata"
  }).format(new Date());
};


// ==========================================
// MARK / UPDATE ATTENDANCE
// ==========================================

const markAttendance = async (req, res) => {
  try {
    const {
      date,
      classId,
      subjectId,
      records
    } = req.body;


    // --------------------------------------
    // Validate input
    // --------------------------------------

    if (!date || !classId || !subjectId || !records) {
      return res.status(400).json({
        success: false,
        message: "Date, class, subject and records are required"
      });
    }


    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Attendance records are required"
      });
    }


    // --------------------------------------
    // Validate date
    // --------------------------------------

    const attendanceDate = new Date(date);

    if (isNaN(attendanceDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date"
      });
    }


    // --------------------------------------
    // CR restriction
    // --------------------------------------

    const requestedDate = date.slice(0, 10);
    const todayIST = getTodayIST();

    if (
      req.user.role === "CR" &&
      requestedDate !== todayIST
    ) {
      return res.status(403).json({
        success: false,
        message: "CR can only mark attendance for today"
      });
    }


    // --------------------------------------
    // Check Class
    // --------------------------------------

    const existingClass = await Class.findById(classId);

    if (!existingClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found"
      });
    }


    // --------------------------------------
    // Check Subject
    // --------------------------------------

    const existingSubject = await Subject.findById(subjectId);

    if (!existingSubject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found"
      });
    }


    // --------------------------------------
    // Validate records
    // --------------------------------------

    for (const record of records) {

      if (!record.studentId || !record.status) {
        return res.status(400).json({
          success: false,
          message: "Each record requires studentId and status"
        });
      }


      if (!["Present", "Absent"].includes(record.status)) {
        return res.status(400).json({
          success: false,
          message: "Status must be Present or Absent"
        });
      }
    }


    // --------------------------------------
    // Check students
    // --------------------------------------

    const studentIds = records.map(
      record => record.studentId
    );

    const students = await Student.find({
      _id: { $in: studentIds },
      class: classId
    });


    if (students.length !== studentIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more students do not belong to this class"
      });
    }


    // --------------------------------------
    // Prepare records
    // --------------------------------------

    const attendanceRecords = records.map(record => ({
      student: record.studentId,
      status: record.status
    }));


    // --------------------------------------
    // Find existing attendance
    // --------------------------------------

    const existingAttendance = await Attendance.findOne({
      date: attendanceDate,
      class: classId,
      subject: subjectId
    });


    // --------------------------------------
    // UPDATE
    // --------------------------------------

    if (existingAttendance) {

      existingAttendance.records = attendanceRecords;

      existingAttendance.markedBy = req.user.userId;

      await existingAttendance.save();

      return res.status(200).json({
        success: true,
        message: "Attendance updated successfully",
        attendance: existingAttendance
      });
    }


    // --------------------------------------
    // CREATE
    // --------------------------------------

    const attendance = await Attendance.create({
      date: attendanceDate,
      class: classId,
      subject: subjectId,
      records: attendanceRecords,
      markedBy: req.user.userId
    });


    return res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      attendance
    });

  } catch (error) {

    console.error("Mark Attendance Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// ==========================================
// GET ATTENDANCE
// ==========================================

const getAttendance = async (req, res) => {
  try {

    const {
      date,
      classId,
      subjectId
    } = req.query;


    if (!date || !classId || !subjectId) {
      return res.status(400).json({
        success: false,
        message: "Date, classId and subjectId are required"
      });
    }


    const attendanceDate = new Date(date);

    if (isNaN(attendanceDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date"
      });
    }


    const attendance = await Attendance.findOne({
      date: attendanceDate,
      class: classId,
      subject: subjectId
    })
      .populate("records.student", "name rollNumber")
      .populate("class", "name")
      .populate("subject", "name")
      .populate("markedBy", "name email");


    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found"
      });
    }


    return res.status(200).json({
      success: true,
      attendance
    });

  } catch (error) {

    console.error("Get Attendance Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


module.exports = {
  markAttendance,
  getAttendance
};