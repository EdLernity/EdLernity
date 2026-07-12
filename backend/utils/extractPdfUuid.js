const LEGACY_UUID_PATTERN =
  /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i;

const CERTIFICATE_ID_PATTERN = /EDL-(?:INT|CRS|CRT)-\d{4}-[A-Z0-9]{8}/i;

const IGNORED_IDS = new Set([
  "preview-sample-uuid",
  "EDL-CRT-2026-PREVIEWS",
]);

function normalizeCertificateId(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return null;

  const brandedMatch = trimmed.match(CERTIFICATE_ID_PATTERN);
  if (brandedMatch) {
    const certificateId = brandedMatch[0].toUpperCase();
    if (IGNORED_IDS.has(certificateId)) return null;
    return certificateId;
  }

  const legacyMatch = trimmed.match(LEGACY_UUID_PATTERN);
  if (!legacyMatch) return null;

  const legacyId = legacyMatch[0].toLowerCase();
  if (IGNORED_IDS.has(legacyId)) return null;
  return legacyId;
}

function extractCertificateIdFromPdfBuffer(buffer) {
  if (!buffer?.length) return null;
  const raw = buffer.toString("latin1");

  const brandedMatches = raw.match(/EDL-(?:INT|CRS|CRT)-\d{4}-[A-Z0-9]{8}/gi);
  if (brandedMatches?.length) {
    for (const match of brandedMatches) {
      const certificateId = match.toUpperCase();
      if (!IGNORED_IDS.has(certificateId)) return certificateId;
    }
  }

  const legacyMatches = raw.match(LEGACY_UUID_PATTERN);
  if (legacyMatches?.length) {
    for (const match of legacyMatches) {
      const legacyId = match.toLowerCase();
      if (!IGNORED_IDS.has(legacyId)) return legacyId;
    }
  }

  return null;
}

module.exports = {
  UUID_PATTERN: LEGACY_UUID_PATTERN,
  CERTIFICATE_ID_PATTERN,
  normalizeUuid: normalizeCertificateId,
  normalizeCertificateId,
  extractUuidFromPdfBuffer: extractCertificateIdFromPdfBuffer,
  extractCertificateIdFromPdfBuffer,
};
