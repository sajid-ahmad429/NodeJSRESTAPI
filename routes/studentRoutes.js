const express = require("express");
const router = express.Router();

// Import controller functions
const {
    getAllStudentDetails,
    getAllStudentDetailsTesting
} = require("../controllers/studentController"); // Adjust the path as needed

// @route   GET /api/students/
// @desc    Fetch all student details
router.get("/", getAllStudentDetails);

// @route   GET /api/students/testing
// @desc    Testing route for student details
router.get("/testing", getAllStudentDetailsTesting);

module.exports = router;
