require("dotenv").config;
const express = require("express");
const app = express(); // FIXED HERE ✅
const connectDB = require("./config/database");
const PORT = process.env.PORT || 5000;

// Routes
const studentRoutes = require("./routes/studentRoutes");
app.use("/api/students", studentRoutes);
app.get("/", (req, res) => {
    res.send("Hello World...!");
});

const start = async () => {
    try {
        await connectDB(process.env.MONGODB_URI);
        app.listen(PORT, () => {
            console.log(`Yes I am connected with port ${PORT}`); // Also added console.log ✅
        });
    } catch (error) {
        console.log(error);
    }
}

start();
