require('dotenv').config();  // Load env variables from .env file
const mongoose = require("mongoose");

// Use environment variables instead for security in production
// const uri = process.env.MONGODB_URI;

// const connectDB = (uri) => {
//     return mongoose.connect(uri, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     });
// };

const connectDB = (uri) => {
    return mongoose.connect(uri);
};

// Optional: Test connection
// connectDB()
//     .then(() => console.log("MongoDB connected successfully"))
//     .catch(err => console.error("MongoDB connection error:", err));

module.exports = connectDB;
