"use client";

import React, { useEffect, useState } from "react";
import {
  approveIntern,
  createInvite,
  deleteInvite,
  fetchCareersPrograms,
  fetchInvites,
  InternInviteRow,
  rejectIntern,
} from "@/lib/crmApi";
import { formatDate, inputClass, selectClass } from "@/lib/crmUtils";
import { useAuth } from "@/context/AuthContext";

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
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    internshipSlug: "sales-marketing",
    inviteMessage:
      "Welcome to EdLernity! Please complete your onboarding using the link below to receive your login credentials.",
  });

  const load = () => {
    setLoading(true);
    Promise.all([fetchInvites(), fetchCareersPrograms()])
      .then(([inviteRows, programRows]) => {
        setInvites(inviteRows);
        setPrograms(programRows);
      })
      .catch(() => setMessage("Failed to load invites"))
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
    setSubmitting(true);
    setMessage("");
    try {
      const result = await createInvite(form);
      setMessage(result.message || "Invite sent");
      setForm((prev) => ({ ...prev, email: "", firstName: "", lastName: "" }));
      load();
    } catch {
      setMessage("Failed to send invite");
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
        className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 space-y-4 max-w-2xl"
      >
        <h2 className="font-semibold text-gray-900 dark:text-white">Send invite</h2>
        <input
          type="email"
          required
          placeholder="Intern Gmail address *"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={inputClass()}
        />
        <p className="text-xs text-gray-500 -mt-2">Only Gmail addresses are allowed</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            placeholder="First name"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            className={inputClass()}
          />
          <input
            placeholder="Last name"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            className={inputClass()}
          />
        </div>
        <label className="block">
          <span className="text-xs font-medium text-gray-500 mb-1 block">Careers internship *</span>
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
          disabled={submitting}
          className="px-5 py-2.5 rounded-lg bg-brand-500 text-white text-sm font-medium disabled:opacity-60"
        >
          {submitting ? "Sending..." : "Send onboarding link"}
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-gray-500 py-8 text-center">Loading invites...</p>
      ) : invites.length === 0 ? (
        <p className="text-sm text-gray-500 py-8 text-center">No invites yet</p>
      ) : (
        <div className="space-y-4">
          {invites.map((row) => {
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
