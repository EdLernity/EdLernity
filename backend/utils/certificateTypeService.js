const { CertificateType } = require("../models/certificateTypeSchema");
const { DEFAULT_CERTIFICATE_TYPES } = require("./certificateTypeDefaults");

const SLUG_PATTERN = /^[a-z][a-z0-9-]*$/;

function normalizeTypeSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function isValidTypeSlug(slug) {
  return Boolean(slug && SLUG_PATTERN.test(slug));
}

function mapCertificateType(row) {
  return {
    id: row._id,
    slug: row.slug,
    label: row.label,
    kind: row.kind,
    description: row.description || "",
    active: row.active,
    sortOrder: row.sortOrder || 0,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

async function ensureDefaultCertificateTypes() {
  const count = await CertificateType.countDocuments();
  if (count > 0) return;
  await CertificateType.insertMany(DEFAULT_CERTIFICATE_TYPES);
}

async function listCertificateTypes({ kind, activeOnly = true } = {}) {
  await ensureDefaultCertificateTypes();
  const filter = {};
  if (kind) filter.kind = kind;
  if (activeOnly) filter.active = true;
  const rows = await CertificateType.find(filter).sort({ sortOrder: 1, label: 1 });
  return rows.map(mapCertificateType);
}

async function getActiveTypeSlugs() {
  const types = await listCertificateTypes({ activeOnly: true });
  return types.map((row) => row.slug);
}

async function getIssuableCertificateTypeSlugs() {
  const types = await listCertificateTypes({ kind: "certificate", activeOnly: true });
  return types.map((row) => row.slug);
}

async function findCertificateTypeBySlug(slug) {
  await ensureDefaultCertificateTypes();
  return CertificateType.findOne({ slug: normalizeTypeSlug(slug) });
}

async function assertCertificateTypeExists(slug) {
  const normalized = normalizeTypeSlug(slug);
  if (!isValidTypeSlug(normalized)) {
    const error = new Error("Invalid type slug. Use lowercase letters, numbers, and hyphens.");
    error.statusCode = 400;
    throw error;
  }
  const type = await findCertificateTypeBySlug(normalized);
  if (!type || !type.active) {
    const error = new Error("Valid active certificate type is required");
    error.statusCode = 400;
    throw error;
  }
  return type;
}

async function createCertificateType(payload, createdBy) {
  await ensureDefaultCertificateTypes();
  const slug = normalizeTypeSlug(payload.slug || payload.label);
  const label = String(payload.label || "").trim();
  const kind = payload.kind === "offer-letter" ? "offer-letter" : "certificate";

  if (!label) {
    const error = new Error("Type label is required");
    error.statusCode = 400;
    throw error;
  }
  if (!isValidTypeSlug(slug)) {
    const error = new Error("Invalid type slug. Use lowercase letters, numbers, and hyphens.");
    error.statusCode = 400;
    throw error;
  }

  const existing = await CertificateType.findOne({ slug });
  if (existing) {
    const error = new Error("A certificate type with this slug already exists");
    error.statusCode = 409;
    throw error;
  }

  const row = await CertificateType.create({
    slug,
    label,
    kind,
    description: payload.description?.trim() || "",
    active: payload.active !== false,
    sortOrder: Number(payload.sortOrder) || 0,
    createdBy: createdBy || null,
  });

  return mapCertificateType(row);
}

async function updateCertificateType(id, payload) {
  await ensureDefaultCertificateTypes();
  const row = await CertificateType.findById(id);
  if (!row) {
    const error = new Error("Certificate type not found");
    error.statusCode = 404;
    throw error;
  }

  if (payload.label !== undefined) {
    const label = String(payload.label).trim();
    if (!label) {
      const error = new Error("Type label is required");
      error.statusCode = 400;
      throw error;
    }
    row.label = label;
  }
  if (payload.kind !== undefined) {
    row.kind = payload.kind === "offer-letter" ? "offer-letter" : "certificate";
  }
  if (payload.description !== undefined) row.description = String(payload.description).trim();
  if (payload.active !== undefined) row.active = Boolean(payload.active);
  if (payload.sortOrder !== undefined) row.sortOrder = Number(payload.sortOrder) || 0;

  await row.save();
  return mapCertificateType(row);
}

async function deleteCertificateType(id, { CertificateTemplate }) {
  await ensureDefaultCertificateTypes();
  const row = await CertificateType.findById(id);
  if (!row) {
    const error = new Error("Certificate type not found");
    error.statusCode = 404;
    throw error;
  }

  const templatesUsingType = await CertificateTemplate.countDocuments({ type: row.slug });
  if (templatesUsingType > 0) {
    const error = new Error(
      `Cannot delete "${row.label}" because ${templatesUsingType} PDF template(s) still use it`
    );
    error.statusCode = 400;
    throw error;
  }

  await row.deleteOne();
  return mapCertificateType(row);
}

module.exports = {
  SLUG_PATTERN,
  normalizeTypeSlug,
  isValidTypeSlug,
  mapCertificateType,
  ensureDefaultCertificateTypes,
  listCertificateTypes,
  getActiveTypeSlugs,
  getIssuableCertificateTypeSlugs,
  findCertificateTypeBySlug,
  assertCertificateTypeExists,
  createCertificateType,
  updateCertificateType,
  deleteCertificateType,
};
