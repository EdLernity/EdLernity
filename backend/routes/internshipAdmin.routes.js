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

router.use(authMiddleware, roleMiddleware("admin"));

router.get("/programs", listPrograms);
router.get("/trainers", listTrainers);
router.get("/enrollments", listEnrollments);
router.post("/assign-trainer", assignTrainer);
router.post("/assign-student", assignStudent);
router.post("/set-role", promoteUserRole);
router.post("/issue-certificate", issueInternshipCertificate);

module.exports = router;
