import moment from "moment";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const CERTIFICATE_PDF_URL =
  "https://dd4maq26g014m.cloudfront.net/Course+completion+certificate+(EdLernity)_20250508_204220_0000.pdf";

export async function downloadInternshipCertificatePdf({
  studentName,
  programTitle,
  uuid,
}) {
  const existingPdfBytes = await fetch(CERTIFICATE_PDF_URL).then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const firstPage = pdfDoc.getPages()[0];
  const { height } = firstPage.getSize();
  const today = moment().format("DD/MM/YYYY");
  const textColor = rgb(0.0392156862745098, 0.18823529411764706, 0.3843137254901961);

  firstPage.drawText(studentName, {
    x: 147,
    y: height - 254,
    size: 25,
    font: helveticaFont,
    color: textColor,
  });
  firstPage.drawText(programTitle, {
    x: 148,
    y: height - 328,
    size: 22,
    font: helveticaFont,
    color: textColor,
  });
  firstPage.drawText(today, {
    x: 196,
    y: height - 508,
    size: 15,
    font: helveticaFont,
    color: textColor,
  });
  firstPage.drawText(uuid, {
    x: 190,
    y: height - 536,
    size: 15,
    font: helveticaFont,
    color: textColor,
  });

  const modifiedPdfBytes = await pdfDoc.save();
  const blob = new Blob([modifiedPdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${studentName}_${programTitle}_internship_certificate.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
