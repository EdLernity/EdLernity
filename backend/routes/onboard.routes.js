const express = require("express");
const {
  getInviteByToken,
  completeOnboarding,
  getMyOfferLetters,
} = require("../controllers/onboardController");
const authMiddleware = require("../middleware/authMiddleware");
const { uploadKycDocuments } = require("../utils/kycUpload");

const blockInternFromMainPortal = (req, res, next) => {
  if (req.user?.role === "intern") {
    return res.status(403).json({
      message: "Please use the intern CRM portal for offer letters and certificates.",
    });
  }
  next();
};

const router = express.Router();

router.get("/invite/:token", getInviteByToken);
router.post("/invite/:token/complete", (req, res, next) => {
  uploadKycDocuments(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || "Invalid file upload" });
    }
    next();
  });
}, completeOnboarding);
router.get("/my-offer-letters", authMiddleware, blockInternFromMainPortal, getMyOfferLetters);

module.exports = router;
