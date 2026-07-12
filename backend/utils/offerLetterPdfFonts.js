const fs = require("fs");
const path = require("path");
const { PDFDocument, StandardFonts } = require("pdf-lib");
const fontkit = require("@pdf-lib/fontkit");

const CANVA_SANS_REGULAR_PATH = path.join(__dirname, "../assets/fonts/CanvaSans-Regular.ttf");
const CANVA_SANS_BOLD_PATH = path.join(__dirname, "../assets/fonts/CanvaSans-Bold.ttf");
const MONTSERRAT_MEDIUM_PATH = path.join(__dirname, "../assets/fonts/Montserrat-Medium.ttf");
const MONTSERRAT_SEMIBOLD_PATH = path.join(__dirname, "../assets/fonts/Montserrat-SemiBold.ttf");

const MIN_FULL_FONT_BYTES = 50_000;

const fontBytesCache = {};

function loadFontBytes(cacheKey, filePath) {
  if (!fontBytesCache[cacheKey]) {
    fontBytesCache[cacheKey] = fs.readFileSync(filePath);
  }
  return fontBytesCache[cacheKey];
}

function isFullFont(bytes) {
  return Buffer.isBuffer(bytes) && bytes.length >= MIN_FULL_FONT_BYTES;
}

function resolveRegularFontBytes() {
  const canvaSansBytes = loadFontBytes("canvaSansRegular", CANVA_SANS_REGULAR_PATH);
  if (isFullFont(canvaSansBytes)) {
    return { bytes: canvaSansBytes, key: "canva-sans" };
  }

  const montserratBytes = loadFontBytes("montserratMedium", MONTSERRAT_MEDIUM_PATH);
  return { bytes: montserratBytes, key: "montserrat" };
}

function resolveBoldFontBytes() {
  const canvaSansBoldBytes = loadFontBytes("canvaSansBold", CANVA_SANS_BOLD_PATH);
  if (isFullFont(canvaSansBoldBytes)) {
    return { bytes: canvaSansBoldBytes, key: "canva-sans-bold" };
  }

  const montserratBytes = loadFontBytes("montserratSemiBold", MONTSERRAT_SEMIBOLD_PATH);
  return { bytes: montserratBytes, key: "montserrat-bold" };
}

async function embedOfferLetterFonts(pdfDoc) {
  pdfDoc.registerFontkit(fontkit);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const regular = resolveRegularFontBytes();
  const bold = resolveBoldFontBytes();

  const canvaSans = await pdfDoc.embedFont(regular.bytes, { subset: true });
  const canvaSansBold = await pdfDoc.embedFont(bold.bytes, { subset: true });

  return {
    helveticaBold,
    helvetica,
    "canva-sans": canvaSans,
    "canva-sans-bold": canvaSansBold,
    montserrat: canvaSans,
    "montserrat-bold": canvaSansBold,
    activeRegularFont: regular.key,
    activeBoldFont: bold.key,
  };
}

function resolveOfferLetterFont(fonts, fontKey = "canva-sans") {
  if (fontKey === "canva-sans-bold" || fontKey === "montserrat-bold") {
    return fonts["canva-sans-bold"];
  }
  if (fontKey === "canva-sans" || fontKey === "montserrat") {
    return fonts["canva-sans"];
  }
  if (fontKey === "helvetica") return fonts.helvetica;
  return fonts.helveticaBold;
}

module.exports = {
  embedOfferLetterFonts,
  resolveOfferLetterFont,
  isFullFont,
  MIN_FULL_FONT_BYTES,
};
