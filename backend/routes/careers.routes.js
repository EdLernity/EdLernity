const express = require("express");
const { listPublicCareersPrograms } = require("../controllers/careersProgramController");

const router = express.Router();

router.get("/programs", listPublicCareersPrograms);

module.exports = router;
