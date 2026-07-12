const CareersProgram = require("../models/careersProgramSchema");
const { DEFAULT_CAREERS_PROGRAMS } = require("./careersProgramDefaults");

const LEGACY_SLUG_ALIASES = {
  "marketing-intern": "sales-marketing",
};

let careersCache = [];
let cacheReady = false;

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function templateRefId(value) {
  if (!value) return null;
  if (typeof value === "object" && value._id) return String(value._id);
  return String(value);
}

function toCatalogEntry(row) {
  return {
    slug: row.slug,
    title: row.title,
    category: row.category || "",
    track: "careers",
    trackLabel: row.trackLabel || "",
    coverImage: row.coverImage || "",
    description: row.description || "",
    highlights: row.highlights || [],
    applyUrl: row.applyUrl || "",
    location: row.location || "Remote",
    duration: row.duration || "",
    preferred: Boolean(row.preferred),
    preferredNote: row.preferredNote || "",
    certificateTemplateId: templateRefId(row.certificateTemplateId),
    offerLetterTemplateId: templateRefId(row.offerLetterTemplateId),
    offerLetterRoleDescription: row.offerLetterRoleDescription || "",
    active: row.active !== false,
    sortOrder: row.sortOrder || 0,
    id: row._id ? String(row._id) : undefined,
  };
}

function mapTemplateMeta(value) {
  if (!value) return null;
  if (typeof value === "object" && value.label) {
    return {
      id: templateRefId(value),
      label: value.label || "",
      type: value.type || "",
    };
  }
  return null;
}

function mapProgramResponse(row) {
  const base = toCatalogEntry(row);
  return {
    ...base,
    id: String(row._id),
    certificateTemplate: mapTemplateMeta(row.certificateTemplateId),
    offerLetterTemplate: mapTemplateMeta(row.offerLetterTemplateId),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

async function seedCareersProgramsIfEmpty() {
  const count = await CareersProgram.countDocuments();
  if (count > 0) return;

  await CareersProgram.insertMany(
    DEFAULT_CAREERS_PROGRAMS.map((row) => ({
      ...row,
      slug: row.slug.toLowerCase(),
      active: true,
    }))
  );
}

async function refreshCareersCache() {
  const rows = await CareersProgram.find({ active: true })
    .sort({ sortOrder: 1, title: 1 })
    .lean();
  careersCache = rows.map(toCatalogEntry);
  cacheReady = true;
}

async function ensureCareersReady() {
  await seedCareersProgramsIfEmpty();
  if (!cacheReady) {
    await refreshCareersCache();
  }
}

function resolveSlug(slug) {
  return LEGACY_SLUG_ALIASES[slug] || slug;
}

function getCareersProgramFromCache(slug) {
  const resolved = resolveSlug(slug);
  return careersCache.find((row) => row.slug === resolved) || null;
}

function listCareersProgramsFromCache() {
  return [...careersCache];
}

async function listAllCareersPrograms({ includeInactive = false } = {}) {
  await ensureCareersReady();
  const filter = includeInactive ? {} : { active: true };
  const rows = await CareersProgram.find(filter)
    .populate("certificateTemplateId", "label type pdfUrl active")
    .populate("offerLetterTemplateId", "label type pdfUrl active")
    .sort({ sortOrder: 1, title: 1 });
  return rows.map(mapProgramResponse);
}

async function getCareersProgramBySlug(slug, { includeInactive = false } = {}) {
  await ensureCareersReady();
  const resolved = resolveSlug(slug);
  const filter = { slug: resolved };
  if (!includeInactive) filter.active = true;
  const row = await CareersProgram.findOne(filter)
    .populate("certificateTemplateId", "label type pdfUrl active")
    .populate("offerLetterTemplateId", "label type pdfUrl active");
  return row ? mapProgramResponse(row) : null;
}

async function createCareersProgram(payload, userId) {
  const slug = slugify(payload.slug || payload.title);
  if (!slug) throw new Error("Slug is required");

  const exists = await CareersProgram.findOne({ slug });
  if (exists) throw new Error("A program with this slug already exists");

  const row = await CareersProgram.create({
    slug,
    title: payload.title.trim(),
    category: payload.category?.trim() || "",
    trackLabel: payload.trackLabel?.trim() || "",
    description: payload.description?.trim() || "",
    highlights: Array.isArray(payload.highlights) ? payload.highlights.filter(Boolean) : [],
    coverImage: payload.coverImage?.trim() || "",
    applyUrl: payload.applyUrl?.trim() || "",
    location: payload.location?.trim() || "Remote",
    duration: payload.duration?.trim() || "2 Months",
    preferred: Boolean(payload.preferred),
    preferredNote: payload.preferredNote?.trim() || "",
    active: payload.active !== false,
    sortOrder: Number(payload.sortOrder) || 0,
    certificateTemplateId: payload.certificateTemplateId || null,
    offerLetterTemplateId: payload.offerLetterTemplateId || null,
    offerLetterRoleDescription: payload.offerLetterRoleDescription?.trim() || "",
    createdBy: userId,
    updatedBy: userId,
  });

  await refreshCareersCache();
  return mapProgramResponse(
    await row.populate([
      { path: "certificateTemplateId", select: "label type pdfUrl active" },
      { path: "offerLetterTemplateId", select: "label type pdfUrl active" },
    ])
  );
}

async function updateCareersProgram(id, payload, userId) {
  const row = await CareersProgram.findById(id);
  if (!row) return null;

  if (payload.title !== undefined) row.title = payload.title.trim();
  if (payload.category !== undefined) row.category = payload.category.trim();
  if (payload.trackLabel !== undefined) row.trackLabel = payload.trackLabel.trim();
  if (payload.description !== undefined) row.description = payload.description.trim();
  if (payload.highlights !== undefined) {
    row.highlights = Array.isArray(payload.highlights) ? payload.highlights.filter(Boolean) : [];
  }
  if (payload.coverImage !== undefined) row.coverImage = payload.coverImage.trim();
  if (payload.applyUrl !== undefined) row.applyUrl = payload.applyUrl.trim();
  if (payload.location !== undefined) row.location = payload.location.trim();
  if (payload.duration !== undefined) row.duration = payload.duration.trim();
  if (payload.preferred !== undefined) row.preferred = Boolean(payload.preferred);
  if (payload.preferredNote !== undefined) row.preferredNote = payload.preferredNote.trim();
  if (payload.active !== undefined) row.active = Boolean(payload.active);
  if (payload.sortOrder !== undefined) row.sortOrder = Number(payload.sortOrder) || 0;
  if (payload.certificateTemplateId !== undefined) {
    row.certificateTemplateId = payload.certificateTemplateId || null;
  }
  if (payload.offerLetterTemplateId !== undefined) {
    row.offerLetterTemplateId = payload.offerLetterTemplateId || null;
  }
  if (payload.offerLetterRoleDescription !== undefined) {
    row.offerLetterRoleDescription = payload.offerLetterRoleDescription.trim();
  }
  row.updatedBy = userId;
  await row.save();
  await refreshCareersCache();

  return mapProgramResponse(
    await row.populate([
      { path: "certificateTemplateId", select: "label type pdfUrl active" },
      { path: "offerLetterTemplateId", select: "label type pdfUrl active" },
    ])
  );
}

async function deleteCareersProgram(id) {
  const row = await CareersProgram.findByIdAndDelete(id);
  if (!row) return false;
  await refreshCareersCache();
  return true;
}

module.exports = {
  ensureCareersReady,
  refreshCareersCache,
  listCareersProgramsFromCache,
  getCareersProgramFromCache,
  listAllCareersPrograms,
  getCareersProgramBySlug,
  createCareersProgram,
  updateCareersProgram,
  deleteCareersProgram,
  slugify,
  toCatalogEntry,
};
