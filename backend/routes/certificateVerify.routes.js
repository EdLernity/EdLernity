const express = require("express");
const {
  uploadCertificatePdf,
  verifyCertificateByUuid,
  verifyCertificateUpload,
} = require("../controllers/certificateVerifyController");

const router = express.Router();

router.get("/verify/:uuid", verifyCertificateByUuid);
router.post("/verify", verifyCertificateByUuid);
router.post("/verify/upload", (req, res, next) => {
  uploadCertificatePdf(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        valid: false,
        message: err.message || "Invalid file upload",
      });
    }
    next();
  });
}, verifyCertificateUpload);

module.exports = router;
