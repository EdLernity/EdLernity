"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  CertificateTemplateRow,
  InternProfileRow,
  approveInternCertificate,
  deleteIssuedCertificate,
  fetchCertificatePreviewBlob,
  fetchCertificateTemplates,
  fetchInternshipApprovals,
  previewInternshipCertificateDraft,
} from "@/lib/crmApi";
import { formatDate, inputClass, selectClass } from "@/lib/crmUtils";
import { useAuth } from "@/context/AuthContext";
import CrmListPagination, { useClientPagination } from "@/components/crm/CrmListPagination";

type ApprovalFilter = "pending" | "issued" | "all";

function displayName(row: InternProfileRow) {
  const fromKyc = row.kyc?.fullName?.trim();
  if (fromKyc) return fromKyc;
  return `${row.student.firstName || ""} ${row.student.lastName || ""}`.trim() || "—";
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

function isTechInternshipTemplate(template: CertificateTemplateRow) {
  if (template.type === "tech-internship") return true;
  const label = String(template.label || "");
  return /tech/i.test(label) && !/non[\s-]*tech/i.test(label);
}

/** Internship completion PDFs for Approvals (includes Tech / Non Tech even if type slug differs). */
function isInternshipIssueTemplate(template: CertificateTemplateRow) {
  if (template.active === false) return false;
  const type = String(template.type || "");
  if (type === "course-completion" || type.startsWith("offer-letter")) return false;
  if (type === "internship-completion" || type === "tech-internship") return true;
  const label = String(template.label || "");
  return /tech\s*internship|non[\s-]*tech|internship\s*completion/i.test(label);
}

function looksLikeTechProgram(programTitle?: string, internshipSlug?: string) {
  const haystack = `${programTitle || ""} ${internshipSlug || ""}`.toLowerCase();
  if (/non[\s-]*tech/.test(haystack)) return false;
  if (
    /human-?resources|\bhr\b|business-?development|sales-?marketing|lead-?generation|marketing/.test(
      haystack
    )
  ) {
    return false;
  }
  return /tech|software|developer|coding|full[\s-]?stack|data|ai|ml|web|python|java|cloud|devops|salesforce/.test(
    haystack
  );
}

function pickInternshipTemplateId(
  templates: CertificateTemplateRow[],
  programTemplateId?: string | null,
  programTitle?: string,
  internshipSlug?: string
) {
  const list = templates.filter(isInternshipIssueTemplate);
  if (!list.length) return "";

  if (programTemplateId && list.some((t) => t.id === programTemplateId)) {
    return programTemplateId;
  }

  const isTech = looksLikeTechProgram(programTitle, internshipSlug);
  if (isTech) {
    const tech = list.find(
      (t) => /tech/i.test(t.label) && !/non[\s-]*tech/i.test(t.label)
    );
    if (tech) return tech.id;
  } else {
    const nonTech = list.find((t) => /non[\s-]*tech/i.test(t.label));
    if (nonTech) return nonTech.id;
  }

  const completion = list.filter((t) => t.type === "internship-completion");
  return completion[0]?.id || list[0]?.id || "";
}

export default function CrmInternshipApprovalsPage() {
  const { isAdmin, isManager } = useAuth();
  const [status, setStatus] = useState<ApprovalFilter>("pending");
  const [approvals, setApprovals] = useState<InternProfileRow[]>([]);
  const [summary, setSummary] = useState({ pending: 0, issued: 0 });
  const [templates, setTemplates] = useState<CertificateTemplateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [issuing, setIssuing] = useState(false);
  const [unissuingId, setUnissuingId] = useState<string | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [viewerTitle, setViewerTitle] = useState("");
  const [modal, setModal] = useState<{
    studentId: string;
    studentEmail: string;
    internshipSlug: string;
    programTitle: string;
    studentName: string;
    certificateTemplateId: string;
    fromDate: string;
    toDate: string;
    override: boolean;
    internshipCompleted: boolean;
  } | null>(null);

  const hideTechForManager = isManager && !isAdmin;

  const load = () => {
    setLoading(true);
    Promise.all([
      fetchInternshipApprovals(status),
      // Load all templates — filter client-side so Tech / Non Tech show even if type slug differs
      fetchCertificateTemplates().then((data) => data.templates),
    ])
      .then(([data, templateRows]) => {
        setApprovals(data.approvals || []);
        setSummary(data.summary || { pending: 0, issued: 0 });
        setTemplates((templateRows || []).filter(isInternshipIssueTemplate));
      })
      .catch(() => setMessage("Failed to load internship approvals"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return approvals.filter((row) => {
      // Defense in depth: never show business careers on this page
      if (
        !looksLikeTechProgram(
          row.enrollment?.programTitle,
          row.enrollment?.internshipSlug
        )
      ) {
        return false;
      }
      if (!term) return true;
      const name = displayName(row).toLowerCase();
      const email = row.student.email?.toLowerCase() || "";
      const program = row.enrollment?.programTitle?.toLowerCase() || "";
      return name.includes(term) || email.includes(term) || program.includes(term);
    });
  }, [approvals, search]);

  const {
    page: approvalsPage,
    setPage: setApprovalsPage,
    pageItems: pagedApprovals,
    total: approvalsTotal,
    totalPages: approvalsTotalPages,
    from: approvalsFrom,
    to: approvalsTo,
  } = useClientPagination(filtered);

  const openPdfBlob = (blob: Blob, title: string) => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
    setViewerTitle(title);
  };

  const openIssue = (row: InternProfileRow) => {
    const slug = row.enrollment?.internshipSlug || "";
    const enrolledAt = row.enrollment?.enrolledAt
      ? toDateInputValue(new Date(row.enrollment.enrolledAt))
      : monthsAgoDateInput(2);
    const templatesForPicker = hideTechForManager
      ? templates.filter((template) => !isTechInternshipTemplate(template))
      : templates;
    setModal({
      studentId: String(row.student.id),
      studentEmail: row.student.email,
      internshipSlug: slug,
      programTitle: row.enrollment?.programTitle || slug,
      studentName: (() => {
        const name = displayName(row);
        return name === "—" ? "" : name;
      })(),
      certificateTemplateId: pickInternshipTemplateId(
        templatesForPicker,
        hideTechForManager ? null : row.enrollment?.certificateTemplateId,
        row.enrollment?.programTitle || slug,
        slug
      ),
      fromDate: enrolledAt,
      toDate: toDateInputValue(),
      override: Boolean(row.internshipCompletedOverride),
      internshipCompleted: Boolean(row.internshipCompleted),
    });
  };

  const handlePreviewDraft = async () => {
    if (!modal) return;
    if (!modal.certificateTemplateId || !modal.fromDate || !modal.toDate) {
      setMessage("Select template and from/to dates to preview");
      return;
    }
    if (!modal.studentName.trim()) {
      setMessage("Enter the full name to print on the certificate");
      return;
    }
    if (modal.fromDate > modal.toDate) {
      setMessage("From date must be on or before the to date");
      return;
    }
    setPreviewing(true);
    setMessage("");
    try {
      const blob = await previewInternshipCertificateDraft({
        studentId: modal.studentId,
        internshipSlug: modal.internshipSlug,
        certificateTemplateId: modal.certificateTemplateId,
        studentName: modal.studentName.trim(),
        fromDate: modal.fromDate,
        toDate: modal.toDate,
      });
      openPdfBlob(blob, `Preview · ${modal.studentName}`);
    } catch (err: unknown) {
      const apiMessage =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
      setMessage(apiMessage || "Failed to preview certificate");
    } finally {
      setPreviewing(false);
    }
  };

  const handleViewIssued = async (row: InternProfileRow) => {
    const cert = row.completionCertificate;
    if (!cert?.id) {
      setMessage("No issued certificate found for this student");
      return;
    }
    setPreviewing(true);
    setMessage("");
    try {
      const blob = await fetchCertificatePreviewBlob(cert.id, "internship-completion");
      openPdfBlob(blob, `${cert.studentName} · ${cert.programTitle}`);
    } catch {
      setMessage("Failed to load certificate PDF");
    } finally {
      setPreviewing(false);
    }
  };

  const handleUnissue = async (row: InternProfileRow) => {
    const cert = row.completionCertificate;
    if (!cert?.id) {
      setMessage("No issued certificate found for this student");
      return;
    }
    const name = displayName(row);
    const ok = window.confirm(
      `Unissue the internship certificate for ${name}?\n\nThey will disappear from the student portal and can be issued again later.`
    );
    if (!ok) return;

    setUnissuingId(cert.id);
    setMessage("");
    try {
      await deleteIssuedCertificate(cert.id, "internship-completion");
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl("");
        setViewerTitle("");
      }
      setMessage("Certificate unissued — student is back in Awaiting certificate");
      load();
    } catch (err: unknown) {
      const apiMessage =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
      setMessage(apiMessage || "Failed to unissue certificate");
    } finally {
      setUnissuingId(null);
    }
  };

  const handleIssue = async () => {
    if (!modal) return;
    if (!modal.certificateTemplateId) {
      setMessage("Select a certificate template");
      return;
    }
    if (!modal.studentName.trim() || modal.studentName.trim() === "—") {
      setMessage("Enter the full name to print on the certificate");
      return;
    }
    if (!modal.fromDate || !modal.toDate) {
      setMessage("Enter from date and to date");
      return;
    }
    if (modal.fromDate > modal.toDate) {
      setMessage("From date must be on or before the to date");
      return;
    }
    setIssuing(true);
    setMessage("");
    try {
      const selectedTemplate = internshipTemplates.find(
        (t) => String(t.id) === String(modal.certificateTemplateId)
      );
      const isNonTech =
        selectedTemplate &&
        /non[\s-]*tech/i.test(String(selectedTemplate.label || ""));
      // KYC-approved queue (no trainer completion yet): managers override Non Tech; admins always
      const useOverride =
        !modal.internshipCompleted && (Boolean(isAdmin) || Boolean(isNonTech));

      await approveInternCertificate(
        modal.studentId,
        modal.studentName.trim(),
        modal.internshipSlug,
        modal.certificateTemplateId,
        modal.toDate,
        {
          fromDate: modal.fromDate,
          toDate: modal.toDate,
          manualOverride: useOverride,
        }
      );
      setMessage("Internship certificate issued");
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

  const internshipTemplates = useMemo(() => {
    const list = templates
      .filter(isInternshipIssueTemplate)
      .filter((template) => !(hideTechForManager && isTechInternshipTemplate(template)));
    return [...list].sort((a, b) => {
      // Prefer completion templates, then label A–Z
      if (a.type === "internship-completion" && b.type !== "internship-completion") return -1;
      if (b.type === "internship-completion" && a.type !== "internship-completion") return 1;
      return a.label.localeCompare(b.label);
    });
  }, [templates, hideTechForManager]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tech Internship Approvals
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Tech internship students only (excludes HR, sales, marketing, and other business
          careers). Set from/to dates, preview the PDF, then issue.
        </p>
      </div>

      {message && (
        <p className="rounded-lg bg-brand-50 px-4 py-2 text-sm text-brand-600 dark:bg-brand-500/10">
          {message}
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <button
          type="button"
          onClick={() => setStatus("pending")}
          className={`rounded-xl border px-4 py-3 text-left transition ${
            status === "pending"
              ? "border-amber-400 bg-amber-50 ring-2 ring-amber-200 dark:border-amber-400 dark:bg-amber-500/15 dark:ring-amber-500/30"
              : "border-amber-200 bg-amber-50/60 hover:bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/10"
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300">
            Awaiting certificate
          </p>
          <p className="mt-1 text-2xl font-bold text-amber-900 dark:text-amber-100">
            {summary.pending}
          </p>
        </button>
        <button
          type="button"
          onClick={() => setStatus("issued")}
          className={`rounded-xl border px-4 py-3 text-left transition ${
            status === "issued"
              ? "border-emerald-400 bg-emerald-50 ring-2 ring-emerald-200 dark:border-emerald-400 dark:bg-emerald-500/15 dark:ring-emerald-500/30"
              : "border-emerald-200 bg-emerald-50/60 hover:bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10"
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
            Certificate issued
          </p>
          <p className="mt-1 text-2xl font-bold text-emerald-900 dark:text-emerald-100">
            {summary.issued}
          </p>
        </button>
        <button
          type="button"
          onClick={() => setStatus("all")}
          className={`rounded-xl border px-4 py-3 text-left transition ${
            status === "all"
              ? "border-brand-400 bg-brand-50 ring-2 ring-brand-200 dark:border-brand-400 dark:bg-brand-500/15 dark:ring-brand-500/30"
              : "border-gray-200 bg-gray-50 hover:bg-gray-100 dark:border-gray-700 dark:bg-white/[0.03]"
          }`}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            All trainer-completed
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {summary.pending + summary.issued}
          </p>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-white/[0.03]">
          {(
            [
              { id: "pending", label: "Awaiting" },
              { id: "issued", label: "Issued" },
              { id: "all", label: "All" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatus(tab.id)}
              className={`rounded-lg px-3.5 py-1.5 text-sm font-semibold transition ${
                status === tab.id
                  ? "bg-brand-500 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/[0.06]"
              }`}
            >
              {tab.label}
              <span className="ml-1.5 tabular-nums opacity-80">
                {tab.id === "pending"
                  ? summary.pending
                  : tab.id === "issued"
                    ? summary.issued
                    : summary.pending + summary.issued}
              </span>
            </button>
          ))}
        </div>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email, program…"
          className={inputClass() + " max-w-xs"}
        />
      </div>

      {loading ? (
        <p className="py-8 text-center text-sm text-gray-500">Loading approvals…</p>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center dark:border-gray-700 dark:bg-white/[0.02]">
          <p className="text-sm text-gray-500">
            {status === "pending"
              ? "No students waiting for internship certificates."
              : status === "issued"
                ? "No issued internship certificates yet."
                : search.trim()
                  ? "No matching records for this search."
                  : "No trainer-completed students yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {pagedApprovals.map((row) => {
            const cert = row.completionCertificate;
            return (
              <div
                key={row.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {displayName(row)}
                    </p>
                    <p className="text-sm text-gray-500">{row.student.email}</p>
                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                      {row.enrollment?.programTitle || row.enrollment?.internshipSlug}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {row.internshipCompleted ? (
                        <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-semibold text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                          {row.internshipCompletedOverride
                            ? "Trainer: Completed (override)"
                            : "Trainer: Completed"}
                        </span>
                      ) : (
                        <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
                          Profile approved
                        </span>
                      )}
                      {row.awaitingInternshipCertificate ? (
                        <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                          Awaiting manager certificate
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                          Certificate issued
                        </span>
                      )}
                      {cert?.fromDate && cert?.toDate && (
                        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                          {formatDate(cert.fromDate)} → {formatDate(cert.toDate)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {row.awaitingInternshipCertificate ? (
                      <button
                        type="button"
                        onClick={() => openIssue(row)}
                        className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
                      >
                        Issue certificate
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          disabled={previewing || !cert?.id}
                          onClick={() => handleViewIssued(row)}
                          className="rounded-lg border border-brand-200 px-4 py-2 text-sm font-semibold text-brand-600 hover:bg-brand-50 disabled:opacity-60 dark:border-brand-500/30 dark:hover:bg-brand-500/10"
                        >
                          {previewing ? "Loading…" : "View certificate"}
                        </button>
                        <button
                          type="button"
                          disabled={!cert?.id || unissuingId === cert?.id}
                          onClick={() => handleUnissue(row)}
                          className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
                        >
                          {unissuingId === cert?.id ? "Unissuing…" : "Unissue"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && filtered.length > 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <CrmListPagination
            page={approvalsPage}
            totalPages={approvalsTotalPages}
            total={approvalsTotal}
            from={approvalsFrom}
            to={approvalsTo}
            onPageChange={setApprovalsPage}
          />
        </div>
      ) : null}

      {pdfUrl && (
        <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {viewerTitle || "Certificate PDF"}
            </p>
            <div className="flex gap-2">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200"
              >
                Open tab
              </a>
              <button
                type="button"
                onClick={() => {
                  URL.revokeObjectURL(pdfUrl);
                  setPdfUrl("");
                  setViewerTitle("");
                }}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
          <iframe
            title="Certificate preview"
            src={pdfUrl}
            className="h-[70vh] min-h-[480px] w-full rounded-xl border border-gray-100 bg-white dark:border-gray-800"
          />
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Issue internship certificate
            </h3>
            <p className="mb-4 text-sm text-gray-500">
              {modal.programTitle} · {modal.studentEmail}
            </p>
            {modal.override && (
              <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                Trainer used override complete (requirements were not all passed).
              </p>
            )}

            <label className="mb-4 block">
              <span className="mb-1 block text-xs font-medium text-gray-500">
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

            <label className="mb-4 block">
              <span className="mb-1 block text-xs font-medium text-gray-500">
                Certificate template
              </span>
              <select
                className={selectClass()}
                value={modal.certificateTemplateId}
                onChange={(e) =>
                  setModal({ ...modal, certificateTemplateId: e.target.value })
                }
              >
                {internshipTemplates.length === 0 ? (
                  <option value="">No certificate templates found</option>
                ) : (
                  internshipTemplates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                      {modal.certificateTemplateId === t.id &&
                      modal.programTitle &&
                      looksLikeTechProgram(modal.programTitle, modal.internshipSlug) &&
                      /tech/i.test(t.label) &&
                      !/non[\s-]*tech/i.test(t.label)
                        ? " (recommended)"
                        : ""}
                    </option>
                  ))
                )}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                {hideTechForManager ? (
                  <>
                    Managers issue <strong>Non Tech</strong> internship certificates here.
                  </>
                ) : (
                  <>
                    Use <strong>Tech Internship</strong> for tech programs and{" "}
                    <strong>Non Tech</strong> for non-tech. Programs can also link a default in Careers
                    Programs.
                  </>
                )}
              </p>
            </label>

            <div className="mb-4 grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-gray-500">
                  From date (printed)
                </span>
                <input
                  type="date"
                  value={modal.fromDate}
                  onChange={(e) => setModal({ ...modal, fromDate: e.target.value })}
                  className={inputClass()}
                  required
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-gray-500">
                  To date (printed)
                </span>
                <input
                  type="date"
                  value={modal.toDate}
                  onChange={(e) => setModal({ ...modal, toDate: e.target.value })}
                  className={inputClass()}
                  required
                />
              </label>
            </div>
            <p className="mb-4 text-xs text-gray-500">
              These dates appear on the certificate PDF as the internship period (not a separate
              issue date).
            </p>

            <div className="flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setModal(null)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePreviewDraft}
                disabled={
                  previewing ||
                  !modal.studentName.trim() ||
                  !modal.certificateTemplateId ||
                  !modal.fromDate ||
                  !modal.toDate
                }
                className="rounded-lg border border-brand-200 px-4 py-2 text-sm font-semibold text-brand-600 hover:bg-brand-50 disabled:opacity-60"
              >
                {previewing ? "Previewing…" : "Preview PDF"}
              </button>
              <button
                type="button"
                onClick={handleIssue}
                disabled={
                  issuing ||
                  !modal.studentName.trim() ||
                  !modal.certificateTemplateId ||
                  !modal.fromDate ||
                  !modal.toDate
                }
                className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {issuing ? "Issuing…" : "Issue certificate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
