const DEFAULT_CERTIFICATE_TYPES = [
  {
    slug: "internship-completion",
    label: "Internship Completion",
    kind: "certificate",
    description: "Internship completion certificates for career programs.",
    sortOrder: 1,
  },
  {
    slug: "course-completion",
    label: "Course Completion",
    kind: "certificate",
    description: "Course completion certificates.",
    sortOrder: 2,
  },
  {
    slug: "offer-letter-hr",
    label: "Offer Letter (HR)",
    kind: "offer-letter",
    description: "HR internship offer letter templates.",
    sortOrder: 3,
  },
  {
    slug: "offer-letter-marketing",
    label: "Offer Letter (Marketing)",
    kind: "offer-letter",
    description: "Marketing internship offer letter templates.",
    sortOrder: 4,
  },
];

module.exports = { DEFAULT_CERTIFICATE_TYPES };
