const { validationResult, body } = require("express-validator");
const Student = require("../models/studentModel");

const getAllStudentDetails = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const skip = (page - 1) * limit;

    // Base filters
    const filter = {
      trash: false,
      status: "active",
      ...(req.query["address.state"] && { "address.state": req.query["address.state"] }),
      ...(req.query["address.city"] && { "address.city": req.query["address.city"] }),
      ...(req.query["address.postalCode"] && { "address.postalCode": req.query["address.postalCode"] }),
    };

    // Allowed top-level fields to filter directly
    const directFilters = ["gender", "class", "course"];

    // Allowed address subfields
    const addressFields = ["state", "city", "postalCode"];

    // Add direct filters with case-insensitive partial matching for strings
    directFilters.forEach((key) => {
      if (req.query[key]) {
        filter[key] = new RegExp(req.query[key], "i"); // partial & case-insensitive
      }
    });

    // Add nested address filters
    addressFields.forEach((field) => {
      if (req.query[field]) {
        filter[`address.${field}`] = new RegExp(req.query[field], "i");
      }
    });

    // Fetch students with pagination
    const students = await Student.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Student.countDocuments(filter);

    res.status(200).json({
      status: 200,
      message: students.length ? "Students fetched successfully" : "No students found for given criteria",
      total: students.length ? total : 0,
      page,
      limit,
      data: students.length ? students : null, // or use "No records available"
    });
  } catch (error) {
    console.error("Error fetching student details:", error.message);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getAllStudentDetailsTesting = async (req, res) => {
  // Your testing logic here
  res.send("Testing Student Details");
};

const addStudent = async (req, res) => {
  // Validate inputs first
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: 422,
      message: "Validation failed",
      errors: errors.array()
    });
  }

  try {
    const {
      firstName, lastName, middleName = "", dateOfBirth, gender,
      email, phone, address, enrollmentNumber, course,
      yearOfAdmission, currentYear, section = "",
      guardianName = "", guardianContact, bloodGroup,
      nationality = "", aadharNumber = null
    } = req.body;

    // Utility to normalize values
    const normalize = (value, toLower = false) =>
      typeof value === 'string' ? (toLower ? value.toLowerCase().trim() : value.trim()) : value;

    // Normalized fields
    const normalizedData = {
      email: normalize(email, true),
      phone: normalize(phone),
      enrollmentNumber: normalize(enrollmentNumber),
      aadharNumber: normalize(aadharNumber),
    };

    // Build dynamic duplicate query
    const duplicateQuery = {
      $or: [
        { email: normalizedData.email },
        { phone: normalizedData.phone },
        { enrollmentNumber: normalizedData.enrollmentNumber },
        ...(normalizedData.aadharNumber ? [{ aadharNumber: normalizedData.aadharNumber }] : [])
      ]
    };

    const existingStudent = await Student.findOne(duplicateQuery);

    if (existingStudent) {
      const duplicateFields = [];
      for (const [field, label] of Object.entries({
        email: "Email",
        phone: "Phone",
        enrollmentNumber: "Enrollment Number",
        aadharNumber: "Aadhar Number"
      })) {
        if (
          normalizedData[field] &&
          existingStudent[field] === normalizedData[field]
        ) {
          duplicateFields.push(label);
        }
      }

      return res.status(400).json({
        status: 400,
        message: `Student with this ${duplicateFields.join(", ")} already exists.`
      });
    }

    const newStudent = new Student({
      firstName: normalize(firstName),
      lastName: normalize(lastName),
      middleName: normalize(middleName),
      dateOfBirth,
      gender,
      email: normalizedData.email,
      phone: normalizedData.phone,
      address,
      enrollmentNumber: normalizedData.enrollmentNumber,
      course: normalize(course),
      yearOfAdmission,
      currentYear,
      section: normalize(section),
      guardianName: normalize(guardianName),
      guardianContact,
      bloodGroup,
      nationality: normalize(nationality),
      aadharNumber: normalizedData.aadharNumber
    });

    await newStudent.save();

    return res.status(201).json({
      status: 201,
      message: "Student added successfully",
      data: newStudent
    });

  } catch (error) {
    console.error("Error adding student:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message || error
    });
  }
};


const updateStudentPUT = async (req, res) => {
  const { id } = req.params;

  // Validate inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: 422,
      message: "Validation failed",
      errors: errors.array()
    });
  }

  try {
    const {
      firstName, lastName, middleName = "", dateOfBirth, gender,
      email, phone, address, enrollmentNumber, course,
      yearOfAdmission, currentYear, section = "",
      guardianName = "", guardianContact, bloodGroup,
      nationality = "", aadharNumber = null
    } = req.body;

    const normalize = (val, lower = false) =>
      typeof val === "string" ? (lower ? val.toLowerCase().trim() : val.trim()) : val;

    const normalizedData = {
      email: normalize(email, true),
      phone: normalize(phone),
      enrollmentNumber: normalize(enrollmentNumber),
      aadharNumber: normalize(aadharNumber)
    };

    // Check if another student exists with same unique fields
    const existingStudent = await Student.findOne({
      _id: { $ne: id },
      $or: [
        { email: normalizedData.email },
        { phone: normalizedData.phone },
        { enrollmentNumber: normalizedData.enrollmentNumber },
        ...(normalizedData.aadharNumber ? [{ aadharNumber: normalizedData.aadharNumber }] : [])
      ]
    });

    if (existingStudent) {
      return res.status(400).json({
        status: 400,
        message: "Duplicate entry: Email, Phone, Enrollment Number or Aadhar Number already exists."
      });
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      {
        firstName: normalize(firstName),
        lastName: normalize(lastName),
        middleName: normalize(middleName),
        dateOfBirth,
        gender,
        email: normalizedData.email,
        phone: normalizedData.phone,
        address,
        enrollmentNumber: normalizedData.enrollmentNumber,
        course: normalize(course),
        yearOfAdmission,
        currentYear,
        section: normalize(section),
        guardianName: normalize(guardianName),
        guardianContact,
        bloodGroup,
        nationality: normalize(nationality),
        aadharNumber: normalizedData.aadharNumber
      },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ status: 404, message: "Student not found" });
    }

    return res.status(200).json({
      status: 200,
      message: "Student updated successfully",
      data: updatedStudent
    });

  } catch (error) {
    console.error("Error updating student:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message || error
    });
  }
};


const updateStudentPATCH = async (req, res) => {
  const { id } = req.params;

  // Validate inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: 422,
      message: "Validation failed",
      errors: errors.array()
    });
  }

  try {
    const updates = req.body;

    const normalize = (val, lower = false) =>
      typeof val === "string" ? (lower ? val.toLowerCase().trim() : val.trim()) : val;

    // Normalize fields if they exist
    const normalizedData = {};
    if (updates.email) normalizedData.email = normalize(updates.email, true);
    if (updates.phone) normalizedData.phone = normalize(updates.phone);
    if (updates.enrollmentNumber) normalizedData.enrollmentNumber = normalize(updates.enrollmentNumber);
    if (updates.aadharNumber) normalizedData.aadharNumber = normalize(updates.aadharNumber);

    // Duplication check for updated fields
    const duplicateQuery = {
      _id: { $ne: id },
      $or: Object.entries(normalizedData).map(([key, val]) => ({ [key]: val }))
    };

    if (duplicateQuery.$or.length > 0) {
      const existing = await Student.findOne(duplicateQuery);
      if (existing) {
        return res.status(400).json({
          status: 400,
          message: "Duplicate entry detected in updated fields."
        });
      }
    }

    // Normalize remaining fields
    const finalUpdates = {};
    for (let key in updates) {
      if (typeof updates[key] === 'string') {
        finalUpdates[key] = normalize(updates[key], key === "email");
      } else {
        finalUpdates[key] = updates[key];
      }
    }

    const updatedStudent = await Student.findByIdAndUpdate(id, finalUpdates, {
      new: true,
      runValidators: true
    });

    if (!updatedStudent) {
      return res.status(404).json({ status: 404, message: "Student not found" });
    }

    return res.status(200).json({
      status: 200,
      message: "Student updated successfully",
      data: updatedStudent
    });

  } catch (error) {
    console.error("Error updating student:", error);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: error.message || error
    });
  }
};


module.exports = {
  getAllStudentDetails,
  getAllStudentDetailsTesting,
  addStudent,
  updateStudentPUT,
  updateStudentPATCH
};

