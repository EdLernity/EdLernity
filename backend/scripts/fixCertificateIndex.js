/**
 * Run once after upgrading to multi-certificate support:
 * node backend/scripts/fixCertificateIndex.js
 */
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const { ensureCertificateIndexes } = require("../utils/ensureCertificateIndexes");

async function main() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    console.error("Missing MONGODB_URI");
    process.exit(1);
  }

  await mongoose.connect(uri);
  await ensureCertificateIndexes(mongoose.connection);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
