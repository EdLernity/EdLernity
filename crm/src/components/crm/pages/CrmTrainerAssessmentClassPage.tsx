"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  fetchTrainerAssessments,
  TrainerAssessmentRow,
} from "@/lib/crmApi";
import { selectClass } from "@/lib/crmUtils";
import {
  AssessmentReviewDrawer,
  formatDateTime,
  ProgressBar,
  scoreLabel,
  scoreTone,
} from "./trainerAssessmentShared";

type StatusFilter = "all" | "submitted" | "pending";

export default function CrmTrainerAssessmentClassPage() {
  const params = useParams();
  const router = useRouter();
  const slug = String(params.slug || "");
  const weekIndex = Number(params.weekIndex);
  const classId = decodeURIComponent(String(params.classId || ""));

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rows, setRows] = useState<TrainerAssessmentRow[]>([]);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<TrainerAssessmentRow | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim().toLowerCase()), 250);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    if (!slug || !classId || !Number.isInteger(weekIndex) || weekIndex < 0) {
      router.replace("/trainer/assessments");
      return;
    }
    const classKey = `${slug}:${weekIndex}:${classId}`;
    setLoading(true);
    setError("");
    fetchTrainerAssessments({ slug, classKey, status: "all" })
      .then((data) => {
        setRows(data.rows || []);
        if (!(data.rows || []).length && !(data.classes || []).some((c) => c.key === classKey)) {
          setError("This class assignment was not found.");
        }
      })
      .catch((e: any) => {
        setError(e?.response?.data?.message || "Failed to load class assessments");
      })
      .finally(() => setLoading(false));
  }, [slug, weekIndex, classId, router]);

  const meta = rows[0];
  const summary = useMemo(() => {
    const submitted = rows.filter((r) => r.submitted).length;
    return {
      total: rows.length,
      submitted,
      pending: rows.length - submitted,
      completionPercent: rows.length
        ? Math.round((submitted / rows.length) * 100)
        : 0,
    };
  }, [rows]);

  const filtered = useMemo(() => {
    return rows
      .filter((row) => {
        if (status === "submitted" && !row.submitted) return false;
        if (status === "pending" && row.submitted) return false;
        if (!search) return true;
        const hay = `${row.studentName} ${row.studentEmail} ${row.phone || ""}`.toLowerCase();
        return hay.includes(search);
      })
      .sort((a, b) => {
        if (a.submitted !== b.submitted) return a.submitted ? -1 : 1;
        const aTime = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
        const bTime = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
        return bTime - aTime;
      });
  }, [rows, status, search]);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <Link
            href="/trainer/assessments"
            className="font-medium text-brand-500 hover:text-brand-600"
          >
            Assessments
          </Link>
          <span className="text-gray-300">/</span>
          <Link
            href={`/trainer/assessments/${slug}`}
            className="font-medium text-brand-500 hover:text-brand-600"
          >
            {meta?.programTitle || "Internship"}
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-500">{meta?.weekLabel || `Week ${weekIndex + 1}`}</span>
        </div>
        <h1 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
          {meta?.assignmentTitle || "Class assignment"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {meta?.classTitle || "Class"}
          {meta?.topic ? ` · ${meta.topic}` : ""}
        </p>
      </div>

      {error && (
        <p className="rounded-lg bg-error-50 px-4 py-2 text-sm text-error-500">{error}</p>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Students", value: summary.total },
          { label: "Submitted", value: summary.submitted, tone: "text-success-600" },
          { label: "Pending", value: summary.pending, tone: "text-amber-600" },
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
          <span>Class completion</span>
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
            <option value="submitted">Submitted only</option>
            <option value="pending">Pending only</option>
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

      <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-white/[0.03]">
              <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Submitted</th>
                <th className="px-4 py-3">Result</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-transparent">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-gray-500">
                    Loading students…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-gray-500">
                    No students match these filters.
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr
                    key={row.id}
                    className="text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/[0.02]"
                  >
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {row.studentName}
                      </p>
                      <p className="text-xs text-gray-500">{row.studentEmail}</p>
                    </td>
                    <td className={`px-4 py-3 font-semibold ${scoreTone(row)}`}>
                      {scoreLabel(row)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {row.submitted ? formatDateTime(row.submittedAt) : "—"}
                    </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <span
                              className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${
                                row.submitted
                                  ? "bg-brand-50 text-brand-600 dark:bg-brand-500/10"
                                  : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                              }`}
                            >
                              {row.submitted ? "Submitted" : "Pending"}
                            </span>
                            {row.submitted && (
                              <span
                                className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${
                                  row.passed
                                    ? "bg-success-50 text-success-600"
                                    : "bg-error-50 text-error-500"
                                }`}
                              >
                                {row.passed ? "Pass" : "Fail"}
                                {typeof row.passingScore === "number"
                                  ? ` (≥${row.passingScore})`
                                  : ""}
                              </span>
                            )}
                          </div>
                        </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setSelected(row)}
                        className="rounded-lg px-3 py-1.5 text-xs font-semibold text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10"
                      >
                        {row.submitted ? "Review" : "View"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AssessmentReviewDrawer
        open={Boolean(selected)}
        row={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
