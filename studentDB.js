require("dotenv").config();  // <-- Corrected here
const connectDB = require("./config/database");
const studentModel = require("./models/studentModel"); 
const getStudentDetails = require("./studentDetails.json");


const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    await studentModel.insertMany(getStudentDetails);
    // console.log("Success");
    process.exit(0);
  } catch (error) {   
    console.error(error);
    process.exit(1);
  }
};

start();
