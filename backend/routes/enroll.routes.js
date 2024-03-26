const express = require("express");
const { EnrollCourses, getEnrollCoursesList, verify, getEnrolledCoursesList } = require("../controllers/controller.enroll.js");


const authMiddleware = require("../middleware/authMiddleware.js");
const enrollment = express.Router();

enrollment.get("/fetch", authMiddleware, getEnrollCoursesList);
enrollment.get("/check-enrollment", authMiddleware, getEnrolledCoursesList);
enrollment.post("/add", authMiddleware, EnrollCourses);
enrollment.post("/verify", authMiddleware, verify);

module.exports = enrollment;
