"use client";

import React from "react";
import {
  fetchTrainerAssessmentDetail,
  TrainerAssessmentDetail,
  TrainerAssessmentRow,
} from "@/lib/crmApi";
import { useModalOverlay } from "@/context/ModalOverlayContext";

export function formatDateTime(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function scoreLabel(
  row: Pick<TrainerAssessmentRow, "mcqScore" | "mcqTotal" | "submitted">
) {
  if (!row.submitted) return "—";
  if (row.mcqTotal == null || row.mcqTotal <= 0) return "Submitted";
  return `${row.mcqScore ?? 0}/${row.mcqTotal}`;
}

export function scoreTone(
  row: Pick<TrainerAssessmentRow, "mcqScore" | "mcqTotal" | "submitted">
) {
  if (!row.submitted || row.mcqTotal == null || row.mcqTotal <= 0) {
    return "text-gray-600 dark:text-gray-400";
  }
  const pct = ((row.mcqScore ?? 0) / row.mcqTotal) * 100;
  if (pct >= 80) return "text-success-600";
  if (pct >= 50) return "text-amber-600";
  return "text-error-500";
}

export function ProgressBar({
  percent,
  className = "",
}: {
  percent: number;
  className?: string;
}) {
  const value = Math.max(0, Math.min(100, percent || 0));
  return (
    <div
      className={`h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/10 ${className}`}
    >
      <div
        className="h-full rounded-full bg-brand-500 transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export function AssessmentReviewDrawer({
  open,
  onClose,
  row,
}: {
  open: boolean;
  onClose: () => void;
  row: TrainerAssessmentRow | null;
}) {
  useModalOverlay(open);
  const [detail, setDetail] = React.useState<TrainerAssessmentDetail | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!open || !row) {
      setDetail(null);
      setError("");
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError("");
    setDetail(null);
    fetchTrainerAssessmentDetail({
      slug: row.internshipSlug,
      studentId: row.studentId,
      weekIndex: row.weekIndex,
      classId: row.classId,
    })
      .then((data) => {
        if (!cancelled) setDetail(data);
      })
      .catch((e: any) => {
        if (!cancelled) {
          setError(e?.response?.data?.message || "Failed to load submission");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, row]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100000] flex justify-end bg-black/40">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <aside className="relative z-10 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl dark:bg-gray-900 pt-[env(safe-area-inset-top)]">
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4 dark:border-gray-800">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-500">
              Assignment review
            </p>
            <h2 className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
              {detail?.assignment.title || row?.assignmentTitle || "Submission"}
            </h2>
            {(detail || row) && (
              <p className="mt-1 text-sm text-gray-500">
                {detail?.student.name || row?.studentName}
                {" · "}
                {detail?.programTitle || row?.programTitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10"
          >
            Close
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          {loading && <p className="text-sm text-gray-500">Loading submission…</p>}
          {error && (
            <p className="rounded-lg bg-error-50 px-3 py-2 text-sm text-error-500">
              {error}
            </p>
          )}
          {detail && !loading && (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-gray-50 px-3 py-2 dark:bg-white/[0.04]">
                  <p className="text-xs text-gray-500">Class</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    {detail.assignment.classTitle?.includes(detail.assignment.weekLabel)
                      ? detail.assignment.classTitle
                      : `${detail.assignment.weekLabel} · ${detail.assignment.classTitle}`}
                  </p>
                </div>
                <div className="rounded-xl bg-gray-50 px-3 py-2 dark:bg-white/[0.04]">
                  <p className="text-xs text-gray-500">MCQ score</p>
                  <p className={`text-sm font-semibold ${scoreTone(detail)}`}>
                    {scoreLabel(detail)}
                    {typeof detail.passingScore === "number"
                      ? ` (pass ≥ ${detail.passingScore})`
                      : ""}
                  </p>
                </div>
                <div className="rounded-xl bg-gray-50 px-3 py-2 dark:bg-white/[0.04]">
                  <p className="text-xs text-gray-500">Result</p>
                  <p
                    className={`text-sm font-semibold ${
                      !detail.submitted
                        ? "text-gray-800 dark:text-white"
                        : detail.passed
                          ? "text-success-600"
                          : "text-error-500"
                    }`}
                  >
                    {!detail.submitted
                      ? "Not submitted"
                      : detail.passed
                        ? "Pass"
                        : "Fail"}
                  </p>
                </div>
                <div className="rounded-xl bg-gray-50 px-3 py-2 dark:bg-white/[0.04]">
                  <p className="text-xs text-gray-500">Submitted at</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                    {detail.submitted ? formatDateTime(detail.submittedAt) : "—"}
                  </p>
                </div>
              </div>

              {detail.assignment.instructions && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Instructions
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">
                    {detail.assignment.instructions}
                  </p>
                </div>
              )}

              {!detail.submitted ? (
                <p className="rounded-xl border border-dashed border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
                  This student has not submitted this assignment yet.
                </p>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Responses
                  </p>
                  {detail.questions.map((q, index) => (
                    <div
                      key={q.id}
                      className="rounded-xl border border-gray-100 p-4 dark:border-gray-800"
                    >
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                          Q{index + 1} · {q.type === "mcq" ? "MCQ" : "Text"}
                        </p>
                        {q.type === "mcq" && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                              q.isCorrect
                                ? "bg-success-50 text-success-600"
                                : "bg-error-50 text-error-500"
                            }`}
                          >
                            {q.isCorrect ? "Correct" : "Incorrect"}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {q.prompt}
                      </p>
                      {q.type === "mcq" ? (
                        <ul className="mt-3 space-y-1.5">
                          {(q.options || []).map((opt, oIndex) => {
                            const isSelected = q.selectedIndex === oIndex;
                            const isCorrect = q.correctOptionIndex === oIndex;
                            return (
                              <li
                                key={oIndex}
                                className={`rounded-lg px-3 py-2 text-sm ${
                                  isCorrect
                                    ? "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400"
                                    : isSelected
                                      ? "bg-error-50 text-error-600 dark:bg-error-500/10"
                                      : "bg-gray-50 text-gray-600 dark:bg-white/[0.03] dark:text-gray-400"
                                }`}
                              >
                                <span className="font-semibold">
                                  {String.fromCharCode(65 + oIndex)}.
                                </span>{" "}
                                {opt || "—"}
                                {isSelected && (
                                  <span className="ml-2 text-xs font-semibold">(student)</span>
                                )}
                                {isCorrect && (
                                  <span className="ml-2 text-xs font-semibold">(correct)</span>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <p className="mt-3 whitespace-pre-wrap rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:bg-white/[0.03] dark:text-gray-300">
                          {q.textAnswer?.trim() || (
                            <span className="italic text-gray-400">No answer</span>
                          )}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
