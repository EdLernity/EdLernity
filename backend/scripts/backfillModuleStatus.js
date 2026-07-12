/**
 * Backfill module.status for existing internship program configs.
 * Week 1 = current, Week 2 = upcoming, rest = locked (unless already set).
 * Usage: node backend/scripts/backfillModuleStatus.js
 */
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: path.join(__dirname, "../.env") });

const InternshipProgramConfig = require("../models/internshipProgramConfigSchema");

function defaultStatus(index) {
  if (index === 0) return "current";
  if (index === 1) return "upcoming";
  return "locked";
}

async function main() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not set in backend/.env");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  const configs = await InternshipProgramConfig.find({});
  let updated = 0;

  for (const config of configs) {
    let changed = false;
    const modules = (config.modules || []).map((mod, index) => {
      const plain = mod.toObject ? mod.toObject() : { ...mod };
      if (!plain.status) {
        plain.status = defaultStatus(plain.weekIndex ?? index);
        changed = true;
      }
      return plain;
    });

    if (changed) {
      config.modules = modules;
      config.markModified("modules");
      await config.save();
      updated += 1;
      console.log(`Updated statuses for ${config.internshipSlug}`);
    }
  }

  console.log(`Done. Updated ${updated} program config(s).`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
