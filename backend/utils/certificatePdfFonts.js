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
const CORMORANT_GARAMOND_REGULAR_PATH = path.join(
  __dirname,
  "../assets/fonts/CormorantGaramond-Regular.ttf"
);
const CORMORANT_GARAMOND_BOLD_PATH = path.join(
  __dirname,
  "../assets/fonts/CormorantGaramond-Bold.ttf"
);
const CORMORANT_GARAMOND_SEMIBOLD_PATH = path.join(
  __dirname,
  "../assets/fonts/CormorantGaramond-SemiBold.ttf"
);
const CORMORANT_GARAMOND_ITALIC_PATH = path.join(
  __dirname,
  "../assets/fonts/CormorantGaramond-Italic.ttf"
);
const DM_SANS_REGULAR_PATH = path.join(__dirname, "../assets/fonts/DMSans-Regular.ttf");

let poppinsBoldBytes = null;
let poppinsRegularBytes = null;
let libreBaskervilleItalicBytes = null;
let cormorantGaramondRegularBytes = null;
let cormorantGaramondBoldBytes = null;
let cormorantGaramondSemiBoldBytes = null;
let cormorantGaramondItalicBytes = null;
let dmSansRegularBytes = null;

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

function loadCormorantGaramondRegularBytes() {
  if (!cormorantGaramondRegularBytes) {
    cormorantGaramondRegularBytes = fs.readFileSync(CORMORANT_GARAMOND_REGULAR_PATH);
  }
  return cormorantGaramondRegularBytes;
}

function loadCormorantGaramondBoldBytes() {
  if (!cormorantGaramondBoldBytes) {
    cormorantGaramondBoldBytes = fs.readFileSync(CORMORANT_GARAMOND_BOLD_PATH);
  }
  return cormorantGaramondBoldBytes;
}

function loadCormorantGaramondSemiBoldBytes() {
  if (!cormorantGaramondSemiBoldBytes) {
    cormorantGaramondSemiBoldBytes = fs.readFileSync(CORMORANT_GARAMOND_SEMIBOLD_PATH);
  }
  return cormorantGaramondSemiBoldBytes;
}

function loadCormorantGaramondItalicBytes() {
  if (!cormorantGaramondItalicBytes) {
    cormorantGaramondItalicBytes = fs.readFileSync(CORMORANT_GARAMOND_ITALIC_PATH);
  }
  return cormorantGaramondItalicBytes;
}

function loadDmSansRegularBytes() {
  if (!dmSansRegularBytes) {
    dmSansRegularBytes = fs.readFileSync(DM_SANS_REGULAR_PATH);
  }
  return dmSansRegularBytes;
}

async function embedCertificateFonts(pdfDoc) {
  pdfDoc.registerFontkit(fontkit);
  const offerFonts = await embedOfferLetterFonts(pdfDoc);
  const poppins = await pdfDoc.embedFont(loadPoppinsBoldBytes(), { subset: true });
  const poppinsRegular = await pdfDoc.embedFont(loadPoppinsRegularBytes(), { subset: true });
  const libreBaskervilleItalic = await pdfDoc.embedFont(loadLibreBaskervilleItalicBytes(), {
    subset: true,
  });
  const cormorantGaramond = await pdfDoc.embedFont(loadCormorantGaramondRegularBytes(), {
    subset: true,
  });
  const cormorantGaramondBold = await pdfDoc.embedFont(loadCormorantGaramondBoldBytes(), {
    subset: true,
  });
  const cormorantGaramondSemiBold = await pdfDoc.embedFont(loadCormorantGaramondSemiBoldBytes(), {
    subset: true,
  });
  const cormorantGaramondItalic = await pdfDoc.embedFont(loadCormorantGaramondItalicBytes(), {
    subset: true,
  });
  const dmSans = await pdfDoc.embedFont(loadDmSansRegularBytes(), { subset: true });
  return {
    helvetica: offerFonts.helveticaBold,
    poppins,
    poppinsRegular,
    "canva-sans": offerFonts["canva-sans"],
    "canva-sans-bold": offerFonts["canva-sans-bold"],
    "libre-baskerville-italic": libreBaskervilleItalic,
    "cormorant-garamond": cormorantGaramond,
    "cormorant-garamond-bold": cormorantGaramondBold,
    "cormorant-garamond-semibold": cormorantGaramondSemiBold,
    "cormorant-garamond-italic": cormorantGaramondItalic,
    "dm-sans": dmSans,
  };
}

function resolveFieldFont(fonts, fieldConfig = {}, layout = {}) {
  const fontKey = fieldConfig.font || layout.font || "helvetica";
  if (fontKey === "libre-baskerville-italic") return fonts["libre-baskerville-italic"];
  if (fontKey === "cormorant-garamond") return fonts["cormorant-garamond"];
  if (fontKey === "cormorant-garamond-bold") return fonts["cormorant-garamond-bold"];
  if (fontKey === "cormorant-garamond-semibold") return fonts["cormorant-garamond-semibold"];
  if (fontKey === "cormorant-garamond-italic") return fonts["cormorant-garamond-italic"];
  if (fontKey === "dm-sans") return fonts["dm-sans"];
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
