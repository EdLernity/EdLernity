const CERTIFICATE_ISSUE_LOCK_DAYS = 60;

const COMPLETION_CERTIFICATE_TYPES = new Set(["internship-completion", "course-completion"]);

function isCompletionCertificateType(type) {
  return COMPLETION_CERTIFICATE_TYPES.has(String(type || "").trim());
}

function requiresCompletionLock(type) {
  return isCompletionCertificateType(type);
}

function getCertificateLockStartDate(kyc, enrollment) {
  if (kyc?.approvedAt) return new Date(kyc.approvedAt);
  if (enrollment?.createdAt) return new Date(enrollment.createdAt);
  if (kyc?.createdAt) return new Date(kyc.createdAt);
  return null;
}

function getCertificateEligibleAt(lockStart) {
  if (!lockStart) return null;
  const eligibleAt = new Date(lockStart);
  eligibleAt.setDate(eligibleAt.getDate() + CERTIFICATE_ISSUE_LOCK_DAYS);
  return eligibleAt;
}

function isCertificateUnlocked(eligibleAt, now = new Date()) {
  if (!eligibleAt) return false;
  return now.getTime() >= new Date(eligibleAt).getTime();
}

function getCertificateLockDaysRemaining(eligibleAt, now = new Date()) {
  if (!eligibleAt) return CERTIFICATE_ISSUE_LOCK_DAYS;
  const diffMs = new Date(eligibleAt).getTime() - now.getTime();
  if (diffMs <= 0) return 0;
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

module.exports = {
  CERTIFICATE_ISSUE_LOCK_DAYS,
  COMPLETION_CERTIFICATE_TYPES,
  isCompletionCertificateType,
  requiresCompletionLock,
  getCertificateLockStartDate,
  getCertificateEligibleAt,
  isCertificateUnlocked,
  getCertificateLockDaysRemaining,
};
