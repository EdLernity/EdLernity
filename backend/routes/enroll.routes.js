const express = require("express");
const { EnrollCourses, getEnrollCoursesList, verify, getEnrolledCoursesList, getCertificationCoursesList, getInternshipEnrollments } = require("../controllers/controller.enroll.js");


const authMiddleware = require("../middleware/authMiddleware.js");
const enrollment = express.Router();

enrollment.get("/fetch", authMiddleware, getEnrollCoursesList);
enrollment.get("/check-enrollment", authMiddleware, getEnrolledCoursesList);
enrollment.get("/internships", authMiddleware, getInternshipEnrollments);
const {
  getStudentDashboard,
  submitClassAssignment,
  submitProjectGithub,
  markLiveClassAttendance,
  getStudentCertificatePdf,
} = require("../controllers/internshipContentController");
enrollment.get("/internships/:slug/dashboard", authMiddleware, getStudentDashboard);
enrollment.get(
  "/internships/:slug/certificate/pdf",
  authMiddleware,
  getStudentCertificatePdf
);
enrollment.post(
  "/internships/:slug/assignments/:classId/submit",
  authMiddleware,
  submitClassAssignment
);
enrollment.post(
  "/internships/:slug/projects/:weekIndex/submit",
  authMiddleware,
  submitProjectGithub
);
enrollment.post(
  "/internships/:slug/classes/:classId/attend",
  authMiddleware,
  markLiveClassAttendance
);
enrollment.post("/add", authMiddleware, EnrollCourses);
enrollment.post("/verify", authMiddleware, verify);
enrollment.get("/getCertificationCoursesList/:courseId", authMiddleware,getCertificationCoursesList);


module.exports = enrollment;
