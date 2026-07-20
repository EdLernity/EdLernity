"use client";

import React, { useEffect, useState } from "react";
import { ReactMultiEmail } from "react-multi-email";
import "react-multi-email/dist/style.css";
import {
  approveIntern,
  createInviteBulk,
  deleteInvite,
  fetchCareersPrograms,
  fetchInvites,
  InternInviteRow,
  rejectIntern,
} from "@/lib/crmApi";
import { formatDate, inputClass, selectClass } from "@/lib/crmUtils";
import { useAuth } from "@/context/AuthContext";
import CrmListPagination, { useClientPagination } from "@/components/crm/CrmListPagination";

function isGmailAddress(email: string) {
  return /^[a-z0-9.+]+@gmail\.com$/i.test(String(email || "").trim());
}

const FALLBACK_PROGRAMS = [
  { slug: "sales-marketing", title: "Sales and Marketing Internship" },
  { slug: "business-development", title: "Business Development Internship" },
  { slug: "lead-generation", title: "Lead Generation Internship" },
  { slug: "human-resources", title: "Human Resources Internship" },
  { slug: "technical", title: "Technical Internship" },
];

function isImageUrl(url: string) {
  return /\.(jpe?g|png|webp)(\?|$)/i.test(url);
}

function KycDocument({ label, url }: { label: string; url: string }) {
  if (!url) return null;
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 space-y-2">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      {isImageUrl(url) ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="block">
          <img
            src={url}
            alt={label}
            className="h-24 w-full rounded-lg object-cover border border-gray-100 dark:border-gray-800"
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

export default function CrmInvitesPage() {
  const { isAdmin, isStaff } = useAuth();
  const [invites, setInvites] = useState<InternInviteRow[]>([]);
  const [programs, setPrograms] = useState<Array<{ slug: string; title: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<{
    inviteId: string;
    userId: string;
    internshipSlug: string;
    name: string;
    reason: string;
  } | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    internshipSlug: "sales-marketing",
    inviteMessage:
      "Welcome to EdLernity! Please complete your onboarding using the link below to receive your login credentials.",
  });

  const {
    page: invitesPage,
    setPage: setInvitesPage,
    pageItems: pagedInvites,
    total: invitesTotal,
    totalPages: invitesTotalPages,
    from: invitesFrom,
    to: invitesTo,
  } = useClientPagination(invites);

  const load = () => {
    setLoading(true);
    Promise.all([
      fetchInvites(),
      fetchCareersPrograms().catch(() => FALLBACK_PROGRAMS),
    ])
      .then(([inviteRows, programRows]) => {
        setInvites(inviteRows);
        const rows = programRows?.length ? programRows : FALLBACK_PROGRAMS;
        setPrograms(rows);
        setForm((prev) => {
          if (rows.some((p) => p.slug === prev.internshipSlug)) return prev;
          return { ...prev, internshipSlug: rows[0]?.slug || "sales-marketing" };
        });
      })
      .catch((err: unknown) => {
        const apiMessage =
          err && typeof err === "object" && "response" in err
            ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
            : null;
        setMessage(apiMessage || "Failed to load invites");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (inviteId: string, email: string) => {
    if (!window.confirm(`Delete invite for ${email}?`)) return;
    setDeletingId(inviteId);
    setMessage("");
    try {
      await deleteInvite(inviteId);
      setMessage("Invite deleted");
      load();
    } catch {
      setMessage("Failed to delete invite");
    } finally {
      setDeletingId(null);
    }
  };

  const handleApprove = async (row: InternInviteRow) => {
    if (!row.user?.id) return;
    setApprovingId(row.id);
    setMessage("");
    try {
      await approveIntern(row.user.id, row.internshipSlug);
      setMessage("Intern approved. Offer letter is now available in their portal.");
      load();
    } catch {
      setMessage("Failed to approve intern");
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectModal) return;
    setRejectingId(rejectModal.inviteId);
    setMessage("");
    try {
      await rejectIntern(
        rejectModal.userId,
        rejectModal.reason.trim(),
        rejectModal.internshipSlug
      );
      setMessage("Application rejected. Intern must re-upload and resubmit.");
      setRejectModal(null);
      load();
    } catch {
      setMessage("Failed to reject application");
    } finally {
      setRejectingId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const uniqueEmails = [...new Set(emails.map((e) => e.trim().toLowerCase()).filter(Boolean))];
    if (!uniqueEmails.length) {
      setMessage("Add at least one Gmail address (press Enter or comma after each email)");
      return;
    }
    if (uniqueEmails.length > 50) {
      setMessage("Maximum 50 emails per bulk invite");
      return;
    }

    setSubmitting(true);
    setMessage("");
    try {
      const result = await createInviteBulk({
        emails: uniqueEmails,
        firstName: form.firstName,
        lastName: form.lastName,
        internshipSlug: form.internshipSlug,
        inviteMessage: form.inviteMessage,
      });
      const failHint = result.failed?.length
        ? ` Failed: ${result.failed
            .slice(0, 5)
            .map((f) => `${f.email} (${f.reason})`)
            .join("; ")}${result.failed.length > 5 ? "…" : ""}`
        : "";
      setMessage(`${result.message || "Invites sent."}${failHint}`);
      if (result.sent?.length) {
        setEmails([]);
        setForm((prev) => ({ ...prev, firstName: "", lastName: "" }));
        load();
      }
    } catch (err: unknown) {
      const apiMessage =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
      setMessage(apiMessage || "Failed to send invites. Check backend/email configuration.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Intern Invites</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Send onboarding links, view intern KYC details, and approve applications for offer letters.
        </p>
      </div>

      {message && (
        <p className="text-sm text-brand-600 bg-brand-50 dark:bg-brand-500/10 rounded-lg px-4 py-2">{message}</p>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl space-y-4 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]"
      >
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-white">Send invites (bulk)</h2>
          <p className="mt-1 text-xs text-gray-500">
            Type a Gmail, then press <strong>Enter</strong> or <strong>,</strong> to add a chip.
            Paste multiple emails separated by commas or spaces.
          </p>
        </div>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-gray-500">
            Intern Gmail addresses * ({emails.length} added)
          </span>
          <ReactMultiEmail
            className="crm-invite-multi-email"
            emails={emails}
            onChange={setEmails}
            allowDuplicate={false}
            placeholder="name@gmail.com"
            validateEmail={(email) => isGmailAddress(email)}
            getLabel={(email, index, removeEmail) => (
              <div data-tag key={email} className="crm-invite-chip">
                <span data-tag-item>{email}</span>
                <span
                  data-tag-handle
                  role="button"
                  tabIndex={0}
                  onClick={() => removeEmail(index)}
                  onKeyDown={(ev) => {
                    if (ev.key === "Enter" || ev.key === " ") removeEmail(index);
                  }}
                >
                  ×
                </span>
              </div>
            )}
          />
          <p className="mt-1.5 text-xs text-gray-500">
            Only @gmail.com addresses. Up to 50 per send.
          </p>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <input
            placeholder="First name (optional, shared)"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            className={inputClass()}
          />
          <input
            placeholder="Last name (optional, shared)"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            className={inputClass()}
          />
        </div>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-gray-500">Careers internship *</span>
          <select
            value={form.internshipSlug}
            onChange={(e) => setForm({ ...form, internshipSlug: e.target.value })}
            className={selectClass()}
          >
            {programs.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.title}
              </option>
            ))}
          </select>
        </label>
        <textarea
          rows={4}
          value={form.inviteMessage}
          onChange={(e) => setForm({ ...form, inviteMessage: e.target.value })}
          className={inputClass() + " !h-auto py-3"}
          placeholder="Custom message in invite email"
        />
        <button
          type="submit"
          disabled={submitting || emails.length === 0}
          className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {submitting
            ? `Sending ${emails.length} invite${emails.length === 1 ? "" : "s"}…`
            : `Send ${emails.length || ""} invite${emails.length === 1 ? "" : "s"}`}
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-gray-500 py-8 text-center">Loading invites...</p>
      ) : invites.length === 0 ? (
        <p className="text-sm text-gray-500 py-8 text-center">No invites yet</p>
      ) : (
        <div className="space-y-4">
          {pagedInvites.map((row) => {
            const isExpanded = expandedId === row.id;
            const approval = row.kyc?.approvalStatus || row.approvalStatus;
            const busy = deletingId === row.id || approvingId === row.id || rejectingId === row.id;

            return (
              <div
                key={row.id}
                className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 p-5">
                  <div className="min-w-[220px]">
                    <p className="font-semibold text-gray-900 dark:text-white">{row.email}</p>
                    <p className="text-sm text-gray-500">
                      {row.firstName} {row.lastName}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{row.programTitle}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs font-semibold capitalize text-gray-600 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                        {row.status}
                      </span>
                      {approval === "pending" && (
                        <span className="text-xs font-semibold text-amber-600 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-full">
                          Awaiting approval
                        </span>
                      )}
                      {approval === "approved" && (
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          Approved
                        </span>
                      )}
                      {approval === "rejected" && (
                        <span className="text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded-full">
                          Rejected
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-sm space-y-1">
                    <p className="text-gray-500">
                      Password:{" "}
                      <span className="font-mono text-gray-800 dark:text-gray-200">
                        {row.password || row.onboardingPassword || "—"}
                      </span>
                    </p>
                    <p className="text-gray-500">Expires: {formatDate(row.expiresAt)}</p>
                    {row.acceptedAt && (
                      <p className="text-gray-500">Onboarded: {formatDate(row.acceptedAt)}</p>
                    )}
                    <a href={row.inviteUrl} target="_blank" rel="noreferrer" className="text-xs text-brand-500">
                      Open invite link
                    </a>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {approval === "pending" && row.user?.id && (
                      <>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => handleApprove(row)}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-60"
                        >
                          {approvingId === row.id ? "Approving..." : "Approve"}
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() =>
                            setRejectModal({
                              inviteId: row.id,
                              userId: row.user!.id,
                              internshipSlug: row.internshipSlug,
                              name: row.kyc?.fullName || row.email,
                              reason: "",
                            })
                          }
                          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10 disabled:opacity-60"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : row.id)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      {isExpanded ? "Hide details" : "View details"}
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => handleDelete(row.id, row.email)}
                      className="text-xs font-medium text-error-500 hover:text-error-600 disabled:opacity-50"
                    >
                      {deletingId === row.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-gray-100 dark:border-gray-800 p-5 bg-gray-50/50 dark:bg-gray-900/30 space-y-4">
                    {row.kyc ? (
                      <>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                          <div>
                            <p className="text-xs font-medium text-gray-500">Full name</p>
                            <p className="text-sm text-gray-900 dark:text-white mt-1">{row.kyc.fullName}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500">Phone</p>
                            <p className="text-sm text-gray-900 dark:text-white mt-1">{row.kyc.phone}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500">College</p>
                            <p className="text-sm text-gray-900 dark:text-white mt-1">{row.kyc.collegeName}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500">Program</p>
                            <p className="text-sm text-gray-900 dark:text-white mt-1">{row.kyc.programName}</p>
                          </div>
                        </div>
                        {row.kyc.rejectionReason && (
                          <p className="text-sm text-red-600">
                            <span className="font-medium">Rejection reason:</span> {row.kyc.rejectionReason}
                          </p>
                        )}
                        {isStaff ? (
                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                            <KycDocument label="Photo" url={row.kyc.photoUrl || ""} />
                            <KycDocument label="12th certificate" url={row.kyc.twelfthCertificateUrl || ""} />
                            <KycDocument label="Aadhar (front)" url={row.kyc.aadharFrontUrl || ""} />
                            <KycDocument label="Aadhar (back)" url={row.kyc.aadharBackUrl || ""} />
                            <KycDocument label="College ID" url={row.kyc.collegeIdUrl || ""} />
                          </div>
                        ) : null}
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">Onboarding not completed yet.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!loading && invites.length > 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <CrmListPagination
            page={invitesPage}
            totalPages={invitesTotalPages}
            total={invitesTotal}
            from={invitesFrom}
            to={invitesTo}
            onPageChange={setInvitesPage}
          />
        </div>
      ) : null}

      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Reject application</h3>
            <p className="text-sm text-gray-500 mb-4">{rejectModal.name}</p>
            <label className="block mb-4">
              <span className="text-xs font-medium text-gray-500 mb-1 block">Reason for rejection</span>
              <textarea
                rows={4}
                value={rejectModal.reason}
                onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
                placeholder="Explain what needs to be corrected"
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
                disabled={rejectingId === rejectModal.inviteId}
                className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white disabled:opacity-60"
              >
                {rejectingId === rejectModal.inviteId ? "Rejecting..." : "Reject application"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
