// const getAllStudentDetails = async(req, res) => {
//     // Your logic here
//     res.status(200).json({
//         "status" : "200",
//         "message" : "Success",
//         "response" : "All Student Details",
//     })
//     // res.send("All Student Details");
// };
// const getStudentModel = require("../models/studentModel");
const Student = require("../models/studentModel");
// const getAllStudentDetails = async (req, res) => {
//     try {
//         // Fake student details
//         // const student = {
//         //     id: 1,
//         //     name: "Sajid Ahmad",
//         //     age: 16,
//         //     gender: "Male",
//         //     class: "10th Grade",
//         //     rollNumber: "STU2025001",
//         //     contact: "+91 98765 43210",
//         //     email: "sajid.ahmad@example.com"
//         // };

//         const student = getStudentModel.find({});
        
//         // Respond with success
//         res.status(200).json({
//             status: 200,
//             message: "Success",
//             data: {student}
//         });
//     } catch (error) {
//         console.error("Error fetching student details:", error.message);

//         res.status(500).json({
//             status: 500,
//             message: "Internal Server Error",
//             error: error.message
//         });
//     }
// };

const getAllStudentDetails = async (req, res) => {
    try {
        // Optional: Add pagination
        // const page = parseInt(req.query.page) || 1;
        // const limit = parseInt(req.query.limit) || 10;
        // const skip = (page - 1) * limit;

        // Fetch data from MongoDB
        // const students = await Student.find({ trash: false }).sort({ createdAt: -1 }).skip(skip).limit(limit);
        const students = await Student.find({ trash: false });

        // Count total documents
        // const total = await Student.countDocuments({ trash: false });

        // Respond with data
        res.status(200).json({
            status: 200,
            message: "Students fetched successfully",
            // total,
            // page,
            // limit,
            data: students
        });

    } catch (error) {
        console.error("Error fetching student details:", error.message);

        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

const getAllStudentDetailsTesting = async(req, res) => {
    // Your testing logic here
    res.send("Testing Student Details");
};

module.exports = {
    getAllStudentDetails,
    getAllStudentDetailsTesting
};


// const Student = require("../models/studentModel");

// const getAllStudentDetails = async (req, res) => {
//     try {

//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10;
//         const skip = (page - 1) * limit;

//         const students = await Student.find({ trash: false, status: "active", }).sort({ createdAt: -1 }).skip(skip).limit(limit);
//         const total = await Student.countDocuments({ trash: false, status: "active", });
//         // Respond with data
//         res.status(200).json({
//             status: 200,
//             message: "Students fetched successfully",
//             total,
//             page,
//             limit,
//             data: students
//         });

//     } catch (error) {
//         console.error("Error fetching student details:", error.message);

//         res.status(500).json({
//             status: 500,
//             message: "Internal Server Error",
//             error: error.message
//         });
//     }
// };

// const getAllStudentDetails = async (req, res) => {
//     try {
//         // Pagination
//         const page = Math.max(parseInt(req.query.page) || 1, 1);
//         let limit = Math.max(parseInt(req.query.limit) || 10, 1);
//         const MAX_LIMIT = 100;
//         limit = Math.min(limit, MAX_LIMIT);
//         const skip = (page - 1) * limit;

//         // Sorting
//         const sortBy = req.query.sortBy || "createdAt";
//         const sortOrder = req.query.sortOrder === "asc" ? 1 : -1; // default desc
//         const sortObj = { [sortBy]: sortOrder };

//         // Base filter (non-text)
//         const filter = {
//             trash: false,
//             status: "active",
//         };

//         // Allowed top-level fields for filtering with regex
//         const directFilters = ["gender", "class", "course"];

//         directFilters.forEach((key) => {
//             if (req.query[key]) {
//                 filter[key] = new RegExp(req.query[key], "i"); // partial & case-insensitive
//             }
//         });

//         // Address filters — expect query params like address.state, address.city, address.postalCode
//         const addressFields = ["state", "city", "postalCode"];
//         addressFields.forEach((field) => {
//             const key = `address.${field}`;
//             if (req.query[key]) {
//                 filter[key] = new RegExp(req.query[key], "i"); // partial & case-insensitive
//             }
//         });

//         // Fetch data with pagination & sorting
//         const studentsPromise = Student.find(filter)
//             .sort(sortObj)
//             .skip(skip)
//             .limit(limit);

//         const countPromise = Student.countDocuments(filter);

//         // Run queries in parallel
//         const [students, total] = await Promise.all([studentsPromise, countPromise]);

//         const totalPages = Math.ceil(total / limit);

//         res.status(200).json({
//             status: 200,
//             message: students.length
//                 ? "Students fetched successfully"
//                 : "No students found for given criteria",
//             total,
//             totalPages,
//             page,
//             limit,
//             data: students,
//         });
//     } catch (error) {
//         console.error("Error fetching student details:", error);
//         res.status(500).json({
//             status: 500,
//             message: "Internal Server Error",
//             error: error.message,
//         });
//     }
// };

// const getAllStudentDetails = async (req, res) => {
//     try {
//         // Pagination
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10;
//         const skip = (page - 1) * limit;

//         const query = {
//             trash: false,
//             status: "active",
//             ...(req.query.gender && { gender: req.query.gender }),
//             ...(req.query["address.state"] && { "address.state": req.query["address.state"] }),
//             ...(req.query["address.city"] && { "address.city": req.query["address.city"] }),
//             ...(req.query["address.postalCode"] && { "address.postalCode": req.query["address.postalCode"] }),
//             ...(req.query.class && { class: req.query.class }),
//             ...(req.query.course && { course: req.query.course })
//         };

//         // Fetch filtered & paginated data
//         const students = await Student.find(query)
//             .sort({ createdAt: -1 })
//             .skip(skip)
//             .limit(limit);

//         const total = await Student.countDocuments(query);

//         res.status(200).json({
//             status: 200,
//             message: "Students fetched successfully",
//             total,
//             page,
//             limit,
//             data: students
//         });

//     } catch (error) {
//         console.error("Error fetching student details:", error.message);

//         res.status(500).json({
//             status: 500,
//             message: "Internal Server Error",
//             error: error.message
//         });
//     }
// };
