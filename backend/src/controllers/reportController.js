const Attendance = require("../models/Attendance");
const Student = require("../models/Student");


// ==========================================
// ATTENDANCE REPORT
// ==========================================

const getAttendanceReport = async (req, res) => {
  try {

    const {
      classId,
      subjectId,
      startDate,
      endDate
    } = req.query;


    if (!classId || !subjectId) {
      return res.status(400).json({
        success: false,
        message: "classId and subjectId are required"
      });
    }


    // --------------------------------------
    // Date filter
    // --------------------------------------

    const attendanceFilter = {
      class: classId,
      subject: subjectId
    };


    if (startDate || endDate) {

      attendanceFilter.date = {};

      if (startDate) {
        attendanceFilter.date.$gte = new Date(startDate);
      }

      if (endDate) {
        const end = new Date(endDate);

        end.setHours(23, 59, 59, 999);

        attendanceFilter.date.$lte = end;
      }
    }


    // --------------------------------------
    // Get attendance
    // --------------------------------------

    const attendanceRecords = await Attendance.find(
      attendanceFilter
    ).populate(
      "records.student",
      "name rollNumber"
    );


    // --------------------------------------
    // Get students
    // --------------------------------------

    const students = await Student.find({
      class: classId
    }).sort({
      rollNumber: 1
    });


    // --------------------------------------
    // Calculate report
    // --------------------------------------

    const report = students.map(student => {

      let present = 0;
      let absent = 0;


      attendanceRecords.forEach(attendance => {

        const record = attendance.records.find(
          item =>
            item.student &&
            item.student._id.toString() ===
            student._id.toString()
        );


        if (record) {

          if (record.status === "Present") {
            present++;
          }

          if (record.status === "Absent") {
            absent++;
          }

        }

      });


      const total = present + absent;


      const percentage =
        total === 0
          ? 0
          : Number(((present / total) * 100).toFixed(2));


      return {
        studentId: student._id,
        name: student.name,
        rollNumber: student.rollNumber,
        present,
        absent,
        total,
        percentage
      };

    });


    // --------------------------------------
    // Overall percentage
    // --------------------------------------

    let totalPresent = 0;
    let totalAttendance = 0;


    report.forEach(student => {
      totalPresent += student.present;
      totalAttendance += student.total;
    });


    const overallPercentage =
      totalAttendance === 0
        ? 0
        : Number(
            ((totalPresent / totalAttendance) * 100)
              .toFixed(2)
          );


    res.status(200).json({
      success: true,
      filters: {
        classId,
        subjectId,
        startDate: startDate || null,
        endDate: endDate || null
      },
      overallPercentage,
      report
    });

  } catch (error) {

    console.error("Attendance Report Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


module.exports = {
  getAttendanceReport
};