const InternKyc = require("../models/internKycSchema");
const InternInvite = require("../models/internInviteSchema");
const UserInternship = require("../models/userInternshipSchema");

function userSlugKey(userId, internshipSlug) {
  return `${String(userId)}::${internshipSlug}`;
}

async function backfillKycInternshipSlug(kyc) {
  if (!kyc || kyc.internshipSlug) return kyc;

  if (kyc.inviteId) {
    const invite = await InternInvite.findById(kyc.inviteId).select("internshipSlug");
    if (invite?.internshipSlug) {
      kyc.internshipSlug = invite.internshipSlug;
      await kyc.save();
      return kyc;
    }
  }

  const enrollment = await UserInternship.findOne({ userId: kyc.userId }).sort({ createdAt: -1 });
  if (enrollment?.internshipSlug) {
    kyc.internshipSlug = enrollment.internshipSlug;
    await kyc.save();
  }

  return kyc;
}

async function findKycForProgram(userId, internshipSlug) {
  if (!userId || !internshipSlug) return null;

  let kyc = await InternKyc.findOne({ userId, internshipSlug });
  if (kyc) return kyc;

  const legacy = await InternKyc.findOne({
    userId,
    $or: [{ internshipSlug: null }, { internshipSlug: { $exists: false } }, { internshipSlug: "" }],
  });

  if (!legacy) return null;

  await backfillKycInternshipSlug(legacy);
  if (legacy.internshipSlug === internshipSlug) return legacy;

  return null;
}

function pickKycFromList(kycRecords, userId, internshipSlug, inviteId) {
  if (inviteId) {
    const inviteMatch = kycRecords.find((row) => String(row.inviteId) === String(inviteId));
    if (inviteMatch) return inviteMatch;
  }

  if (!userId || !internshipSlug) return null;

  const slugMatch = kycRecords.find(
    (row) => String(row.userId) === String(userId) && row.internshipSlug === internshipSlug
  );
  if (slugMatch) return slugMatch;

  return null;
}

function pickCertificateFromList(certificates, userId, internshipSlug) {
  return pickCertificatesFromList(certificates, userId, internshipSlug)[0] || null;
}

function pickCertificatesFromList(certificates, userId, internshipSlug) {
  return certificates.filter(
    (row) => String(row.userId) === String(userId) && row.internshipSlug === internshipSlug
  );
}

module.exports = {
  userSlugKey,
  backfillKycInternshipSlug,
  findKycForProgram,
  pickKycFromList,
  pickCertificateFromList,
  pickCertificatesFromList,
};
