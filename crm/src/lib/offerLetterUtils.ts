import moment from "moment";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { sendOfferLetter } from "./crmApi";

export const OFFER_LETTER_TEMPLATES = [
  {
    id: "hr",
    label: "HR Offer Letter",
    url: "https://dd4maq26g014m.cloudfront.net/Blank+hrm_20240404_132021_0000.pdf",
    type: 2,
  },
  {
    id: "marketing",
    label: "Marketing Offer Letter",
    url: "https://dd4maq26g014m.cloudfront.net/Blank+MARKETING+offer+letter_20240404_132204_0000.pdf",
    type: 1,
  },
];

function getTemplateType(pdfUrl: string) {
  const match = OFFER_LETTER_TEMPLATES.find((item) => item.url === pdfUrl);
  return match?.type || 2;
}

async function stampOfferLetterPdf(pdfUrl: string, name: string) {
  const existingPdfBytes = await fetch(pdfUrl).then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const firstPage = pdfDoc.getPages()[0];
  const { height } = firstPage.getSize();
  const today = moment().format("DD/MM/YYYY");
  const type = getTemplateType(pdfUrl);

  firstPage.drawText(today, {
    x: 84.2,
    y: height - 191,
    size: 14,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });
  firstPage.drawText(name, {
    x: 82,
    y: height - 211,
    size: 14,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });

  return pdfDoc.save();
}

export async function sendOfferLetterEmail({
  pdfUrl,
  email,
  name,
  mailBody,
  subject,
}: {
  pdfUrl: string;
  email: string;
  name: string;
  mailBody: string;
  subject: string;
}) {
  const modifiedPdfBytes = await stampOfferLetterPdf(pdfUrl, name);
  const pdfBlob = new Blob([modifiedPdfBytes as BlobPart], { type: "application/pdf" });
  const formData = new FormData();
  formData.append("pdfData", pdfBlob);
  formData.append("email", email);
  formData.append("name", name);
  formData.append("mail", mailBody);
  formData.append("subject", subject);
  return sendOfferLetter(formData);
}

export async function downloadOfferLetterPdf({
  pdfUrl,
  name,
  fileName,
}: {
  pdfUrl: string;
  name: string;
  fileName?: string;
}) {
  const modifiedPdfBytes = await stampOfferLetterPdf(pdfUrl, name);
  const blob = new Blob([modifiedPdfBytes as BlobPart], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName || `${name.replace(/\s+/g, "_")}_offer_letter.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
