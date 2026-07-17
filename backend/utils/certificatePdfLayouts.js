/**
 * Hardcoded certificate overlay layouts — edit here only.
 *
 * 1. Add/edit layouts under CERTIFICATE_PDF_LAYOUTS (default, internship1, internship2, …)
 * 2. Map CRM template Label → layout key in LAYOUT_BY_TEMPLATE_LABEL (exact match)
 * 3. If label is not mapped → uses "default"
 *
 * Fields: x, yFromTop, size per field. enabledFields = which fields to draw.
 * Optional per layout/field: font ("helvetica" | "poppins" | "poppins-regular" | "canva-sans" | "canva-sans-bold" | "libre-baskerville-italic" | "cormorant-garamond" | "cormorant-garamond-bold" | "cormorant-garamond-semibold" | "cormorant-garamond-italic" | "dm-sans"), uppercase (true for ALL CAPS name).
 * centerX horizontally centers single-line text at that x coordinate.
 * internshipDateRange renders as [DD/MM/YYYY] to [DD/MM/YYYY] (see durationMonths).
 * internshipDateRangeShort renders as DD/MM/YYYY - DD/MM/YYYY (Tech COMPLETED ON).
 */

const TEXT_COLOR_BLACK = { r: 0, g: 0, b: 0 };

const TEXT_COLOR_BRAND_BLUE = {
  r: 24 / 255,
  g: 31 / 255,
  b: 197 / 255,
};

/** Tech cert date & credential: #000e41 */
const TEXT_COLOR_NAVY = {
  r: 0 / 255,
  g: 14 / 255,
  b: 65 / 255,
};

const TEXT_COLOR_DEFAULT = {
  r: 0.0392156862745098,
  g: 0.18823529411764706,
  b: 0.3843137254901961,
};

/**
 * CRM Certificates → template Label must match exactly (case-sensitive).
 */
const LAYOUT_BY_TEMPLATE_LABEL = {
  "Non Tech": "internship1",
  "Tech Internship": "internshipTech",
  "new Tech Internship": "internshipTech",
  "Certificate of Appreciation": "appreciation",
  "Certificate of Participation": "participation",
  "Certificate of campus influencer": "participation",
  "Best Performer Certificate": "bestPerformer",
};

const CERTIFICATE_PDF_LAYOUTS = {
  default: {
    key: "default",
    enabledFields: ["studentName", "programTitle", "issuedDate", "certificateId"],
    textColor: TEXT_COLOR_DEFAULT,
    fields: {
      studentName: { x: 147, yFromTop: 254, size: 25 },
      programTitle: { x: 148, yFromTop: 328, size: 22 },
      issuedDate: { x: 196, yFromTop: 508, size: 15 },
      certificateId: { x: 190, yFromTop: 536, size: 15 },
    },
  },

  internship1: {
    key: "internship1",
    font: "poppins-regular",
    durationMonths: 2,
    enabledFields: ["studentName", "programTitle", "internshipDateRange", "certificateId"],
    textColor: TEXT_COLOR_BLACK,
    fields: {
      studentName: { x: 60, yFromTop: 280, size: 31, uppercase: true, font: "poppins-regular" },
      programTitle: { x: 54, yFromTop: 368, size: 16, uppercase: true, font: "poppins-regular" },
      internshipDateRange: { x: 163, yFromTop: 412, size: 16, font: "poppins-regular" },
      certificateId: { x: 86, yFromTop: 456, size: 16, font: "poppins-regular" },
    },
  },

  /** Landscape Tech template (1152×768) — name, program between laurels, from–to + CREDENTIAL ID. */
  internshipTech: {
    key: "internshipTech",
    font: "cormorant-garamond",
    durationMonths: 3,
    enabledFields: ["studentName", "programTitle", "internshipDateRangeShort", "certificateId"],
    textColor: TEXT_COLOR_DEFAULT,
    fields: {
      studentName: {
        centerX: 621,
        yFromTop: 272,
        size: 80,
        font: "cormorant-garamond-bold",
      },
      programTitle: {
        centerX: 621,
        yFromTop: 374,
        size: 25,
        font: "cormorant-garamond-bold",
        color: TEXT_COLOR_BRAND_BLUE,
      },
      /** COMPLETED ON — manager from/to dates */
      internshipDateRangeShort: {
        centerX: 367,
        yFromTop: 552,
        size: 12.4,
        font: "dm-sans",
        color: TEXT_COLOR_NAVY,
      },
      certificateId: {
        centerX: 850,
        yFromTop: 551,
        size: 12.4,
        font: "dm-sans",
        color: TEXT_COLOR_NAVY,
      },
    },
  },

  appreciation: {
    key: "appreciation",
    font: "canva-sans",
    enabledFields: ["studentName", "issuedDate", "certificateId"],
    textColor: TEXT_COLOR_BLACK,
    fields: {
      studentName: {
        centerX: 400,
        yFromTop: 270,
        size: 28,
        font: "libre-baskerville-italic",
      },
      issuedDate: { x: 300, yFromTop: 400.1, size: 13, font: "canva-sans" },
      certificateId: { x: 290, yFromTop: 418, size: 13, font: "canva-sans" },
    },
  },

  /**
   * Landscape A4 (~842×595) — Campus Influencer / Participation.
   * Name sits on the left underline under "THIS IS TO CERTIFY THAT,";
   * date/UID values sit after the DATE: / UID: labels (do not centerX).
   * Used by: "Certificate of Participation", "Certificate of campus influencer".
   */
  participation: {
    key: "participation",
    font: "canva-sans",
    enabledFields: ["studentName", "issuedDate", "certificateId"],
    textColor: TEXT_COLOR_BLACK,
    fields: {
      studentName: {
        x: 260,
        yFromTop: 270,
        size: 26,
        font: "libre-baskerville-italic",
      },
      issuedDate: { x: 300, yFromTop: 399.5, size: 13, font: "canva-sans" },
      certificateId: { x: 290, yFromTop: 417, size: 13, font: "canva-sans" },
    },
  },

  bestPerformer: {
    key: "bestPerformer",
    font: "canva-sans",
    enabledFields: ["studentName", "issuedDate", "certificateId"],
    textColor: TEXT_COLOR_BLACK,
    fields: {
      studentName: {
        centerX: 500,
        yFromTop: 300,
        size: 28,
        font: "canva-sans-bold",
        color: TEXT_COLOR_BRAND_BLUE,
      },
      issuedDate: { x: 490, yFromTop: 400.1, size: 14, font: "canva-sans" },
      certificateId: { x: 364, yFromTop: 420, size: 14, font: "canva-sans" },
    },
  },
};

const FIELD_LABELS = {
  studentName: "Student name",
  programTitle: "Program title",
  issuedDate: "Issue date (DD/MM/YYYY)",
  internshipDateRange: "Internship period [from] to [to]",
  internshipDateRangeShort: "Internship period from - to (DD/MM/YYYY - DD/MM/YYYY)",
  certificateId: "Certificate ID / UUID",
};

function resolveLayoutKey({ templateLabel } = {}) {
  const label = String(templateLabel || "").trim();
  if (label && LAYOUT_BY_TEMPLATE_LABEL[label]) {
    return LAYOUT_BY_TEMPLATE_LABEL[label];
  }
  return "default";
}

function resolveCertificatePdfLayout({ templateLabel } = {}) {
  const layoutKey = resolveLayoutKey({ templateLabel });
  return CERTIFICATE_PDF_LAYOUTS[layoutKey] || CERTIFICATE_PDF_LAYOUTS.default;
}

module.exports = {
  CERTIFICATE_PDF_LAYOUTS,
  LAYOUT_BY_TEMPLATE_LABEL,
  FIELD_LABELS,
  TEXT_COLOR_BLACK,
  TEXT_COLOR_BRAND_BLUE,
  resolveLayoutKey,
  resolveCertificatePdfLayout,
};
