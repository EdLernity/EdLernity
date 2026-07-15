/**
 * Create or update a user with a role (and optional password reset).
 * Usage: node backend/scripts/ensureUser.js <email> <role> [firstName] [password]
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
  const firstName = process.argv[4] || "User";
  const passwordArg = process.argv[5];

  if (!email) {
    console.error(
      "Usage: node backend/scripts/ensureUser.js <email> <role> [firstName] [password]"
    );
    process.exit(1);
  }

  if (!["student", "trainer", "admin", "manager", "intern"].includes(role)) {
    console.error("Role must be student, trainer, manager, admin, or intern");
    process.exit(1);
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not set in backend/.env");
  }

  await mongoose.connect(process.env.MONGODB_URI);

  let user = await UserModel.findOne({ email });
  const password =
    passwordArg || process.env.SEED_USER_PASSWORD || "ChangeMe@EdLernity2026!";

  if (!user) {
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await UserModel.create({
      userId: await generateUserId(),
      firstName,
      lastName: "",
      email,
      password: hashedPassword,
      isVerified: true,
      IsBlocked: false,
      isActive: true,
      role,
    });
    console.log(`Created ${email} with role: ${role}`);
  } else {
    user.role = role;
    user.isVerified = true;
    user.IsBlocked = false;
    user.isActive = true;
    if (firstName) user.firstName = firstName;
    if (passwordArg || process.env.SEED_USER_PASSWORD) {
      user.password = await bcrypt.hash(password, 10);
    }
    await user.save();
    console.log(`Updated ${email} -> role: ${role}`);
  }

  console.log(`Password: ${password}`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
