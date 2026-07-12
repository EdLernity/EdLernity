/**
 * Assign a trainer to an internship program.
 * Usage: node backend/scripts/assignTrainer.js <trainerEmail> <internship-slug>
 */
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: path.join(__dirname, "../.env") });

const UserModel = require("../models/userModel");
const InternshipTrainerAssignment = require("../models/internshipTrainerAssignmentSchema");
const { getInternshipBySlug } = require("../utils/internshipCatalog");
const { getOrCreateProgramConfig } = require("../controllers/internshipAdminController");

async function main() {
  const trainerEmail = process.argv[2];
  const slug = process.argv[3];

  if (!trainerEmail || !slug) {
    console.error("Usage: node backend/scripts/assignTrainer.js <trainerEmail> <internship-slug>");
    process.exit(1);
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not set in backend/.env");
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const internship = getInternshipBySlug(slug);
  if (!internship) {
    throw new Error(`Unknown internship slug: ${slug}`);
  }

  const trainer = await UserModel.findOne({ email: trainerEmail.trim().toLowerCase() });
  if (!trainer) {
    throw new Error(`No user found with email: ${trainerEmail}`);
  }

  if (trainer.role !== "trainer" && trainer.role !== "admin") {
    trainer.role = "trainer";
    await trainer.save();
  }

  await getOrCreateProgramConfig(slug);

  await InternshipTrainerAssignment.findOneAndUpdate(
    { trainerId: trainer._id, internshipSlug: slug },
    { trainerId: trainer._id, internshipSlug: slug, active: true },
    { upsert: true, new: true }
  );

  console.log(`Assigned ${trainer.email} as trainer for ${slug}`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
