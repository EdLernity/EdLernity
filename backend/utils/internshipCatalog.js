/** Careers tracks mirror https://www.edlernity.com/careers */
const {
  listCareersProgramsFromCache,
  getCareersProgramFromCache,
  ensureCareersReady,
} = require("./careersProgramService");

const CAREERS_PROGRAMS = {
  "business-development": {
    slug: "business-development",
    title: "Business Development Internship",
    category: "Business Development",
    track: "careers",
    coverImage: "/Image/business_dev_card.png",
  },
  "sales-marketing": {
    slug: "sales-marketing",
    title: "Sales and Marketing Internship",
    category: "Sales & Marketing",
    track: "careers",
    coverImage: "/Image/sales_marketing_card.png",
  },
  "lead-generation": {
    slug: "lead-generation",
    title: "Lead Generation Internship",
    category: "Lead Generation",
    track: "careers",
    coverImage: "/Image/lead_generation.png",
  },
  "human-resources": {
    slug: "human-resources",
    title: "Human Resources Internship",
    category: "Human Resources",
    track: "careers",
    coverImage: "/Image/hr_internship_card.png",
  },
  technical: {
    slug: "technical",
    title: "Technical Internship",
    category: "Software Development",
    track: "careers",
    coverImage: "/Image/technical_internship.png",
  },
};

/** Paid tech programs from /internship-programs */
const PAID_TECH_PROGRAMS = {
  "ai-machine-learning": {
    slug: "ai-machine-learning",
    title: "Artificial Intelligence & Machine Learning",
    category: "AI & Machine Learning",
    track: "paid-tech",
    coverImage: "/Image/ai_machine_learning_banner.png",
  },
  "full-stack-ai": {
    slug: "full-stack-ai",
    title: "Full Stack Development with AI",
    category: "Full Stack",
    track: "paid-tech",
    coverImage: "/Image/full_stack_dev_banner.png",
  },
  "salesforce-cloud-ai": {
    slug: "salesforce-cloud-ai",
    title: "Salesforce Cloud with AI",
    category: "Salesforce & Cloud",
    track: "paid-tech",
    coverImage: "/Image/salesforce_cloud_ai_banner.png",
  },
  "python-data-science-ml": {
    slug: "python-data-science-ml",
    title: "Python for Data Science & Machine Learning",
    category: "Data Science",
    track: "paid-tech",
    coverImage: "/Image/python_developer_ai_banner.png",
  },
  "cloud-computing-devops": {
    slug: "cloud-computing-devops",
    title: "Cloud Computing & DevOps",
    category: "Cloud & DevOps",
    track: "paid-tech",
    coverImage: "/Image/cloud_devops_banner.png",
  },
};

const LEGACY_SLUG_ALIASES = {
  "marketing-intern": "sales-marketing",
};

const INTERNSHIP_CATALOG = {
  ...CAREERS_PROGRAMS,
  ...PAID_TECH_PROGRAMS,
};

const TRACK_ORDER = { careers: 0, "paid-tech": 1 };

function resolveSlug(slug) {
  return LEGACY_SLUG_ALIASES[slug] || slug;
}

function getInternshipBySlug(slug) {
  const resolved = resolveSlug(slug);
  const fromCareers = getCareersProgramFromCache(resolved);
  if (fromCareers) return fromCareers;
  return INTERNSHIP_CATALOG[resolved] || null;
}

function listCareersPrograms() {
  const fromDb = listCareersProgramsFromCache();
  if (fromDb.length) return fromDb;
  return Object.values(CAREERS_PROGRAMS).sort((a, b) => a.title.localeCompare(b.title));
}

async function listCareersProgramsAsync() {
  await ensureCareersReady();
  return listCareersPrograms();
}

function listCatalogPrograms() {
  return Object.values(INTERNSHIP_CATALOG).sort((a, b) => {
    const trackDiff = (TRACK_ORDER[a.track] ?? 9) - (TRACK_ORDER[b.track] ?? 9);
    if (trackDiff !== 0) return trackDiff;
    return a.title.localeCompare(b.title);
  });
}

function resolveProgramTitle(slug, options = {}) {
  const enrollmentTitle = String(options.enrollmentTitle || "").trim();
  if (enrollmentTitle) return enrollmentTitle;

  const program = getInternshipBySlug(slug);
  const catalogTitle = String(program?.title || "").trim();
  if (catalogTitle) return catalogTitle;

  const storedTitle = String(options.storedTitle || "").trim();
  if (storedTitle) return storedTitle;

  return resolveSlug(slug) || slug || "";
}

module.exports = {
  INTERNSHIP_CATALOG,
  CAREERS_PROGRAMS,
  PAID_TECH_PROGRAMS,
  LEGACY_SLUG_ALIASES,
  getInternshipBySlug,
  resolveProgramTitle,
  listCatalogPrograms,
  listCareersPrograms,
  listCareersProgramsAsync,
  ensureCareersReady,
  resolveSlug,
};
