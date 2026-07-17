const moment = require("moment");
const fs = require("fs");
const { PDFDocument, rgb } = require("pdf-lib");
const { resolveCertificatePdfLayout } = require("./certificatePdfLayouts");
const {
  embedCertificateFonts,
  resolveFieldFont,
  formatFieldValue,
} = require("./certificatePdfFonts");

async function fetchPdfBuffer(pdfUrl) {
  if (String(pdfUrl || "").startsWith("/")) {
    return fs.readFileSync(pdfUrl);
  }
  const response = await fetch(pdfUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch PDF: ${response.status}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

function drawCertificateField(page, { value, position, height, width, fonts, layout, textColor }) {
  const font = resolveFieldFont(fonts, position, layout);
  const size = position.size;
  let x = position.x;

  // center: true → page horizontal midpoint; centerX → fixed anchor
  if (position.center === true || position.centerX != null) {
    const textWidth = font.widthOfTextAtSize(value, size);
    const anchor =
      position.center === true
        ? (width != null ? width / 2 : position.centerX)
        : position.centerX;
    x = anchor - textWidth / 2;
  }

  const fieldColor = position.color
    ? rgb(position.color.r, position.color.g, position.color.b)
    : textColor;

  page.drawText(value, {
    x,
    y: height - position.yFromTop,
    size,
    font,
    color: fieldColor,
  });
}

function formatCertificateDate(value) {
  return moment(value || new Date()).format("DD/MM/YYYY");
}

function buildInternshipDateRange(fromDate, toDate) {
  return `[${formatCertificateDate(fromDate)}] to [${formatCertificateDate(toDate)}]`;
}

/** Compact period for Tech COMPLETED ON column: DD/MM/YYYY - DD/MM/YYYY */
function buildInternshipDateRangeShort(fromDate, toDate) {
  return `${formatCertificateDate(fromDate)} - ${formatCertificateDate(toDate)}`;
}

function resolveDefaultFromDate(toDate, layout) {
  const months = Number(layout?.durationMonths) > 0 ? Number(layout.durationMonths) : 2;
  return moment(toDate || new Date())
    .subtract(months, "months")
    .toDate();
}

function buildFieldValues({ studentName, programTitle, uuid, issuedAt, fromDate, toDate, layout }) {
  const to = toDate || issuedAt || new Date();
  const from = fromDate || resolveDefaultFromDate(to, layout);

  return {
    studentName: String(studentName || "").trim(),
    programTitle: String(programTitle || "").trim(),
    issuedDate: formatCertificateDate(to),
    internshipDateRange: buildInternshipDateRange(from, to),
    internshipDateRangeShort: buildInternshipDateRangeShort(from, to),
    certificateId: String(uuid || "").trim(),
  };
}

async function resolveInternshipCertificateDates(certificate) {
  const UserInternship = require("../models/userInternshipSchema");
  const { findKycForProgram } = require("./internKycService");

  // Prefer manager-set from/to dates stored on the certificate record.
  if (certificate?.fromDate && certificate?.toDate) {
    return {
      fromDate: new Date(certificate.fromDate),
      toDate: new Date(certificate.toDate),
    };
  }

  const toDate =
    certificate?.toDate ||
    certificate?.issuedAt ||
    certificate?.createdAt ||
    new Date();
  const [enrollment, kyc] = await Promise.all([
    UserInternship.findOne({
      userId: certificate.userId,
      internshipSlug: certificate.internshipSlug,
    }).sort({ createdAt: -1 }),
    findKycForProgram(certificate.userId, certificate.internshipSlug),
  ]);

  const fromDate =
    certificate?.fromDate ||
    kyc?.approvedAt ||
    enrollment?.createdAt ||
    resolveDefaultFromDate(toDate, { durationMonths: 2 });

  return { fromDate: new Date(fromDate), toDate: new Date(toDate) };
}

async function buildInternshipCompletionPdf({
  pdfUrl,
  templateLabel,
  studentName,
  programTitle,
  uuid,
  issuedAt,
  fromDate,
  toDate,
}) {
  const existingPdfBytes = await fetchPdfBuffer(pdfUrl);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const fonts = await embedCertificateFonts(pdfDoc);
  const firstPage = pdfDoc.getPages()[0];
  const { width, height } = firstPage.getSize();

  const layout = resolveCertificatePdfLayout({ templateLabel });
  const values = buildFieldValues({
    studentName,
    programTitle,
    uuid,
    issuedAt,
    fromDate,
    toDate,
    layout,
  });
  const color = layout.textColor || { r: 0, g: 0, b: 0 };
  const textColor = rgb(color.r, color.g, color.b);

  for (const fieldKey of layout.enabledFields) {
    const position = layout.fields[fieldKey];
    const rawValue = values[fieldKey];
    if (!position || !rawValue) continue;

    const value = formatFieldValue(rawValue, position);
    if (!value) continue;

    drawCertificateField(firstPage, {
      value,
      position,
      height,
      width,
      fonts,
      layout,
      textColor,
    });
  }

  return pdfDoc.save();
}

module.exports = {
  fetchPdfBuffer,
  buildInternshipCompletionPdf,
  resolveCertificatePdfLayout,
  resolveInternshipCertificateDates,
  buildInternshipDateRange,
};
