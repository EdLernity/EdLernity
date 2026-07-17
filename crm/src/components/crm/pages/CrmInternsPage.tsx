"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CertificateTemplateRow,
  InternProfileRow,
  IssuedInternCertificate,
  approveIntern,
  approveInternCertificate,
  blockIntern,
  deactivateIntern,
  reactivateIntern,
  fetchCertificateTemplates,
  fetchInterns,
  rejectIntern,
} from "@/lib/crmApi";
import { formatDate, inputClass, selectClass } from "@/lib/crmUtils";
import { useAuth } from "@/context/AuthContext";
import CrmListPagination, { useClientPagination } from "@/components/crm/CrmListPagination";

function displayName(row: InternProfileRow) {
  const fromKyc = row.kyc?.fullName?.trim();
  if (fromKyc) return fromKyc;
  return `${row.student.firstName || ""} ${row.student.lastName || ""}`.trim() || "—";
}

function isImageUrl(url: string) {
  return /\.(jpe?g|png|webp)(\?|$)/i.test(url);
}

function KycDocument({ label, url }: { label: string; url: string }) {
  if (!url) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-700 p-3">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="text-xs text-gray-400 mt-1">Not uploaded</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 space-y-2">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      {isImageUrl(url) ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="block">
          <img
            src={url}
            alt={label}
            className="h-28 w-full rounded-lg object-cover border border-gray-100 dark:border-gray-800"
          />
        </a>
      ) : null}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex text-xs font-medium text-brand-500 hover:text-brand-600"
      >
        View document
      </a>
    </div>
  );
}

function approvalStatus(row: InternProfileRow) {
  return row.kyc?.approvalStatus || (row.kyc ? "pending" : "none");
}

function issuedCertificates(row: InternProfileRow): IssuedInternCertificate[] {
  return row.certificates || [];
}

function hasIssuedCertificates(row: InternProfileRow) {
  return issuedCertificates(row).length > 0 || Boolean(row.certificate?.issued);
}

/** Non Tech / internship-completion already issued (including admin override). */
function hasInternshipCompletionCertificate(row: InternProfileRow) {
  return issuedCertificates(row).some((certificate) => {
    const label = String(certificate.templateLabel || "");
    const type = String(certificate.certificateType || "");
    if (/non[\s-]*tech/i.test(label)) return true;
    if (type === "internship-completion" || type === "tech-internship") return true;
    if (/tech/i.test(label) && !/non[\s-]*tech/i.test(label) && /internship/i.test(label)) {
      return true;
    }
    return Boolean(certificate.fromDate && certificate.toDate);
  });
}

function isTechInternshipTemplate(template: CertificateTemplateRow) {
  if (template.type === "tech-internship") return true;
  const label = String(template.label || "");
  return /tech/i.test(label) && !/non[\s-]*tech/i.test(label);
}

function isNonTechTemplate(template: CertificateTemplateRow) {
  return /non[\s-]*tech/i.test(String(template.label || ""));
}

/** Internship completion PDFs print a from–to period (not a single issue date). */
function needsInternshipPeriodDates(template: CertificateTemplateRow | null | undefined) {
  if (!template) return false;
  if (isNonTechTemplate(template)) return true;
  if (template.type === "internship-completion" || template.type === "tech-internship") return true;
  return isTechInternshipTemplate(template);
}

/** Interns Issue Certificate dropdown — only these templates. */
function isAllowedInternIssueTemplate(template: CertificateTemplateRow) {
  if (template.type === "course-completion") return false;
  if (isTechInternshipTemplate(template)) return false;
  if (isNonTechTemplate(template)) return true;
  const label = String(template.label || "").trim().toLowerCase();
  return (
    label === "best performer certificate" ||
    label === "certificate of appreciation" ||
    label === "certificate of campus influencer"
  );
}

function isCompletionCertificateTemplate(template: CertificateTemplateRow) {
  return needsInternshipPeriodDates(template) && isAllowedInternIssueTemplate(template);
}

function isSpecialCertificateTemplate(template: CertificateTemplateRow) {
  return isAllowedInternIssueTemplate(template) && !isNonTechTemplate(template);
}

function pickDefaultCertificateTemplateId(
  templates: CertificateTemplateRow[],
  issuedTemplateIds: string[],
  programTemplateId?: string | null,
  _completionUnlocked = true
) {
  const available = templates.filter(
    (template) =>
      isAllowedInternIssueTemplate(template) &&
      !issuedTemplateIds.includes(String(template.id))
  );
  if (!available.length) return "";

  const completionAvailable = available.filter(isCompletionCertificateTemplate);
  const specialAvailable = available.filter(isSpecialCertificateTemplate);

  // Always prefer Non Tech when still available — admin/manager override handles trainer gate.
  const nonTech = completionAvailable.find((template) => isNonTechTemplate(template));
  if (nonTech) return String(nonTech.id);

  if (
    programTemplateId &&
    available.some((template) => String(template.id) === String(programTemplateId))
  ) {
    return String(programTemplateId);
  }

  if (completionAvailable[0]) return String(completionAvailable[0].id);
  return specialAvailable[0] ? String(specialAvailable[0].id) : "";
}

function isSelectedTemplateIssueBlocked(
  templateId: string,
  templates: CertificateTemplateRow[],
  options: {
    internshipCompleted: boolean;
    manualOverride?: boolean;
    isAdmin?: boolean;
  }
) {
  if (!templateId) return true;
  const selected = templates.find((template) => String(template.id) === String(templateId));
  if (!selected) return true;
  if (selected.type === "course-completion") return true;
  if (
    (selected.type === "internship-completion" || isNonTechTemplate(selected)) &&
    !options.internshipCompleted
  ) {
    // Admins can always override; managers need Manual override for Non Tech
    if (options.isAdmin) return false;
    if (isNonTechTemplate(selected) && options.manualOverride) return false;
    return true;
  }
  return false;
}

function toDateInputValue(d = new Date()) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function monthsAgoDateInput(months: number) {
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  return toDateInputValue(d);
}

export default function CrmInternsPage() {
  const { isAdmin, isManager, isStaff } = useAuth();
  const [interns, setInterns] = useState<InternProfileRow[]>([]);
  const [certificateTemplates, setCertificateTemplates] = useState<CertificateTemplateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [programFilter, setProgramFilter] = useState("all");
  const [kycFilter, setKycFilter] = useState("all");
  const [approvalFilter, setApprovalFilter] = useState("all");
  const [certFilter, setCertFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);
  const [showInactive, setShowInactive] = useState(false);
  const [modal, setModal] = useState<{
    studentId: string;
    studentEmail: string;
    internshipSlug: string;
    programTitle: string;
    studentName: string;
    certificateTemplateId: string;
    issuedAt: string;
    fromDate: string;
    toDate: string;
    certificateUnlocked: boolean;
    courseCompletionUnlocked: boolean;
    internshipCompleted: boolean;
    certificateLockDaysRemaining: number;
    certificateEligibleAt?: string | null;
    issuedTemplateIds: string[];
    issuedCertificates: IssuedInternCertificate[];
    programTemplateId?: string | null;
    programTemplateLabel?: string | null;
    manualOverride: boolean;
  } | null>(null);
  const [issuing, setIssuing] = useState(false);
  const [rejectModal, setRejectModal] = useState<{
    studentId: string;
    studentName: string;
    internshipSlug?: string;
    reason: string;
  } | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  const load = (includeInactive = showInactive) => {
    setLoading(true);
    Promise.all([
      fetchInterns(includeInactive),
      fetchCertificateTemplates({ issuable: true }).then((data) => data.templates),
    ])
      .then(([internRows, templateRows]) => {
        setInterns(internRows);
        setCertificateTemplates(
          templateRows
            .filter((template) => template.active !== false)
            .map((template) => ({ ...template, id: String(template.id) }))
        );
      })
      .catch(() => setMessage("Failed to load intern profiles"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load(showInactive);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showInactive]);

  const programs = useMemo(() => {
    const slugs = new Set<string>();
    interns.forEach((row) => {
      if (row.enrollment?.internshipSlug) slugs.add(row.enrollment.internshipSlug);
      if (row.kyc?.programName) slugs.add(row.kyc.programName);
    });
    return [...slugs].map((slug) => ({
      slug,
      title:
        interns.find((row) => row.enrollment?.internshipSlug === slug)?.enrollment?.programTitle ||
        slug,
    }));
  }, [interns]);

  const awaitingInternshipCount = useMemo(
    () => interns.filter((row) => row.awaitingInternshipCertificate).length,
    [interns]
  );

  const filtered = useMemo(() => {
    return interns.filter((row) => {
      const term = search.trim().toLowerCase();
      const name = displayName(row).toLowerCase();
      const email = row.student.email?.toLowerCase() || "";
      const college = row.kyc?.collegeName?.toLowerCase() || "";
      const matchesSearch = !term || name.includes(term) || email.includes(term) || college.includes(term);
      const slug = row.enrollment?.internshipSlug || "";
      const matchesProgram = programFilter === "all" || slug === programFilter;
      const matchesKyc =
        kycFilter === "all" ||
        (kycFilter === "submitted" && Boolean(row.kyc)) ||
        (kycFilter === "pending" && !row.kyc);
      const status = approvalStatus(row);
      const matchesApproval =
        approvalFilter === "all" ||
        (approvalFilter === "pending" && status === "pending") ||
        (approvalFilter === "approved" && status === "approved");
      const matchesCert =
        certFilter === "all" ||
        (certFilter === "issued" && hasIssuedCertificates(row)) ||
        (certFilter === "pending" && !hasIssuedCertificates(row));
      return matchesSearch && matchesProgram && matchesKyc && matchesApproval && matchesCert;
    });
  }, [interns, search, programFilter, kycFilter, approvalFilter, certFilter]);

  const {
    page: listPage,
    setPage: setListPage,
    pageItems: pagedInterns,
    total: listTotal,
    totalPages: listTotalPages,
    from: listFrom,
    to: listTo,
  } = useClientPagination(
    filtered,
    20,
    `${search}|${programFilter}|${kycFilter}|${approvalFilter}|${certFilter}|${showInactive}`
  );

  const handleApprove = async (row: InternProfileRow) => {
    setActionId(row.id);
    try {
      await approveIntern(row.student.id, row.enrollment?.internshipSlug);
      setMessage("Intern approved. Offer letter is now available in their portal.");
      load();
    } catch {
      setMessage("Failed to approve intern");
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectModal) return;
    setRejectingId(rejectModal.studentId);
    try {
      await rejectIntern(rejectModal.studentId, rejectModal.reason.trim(), rejectModal.internshipSlug);
      setMessage("Application rejected. Intern must re-upload and resubmit.");
      setRejectModal(null);
      load();
    } catch {
      setMessage("Failed to reject application");
    } finally {
      setRejectingId(null);
    }
  };

  const handleIssue = async () => {
    if (!modal) return;
    const selectedTemplate = certificateTemplates.find(
      (t) => String(t.id) === String(modal.certificateTemplateId)
    );
    const adminOverride = Boolean(isAdmin);
    const managerOverride =
      Boolean(modal.manualOverride) && Boolean(selectedTemplate && isNonTechTemplate(selectedTemplate));
    const useOverride = adminOverride || managerOverride;

    if (
      isSelectedTemplateIssueBlocked(modal.certificateTemplateId, certificateTemplates, {
        internshipCompleted: modal.internshipCompleted,
        manualOverride: useOverride,
        isAdmin,
      })
    ) {
      if (
        selectedTemplate &&
        (selectedTemplate.type === "internship-completion" || isNonTechTemplate(selectedTemplate)) &&
        !modal.internshipCompleted
      ) {
        setMessage(
          isNonTechTemplate(selectedTemplate)
            ? "Non Tech is locked until trainer completion — enable Manual override to issue now."
            : "Internship completion waits until the trainer marks the internship completed."
        );
      } else {
        setMessage("Select a certificate type to issue");
      }
      return;
    }
    if (!modal.certificateTemplateId) {
      setMessage("Select a certificate type to issue");
      return;
    }
    if (!modal.studentName.trim() || modal.studentName.trim() === "—") {
      setMessage("Enter the full name to print on the certificate");
      return;
    }
    const isInternshipCompletion = needsInternshipPeriodDates(selectedTemplate);
    if (isInternshipCompletion) {
      if (!modal.fromDate || !modal.toDate) {
        setMessage("Enter internship from date and to date");
        return;
      }
      if (modal.fromDate > modal.toDate) {
        setMessage("From date must be on or before the to date");
        return;
      }
    } else if (!modal.issuedAt) {
      setMessage("Enter the certificate issue date");
      return;
    }

    setIssuing(true);
    try {
      await approveInternCertificate(
        modal.studentId,
        modal.studentName.trim(),
        modal.internshipSlug,
        modal.certificateTemplateId,
        isInternshipCompletion ? modal.toDate : modal.issuedAt,
        isInternshipCompletion
          ? {
              fromDate: modal.fromDate,
              toDate: modal.toDate,
              manualOverride: useOverride,
            }
          : undefined
      );
      setMessage(
        useOverride && !modal.internshipCompleted
          ? "Certificate issued with override (trainer completion bypassed)"
          : "Certificate issued and available in intern portal"
      );
      setModal(null);
      load();
    } catch (err: unknown) {
      const apiMessage =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
      setMessage(apiMessage || "Failed to issue certificate");
    } finally {
      setIssuing(false);
    }
  };

  const handleBlockToggle = async (row: InternProfileRow) => {
    const nextBlocked = !row.student.isBlocked;
    setActionId(row.id);
    try {
      await blockIntern(row.student.id, nextBlocked);
      setMessage(nextBlocked ? "Intern blocked" : "Intern unblocked");
      load();
    } catch {
      setMessage("Failed to update block status");
    } finally {
      setActionId(null);
    }
  };

  const handleDeactivate = async (row: InternProfileRow) => {
    const name = displayName(row);
    const programLabel = row.enrollment?.programTitle
      ? ` for ${row.enrollment.programTitle}`
      : "";
    if (
      !window.confirm(
        `Mark intern ${name} (${row.student.email})${programLabel} as inactive? Records are kept and can be reactivated later.`
      )
    ) {
      return;
    }
    setActionId(row.id);
    try {
      await deactivateIntern(row.student.id, row.enrollment?.internshipSlug);
      setMessage("Intern marked inactive");
      if (expandedId === row.id) setExpandedId(null);
      load(showInactive);
    } catch {
      setMessage("Failed to mark intern inactive");
    } finally {
      setActionId(null);
    }
  };

  const handleReactivate = async (row: InternProfileRow) => {
    setActionId(row.id);
    try {
      await reactivateIntern(row.student.id, row.enrollment?.internshipSlug);
      setMessage("Intern reactivated");
      load(showInactive);
    } catch {
      setMessage("Failed to reactivate intern");
    } finally {
      setActionId(null);
    }
  };

  const openCertificateModal = (row: InternProfileRow) => {
    const slug = row.enrollment?.internshipSlug || "sales-marketing";
    const programTitle = row.enrollment?.programTitle || row.kyc?.programName || slug;
    const issuedTemplateIds = issuedCertificates(row)
      .map((certificate) => certificate.templateId)
      .filter(Boolean)
      .map((id) => String(id));
    const programTemplateId = row.enrollment?.certificateTemplateId
      ? String(row.enrollment.certificateTemplateId)
      : null;
    const internshipCompleted = Boolean(row.internshipCompleted);
    const completionUnlocked =
      internshipCompleted || Boolean(row.courseCompletionUnlocked ?? row.certificateUnlocked);

    const enrolledAt = row.enrollment?.enrolledAt
      ? toDateInputValue(new Date(row.enrollment.enrolledAt))
      : monthsAgoDateInput(2);

    const templatesForPicker = certificateTemplates.filter(isAllowedInternIssueTemplate);

    const preferredProgramTemplateId =
      programTemplateId &&
      templatesForPicker.some((template) => String(template.id) === programTemplateId) &&
      isNonTechTemplate(
        templatesForPicker.find((template) => String(template.id) === programTemplateId)!
      )
        ? programTemplateId
        : null;

    const defaultTemplateId = pickDefaultCertificateTemplateId(
      templatesForPicker,
      issuedTemplateIds,
      preferredProgramTemplateId,
      completionUnlocked
    );

    setModal({
      studentId: String(row.student.id),
      studentEmail: row.student.email,
      internshipSlug: slug,
      programTitle,
      studentName: (() => {
        const name = displayName(row);
        return name === "—" ? "" : name;
      })(),
      issuedAt: toDateInputValue(),
      fromDate: enrolledAt,
      toDate: toDateInputValue(),
      certificateTemplateId: defaultTemplateId,
      certificateUnlocked: Boolean(row.certificateUnlocked),
      courseCompletionUnlocked: Boolean(
        row.courseCompletionUnlocked ?? row.certificateUnlocked
      ),
      internshipCompleted,
      certificateLockDaysRemaining: row.certificateLockDaysRemaining || 0,
      certificateEligibleAt: row.certificateEligibleAt,
      issuedTemplateIds,
      issuedCertificates: issuedCertificates(row),
      programTemplateId: preferredProgramTemplateId,
      programTemplateLabel:
        preferredProgramTemplateId
          ? row.enrollment?.certificateTemplateLabel || null
          : null,
      manualOverride: Boolean(isAdmin) && !internshipCompleted,
    });
  };

  const availableTemplatesForModal = useMemo(() => {
    if (!modal) return [];
    const issued = new Set(modal.issuedTemplateIds.map(String));
    return certificateTemplates.filter((template) => {
      if (issued.has(String(template.id))) return false;
      return isAllowedInternIssueTemplate(template);
    });
  }, [certificateTemplates, modal]);

  // Keep select value valid — empty id was showing first option (Non Tech) but Issue date fields.
  useEffect(() => {
    if (!modal) return;
    const currentId = String(modal.certificateTemplateId || "");
    const stillValid = availableTemplatesForModal.some((t) => String(t.id) === currentId);
    if (stillValid || availableTemplatesForModal.length === 0) return;
    const fallback = availableTemplatesForModal[0];
    setModal((prev) =>
      prev
        ? {
            ...prev,
            certificateTemplateId: String(fallback.id),
            manualOverride:
              Boolean(isAdmin) && !prev.internshipCompleted && isNonTechTemplate(fallback)
                ? true
                : prev.manualOverride,
          }
        : prev
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync only when id/list mismatch
  }, [modal?.certificateTemplateId, availableTemplatesForModal, isAdmin]);

  const completionTemplatesForModal = useMemo(() => {
    return availableTemplatesForModal.filter(isCompletionCertificateTemplate);
  }, [availableTemplatesForModal]);

  const specialTemplatesForModal = useMemo(() => {
    return availableTemplatesForModal.filter(isSpecialCertificateTemplate);
  }, [availableTemplatesForModal]);

  const selectedTemplateForModal = useMemo(() => {
    if (!modal?.certificateTemplateId) return null;
    const id = String(modal.certificateTemplateId);
    return (
      availableTemplatesForModal.find((t) => String(t.id) === id) ||
      certificateTemplates.find((t) => String(t.id) === id) ||
      null
    );
  }, [modal?.certificateTemplateId, availableTemplatesForModal, certificateTemplates]);

  const showPeriodDates =
    needsInternshipPeriodDates(selectedTemplateForModal) ||
    Boolean(
      modal &&
        completionTemplatesForModal.some(
          (t) => String(t.id) === String(modal.certificateTemplateId)
        )
    );
  const showNonTechOverride =
    Boolean(modal) &&
    !isAdmin &&
    Boolean(selectedTemplateForModal && isNonTechTemplate(selectedTemplateForModal)) &&
    !modal!.internshipCompleted;

  const issueBlockedForSelection = modal
    ? isSelectedTemplateIssueBlocked(modal.certificateTemplateId, certificateTemplates, {
        internshipCompleted: modal.internshipCompleted,
        manualOverride: modal.manualOverride || isAdmin,
        isAdmin,
      })
    : true;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Interns</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Career intern profiles, KYC documents, offer letters, and certificates
        </p>
      </div>

      {message && (
        <p className="text-sm text-brand-600 bg-brand-50 dark:bg-brand-500/10 rounded-lg px-4 py-2">{message}</p>
      )}

      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-1 dark:border-gray-800">
        <span className="rounded-t-lg bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-600 dark:bg-brand-500/10">
          All interns
        </span>
        <Link
          href="/internship-approvals"
          className="rounded-t-lg px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.04] dark:hover:text-gray-200"
        >
          Internship certificates
          {awaitingInternshipCount > 0 ? (
            <span className="ml-2 inline-flex min-w-[1.25rem] justify-center rounded-full bg-amber-500 px-1.5 text-[11px] font-bold text-white">
              {awaitingInternshipCount}
            </span>
          ) : null}
        </Link>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        For trainer-completed students waiting on Non Tech certificates, open{" "}
        <Link href="/internship-approvals" className="font-semibold text-brand-500 hover:underline">
          Internship Approvals
        </Link>
        .
      </p>

      <div className="flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={inputClass() + " max-w-xs"}
        />
        <select value={programFilter} onChange={(e) => setProgramFilter(e.target.value)} className={selectClass() + " max-w-[200px]"}>
          <option value="all">All programs</option>
          {programs.map((p) => (
            <option key={p.slug} value={p.slug}>{p.title}</option>
          ))}
        </select>
        <select value={approvalFilter} onChange={(e) => setApprovalFilter(e.target.value)} className={selectClass() + " max-w-[180px]"}>
          <option value="all">All approvals</option>
          <option value="pending">Pending approval</option>
          <option value="approved">Approved</option>
        </select>
        <select value={kycFilter} onChange={(e) => setKycFilter(e.target.value)} className={selectClass() + " max-w-[160px]"}>
          <option value="all">All KYC</option>
          <option value="submitted">KYC submitted</option>
          <option value="pending">KYC pending</option>
        </select>
        <select value={certFilter} onChange={(e) => setCertFilter(e.target.value)} className={selectClass() + " max-w-[160px]"}>
          <option value="all">All certs</option>
          <option value="issued">Issued</option>
          <option value="pending">Pending</option>
        </select>
        {isAdmin && (
          <label className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 px-1">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              className="rounded border-gray-300 text-brand-500 focus:ring-brand-500"
            />
            Show inactive
          </label>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-gray-500 py-8 text-center">Loading intern profiles...</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-gray-500 py-8 text-center">No intern profiles found</p>
      ) : (
        <div className="space-y-4">
          {pagedInterns.map((row) => {
            const isExpanded = expandedId === row.id;
            const busy = actionId === row.id;
            const name = displayName(row);

            return (
              <div
                key={row.id}
                className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 p-5">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : row.id)}
                    className="text-left flex-1 min-w-[200px]"
                  >
                    <div className="flex items-center gap-3">
                      {(isAdmin || isManager) && row.kyc?.photoUrl && isImageUrl(row.kyc.photoUrl) ? (
                        <img
                          src={row.kyc.photoUrl}
                          alt={name}
                          className="h-12 w-12 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-600 font-semibold">
                          {name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{name}</p>
                        <p className="text-sm text-gray-500">{row.student.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {row.student.isBlocked && (
                        <span className="text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded-full">
                          Blocked
                        </span>
                      )}
                      {row.student.isActive === false && (
                        <span className="text-xs font-semibold text-gray-600 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                          Inactive
                        </span>
                      )}
                      {row.kyc ? (
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          KYC submitted
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-amber-600 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-full">
                          KYC pending
                        </span>
                      )}
                      {approvalStatus(row) === "approved" ? (
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          Approved
                        </span>
                      ) : approvalStatus(row) === "pending" ? (
                        <span className="text-xs font-semibold text-amber-600 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-full">
                          Awaiting approval
                        </span>
                      ) : approvalStatus(row) === "rejected" ? (
                        <span className="text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded-full">
                          Rejected
                        </span>
                      ) : null}
                      {row.awaitingInternshipCertificate && (
                        <span className="text-xs font-semibold text-violet-700 bg-violet-50 dark:bg-violet-500/10 px-2 py-0.5 rounded-full">
                          Ready for internship certificate
                        </span>
                      )}
                      {row.internshipCompleted && !row.awaitingInternshipCertificate && (
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          Trainer completed
                        </span>
                      )}
                      {issuedCertificates(row).map((certificate) => (
                        <span
                          key={certificate.id}
                          className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full"
                        >
                          Issued: {certificate.templateLabel}
                        </span>
                      ))}
                      {approvalStatus(row) === "approved" &&
                      !row.internshipCompleted &&
                      !hasInternshipCompletionCertificate(row) &&
                      !row.courseCompletionUnlocked &&
                      !row.certificateUnlocked ? (
                        <span className="text-xs font-semibold text-amber-600 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-full">
                          Awaiting trainer completion
                        </span>
                      ) : approvalStatus(row) === "approved" &&
                        !hasIssuedCertificates(row) &&
                        !row.awaitingInternshipCertificate ? (
                        <span className="text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                          No certificate issued
                        </span>
                      ) : null}
                    </div>
                  </button>

                  <div className="flex flex-wrap items-center gap-2">
                    {approvalStatus(row) === "pending" && row.kyc && (
                      <>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => handleApprove(row)}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-60"
                        >
                          {busy ? "..." : "Approve"}
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() =>
                            setRejectModal({
                              studentId: row.student.id,
                              studentName: displayName(row),
                              internshipSlug: row.enrollment?.internshipSlug,
                              reason: "",
                            })
                          }
                          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10 disabled:opacity-60"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {isStaff && approvalStatus(row) === "approved" && (
                      <button
                        type="button"
                        onClick={() => openCertificateModal(row)}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-brand-500 text-white hover:bg-brand-600"
                      >
                        Issue Certificate
                      </button>
                    )}
                    {isAdmin && (
                      <>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => handleBlockToggle(row)}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-60"
                        >
                          {busy ? "..." : row.student.isBlocked ? "Unblock" : "Block"}
                        </button>
                        {row.student.isActive === false ? (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => handleReactivate(row)}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-brand-200 text-brand-600 hover:bg-brand-50 dark:border-brand-500/30 dark:hover:bg-brand-500/10 disabled:opacity-60"
                          >
                            {busy ? "..." : "Reactivate"}
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => handleDeactivate(row)}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10 disabled:opacity-60"
                          >
                            {busy ? "..." : "Deactivate"}
                          </button>
                        )}
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : row.id)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      {isExpanded ? "Hide" : "View profile"}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-gray-100 dark:border-gray-800 p-5 space-y-6 bg-gray-50/50 dark:bg-gray-900/30">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <p className="text-xs font-medium text-gray-500">Full name</p>
                        <p className="text-sm text-gray-900 dark:text-white mt-1">{name}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">Email</p>
                        <p className="text-sm text-gray-900 dark:text-white mt-1">{row.student.email}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">Phone</p>
                        <p className="text-sm text-gray-900 dark:text-white mt-1">
                          {row.kyc?.phone || row.student.phone || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">Joined</p>
                        <p className="text-sm text-gray-900 dark:text-white mt-1">{formatDate(row.student.joinedAt)}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">College</p>
                        <p className="text-sm text-gray-900 dark:text-white mt-1">{row.kyc?.collegeName || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">Program</p>
                        <p className="text-sm text-gray-900 dark:text-white mt-1">
                          {row.enrollment?.programTitle || row.kyc?.programName || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">Rejection reason</p>
                        <p className="text-sm text-gray-900 dark:text-white mt-1">
                          {row.kyc?.rejectionReason || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">KYC submitted</p>
                        <p className="text-sm text-gray-900 dark:text-white mt-1">
                          {row.kyc?.submittedAt ? formatDate(row.kyc.submittedAt) : "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">Enrollment</p>
                        <p className="text-sm text-gray-900 dark:text-white mt-1">
                          {row.enrollment?.enrolledAt ? formatDate(row.enrollment.enrolledAt) : "—"}
                        </p>
                      </div>
                    </div>

                    {isStaff && row.kyc ? (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Uploaded documents</h3>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                          <KycDocument label="Photo" url={row.kyc.photoUrl || ""} />
                          <KycDocument label="12th certificate" url={row.kyc.twelfthCertificateUrl || ""} />
                          <KycDocument label="Aadhar (front)" url={row.kyc.aadharFrontUrl || ""} />
                          <KycDocument label="Aadhar (back)" url={row.kyc.aadharBackUrl || ""} />
                          <KycDocument label="College ID" url={row.kyc.collegeIdUrl || ""} />
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-amber-600">This intern has not completed internship onboarding yet.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!loading && filtered.length > 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <CrmListPagination
            page={listPage}
            totalPages={listTotalPages}
            total={listTotal}
            from={listFrom}
            to={listTo}
            onPageChange={setListPage}
          />
        </div>
      ) : null}

      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Reject application</h3>
            <p className="text-sm text-gray-500 mb-4">{rejectModal.studentName}</p>
            <label className="block mb-4">
              <span className="text-xs font-medium text-gray-500 mb-1 block">Reason for rejection</span>
              <textarea
                rows={4}
                value={rejectModal.reason}
                onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
                placeholder="Explain what needs to be corrected (documents, details, etc.)"
                className={inputClass() + " !h-auto py-3"}
              />
            </label>
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setRejectModal(null)} className="px-4 py-2 text-sm rounded-lg border border-gray-200">
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={rejectingId === rejectModal.studentId}
                className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white disabled:opacity-60"
              >
                {rejectingId === rejectModal.studentId ? "Rejecting..." : "Reject application"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Issue Certificate</h3>
            <p className="text-sm text-gray-500 mb-4">
              {modal.programTitle} · {modal.studentEmail}
            </p>

            <label className="block mb-4">
              <span className="text-xs font-medium text-gray-500 mb-1 block">
                Full name on certificate *
              </span>
              <input
                value={modal.studentName}
                onChange={(e) => setModal({ ...modal, studentName: e.target.value })}
                className={inputClass()}
                placeholder="Enter full name as it should appear on the PDF"
                autoFocus
              />
              <p className="mt-1 text-xs text-gray-500">
                Prefills from KYC — edit if the printed name should be different.
              </p>
            </label>

            {!modal.internshipCompleted && !isAdmin && !showNonTechOverride ? (
              <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                Internship completion unlocks after the trainer marks the internship completed.
                Recognition certificates can be issued anytime.
              </div>
            ) : null}
            {isAdmin && !modal.internshipCompleted && showPeriodDates ? (
              <div className="mb-4 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-800 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-200">
                Admin override: you can issue Non Tech now without trainer completion. Set the
                internship <strong>from</strong> and <strong>to</strong> dates below.
              </div>
            ) : null}

            {modal.issuedCertificates.length > 0 ? (
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 mb-2">Already issued</p>
                <div className="flex flex-wrap gap-2">
                  {modal.issuedCertificates.map((certificate) => (
                    <span
                      key={certificate.id}
                      className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                    >
                      {certificate.templateLabel}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            <label className="block mb-4">
              <span className="text-xs font-medium text-gray-500 mb-1 block">Certificate type</span>
              {modal.programTemplateLabel ? (
                <p className="mb-2 text-xs text-gray-500">
                  Program default: <strong>{modal.programTemplateLabel}</strong>
                </p>
              ) : null}
              {completionTemplatesForModal.length === 0 && specialTemplatesForModal.length > 0 ? (
                <p className="mb-2 text-xs text-amber-700 dark:text-amber-300">
                  Completion certificate already issued. Choose an additional recognition certificate below.
                </p>
              ) : null}
              <select
                className={selectClass()}
                value={modal.certificateTemplateId ? String(modal.certificateTemplateId) : ""}
                onChange={(e) => {
                  const nextId = e.target.value;
                  const nextTemplate = availableTemplatesForModal.find(
                    (t) => String(t.id) === nextId
                  );
                  const keepAdminOverride =
                    Boolean(isAdmin) &&
                    !modal.internshipCompleted &&
                    Boolean(nextTemplate && isNonTechTemplate(nextTemplate));
                  setModal({
                    ...modal,
                    certificateTemplateId: nextId,
                    manualOverride: keepAdminOverride
                      ? true
                      : nextTemplate && isNonTechTemplate(nextTemplate)
                        ? modal.manualOverride
                        : false,
                  });
                }}
                disabled={availableTemplatesForModal.length === 0}
              >
                {availableTemplatesForModal.length === 0 ? (
                  <option value="">All certificate types already issued</option>
                ) : (
                  <>
                    {completionTemplatesForModal.length > 0 ? (
                      <optgroup label="Internship completion">
                        {completionTemplatesForModal.map((template) => {
                          const locked =
                            !modal.internshipCompleted &&
                            !isAdmin &&
                            !(isNonTechTemplate(template) && modal.manualOverride);
                          return (
                            <option key={template.id} value={String(template.id)}>
                              {template.label}
                              {locked ? " (needs trainer or override)" : ""}
                            </option>
                          );
                        })}
                      </optgroup>
                    ) : null}
                    {specialTemplatesForModal.length > 0 ? (
                      <optgroup label="Recognition certificates">
                        {specialTemplatesForModal.map((template) => (
                          <option key={template.id} value={String(template.id)}>
                            {template.label}
                          </option>
                        ))}
                      </optgroup>
                    ) : null}
                  </>
                )}
              </select>
            </label>

            {showNonTechOverride ? (
              <label className="mb-4 flex cursor-pointer items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-500/30 dark:bg-amber-500/10">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={modal.manualOverride}
                  onChange={(e) =>
                    setModal({ ...modal, manualOverride: e.target.checked })
                  }
                />
                <span>
                  <span className="block text-sm font-semibold text-amber-900 dark:text-amber-100">
                    Manual override (Non Tech only)
                  </span>
                  <span className="mt-0.5 block text-xs text-amber-800 dark:text-amber-200">
                    Issue Non Tech now without waiting for the trainer to mark internship completed.
                  </span>
                </span>
              </label>
            ) : null}

            {showPeriodDates ? (
              <div className="mb-4 space-y-2">
                <p className="text-xs font-medium text-gray-500">
                  Internship period (printed on certificate)
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-gray-500">From date</span>
                    <input
                      type="date"
                      value={modal.fromDate}
                      onChange={(e) => setModal({ ...modal, fromDate: e.target.value })}
                      className={inputClass()}
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-gray-500">To date</span>
                    <input
                      type="date"
                      value={modal.toDate}
                      onChange={(e) => setModal({ ...modal, toDate: e.target.value })}
                      className={inputClass()}
                      required
                    />
                  </label>
                </div>
              </div>
            ) : (
              <label className="mb-4 block">
                <span className="mb-1 block text-xs font-medium text-gray-500">
                  Issue date (printed on certificate)
                </span>
                <input
                  type="date"
                  value={modal.issuedAt}
                  onChange={(e) => setModal({ ...modal, issuedAt: e.target.value })}
                  className={inputClass()}
                  required
                />
              </label>
            )}

            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setModal(null)} className="px-4 py-2 text-sm rounded-lg border border-gray-200">
                Cancel
              </button>
              <button
                type="button"
                onClick={handleIssue}
                disabled={
                  issuing ||
                  !modal.studentName.trim() ||
                  modal.studentName.trim() === "—" ||
                  !modal.certificateTemplateId ||
                  (showPeriodDates ? !modal.fromDate || !modal.toDate : !modal.issuedAt) ||
                  availableTemplatesForModal.length === 0 ||
                  issueBlockedForSelection
                }
                className="px-4 py-2 text-sm rounded-lg bg-brand-500 text-white disabled:opacity-60"
              >
                {issuing ? "Issuing..." : "Issue Certificate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
