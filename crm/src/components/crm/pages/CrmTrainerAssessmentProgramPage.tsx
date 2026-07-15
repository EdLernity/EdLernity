"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  fetchTrainerAssessments,
  TrainerAssessmentClassOption,
  TrainerAssessmentProgramSummary,
  TrainerAssessmentRow,
} from "@/lib/crmApi";
import { ProgressBar } from "./trainerAssessmentShared";

type ClassCard = TrainerAssessmentClassOption & {
  submitted: number;
  total: number;
  pending: number;
  completionPercent: number;
};

type WeekGroup = {
  weekIndex: number;
  weekLabel: string;
  topic: string;
  classes: ClassCard[];
  submitted: number;
  total: number;
  completionPercent: number;
};

export default function CrmTrainerAssessmentProgramPage() {
  const params = useParams();
  const router = useRouter();
  const slug = String(params.slug || "");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [program, setProgram] = useState<TrainerAssessmentProgramSummary | null>(null);
  const [classes, setClasses] = useState<TrainerAssessmentClassOption[]>([]);
  const [rows, setRows] = useState<TrainerAssessmentRow[]>([]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError("");
    fetchTrainerAssessments({ slug, status: "all" })
      .then((data) => {
        const match = (data.programs || []).find((p) => p.slug === slug) || null;
        if (!match) {
          setError("Internship not found or not assigned to you.");
          return;
        }
        setProgram(match);
        setClasses((data.classes || []).filter((c) => c.slug === slug));
        setRows(data.rows || []);
      })
      .catch((e: any) => {
        setError(e?.response?.data?.message || "Failed to load internship assessments");
        router.replace("/trainer/assessments");
      })
      .finally(() => setLoading(false));
  }, [slug, router]);

  const weeks = useMemo(() => {
    const byClass: Record<string, ClassCard> = {};
    for (const c of classes) {
      byClass[c.key] = {
        ...c,
        submitted: 0,
        total: 0,
        pending: 0,
        completionPercent: 0,
      };
    }

    for (const row of rows) {
      const key = `${row.internshipSlug}:${row.weekIndex}:${row.classId}`;
      if (!byClass[key]) {
        byClass[key] = {
          key,
          slug: row.internshipSlug,
          programTitle: row.programTitle,
          weekIndex: row.weekIndex,
          weekLabel: row.weekLabel,
          topic: row.topic || "",
          classId: row.classId,
          classTitle: row.classTitle,
          assignmentTitle: row.assignmentTitle,
          questionCount: row.questionCount,
          submitted: 0,
          total: 0,
          pending: 0,
          completionPercent: 0,
        };
      }
      byClass[key].total += 1;
      if (row.submitted) byClass[key].submitted += 1;
    }

    const weekMap = new Map<number, WeekGroup>();
    Object.values(byClass).forEach((cls) => {
      cls.pending = Math.max(0, cls.total - cls.submitted);
      cls.completionPercent = cls.total
        ? Math.round((cls.submitted / cls.total) * 100)
        : 0;

      if (!weekMap.has(cls.weekIndex)) {
        weekMap.set(cls.weekIndex, {
          weekIndex: cls.weekIndex,
          weekLabel: cls.weekLabel,
          topic: cls.topic || "",
          classes: [],
          submitted: 0,
          total: 0,
          completionPercent: 0,
        });
      }
      const week = weekMap.get(cls.weekIndex)!;
      if (!week.topic && cls.topic) week.topic = cls.topic;
      week.classes.push(cls);
      week.submitted += cls.submitted;
      week.total += cls.total;
    });

    return Array.from(weekMap.values())
      .map((week) => ({
        ...week,
        classes: week.classes.sort((a, b) =>
          a.classTitle.localeCompare(b.classTitle)
        ),
        completionPercent: week.total
          ? Math.round((week.submitted / week.total) * 100)
          : 0,
      }))
      .sort((a, b) => a.weekIndex - b.weekIndex);
  }, [classes, rows]);

  if (loading) {
    return <p className="text-sm text-gray-500">Loading assessment weeks…</p>;
  }

  if (error || !program) {
    return (
      <div className="space-y-3">
        <Link
          href="/trainer/assessments"
          className="text-sm font-medium text-brand-500 hover:text-brand-600"
        >
          ← Back to Assessments
        </Link>
        <p className="rounded-lg bg-error-50 px-4 py-2 text-sm text-error-500">
          {error || "Internship not found"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/trainer/assessments"
          className="text-sm font-medium text-brand-500 hover:text-brand-600"
        >
          ← All internships
        </Link>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-500">
              {program.category || "Internship"}
            </p>
            <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              {program.title}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Choose a week, then open a class to review student submissions.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        {[
          { label: "Students", value: program.studentCount },
          { label: "Assignments", value: program.assignmentCount },
          { label: "Completed", value: program.submittedCount, tone: "text-success-600" },
          { label: "Pending", value: program.pendingCount, tone: "text-amber-600" },
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
          <span>Overall completion</span>
          <span className="font-semibold text-gray-800 dark:text-gray-200">
            {program.completionPercent}%
          </span>
        </div>
        <ProgressBar percent={program.completionPercent} />
      </div>

      {weeks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-5 py-10 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-white/[0.03]">
          No class assignments published yet. Create an assignment from Live Classes first.
        </div>
      ) : (
        <div className="space-y-5">
          {weeks.map((week) => (
            <section
              key={week.weekIndex}
              className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.02]"
            >
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {week.weekLabel}
                  </h2>
                  {week.topic && (
                    <p className="mt-0.5 text-sm text-gray-500">{week.topic}</p>
                  )}
                </div>
                <div className="min-w-[160px] text-right">
                  <p className="text-xs font-semibold text-gray-500">
                    {week.submitted}/{week.total} submissions
                  </p>
                  <ProgressBar
                    percent={week.completionPercent}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {week.classes.map((cls) => (
                  <Link
                    key={cls.key}
                    href={`/trainer/assessments/${slug}/week/${cls.weekIndex}/class/${encodeURIComponent(cls.classId)}`}
                    className="rounded-xl border border-gray-100 bg-gray-50 p-4 transition hover:border-brand-300 hover:bg-brand-50/40 dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-brand-500/40"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {cls.classTitle}
                    </p>
                    <p className="mt-1 font-bold text-gray-900 dark:text-white">
                      {cls.assignmentTitle || "Assignment"}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {cls.questionCount || 0} question
                      {(cls.questionCount || 0) === 1 ? "" : "s"}
                    </p>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="font-semibold text-success-600">
                        {cls.submitted} done
                      </span>
                      <span className="font-semibold text-amber-600">
                        {cls.pending} pending
                      </span>
                    </div>
                    <ProgressBar
                      percent={cls.completionPercent}
                      className="mt-2"
                    />
                    <p className="mt-3 text-xs font-semibold text-brand-500">
                      Open class reviews →
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
