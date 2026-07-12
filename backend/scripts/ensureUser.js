/**
 * Create or update a user with a role.
 * Usage: node backend/scripts/ensureUser.js <email> <role> [firstName]
 */
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

dotenv.config({ path: path.join(__dirname, "../.env") });

const UserModel = require("../models/userModel");

async function generateUserId() {
  let userId;
  let exists = true;
  while (exists) {
    userId = Math.floor(10000000 + Math.random() * 90000000);
    exists = await UserModel.findOne({ userId });
  }
  return userId;
}

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  const role = process.argv[3] || "trainer";
  const firstName = process.argv[4] || "Trainer";

  if (!email) {
    console.error("Usage: node backend/scripts/ensureUser.js <email> <role> [firstName]");
    process.exit(1);
  }

  if (!["student", "trainer", "admin", "manager"].includes(role)) {
    console.error("Role must be student, trainer, manager, or admin");
    process.exit(1);
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not set in backend/.env");
  }

  await mongoose.connect(process.env.MONGODB_URI);

  let user = await UserModel.findOne({ email });
  const defaultPassword = process.env.SEED_USER_PASSWORD || "Trainer@123";

  if (!user) {
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    user = await UserModel.create({
      userId: await generateUserId(),
      firstName,
      lastName: "",
      email,
      password: hashedPassword,
      isVerified: true,
      role,
    });
    console.log(`Created ${email} with role: ${role}`);
    console.log(`Temporary password: ${defaultPassword} (change after first login)`);
  } else {
    user.role = role;
    if (!user.isVerified) user.isVerified = true;
    await user.save();
    console.log(`Updated ${email} -> role: ${role}`);
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
