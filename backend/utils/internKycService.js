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

  if (legacy) {
    await backfillKycInternshipSlug(legacy);
    if (!legacy.internshipSlug || legacy.internshipSlug === internshipSlug) {
      if (!legacy.internshipSlug) {
        legacy.internshipSlug = internshipSlug;
        await legacy.save();
      }
      return legacy;
    }
  }

  // Legacy mismatched slug: single KYC for this user still belongs to them
  const forUser = await InternKyc.find({ userId }).sort({ updatedAt: -1 });
  if (forUser.length === 1) {
    return forUser[0];
  }

  return null;
}

function pickKycFromList(kycRecords, userId, internshipSlug, inviteId) {
  if (inviteId) {
    const inviteMatch = kycRecords.find((row) => String(row.inviteId) === String(inviteId));
    if (inviteMatch) return inviteMatch;
  }

  if (!userId) return null;
  const uid = String(userId);

  if (internshipSlug) {
    const slugMatch = kycRecords.find(
      (row) => String(row.userId) === uid && row.internshipSlug === internshipSlug
    );
    if (slugMatch) return slugMatch;
  }

  // Legacy / mismatched slug: any KYC for this user (prefer empty slug, then newest)
  const forUser = kycRecords.filter((row) => String(row.userId) === uid);
  if (!forUser.length) return null;

  const legacy = forUser.find(
    (row) => !row.internshipSlug || row.internshipSlug === ""
  );
  if (legacy) return legacy;

  return forUser.sort(
    (a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0)
  )[0];
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
