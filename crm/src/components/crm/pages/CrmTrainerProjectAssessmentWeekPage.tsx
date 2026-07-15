"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  fetchTrainerProjectAssessments,
  reviewTrainerProject,
  TrainerProjectAssessmentRow,
} from "@/lib/crmApi";
import { selectClass } from "@/lib/crmUtils";
import { formatDateTime, ProgressBar } from "./trainerAssessmentShared";

type StatusFilter =
  | "all"
  | "awaiting_review"
  | "approved"
  | "rejected"
  | "pending";

export default function CrmTrainerProjectAssessmentWeekPage() {
  const params = useParams();
  const router = useRouter();
  const slug = String(params.slug || "");
  const weekIndex = Number(params.weekIndex);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [rows, setRows] = useState<TrainerProjectAssessmentRow[]>([]);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [rejectDraft, setRejectDraft] = useState<Record<string, string>>({});
  const [busyKey, setBusyKey] = useState("");

  const projectKey = `${slug}:${weekIndex}`;

  const load = useCallback(async () => {
    if (!slug || !Number.isInteger(weekIndex) || weekIndex < 0) {
      router.replace("/trainer/assessments?tab=projects");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await fetchTrainerProjectAssessments({
        slug,
        projectKey,
        status: "all",
      });
      setRows(data.rows || []);
      if (!(data.rows || []).length && !(data.projects || []).some((p) => p.key === projectKey)) {
        setError("This project week was not found.");
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to load project submissions");
    } finally {
      setLoading(false);
    }
  }, [slug, weekIndex, projectKey, router]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim().toLowerCase()), 250);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const meta = rows[0];
  const summary = useMemo(() => {
    const submitted = rows.filter((r) => r.submitted).length;
    const awaitingReview = rows.filter(
      (r) => r.submitted && r.reviewStatus === "pending"
    ).length;
    const approved = rows.filter((r) => r.reviewStatus === "approved").length;
    const rejected = rows.filter((r) => r.reviewStatus === "rejected").length;
    return {
      total: rows.length,
      submitted,
      pending: rows.length - submitted,
      awaitingReview,
      approved,
      rejected,
      completionPercent: rows.length
        ? Math.round((approved / rows.length) * 100)
        : 0,
    };
  }, [rows]);

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      if (status === "pending" && row.submitted) return false;
      if (status === "awaiting_review" && !(row.submitted && row.reviewStatus === "pending")) {
        return false;
      }
      if (status === "approved" && row.reviewStatus !== "approved") return false;
      if (status === "rejected" && row.reviewStatus !== "rejected") return false;
      if (!search) return true;
      const hay = `${row.studentName} ${row.studentEmail} ${row.phone || ""}`.toLowerCase();
      return hay.includes(search);
    });
  }, [rows, status, search]);

  const handleReview = async (
    row: TrainerProjectAssessmentRow,
    decision: "approved" | "rejected" | "pending"
  ) => {
    const reason = (rejectDraft[row.id] || "").trim();
    if (decision === "rejected" && reason.length < 5) {
      setError("Add feedback explaining what the student should improve.");
      return;
    }

    const confirmText =
      decision === "approved"
        ? `Approve ${row.studentName}'s submission for "${row.title}"?\n\nThis marks the project as verified.`
        : decision === "rejected"
          ? `Reject ${row.studentName}'s submission for "${row.title}"?\n\nThey will need to improve and resubmit.\n\nFeedback: ${reason}`
          : `Revert the review decision for ${row.studentName} on "${row.title}"?\n\nStatus will go back to awaiting review.`;
    if (!window.confirm(confirmText)) return;

    const key = `${row.id}:${decision}`;
    setBusyKey(key);
    setError("");
    setMessage("");
    try {
      await reviewTrainerProject(slug, {
        studentId: row.studentId,
        weekIndex: row.weekIndex,
        status: decision,
        reason: decision === "rejected" ? reason : "",
      });
      setMessage(
        decision === "approved"
          ? `Approved ${row.studentName}'s project.`
          : decision === "rejected"
            ? `Rejected ${row.studentName}'s project.`
            : `Reverted review for ${row.studentName}. Awaiting review again.`
      );
      await load();
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to review project");
    } finally {
      setBusyKey("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <Link
            href="/trainer/assessments?tab=projects"
            className="font-medium text-brand-500 hover:text-brand-600"
          >
            Assessments
          </Link>
          <span className="text-gray-300">/</span>
          <Link
            href={`/trainer/assessments/${slug}/projects`}
            className="font-medium text-brand-500 hover:text-brand-600"
          >
            {meta?.programTitle || "Internship"}
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-500">{meta?.weekLabel || `Week ${weekIndex + 1}`}</span>
        </div>
        <h1 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
          {meta?.title || "Project submissions"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {(meta?.spanWeeks || 1) > 1 ? `${meta?.spanWeeks}-week project · ` : ""}
          {meta?.topic || "Review GitHub repositories"}
        </p>
        {meta?.documentUrl && (
          <a
            href={meta.documentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex text-sm font-semibold text-violet-600 hover:underline"
          >
            {meta.documentTitle || "Open project document"}
          </a>
        )}
      </div>

      {message && (
        <p className="rounded-lg bg-success-50 px-4 py-2 text-sm text-success-600">
          {message}
        </p>
      )}
      {error && (
        <p className="rounded-lg bg-error-50 px-4 py-2 text-sm text-error-500">{error}</p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Students", value: summary.total },
          { label: "Awaiting review", value: summary.awaitingReview, tone: "text-amber-600" },
          { label: "Approved", value: summary.approved, tone: "text-success-600" },
          { label: "Rejected", value: summary.rejected, tone: "text-error-500" },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-gray-100 bg-white px-4 py-3 dark:border-gray-800 dark:bg-white/[0.02]"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              {card.label}
            </p>
            <p
              className={`mt-1 text-2xl font-bold ${
                card.tone || "text-gray-900 dark:text-white"
              }`}
            >
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between text-sm text-gray-500">
          <span>Approval progress</span>
          <span className="font-semibold text-gray-800 dark:text-gray-200">
            {summary.completionPercent}%
          </span>
        </div>
        <ProgressBar percent={summary.completionPercent} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.02]">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">
            Status
          </span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
            className={selectClass()}
          >
            <option value="all">All students</option>
            <option value="awaiting_review">Awaiting review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="pending">Not submitted</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">
            Search student
          </span>
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Name or email…"
            className={selectClass()}
          />
        </label>
      </div>

      <div className="space-y-3">
        {loading ? (
          <p className="text-sm text-gray-500">Loading submissions…</p>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-white/[0.02]">
            No students match these filters.
          </div>
        ) : (
          filtered.map((row) => {
            const approveBusy = busyKey === `${row.id}:approved`;
            const rejectBusy = busyKey === `${row.id}:rejected`;
            return (
              <div
                key={row.id}
                className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.02]"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {row.studentName}
                    </p>
                    <p className="text-xs text-gray-500">{row.studentEmail}</p>
                    {row.submittedAt && (
                      <p className="mt-1 text-xs text-gray-500">
                        Submitted {formatDateTime(row.submittedAt)}
                      </p>
                    )}
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      row.reviewStatus === "approved"
                        ? "bg-success-50 text-success-600"
                        : row.reviewStatus === "rejected"
                          ? "bg-error-50 text-error-500"
                          : row.submitted
                            ? "bg-amber-50 text-amber-700"
                            : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {!row.submitted
                      ? "Not submitted"
                      : row.reviewStatus === "approved"
                        ? "Approved"
                        : row.reviewStatus === "rejected"
                          ? "Rejected"
                          : "Awaiting review"}
                  </span>
                </div>

                {row.githubUrl && (
                  <a
                    href={row.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex text-sm font-semibold text-violet-600 hover:underline"
                  >
                    Open GitHub repository
                  </a>
                )}

                {row.reviewStatus === "rejected" && row.reviewReason && (
                  <p className="mt-2 rounded-xl bg-error-50 px-3 py-2 text-sm text-error-600">
                    Feedback: {row.reviewReason}
                  </p>
                )}

                {row.submitted && (
                  <div className="mt-3 space-y-2 border-t border-gray-100 pt-3 dark:border-gray-800">
                    {row.reviewStatus !== "approved" && (
                      <textarea
                        rows={2}
                        value={rejectDraft[row.id] || ""}
                        onChange={(e) =>
                          setRejectDraft((prev) => ({
                            ...prev,
                            [row.id]: e.target.value,
                          }))
                        }
                        placeholder={
                          row.reviewStatus === "rejected"
                            ? "Update feedback if rejecting again, or approve…"
                            : "If rejecting, explain what needs improvement…"
                        }
                        className={selectClass()}
                      />
                    )}
                    {row.reviewStatus === "approved" && (
                      <textarea
                        rows={2}
                        value={rejectDraft[row.id] || ""}
                        onChange={(e) =>
                          setRejectDraft((prev) => ({
                            ...prev,
                            [row.id]: e.target.value,
                          }))
                        }
                        placeholder="Required only if you change to Reject…"
                        className={selectClass()}
                      />
                    )}
                    <div className="flex flex-wrap gap-2">
                      {row.reviewStatus !== "approved" && (
                        <button
                          type="button"
                          disabled={approveBusy}
                          onClick={() => handleReview(row, "approved")}
                          className="rounded-xl bg-success-500 px-4 py-2 text-sm font-semibold text-white hover:bg-success-600 disabled:opacity-60"
                        >
                          {approveBusy
                            ? "Saving…"
                            : row.reviewStatus === "rejected"
                              ? "Change to Approve"
                              : "Approve"}
                        </button>
                      )}
                      {row.reviewStatus !== "rejected" && (
                        <button
                          type="button"
                          disabled={rejectBusy}
                          onClick={() => handleReview(row, "rejected")}
                          className="rounded-xl bg-error-500 px-4 py-2 text-sm font-semibold text-white hover:bg-error-600 disabled:opacity-60"
                        >
                          {rejectBusy
                            ? "Saving…"
                            : row.reviewStatus === "approved"
                              ? "Change to Reject"
                              : "Reject"}
                        </button>
                      )}
                      {(row.reviewStatus === "approved" ||
                        row.reviewStatus === "rejected") && (
                        <button
                          type="button"
                          disabled={busyKey === `${row.id}:pending`}
                          onClick={() => handleReview(row, "pending")}
                          className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-white/5"
                        >
                          {busyKey === `${row.id}:pending`
                            ? "Saving…"
                            : "Revert decision"}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
