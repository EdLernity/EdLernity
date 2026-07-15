"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  fetchTrainerProjectAssessments,
  TrainerProjectAssessmentOption,
  TrainerProjectAssessmentProgramSummary,
  TrainerProjectAssessmentRow,
} from "@/lib/crmApi";
import { ProgressBar } from "./trainerAssessmentShared";

type ProjectCard = TrainerProjectAssessmentOption & {
  submitted: number;
  total: number;
  awaitingReview: number;
  approved: number;
  rejected: number;
  pending: number;
  completionPercent: number;
};

export default function CrmTrainerProjectAssessmentProgramPage() {
  const params = useParams();
  const router = useRouter();
  const slug = String(params.slug || "");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [program, setProgram] =
    useState<TrainerProjectAssessmentProgramSummary | null>(null);
  const [projects, setProjects] = useState<TrainerProjectAssessmentOption[]>([]);
  const [rows, setRows] = useState<TrainerProjectAssessmentRow[]>([]);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError("");
    fetchTrainerProjectAssessments({ slug, status: "all" })
      .then((data) => {
        const match = (data.programs || []).find((p) => p.slug === slug) || null;
        if (!match) {
          setError("Internship not found or not assigned to you.");
          return;
        }
        setProgram(match);
        setProjects((data.projects || []).filter((p) => p.slug === slug));
        setRows(data.rows || []);
      })
      .catch((e: any) => {
        setError(e?.response?.data?.message || "Failed to load projects");
        router.replace("/trainer/assessments?tab=projects");
      })
      .finally(() => setLoading(false));
  }, [slug, router]);

  const cards = useMemo(() => {
    const map: Record<string, ProjectCard> = {};
    for (const p of projects) {
      map[p.key] = {
        ...p,
        submitted: 0,
        total: 0,
        awaitingReview: 0,
        approved: 0,
        rejected: 0,
        pending: 0,
        completionPercent: 0,
      };
    }
    for (const row of rows) {
      const key = `${row.internshipSlug}:${row.weekIndex}`;
      if (!map[key]) {
        map[key] = {
          key,
          slug: row.internshipSlug,
          programTitle: row.programTitle,
          weekIndex: row.weekIndex,
          weekLabel: row.weekLabel,
          topic: row.topic || "",
          title: row.title,
          documentUrl: row.documentUrl || "",
          documentTitle: row.documentTitle || "",
          spanWeeks: row.spanWeeks || 1,
          submitted: 0,
          total: 0,
          awaitingReview: 0,
          approved: 0,
          rejected: 0,
          pending: 0,
          completionPercent: 0,
        };
      }
      map[key].total += 1;
      if (!row.submitted) {
        map[key].pending += 1;
      } else {
        map[key].submitted += 1;
        if (row.reviewStatus === "approved") map[key].approved += 1;
        else if (row.reviewStatus === "rejected") map[key].rejected += 1;
        else map[key].awaitingReview += 1;
      }
    }
    return Object.values(map)
      .map((card) => ({
        ...card,
        completionPercent: card.total
          ? Math.round((card.approved / card.total) * 100)
          : 0,
      }))
      .sort((a, b) => a.weekIndex - b.weekIndex);
  }, [projects, rows]);

  if (loading) {
    return <p className="text-sm text-gray-500">Loading project weeks…</p>;
  }

  if (error || !program) {
    return (
      <div className="space-y-3">
        <Link
          href="/trainer/assessments?tab=projects"
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
          href="/trainer/assessments?tab=projects"
          className="text-sm font-medium text-brand-500 hover:text-brand-600"
        >
          ← All project internships
        </Link>
        <div className="mt-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">
            {program.category || "Internship"} · Projects
          </p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {program.title}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Open a project week to review GitHub submissions, approve, or request
            changes.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Students", value: program.studentCount },
          { label: "Awaiting review", value: program.awaitingReviewCount, tone: "text-amber-600" },
          { label: "Approved", value: program.approvedCount, tone: "text-success-600" },
          { label: "Rejected", value: program.rejectedCount, tone: "text-error-500" },
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
          <span>Overall approval</span>
          <span className="font-semibold text-gray-800 dark:text-gray-200">
            {program.completionPercent}%
          </span>
        </div>
        <ProgressBar percent={program.completionPercent} />
      </div>

      {cards.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-5 py-10 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-white/[0.03]">
          No projects configured yet. Mark project weeks and set briefs in the program
          editor.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {cards.map((project) => (
            <Link
              key={project.key}
              href={`/trainer/assessments/${slug}/projects/${project.weekIndex}`}
              className="rounded-2xl border border-gray-100 bg-white p-5 transition hover:border-violet-300 hover:shadow-md dark:border-gray-800 dark:bg-white/[0.02] dark:hover:border-violet-500/40"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">
                {project.weekLabel}
                {(project.spanWeeks || 1) > 1
                  ? ` · ${project.spanWeeks}-week project`
                  : ""}
              </p>
              <h2 className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                {project.title}
              </h2>
              {project.topic && (
                <p className="mt-1 text-sm text-gray-500">{project.topic}</p>
              )}
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-700">
                  {project.awaitingReview} to review
                </span>
                <span className="rounded-full bg-success-50 px-2.5 py-1 text-success-600">
                  {project.approved} approved
                </span>
                <span className="rounded-full bg-error-50 px-2.5 py-1 text-error-500">
                  {project.rejected} rejected
                </span>
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-600">
                  {project.pending} not submitted
                </span>
              </div>
              <ProgressBar percent={project.completionPercent} className="mt-3" />
              <p className="mt-3 text-xs font-semibold text-violet-600">
                Open submissions →
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
