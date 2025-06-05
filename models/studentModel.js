const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  middleName: { type: String, trim: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true },
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  enrollmentNumber: { type: String, unique: true, required: true },
  course: { type: String, required: true },
  yearOfAdmission: { type: Number, required: true },
  currentYear: { type: Number, required: true },
  section: String,
  guardianName: String,
  guardianContact: String,
  bloodGroup: { type: String, enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] },
  nationality: String,
  aadharNumber: { type: String, unique: true },
  status: {
    type: String,
    enum: ["active", "inactive", "graduated", "suspended"],
    default: "active",
  },
  trash: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true // This will add createdAt and updatedAt automatically
});

const Student = mongoose.model("studentModel", studentSchema);

module.exports = Student;
