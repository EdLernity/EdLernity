const express = require("express");
const { EnrollCourses, getEnrollCoursesList, verify, getEnrolledCoursesList, getCertificationCoursesList, getInternshipEnrollments } = require("../controllers/controller.enroll.js");


const authMiddleware = require("../middleware/authMiddleware.js");
const enrollment = express.Router();

enrollment.get("/fetch", authMiddleware, getEnrollCoursesList);
enrollment.get("/check-enrollment", authMiddleware, getEnrolledCoursesList);
enrollment.get("/internships", authMiddleware, getInternshipEnrollments);
const { getStudentDashboard } = require("../controllers/internshipContentController");
enrollment.get("/internships/:slug/dashboard", authMiddleware, getStudentDashboard);
enrollment.post("/add", authMiddleware, EnrollCourses);
enrollment.post("/verify", authMiddleware, verify);
enrollment.get("/getCertificationCoursesList/:courseId", authMiddleware,getCertificationCoursesList);


module.exports = enrollment;
