/**
 * Hardcoded offer letter overlay layouts — edit coordinates here only.
 *
 * Map CRM template Label → layout key in LAYOUT_BY_TEMPLATE_LABEL (exact match).
 * Unmapped offer letter templates use "legacy" (date + name only).
 *
 * Fonts: "canva-sans", "canva-sans-bold", "montserrat", "helvetica", "helvetica-bold"
 * Uses full CanvaSans TTF when present; otherwise Montserrat Medium / SemiBold.
 */

const LAYOUT_BY_TEMPLATE_LABEL = {
  "Generic Offer Letter": "generic",
};

const OFFER_LETTER_PDF_LAYOUTS = {
  legacy: {
    key: "legacy",
    enabledFields: ["issuedDate", "candidateName"],
    fields: {
      issuedDate: { x: 84.2, yFromTop: 191, size: 14, font: "helvetica-bold" },
      candidateName: { x: 82, yFromTop: 211, size: 14, font: "helvetica-bold" },
    },
  },

  generic: {
    key: "generic",
    font: "canva-sans",
    enabledFields: [
      "issuedDate",
      "candidateName",
      "domain",
      "subject",
      "roleTitle",
      "roleDescription",
      "nameLine",
    ],
    fields: {
      issuedDate: { x: 88, yFromTop: 184.5, size: 14, font: "canva-sans-bold" },
      candidateName: { x: 82, yFromTop: 202, size: 14, font: "canva-sans-bold" },
      domain: { x: 108, yFromTop: 220, size: 14, font: "canva-sans-bold" },
      subject: { x: 218, yFromTop: 240.5, size: 14, font: "canva-sans-bold" },
      roleTitle: { x: 198, yFromTop: 631.5, size: 13.5, font: "canva-sans-bold" },
      roleDescription: {
        x: 40,
        yFromTop: 654,
        size: 13,
        font: "canva-sans",
        maxWidth: 500,
        lineHeight: 20,
      },
      nameLine: {
        x: 110,
        yFromTop: 530,
        size: 14,
        font: "canva-sans-bold",
        pageIndex: 2,
      },
    },
  },
};

function resolveOfferLetterLayoutKey({ templateLabel } = {}) {
  const label = String(templateLabel || "").trim();
  if (label && LAYOUT_BY_TEMPLATE_LABEL[label]) {
    return LAYOUT_BY_TEMPLATE_LABEL[label];
  }
  return "legacy";
}

function resolveOfferLetterPdfLayout({ templateLabel } = {}) {
  const layoutKey = resolveOfferLetterLayoutKey({ templateLabel });
  return OFFER_LETTER_PDF_LAYOUTS[layoutKey] || OFFER_LETTER_PDF_LAYOUTS.legacy;
}

function isOfferLetterTemplate(template) {
  const type = String(template?.type || "");
  const label = String(template?.label || "");
  if (type.includes("offer-letter")) return true;
  if (/offer\s*letter/i.test(label)) return true;
  return false;
}

module.exports = {
  LAYOUT_BY_TEMPLATE_LABEL,
  OFFER_LETTER_PDF_LAYOUTS,
  resolveOfferLetterLayoutKey,
  resolveOfferLetterPdfLayout,
  isOfferLetterTemplate,
};
