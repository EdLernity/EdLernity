const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  getMyPrograms,
  getMyStudents,
  getProgramConfig,
  updateProgramConfig,
  generateClassQuestions,
  getProgramProgress,
  getAssessments,
  getAssessmentDetail,
  getProjectAssessments,
  reviewProjectSubmission,
  completeInternship,
  completeInternshipBulk,
} = require("../controllers/internshipTrainerController");

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 12 * 1024 * 1024 },
});

router.use(authMiddleware, roleMiddleware("trainer", "admin"));

router.get("/programs", getMyPrograms);
router.get("/assessments", getAssessments);
router.get("/assessments/projects", getProjectAssessments);
router.get("/assessments/:slug/detail", getAssessmentDetail);
router.get("/programs/:slug/students", getMyStudents);
router.get("/programs/:slug/progress", getProgramProgress);
router.post("/programs/:slug/projects/review", reviewProjectSubmission);
router.post("/programs/:slug/complete-internship", completeInternship);
router.post("/programs/:slug/complete-internship/bulk", completeInternshipBulk);
router.get("/programs/:slug/config", getProgramConfig);
router.put("/programs/:slug/config", updateProgramConfig);
router.post(
  "/programs/:slug/classes/:classId/generate-questions",
  (req, res, next) => {
    upload.single("contextPdf")(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          message: err.message || "Invalid file upload",
        });
      }
      next();
    });
  },
  generateClassQuestions
);

module.exports = router;
