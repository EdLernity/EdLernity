/**
 * Usage: node backend/scripts/setUserRole.js <email> <role>
 * role: student | trainer | admin
 */
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const UserModel = require("../models/userModel");

async function main() {
  const email = process.argv[2];
  const role = process.argv[3] || "admin";

  if (!email) {
    console.error("Usage: node backend/scripts/setUserRole.js <email> <role>");
    process.exit(1);
  }

  if (!["student", "trainer", "admin", "manager"].includes(role)) {
    console.error("Role must be student, trainer, manager, or admin");
    process.exit(1);
  }

  await connectDB();

  const user = await UserModel.findOne({ email: email.trim().toLowerCase() });
  if (!user) {
    console.error(`User not found: ${email}`);
    process.exit(1);
  }

  user.role = role;
  await user.save();
  console.log(`Updated ${user.email} -> role: ${role}`);
  await mongoose.connection.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
