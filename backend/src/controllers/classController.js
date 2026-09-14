// const Class = require("../models/Class");


// // ==========================================
// // CREATE CLASS
// // ==========================================

// const createClass = async (req, res) => {
//   try {

//     const { name, section, year } = req.body;

//     if (!name) {
//       return res.status(400).json({
//         success: false,
//         message: "Class name is required"
//       });
//     }


//     const existingClass = await Class.findOne({
//       name,
//       section
//     });


//     if (existingClass) {
//       return res.status(409).json({
//         success: false,
//         message: "Class already exists"
//       });
//     }


//     const newClass = await Class.create({
//       name,
//       section,
//       year
//     });


//     res.status(201).json({
//       success: true,
//       message: "Class created successfully",
//       class: newClass
//     });

//   } catch (error) {

//     console.error("Create Class Error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Server error"
//     });
//   }
// };


// // ==========================================
// // GET ALL CLASSES
// // ==========================================

// const getClasses = async (req, res) => {
//   try {

//     const classes = await Class.find()
//       .sort({ name: 1 });


//     res.status(200).json({
//       success: true,
//       count: classes.length,
//       classes
//     });

//   } catch (error) {

//     console.error("Get Classes Error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Server error"
//     });
//   }
// };


// module.exports = {
//   createClass,
//   getClasses
// };


const Class = require("../models/Class");

// ==========================================
// CREATE CLASS
// ==========================================

const createClass = async (req, res) => {
  try {

    const {
      name,
      section,
      year,
      academicYear
    } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Class name is required"
      });
    }

    if (!year) {
      return res.status(400).json({
        success: false,
        message: "Year is required"
      });
    }

    if (!academicYear) {
      return res.status(400).json({
        success: false,
        message: "Academic year is required"
      });
    }

    // Check duplicate class
    const existingClass = await Class.findOne({
      name,
      section
    });

    if (existingClass) {
      return res.status(409).json({
        success: false,
        message: "Class already exists"
      });
    }

    // Create class
    const newClass = await Class.create({
      name,
      section,
      year,
      academicYear
    });

    res.status(201).json({
      success: true,
      message: "Class created successfully",
      class: newClass
    });

  } catch (error) {

    console.error("Create Class Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


// ==========================================
// GET ALL CLASSES
// ==========================================

const getClasses = async (req, res) => {
  try {

    const classes = await Class.find()
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: classes.length,
      classes
    });

  } catch (error) {

    console.error("Get Classes Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};


module.exports = {
  createClass,
  getClasses
};