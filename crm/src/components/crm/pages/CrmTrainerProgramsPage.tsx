"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchTrainerPrograms, TrainerProgramRow } from "@/lib/crmApi";

export default function CrmTrainerProgramsPage() {
  const [programs, setPrograms] = useState<TrainerProgramRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTrainerPrograms()
      .then(setPrograms)
      .catch(() => setError("Unable to load trainer programs. Ask admin to assign you to a track."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Trainer Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage schedule, live classes, notes, assignments, and more for your assigned programs.
        </p>
      </div>

      {error && (
        <p className="text-sm text-error-500 bg-error-50 dark:bg-error-500/10 rounded-lg px-4 py-2">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">Loading programs...</p>
      ) : programs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/[0.03] px-5 py-10 text-center text-gray-500">
          No programs assigned yet. Ask an admin to assign you to an internship track.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {programs.map((program) => (
            <div
              key={program.slug}
              className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]"
            >
              {program.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={program.coverImage}
                  alt={program.title}
                  className="mb-4 h-32 w-full rounded-xl object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="mb-4 flex h-32 items-center justify-center rounded-xl bg-brand-50 text-sm font-semibold text-brand-500 dark:bg-brand-500/10">
                  {program.title}
                </div>
              )}
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-brand-500">
                {program.category || "Internship"}
              </p>
              <h2 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">{program.title}</h2>
              <p className="mb-4 text-sm text-gray-500">
                {program.studentCount ?? 0} student{(program.studentCount ?? 0) === 1 ? "" : "s"}
              </p>
              <Link
                href={`/trainer/${program.slug}`}
                className="inline-flex w-full items-center justify-center rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
              >
                Manage Program Content
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
