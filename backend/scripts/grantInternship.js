/**
 * Grant internship access to a user by email.
 * Usage: node backend/scripts/grantInternship.js <email> <internship-slug>
 * Example: node backend/scripts/grantInternship.js ishu.kumar0007@gmail.com ai-machine-learning
 */
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: path.join(__dirname, "../.env") });

const UserModel = require("../models/userModel");
const UserInternship = require("../models/userInternshipSchema");
const { getInternshipBySlug } = require("../utils/internshipCatalog");

async function grantInternship(email, slug) {
  const internship = getInternshipBySlug(slug);
  if (!internship) {
    throw new Error(`Unknown internship slug: ${slug}`);
  }

  const user = await UserModel.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    throw new Error(`No user found with email: ${email}`);
  }

  const existing = await UserInternship.findOne({
    userId: user._id,
    internshipSlug: slug,
  });

  if (existing) {
    console.log(`User already enrolled in "${internship.title}"`);
    return existing;
  }

  const enrollment = await UserInternship.create({
    userId: user._id,
    internshipSlug: slug,
    title: internship.title,
    category: internship.category,
    coverImage: internship.coverImage,
    paymentId: `admin-grant-${Date.now()}`,
    amount: "0",
    enrollmentSource: "admin_grant",
  });

  console.log(`Granted "${internship.title}" to ${user.email} (${user.firstName} ${user.lastName || ""})`);
  return enrollment;
}

async function main() {
  const email = process.argv[2] || "ishu.kumar0007@gmail.com";
  const slug = process.argv[3] || "ai-machine-learning";

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not set in backend/.env");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  await grantInternship(email, slug);
  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(error.message || error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
