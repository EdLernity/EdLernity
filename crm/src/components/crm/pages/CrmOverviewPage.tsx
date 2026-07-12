"use client";

import React, { useEffect, useState } from "react";
import StatCard from "@/components/crm/StatCard";
import RoleBadge from "@/components/crm/RoleBadge";
import { fetchOverview } from "@/lib/crmApi";
import { formatCurrency, formatDate } from "@/lib/crmUtils";

export default function CrmOverviewPage() {
  const [data, setData] = useState<Awaited<ReturnType<typeof fetchOverview>> | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOverview()
      .then(setData)
      .catch(() => setError("Failed to load overview"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading overview...</p>;
  }

  if (error || !data) {
    return <p className="text-error-500">{error || "No data"}</p>;
  }

  const { stats, recentUsers } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Overview</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          EdLernity platform metrics at a glance
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Users" value={stats.totalUsers} />
        <StatCard label="Internship Enrollments" value={stats.totalEnrollments} hint={`${stats.enrollmentsThisMonth} this month`} />
        <StatCard label="Certificates Issued" value={stats.totalCertificates} />
        <StatCard label="Total Revenue" value={formatCurrency(stats.totalRevenue)} hint={`${stats.transactionCount} transactions`} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Students" value={stats.usersByRole.student} />
        <StatCard label="Trainers" value={stats.usersByRole.trainer} />
        <StatCard label="Admins" value={stats.usersByRole.admin} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard label="Verified Users" value={stats.verifiedUsers} />
        <StatCard label="Blocked Users" value={stats.blockedUsers} />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="font-semibold text-gray-900 dark:text-white">Recent Signups</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Name</th>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Email</th>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Role</th>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {recentUsers.map((u) => (
                <tr key={u.id}>
                  <td className="px-5 py-3 text-gray-900 dark:text-white">{u.name || "—"}</td>
                  <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{u.email}</td>
                  <td className="px-5 py-3"><RoleBadge role={u.role} /></td>
                  <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{formatDate(u.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
