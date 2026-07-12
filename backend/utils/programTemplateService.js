const CareersProgram = require("../models/careersProgramSchema");
const { CertificateTemplate } = require("../models/certificateTemplateSchema");
const { DEFAULT_CERTIFICATE_TEMPLATES } = require("./certificateTemplateDefaults");
const {
  resolveOfferLetterTemplateMeta: legacyOfferLetterMeta,
} = require("./offerLetterPdfUtils");

async function findCertificateTemplateById(templateId) {
  if (!templateId) return null;
  const template = await CertificateTemplate.findById(templateId);
  if (template) return template;
  return null;
}

async function findDefaultTemplateByType(type) {
  let template = await CertificateTemplate.findOne({ type, active: true }).sort({ updatedAt: -1 });
  if (!template) {
    const fallback = DEFAULT_CERTIFICATE_TEMPLATES.find((row) => row.type === type);
    if (fallback) return fallback;
  }
  return template;
}

async function resolveOfferLetterForProgram(internshipSlug) {
  const program = await CareersProgram.findOne({ slug: internshipSlug, active: true });
  const programContent = {
    programTitle: program?.title || "",
    programDomain: program?.category || program?.trackLabel || "",
    offerLetterRoleDescription: program?.offerLetterRoleDescription || "",
  };

  if (program?.offerLetterTemplateId) {
    const template = await findCertificateTemplateById(program.offerLetterTemplateId);
    if (template?.pdfUrl) {
      return {
        templateId: String(template._id),
        templateType: template.type,
        templateLabel: template.label,
        pdfUrl: template.pdfUrl,
        offerLetterTemplateId: template._id,
        ...programContent,
      };
    }
  }

  const legacy = legacyOfferLetterMeta(internshipSlug);
  const template = await findDefaultTemplateByType(legacy.templateType);
  return {
    templateId: legacy.templateId,
    templateType: legacy.templateType,
    templateLabel: template?.label || legacy.templateLabel,
    pdfUrl: template?.pdfUrl || legacy.pdfUrl,
    offerLetterTemplateId: template?._id || null,
    ...programContent,
  };
}

async function resolveCertificateTemplateForProgram(internshipSlug, storedTemplateId) {
  if (storedTemplateId) {
    const stored = await findCertificateTemplateById(storedTemplateId);
    if (stored?.pdfUrl) return stored;
  }

  const program = await CareersProgram.findOne({ slug: internshipSlug, active: true });
  if (program?.certificateTemplateId) {
    const template = await findCertificateTemplateById(program.certificateTemplateId);
    if (template?.pdfUrl) return template;
  }

  return findDefaultTemplateByType("internship-completion");
}

module.exports = {
  resolveOfferLetterForProgram,
  resolveCertificateTemplateForProgram,
  findCertificateTemplateById,
};
