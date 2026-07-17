"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  assignTrainer,
  fetchAdminPrograms,
  fetchAdminTrainers,
  fetchTrainerAssignments,
  TrainerAssignmentRow,
  unassignTrainer,
} from "@/lib/crmApi";
import SearchableSelect from "@/components/crm/SearchableSelect";
import { formatDate } from "@/lib/crmUtils";

export default function CrmTrainerAssignmentsPage() {
  const [programs, setPrograms] = useState<Array<{ slug: string; title: string }>>([]);
  const [trainers, setTrainers] = useState<
    Array<{ _id: string; firstName: string; lastName: string; email: string; role?: string }>
  >([]);
  const [assignments, setAssignments] = useState<TrainerAssignmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ trainerEmail: "", internshipSlug: "" });
  const [showInactive, setShowInactive] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [programRows, trainerRows, assignmentRows] = await Promise.all([
        fetchAdminPrograms(),
        fetchAdminTrainers(),
        fetchTrainerAssignments(),
      ]);
      setPrograms(programRows);
      setTrainers(trainerRows);
      setAssignments(assignmentRows);
    } catch {
      setError("Failed to load trainer assignments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const visibleAssignments = useMemo(
    () => (showInactive ? assignments : assignments.filter((row) => row.active)),
    [assignments, showInactive]
  );

  const trainerOptions = useMemo(
    () =>
      trainers.map((trainer) => {
        const name =
          `${trainer.firstName || ""} ${trainer.lastName || ""}`.trim() || trainer.email;
        const label = `${name} (${trainer.email})${trainer.role === "admin" ? " · admin" : ""}`;
        return {
          value: trainer.email,
          label,
          searchText: `${trainer.firstName} ${trainer.lastName} ${trainer.email} ${trainer.role || ""}`,
        };
      }),
    [trainers]
  );

  const programOptions = useMemo(
    () =>
      programs.map((program) => ({
        value: program.slug,
        label: program.title,
        searchText: `${program.title} ${program.slug}`,
      })),
    [programs]
  );

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");
    try {
      await assignTrainer(form);
      setMessage("Trainer assigned to program successfully");
      setForm({ trainerEmail: "", internshipSlug: "" });
      await load();
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || "Failed to assign trainer");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnassign = async (row: TrainerAssignmentRow) => {
    if (!window.confirm(`Unassign ${row.trainer.name || row.trainer.email} from ${row.programTitle}?`)) {
      return;
    }
    setMessage("");
    setError("");
    try {
      await unassignTrainer({ assignmentId: row.id });
      setMessage("Trainer unassigned from program");
      await load();
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || "Failed to unassign trainer");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Trainer Assignments</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Assign internship programs to trainers so they can manage content in CRM.
        </p>
      </div>

      {message && (
        <p className="rounded-lg bg-success-50 px-4 py-2 text-sm text-success-600 dark:bg-success-500/10">
          {message}
        </p>
      )}
      {error && (
        <p className="rounded-lg bg-error-50 px-4 py-2 text-sm text-error-500 dark:bg-error-500/10">
          {error}
        </p>
      )}

      <form
        onSubmit={handleAssign}
        className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]"
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Assign program to trainer</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Trainer
            </label>
            <SearchableSelect
              required
              options={trainerOptions}
              value={form.trainerEmail}
              onChange={(trainerEmail) => setForm({ ...form, trainerEmail })}
              placeholder="Search trainer by name or email…"
              emptyMessage="No trainers match your search"
            />
            {trainers.length === 0 && (
              <p className="mt-1.5 text-xs text-gray-500">
                No trainers yet. Set a user role to <strong>trainer</strong> in Users or Operations first.
              </p>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500">
              Internship program
            </label>
            <SearchableSelect
              required
              options={programOptions}
              value={form.internshipSlug}
              onChange={(internshipSlug) => setForm({ ...form, internshipSlug })}
              placeholder="Search program…"
              emptyMessage="No programs match your search"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={submitting || !form.trainerEmail || !form.internshipSlug}
          className="rounded-lg bg-brand-500 px-6 py-3 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-60"
        >
          {submitting ? "Assigning..." : "Assign Trainer"}
        </button>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-3 dark:border-gray-800">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Current assignments</h2>
          <label className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
              className="rounded border-gray-300 text-brand-500 focus:ring-brand-500"
            />
            Show inactive
          </label>
        </div>
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th className="px-5 py-3 text-left font-medium text-gray-500">Trainer</th>
              <th className="px-5 py-3 text-left font-medium text-gray-500">Program</th>
              <th className="px-5 py-3 text-left font-medium text-gray-500">Status</th>
              <th className="px-5 py-3 text-left font-medium text-gray-500">Assigned</th>
              <th className="px-5 py-3 text-right font-medium text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : visibleAssignments.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-gray-500">
                  No assignments yet
                </td>
              </tr>
            ) : (
              visibleAssignments.map((row) => (
                <tr key={row.id}>
                  <td className="px-5 py-3">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {row.trainer.name || "—"}
                    </div>
                    <div className="text-xs text-gray-500">{row.trainer.email}</div>
                  </td>
                  <td className="px-5 py-3 text-gray-700 dark:text-gray-300">{row.programTitle}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        row.active
                          ? "bg-success-50 text-success-600 dark:bg-success-500/10"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {row.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-600 dark:text-gray-400">
                    {formatDate(row.assignedAt)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    {row.active ? (
                      <button
                        type="button"
                        onClick={() => handleUnassign(row)}
                        className="text-sm font-medium text-error-500 hover:underline"
                      >
                        Unassign
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
