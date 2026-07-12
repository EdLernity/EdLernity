const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  listPrograms,
  listTrainers,
  listEnrollments,
  assignTrainer,
  assignStudent,
  promoteUserRole,
  issueInternshipCertificate,
} = require("../controllers/internshipAdminController");

const router = express.Router();
const staff = roleMiddleware("admin", "manager");
const adminOnly = roleMiddleware("admin");

router.use(authMiddleware);

router.get("/programs", staff, listPrograms);
router.get("/trainers", staff, listTrainers);
router.get("/enrollments", staff, listEnrollments);
router.post("/issue-certificate", staff, issueInternshipCertificate);
router.post("/assign-trainer", adminOnly, assignTrainer);
router.post("/assign-student", adminOnly, assignStudent);
router.post("/set-role", adminOnly, promoteUserRole);

module.exports = router;
