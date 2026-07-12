const fs = require("fs");
const path = require("path");
const fontkit = require("@pdf-lib/fontkit");
const {
  embedOfferLetterFonts,
  resolveOfferLetterFont,
} = require("./offerLetterPdfFonts");

const POPPINS_BOLD_PATH = path.join(__dirname, "../assets/fonts/Poppins-Bold.ttf");
const POPPINS_REGULAR_PATH = path.join(__dirname, "../assets/fonts/Poppins-Regular.ttf");
const LIBRE_BASKERVILLE_ITALIC_PATH = path.join(
  __dirname,
  "../assets/fonts/LibreBaskerville-Italic.ttf"
);

let poppinsBoldBytes = null;
let poppinsRegularBytes = null;
let libreBaskervilleItalicBytes = null;

function loadPoppinsBoldBytes() {
  if (!poppinsBoldBytes) {
    poppinsBoldBytes = fs.readFileSync(POPPINS_BOLD_PATH);
  }
  return poppinsBoldBytes;
}

function loadPoppinsRegularBytes() {
  if (!poppinsRegularBytes) {
    poppinsRegularBytes = fs.readFileSync(POPPINS_REGULAR_PATH);
  }
  return poppinsRegularBytes;
}

function loadLibreBaskervilleItalicBytes() {
  if (!libreBaskervilleItalicBytes) {
    libreBaskervilleItalicBytes = fs.readFileSync(LIBRE_BASKERVILLE_ITALIC_PATH);
  }
  return libreBaskervilleItalicBytes;
}

async function embedCertificateFonts(pdfDoc) {
  pdfDoc.registerFontkit(fontkit);
  const offerFonts = await embedOfferLetterFonts(pdfDoc);
  const poppins = await pdfDoc.embedFont(loadPoppinsBoldBytes(), { subset: true });
  const poppinsRegular = await pdfDoc.embedFont(loadPoppinsRegularBytes(), { subset: true });
  const libreBaskervilleItalic = await pdfDoc.embedFont(loadLibreBaskervilleItalicBytes(), {
    subset: true,
  });
  return {
    helvetica: offerFonts.helveticaBold,
    poppins,
    poppinsRegular,
    "canva-sans": offerFonts["canva-sans"],
    "canva-sans-bold": offerFonts["canva-sans-bold"],
    "libre-baskerville-italic": libreBaskervilleItalic,
  };
}

function resolveFieldFont(fonts, fieldConfig = {}, layout = {}) {
  const fontKey = fieldConfig.font || layout.font || "helvetica";
  if (fontKey === "libre-baskerville-italic") return fonts["libre-baskerville-italic"];
  if (fontKey === "canva-sans" || fontKey === "canva-sans-bold") {
    return resolveOfferLetterFont(fonts, fontKey);
  }
  if (fontKey === "poppins-regular") return fonts.poppinsRegular;
  if (fontKey === "poppins") return fonts.poppins;
  return fonts.helvetica;
}

function formatFieldValue(value, fieldConfig = {}) {
  const text = String(value || "").trim();
  if (!text) return "";
  if (fieldConfig.uppercase) return text.toUpperCase();
  return text;
}

module.exports = {
  embedCertificateFonts,
  resolveFieldFont,
  formatFieldValue,
};
