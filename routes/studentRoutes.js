const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

// Import controller functions
const {
  getAllStudentDetails,
  getAllStudentDetailsTesting,
  addStudent,
  updateStudentPUT,
  updateStudentPATCH
} = require("../controllers/studentController");

// ✨ Common validation rules (for POST and PUT)
const studentValidationRules = [
  body("firstName").notEmpty().withMessage("First name is required"),
  body("lastName").notEmpty().withMessage("Last name is required"),
  body("dateOfBirth").isDate().withMessage("Valid date of birth is required"),
  body("gender").isIn(["Male", "Female", "Other"]).withMessage("Valid gender is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("phone").matches(/^[6-9]\d{9}$/).withMessage("Valid 10-digit Indian phone number is required"),
  body("enrollmentNumber").notEmpty().withMessage("Enrollment number is required"),
  body("course").notEmpty().withMessage("Course is required"),
  body("yearOfAdmission").isInt({ min: 2000 }).withMessage("Valid year of admission is required"),
  body("currentYear").isInt({ min: 1, max: 6 }).withMessage("Current year must be between 1 and 6"),
  body("bloodGroup").optional().isIn(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  body("aadharNumber").optional().isLength({ min: 12, max: 12 }).withMessage("Aadhar must be 12 digits")
];

// 🧪 GET: All students
router.get("/", getAllStudentDetails);

// 🧪 GET: Test route
router.get("/testing", getAllStudentDetailsTesting);

// ➕ POST: Add student
router.post("/add", studentValidationRules, addStudent);

// ✏️ PUT: Full update (requires all fields)
router.put("/:id", studentValidationRules, updateStudentPUT);

// 🔧 PATCH: Partial update (validate only if field is present)
const patchValidationRules = [
  body("email").optional().isEmail().withMessage("Valid email is required"),
  body("phone").optional().matches(/^[6-9]\d{9}$/).withMessage("Valid phone number"),
  body("aadharNumber").optional().isLength({ min: 12, max: 12 }).withMessage("Aadhar must be 12 digits"),
  body("gender").optional().isIn(["Male", "Female", "Other"]),
  body("bloodGroup").optional().isIn(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  body("yearOfAdmission").optional().isInt({ min: 2000 }),
  body("currentYear").optional().isInt({ min: 1, max: 6 }),
  body("dateOfBirth").optional().isDate()
];

// ✏️ PATCH: Partial update
router.patch("/:id", patchValidationRules, updateStudentPATCH);

module.exports = router;
