/**
 * Drops the legacy one-cert-per-program unique index and ensures the
 * multi-template sparse unique index exists.
 */
async function ensureCertificateIndexes(connection = require("mongoose").connection) {
  const collection = connection.collection("internshipcertificates");
  const indexes = await collection.indexes();

  const legacyIndex = indexes.find(
    (index) =>
      index.unique &&
      index.key?.userId === 1 &&
      index.key?.internshipSlug === 1 &&
      !index.key?.certificateTemplateId
  );

  if (legacyIndex) {
    await collection.dropIndex(legacyIndex.name);
    console.log(`Dropped legacy certificate index: ${legacyIndex.name}`);
  }

  const hasTemplateIndex = indexes.some(
    (index) =>
      index.unique &&
      index.key?.userId === 1 &&
      index.key?.internshipSlug === 1 &&
      index.key?.certificateTemplateId === 1
  );

  if (!hasTemplateIndex) {
    await collection.createIndex(
      { userId: 1, internshipSlug: 1, certificateTemplateId: 1 },
      { unique: true, sparse: true }
    );
    console.log("Ensured certificate index: userId + internshipSlug + certificateTemplateId");
  }
}

module.exports = { ensureCertificateIndexes };
