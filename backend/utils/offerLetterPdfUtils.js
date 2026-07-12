const moment = require("moment");
const { PDFDocument, rgb } = require("pdf-lib");
const { fetchPdfBuffer } = require("./certificatePdfUtils");
const {
  resolveOfferLetterPdfLayout,
  isOfferLetterTemplate,
} = require("./offerLetterPdfLayouts");
const { embedOfferLetterFonts, resolveOfferLetterFont } = require("./offerLetterPdfFonts");

const OFFER_LETTER_TEMPLATES = {
  hr: "https://dd4maq26g014m.cloudfront.net/Blank+hrm_20240404_132021_0000.pdf",
  marketing:
    "https://dd4maq26g014m.cloudfront.net/Blank+MARKETING+offer+letter_20240404_132204_0000.pdf",
};

function resolveOfferLetterTemplateId(internshipSlug) {
  return internshipSlug === "human-resources" ? "hr" : "marketing";
}

function resolveOfferLetterTemplateMeta(internshipSlug) {
  const templateId = resolveOfferLetterTemplateId(internshipSlug);
  return {
    templateId,
    templateType: templateId === "hr" ? "offer-letter-hr" : "offer-letter-marketing",
    templateLabel: templateId === "hr" ? "HR Offer Letter" : "Marketing Offer Letter",
    pdfUrl: OFFER_LETTER_TEMPLATES[templateId],
  };
}

function wrapTextLines(text, font, size, maxWidth) {
  const words = String(text || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!words.length) return [];

  const lines = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    const width = font.widthOfTextAtSize(candidate, size);
    if (width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function buildOfferLetterFieldValues({
  candidateName,
  issuedAt,
  programTitle,
  programDomain,
  roleDescription,
}) {
  return {
    issuedDate: moment(issuedAt || new Date()).format("DD/MM/YYYY"),
    candidateName: String(candidateName || "").trim(),
    nameLine: String(candidateName || "").trim(),
    domain: String(programDomain || "").trim(),
    subject: String(programTitle || "").trim(),
    roleTitle: String(programTitle || "").trim(),
    roleDescription: String(roleDescription || "").trim(),
  };
}

function drawSingleLineText(page, { text, position, height, fonts, layout, color }) {
  if (!text || !position) return;
  page.drawText(text, {
    x: position.x,
    y: height - position.yFromTop,
    size: position.size,
    font: resolveOfferLetterFont(fonts, position.font || layout?.font),
    color,
  });
}

function drawWrappedText(page, { text, position, height, fonts, layout, color }) {
  if (!text || !position) return;
  const font = resolveOfferLetterFont(fonts, position.font || layout?.font);
  const size = position.size;
  const lineHeight = position.lineHeight || size + 3;
  const maxWidth = position.maxWidth || 430;
  const lines = wrapTextLines(text, font, size, maxWidth);

  lines.forEach((line, index) => {
    page.drawText(line, {
      x: position.x,
      y: height - position.yFromTop - index * lineHeight,
      size,
      font,
      color,
    });
  });
}

async function buildOfferLetterPdf({
  pdfUrl,
  candidateName,
  issuedAt,
  templateLabel,
  programTitle,
  programDomain,
  roleDescription,
}) {
  const existingPdfBytes = await fetchPdfBuffer(pdfUrl);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const fonts = await embedOfferLetterFonts(pdfDoc);
  const pages = pdfDoc.getPages();
  const layout = resolveOfferLetterPdfLayout({ templateLabel });
  const values = buildOfferLetterFieldValues({
    candidateName,
    issuedAt,
    programTitle,
    programDomain,
    roleDescription,
  });
  const color = rgb(0, 0, 0);

  for (const fieldKey of layout.enabledFields) {
    const position = layout.fields[fieldKey];
    const value = values[fieldKey];
    if (!position || !value) continue;

    const pageIndex = Number.isInteger(position.pageIndex) ? position.pageIndex : 0;
    const page = pages[pageIndex];
    if (!page) continue;
    const { height } = page.getSize();

    if (fieldKey === "roleDescription") {
      drawWrappedText(page, { text: value, position, height, fonts, layout, color });
      continue;
    }

    drawSingleLineText(page, { text: value, position, height, fonts, layout, color });
  }

  return pdfDoc.save();
}

module.exports = {
  OFFER_LETTER_TEMPLATES,
  resolveOfferLetterTemplateId,
  resolveOfferLetterTemplateMeta,
  isOfferLetterTemplate,
  buildOfferLetterPdf,
};
