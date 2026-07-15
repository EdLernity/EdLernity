"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  fetchTrainerProjectAssessments,
  TrainerProjectAssessmentProgramSummary,
} from "@/lib/crmApi";
import { ProgressBar } from "./trainerAssessmentShared";

export default function CrmTrainerProjectAssessmentsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [programs, setPrograms] = useState<TrainerProjectAssessmentProgramSummary[]>(
    []
  );

  useEffect(() => {
    setLoading(true);
    setError("");
    fetchTrainerProjectAssessments({ status: "all" })
      .then((data) => setPrograms(data.programs || []))
      .catch((e: any) =>
        setError(e?.response?.data?.message || "Failed to load project assessments")
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-sm text-gray-500">Loading internships…</p>;
  }

  if (error) {
    return (
      <p className="rounded-lg bg-error-50 px-4 py-2 text-sm text-error-500">{error}</p>
    );
  }

  if (programs.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-5 py-10 text-center text-gray-500 dark:border-gray-700 dark:bg-white/[0.03]">
        No internships assigned yet. Ask an admin to assign you to a program.
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {programs.map((program) => (
        <Link
          key={program.slug}
          href={`/trainer/assessments/${program.slug}/projects`}
          className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:border-violet-300 hover:shadow-md dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-violet-500/40"
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
            <div className="flex h-36 items-center justify-center bg-gradient-to-br from-violet-50 to-violet-100 text-sm font-semibold text-violet-700 dark:from-violet-500/10 dark:to-violet-500/5 dark:text-violet-300">
              {program.title}
            </div>
          )}
          <div className="flex flex-1 flex-col p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">
              {program.category || "Internship"}
            </p>
            <h2 className="mt-1 text-lg font-bold text-gray-900 group-hover:text-violet-600 dark:text-white">
              {program.title}
            </h2>

            <div className="mt-4 grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
              <div className="rounded-xl bg-gray-50 px-2 py-2 dark:bg-white/[0.04]">
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {program.studentCount}
                </p>
                <p className="text-[11px] font-medium text-gray-500">Students</p>
              </div>
              <div className="rounded-xl bg-gray-50 px-2 py-2 dark:bg-white/[0.04]">
                <p className="text-lg font-bold text-amber-600">
                  {program.awaitingReviewCount}
                </p>
                <p className="text-[11px] font-medium text-gray-500">To review</p>
              </div>
              <div className="rounded-xl bg-gray-50 px-2 py-2 dark:bg-white/[0.04]">
                <p className="text-lg font-bold text-success-600">
                  {program.approvedCount}
                </p>
                <p className="text-[11px] font-medium text-gray-500">Approved</p>
              </div>
              <div className="rounded-xl bg-gray-50 px-2 py-2 dark:bg-white/[0.04]">
                <p className="text-lg font-bold text-error-500">
                  {program.rejectedCount}
                </p>
                <p className="text-[11px] font-medium text-gray-500">Rejected</p>
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between text-xs text-gray-500">
                <span>
                  {program.projectCount} project
                  {program.projectCount === 1 ? "" : "s"}
                </span>
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  {program.completionPercent}% approved
                </span>
              </div>
              <ProgressBar percent={program.completionPercent} />
            </div>

            <span className="mt-5 inline-flex items-center justify-center rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white group-hover:bg-violet-700">
              Review projects →
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
