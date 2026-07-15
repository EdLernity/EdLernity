"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  fetchTrainerAssessments,
  TrainerAssessmentProgramSummary,
} from "@/lib/crmApi";
import { ProgressBar } from "./trainerAssessmentShared";
import CrmTrainerProjectAssessmentsPage from "./CrmTrainerProjectAssessmentsPage";

type TabId = "assignments" | "projects";

export default function CrmTrainerAssessmentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get("tab") === "projects" ? "projects" : "assignments";
  const [tab, setTab] = useState<TabId>(tabFromUrl);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [programs, setPrograms] = useState<TrainerAssessmentProgramSummary[]>([]);

  useEffect(() => {
    setTab(tabFromUrl);
  }, [tabFromUrl]);

  useEffect(() => {
    if (tab !== "assignments") return;
    setLoading(true);
    setError("");
    fetchTrainerAssessments({ status: "all" })
      .then((data) => setPrograms(data.programs || []))
      .catch((e: any) =>
        setError(e?.response?.data?.message || "Failed to load assessments")
      )
      .finally(() => setLoading(false));
  }, [tab]);

  const switchTab = (next: TabId) => {
    setTab(next);
    router.replace(
      next === "projects" ? "/trainer/assessments?tab=projects" : "/trainer/assessments"
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Assessments</h1>
        <p className="mt-1 text-sm text-gray-500">
          {tab === "projects"
            ? "Open an internship to review project weeks and GitHub submissions."
            : "Open an internship to review week → class assignment submissions."}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-800">
        <button
          type="button"
          onClick={() => switchTab("assignments")}
          className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
            tab === "assignments"
              ? "border-brand-500 text-brand-500"
              : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
          }`}
        >
          Assignments
        </button>
        <button
          type="button"
          onClick={() => switchTab("projects")}
          className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
            tab === "projects"
              ? "border-brand-500 text-brand-500"
              : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
          }`}
        >
          Projects
        </button>
      </div>

      {tab === "projects" ? (
        <CrmTrainerProjectAssessmentsPage />
      ) : loading ? (
        <p className="text-sm text-gray-500">Loading internships…</p>
      ) : error ? (
        <p className="rounded-lg bg-error-50 px-4 py-2 text-sm text-error-500">{error}</p>
      ) : programs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-5 py-10 text-center text-gray-500 dark:border-gray-700 dark:bg-white/[0.03]">
          No internships assigned yet. Ask an admin to assign you to a program.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {programs.map((program) => (
            <Link
              key={program.slug}
              href={`/trainer/assessments/${program.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:border-brand-300 hover:shadow-md dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-brand-500/40"
            >
              {program.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={program.coverImage}
                  alt=""
                  className="h-36 w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="flex h-36 items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100 text-sm font-semibold text-brand-600 dark:from-brand-500/10 dark:to-brand-500/5 dark:text-brand-400">
                  {program.title}
                </div>
              )}
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-500">
                  {program.category || "Internship"}
                </p>
                <h2 className="mt-1 text-lg font-bold text-gray-900 group-hover:text-brand-600 dark:text-white">
                  {program.title}
                </h2>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-gray-50 px-2 py-2 dark:bg-white/[0.04]">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {program.studentCount}
                    </p>
                    <p className="text-[11px] font-medium text-gray-500">Students</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 px-2 py-2 dark:bg-white/[0.04]">
                    <p className="text-lg font-bold text-success-600">
                      {program.submittedCount}
                    </p>
                    <p className="text-[11px] font-medium text-gray-500">Completed</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 px-2 py-2 dark:bg-white/[0.04]">
                    <p className="text-lg font-bold text-amber-600">
                      {program.pendingCount}
                    </p>
                    <p className="text-[11px] font-medium text-gray-500">Pending</p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="mb-1.5 flex items-center justify-between text-xs text-gray-500">
                    <span>
                      {program.assignmentCount} assignment
                      {program.assignmentCount === 1 ? "" : "s"}
                    </span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      {program.completionPercent}% done
                    </span>
                  </div>
                  <ProgressBar percent={program.completionPercent} />
                </div>

                <span className="mt-5 inline-flex items-center justify-center rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white group-hover:bg-brand-600">
                  Review assessments →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
