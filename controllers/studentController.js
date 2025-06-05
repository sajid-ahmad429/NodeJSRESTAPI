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

module.exports = {
    getAllStudentDetails,
    getAllStudentDetailsTesting
};
