const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  getMyPrograms,
  getMyStudents,
  getProgramConfig,
  updateProgramConfig,
} = require("../controllers/internshipTrainerController");

const router = express.Router();

router.use(authMiddleware, roleMiddleware("trainer", "admin"));

router.get("/programs", getMyPrograms);
router.get("/programs/:slug/students", getMyStudents);
router.get("/programs/:slug/config", getProgramConfig);
router.put("/programs/:slug/config", updateProgramConfig);

module.exports = router;
