"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  downloadOfferLetterPdf,
  OFFER_LETTER_TEMPLATES,
  sendOfferLetterEmail,
} from "@/lib/offerLetterUtils";
import {
  recordOfferLetter,
  fetchCareersPrograms,
  fetchIssuedOfferLetters,
} from "@/lib/crmApi";
import { formatDate, inputClass, selectClass } from "@/lib/crmUtils";
import CrmListPagination, { useClientPagination } from "@/components/crm/CrmListPagination";

type IssuedOfferLetterRow = {
  id: string;
  candidateName: string;
  internshipSlug: string;
  templateId?: string;
  templateLabel: string;
  issuedAt: string;
  user: { email: string; name: string; phone?: string } | null;
  issuedBy?: { email?: string; name?: string } | string | null;
};

function issuedByLabel(value: IssuedOfferLetterRow["issuedBy"]) {
  if (!value) return "—";
  if (typeof value === "string") return value || "—";
  return value.name || value.email || "—";
}

export default function CrmOfferLettersPage() {
  const searchParams = useSearchParams();
  const [pdfUrl, setPdfUrl] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [internshipSlug, setInternshipSlug] = useState("sales-marketing");
  const [programs, setPrograms] = useState<Array<{ slug: string; title: string }>>([]);
  const [mailBody, setMailBody] = useState("");
  const [subject, setSubject] = useState("Your EdLernity Offer Letter");
  const [sending, setSending] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [message, setMessage] = useState("");
  const [issued, setIssued] = useState<IssuedOfferLetterRow[]>([]);
  const [issuedLoading, setIssuedLoading] = useState(true);
  const [issuedSearch, setIssuedSearch] = useState("");

  const loadIssued = () => {
    setIssuedLoading(true);
    fetchIssuedOfferLetters()
      .then(setIssued)
      .catch(() => setIssued([]))
      .finally(() => setIssuedLoading(false));
  };

  useEffect(() => {
    fetchCareersPrograms().then(setPrograms).catch(() => {});
    loadIssued();
  }, []);

  useEffect(() => {
    const initialEmail = searchParams.get("email");
    const initialName = searchParams.get("name");
    if (initialEmail) setEmail(initialEmail);
    if (initialName) setName(initialName);
  }, [searchParams]);

  const programTitleBySlug = useMemo(() => {
    const map = new Map(programs.map((p) => [p.slug, p.title]));
    return map;
  }, [programs]);

  const filteredIssued = useMemo(() => {
    const term = issuedSearch.trim().toLowerCase();
    if (!term) return issued;
    return issued.filter((row) => {
      const program =
        programTitleBySlug.get(row.internshipSlug) || row.internshipSlug || "";
      const issuedBy = issuedByLabel(row.issuedBy);
      return (
        row.candidateName.toLowerCase().includes(term) ||
        row.user?.email?.toLowerCase().includes(term) ||
        row.user?.name?.toLowerCase().includes(term) ||
        row.templateLabel.toLowerCase().includes(term) ||
        program.toLowerCase().includes(term) ||
        issuedBy.toLowerCase().includes(term)
      );
    });
  }, [issued, issuedSearch, programTitleBySlug]);

  const {
    page,
    setPage,
    pageItems,
    total,
    totalPages,
    from,
    to,
  } = useClientPagination(filteredIssued);

  const validate = () => {
    if (!pdfUrl || !name.trim()) {
      setMessage("Select a template and enter candidate name");
      return false;
    }
    return true;
  };

  const handleSend = async () => {
    if (!validate() || !email.trim() || !mailBody.trim()) {
      setMessage("Please fill all required fields");
      return;
    }
    setSending(true);
    setMessage("");
    try {
      await sendOfferLetterEmail({
        pdfUrl,
        email: email.trim(),
        name: name.trim(),
        mailBody,
        subject: subject.trim(),
      });
      const template = OFFER_LETTER_TEMPLATES.find((t) => t.url === pdfUrl);
      await recordOfferLetter({
        userEmail: email.trim(),
        internshipSlug,
        candidateName: name.trim(),
        templateId: template?.id,
        templateLabel: template?.label,
      });
      setMessage("Offer letter sent and recorded for intern visibility");
      loadIssued();
    } catch {
      setMessage("Failed to send offer letter");
    } finally {
      setSending(false);
    }
  };

  const handleDownload = async () => {
    if (!validate()) return;
    setDownloading(true);
    try {
      await downloadOfferLetterPdf({
        pdfUrl,
        name: name.trim(),
      });
      setMessage("Offer letter downloaded");
    } catch {
      setMessage("Failed to download offer letter");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Offer Letters</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Generate, send, and review all issued offer letters
        </p>
      </div>

      {message && (
        <p className="text-sm text-brand-600 bg-brand-50 dark:bg-brand-500/10 rounded-lg px-4 py-2">
          {message}
        </p>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="block">
              <span className="text-xs font-medium text-gray-500 mb-1 block">Letter Template *</span>
              <select value={pdfUrl} onChange={(e) => setPdfUrl(e.target.value)} className={selectClass()}>
                <option value="">Select template</option>
                {OFFER_LETTER_TEMPLATES.map((item) => (
                  <option key={item.id} value={item.url}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-medium text-gray-500 mb-1 block">Candidate Name *</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass()}
                placeholder="Full name"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-gray-500 mb-1 block">Candidate Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass()}
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-gray-500 mb-1 block">Careers internship</span>
              <select
                value={internshipSlug}
                onChange={(e) => setInternshipSlug(e.target.value)}
                className={selectClass()}
              >
                {programs.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-medium text-gray-500 mb-1 block">Email Subject</span>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={inputClass()}
              />
            </label>
          </div>
          <div className="space-y-4">
            <label className="block">
              <span className="text-xs font-medium text-gray-500 mb-1 block">Email Body *</span>
              <textarea
                value={mailBody}
                onChange={(e) => setMailBody(e.target.value)}
                rows={10}
                className={inputClass() + " !h-auto py-3"}
                placeholder="Write the email message..."
              />
            </label>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleSend}
                disabled={sending}
                className="px-5 py-2.5 rounded-lg bg-brand-500 text-white text-sm font-medium disabled:opacity-60"
              >
                {sending ? "Sending..." : "Send Email"}
              </button>
              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className="px-5 py-2.5 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-60"
              >
                {downloading ? "Downloading..." : "Download PDF"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 dark:border-gray-800">
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Issued offer letters
            </h2>
            <p className="text-xs text-gray-500">{total} total records</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="search"
              value={issuedSearch}
              onChange={(e) => setIssuedSearch(e.target.value)}
              placeholder="Search name, email, program…"
              className={inputClass() + " max-w-xs"}
            />
            <button
              type="button"
              onClick={loadIssued}
              disabled={issuedLoading}
              className="h-11 rounded-lg border border-gray-300 px-4 text-sm font-medium disabled:opacity-60"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Candidate</th>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Email</th>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Phone</th>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Program</th>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Template</th>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Issued by</th>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Issued</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {issuedLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-gray-500">
                    Loading issued offer letters…
                  </td>
                </tr>
              ) : pageItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-gray-500">
                    No issued offer letters yet
                  </td>
                </tr>
              ) : (
                pageItems.map((row) => (
                  <tr key={row.id}>
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {row.candidateName}
                      </p>
                      {row.user?.name && row.user.name !== row.candidateName ? (
                        <p className="text-xs text-gray-500">{row.user.name}</p>
                      ) : null}
                    </td>
                    <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                      {row.user?.email || "—"}
                    </td>
                    <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                      {row.user?.phone || "—"}
                    </td>
                    <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                      <p>{programTitleBySlug.get(row.internshipSlug) || row.internshipSlug}</p>
                      <p className="text-xs text-gray-400">{row.internshipSlug}</p>
                    </td>
                    <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                      {row.templateLabel || "—"}
                    </td>
                    <td className="px-5 py-3 text-gray-700 dark:text-gray-300">
                      {issuedByLabel(row.issuedBy)}
                    </td>
                    <td className="px-5 py-3 text-gray-600">{formatDate(row.issuedAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <CrmListPagination
          page={page}
          totalPages={totalPages}
          total={total}
          from={from}
          to={to}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
