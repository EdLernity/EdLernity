"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import StatCard from "@/components/crm/StatCard";
import { fetchManagerDashboard } from "@/lib/crmApi";
import { formatDate } from "@/lib/crmUtils";

export default function CrmManagerDashboardPage() {
  const [data, setData] = useState<Awaited<ReturnType<typeof fetchManagerDashboard>> | null>(
    null
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchManagerDashboard()
      .then(setData)
      .catch(() => setError("Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading dashboard...</p>;
  }

  if (error || !data) {
    return <p className="text-error-500">{error || "No data"}</p>;
  }

  const { stats, recentPendingApprovals } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Intern pipeline overview — approvals, certificates, and invites
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Interns" value={stats.totalInterns} hint="Active profiles" />
        <StatCard
          label="Awaiting KYC Approval"
          value={stats.kycPending}
          hint="Needs Approve on Intern Certificate"
        />
        <StatCard label="Profiles Approved" value={stats.kycApproved} />
        <StatCard
          label="Certificates This Month"
          value={stats.certificatesThisMonth}
          hint="Internship certificates issued"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Tech Awaiting Certificate"
          value={stats.techAwaitingCertificate}
          hint="Tech Internship Approvals queue"
        />
        <StatCard
          label="Business Awaiting Certificate"
          value={stats.businessAwaitingCertificate}
          hint="HR / sales / marketing — Intern Certificate"
        />
        <StatCard
          label="Trainer Completed"
          value={stats.readyAfterTrainer}
          hint="Marked complete by trainer"
        />
        <StatCard label="Rejected Applications" value={stats.kycRejected} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard label="Open Invites" value={stats.pendingInvites} hint="Not yet onboarded" />
        <StatCard label="Offer Letters Issued" value={stats.offerLettersIssued} />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Link
          href="/business-internship-approvals"
          className="rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm font-semibold text-brand-600 transition hover:bg-brand-50 dark:border-gray-800 dark:bg-white/[0.03] dark:hover:bg-brand-500/10"
        >
          Business certificates →
        </Link>
        <Link
          href="/internship-approvals"
          className="rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm font-semibold text-brand-600 transition hover:bg-brand-50 dark:border-gray-800 dark:bg-white/[0.03] dark:hover:bg-brand-500/10"
        >
          Tech Internship Approvals →
        </Link>
        <Link
          href="/invites"
          className="rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm font-semibold text-brand-600 transition hover:bg-brand-50 dark:border-gray-800 dark:bg-white/[0.03] dark:hover:bg-brand-500/10"
        >
          Manage Invites →
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
          <h2 className="font-semibold text-gray-900 dark:text-white">
            Recent KYC awaiting approval
          </h2>
          <Link href="/interns" className="text-sm font-medium text-brand-500 hover:underline">
            View all
          </Link>
        </div>
        {recentPendingApprovals.length === 0 ? (
          <p className="px-5 py-8 text-sm text-gray-500">No pending KYC right now.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Name</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Email</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Program</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {recentPendingApprovals.map((row) => (
                  <tr key={row.id}>
                    <td className="px-5 py-3 text-gray-900 dark:text-white">{row.name}</td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{row.email}</td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-400">
                      {row.program || "—"}
                    </td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-400">
                      {formatDate(row.submittedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
