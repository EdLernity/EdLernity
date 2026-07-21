"use client";

import React, { useCallback, useEffect, useState } from "react";
import RoleBadge from "@/components/crm/RoleBadge";
import {
  CrmUser,
  deleteUser,
  fetchUsers,
  updateUserBlock,
  updateUserLearnerAccess,
  updateUserRole,
  UserRole,
} from "@/lib/crmApi";
import { formatDate, inputClass, selectClass } from "@/lib/crmUtils";

export default function CrmUsersPage() {
  const [users, setUsers] = useState<CrmUser[]>([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchUsers({
        page,
        limit: 20,
        search: search || undefined,
        role: role || undefined,
      });
      setUsers(data.users);
      setTotalPages(data.pagination.pages);
    } catch {
      setMessage("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [page, search, role]);

  useEffect(() => {
    load();
  }, [load]);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await updateUserRole(userId, newRole);
      setMessage(
        newRole === "intern"
          ? "Role updated to intern (learner access kept if they were a student)"
          : "Role updated"
      );
      load();
    } catch {
      setMessage("Failed to update role");
    }
  };

  const handleLearnerAccessToggle = async (userId: string, enabled: boolean) => {
    try {
      await updateUserLearnerAccess(userId, enabled);
      setMessage(enabled ? "Learner site access enabled" : "Learner site access disabled");
      load();
    } catch {
      setMessage("Failed to update learner access");
    }
  };

  const handleDelete = async (userId: string, email: string) => {
    if (!window.confirm(`Delete user ${email}? This cannot be undone.`)) return;
    setDeletingId(userId);
    setMessage("");
    try {
      await deleteUser(userId);
      setMessage("User deleted");
      load();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to delete user";
      setMessage(msg);
    } finally {
      setDeletingId(null);
    }
  };

  const handleBlockToggle = async (userId: string, blocked: boolean) => {
    try {
      await updateUserBlock(userId, blocked);
      setMessage(blocked ? "User blocked" : "User unblocked");
      load();
    } catch {
      setMessage("Failed to update block status");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage roles. For interns who also bought courses, enable{" "}
          <span className="font-medium text-gray-700 dark:text-gray-300">Learner access</span> so
          they can use both portal.edlernity.com and www.edlernity.com.
        </p>
      </div>

      {message && (
        <p className="text-sm text-brand-600 bg-brand-50 dark:bg-brand-500/10 rounded-lg px-4 py-2">{message}</p>
      )}

      <div className="flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Search name, email, phone..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className={inputClass() + " max-w-sm"}
        />
        <select
          value={role}
          onChange={(e) => { setRole(e.target.value); setPage(1); }}
          className={selectClass() + " max-w-[160px]"}
        >
          <option value="">All roles</option>
          <option value="student">Student</option>
          <option value="intern">Intern</option>
          <option value="trainer">Trainer</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th className="px-5 py-3 text-left font-medium text-gray-500">Name</th>
              <th className="px-5 py-3 text-left font-medium text-gray-500">Email</th>
              <th className="px-5 py-3 text-left font-medium text-gray-500">Phone</th>
              <th className="px-5 py-3 text-left font-medium text-gray-500">Role</th>
              <th className="px-5 py-3 text-left font-medium text-gray-500">Learner access</th>
              <th className="px-5 py-3 text-left font-medium text-gray-500">Status</th>
              <th className="px-5 py-3 text-left font-medium text-gray-500">Joined</th>
              <th className="px-5 py-3 text-right font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <tr><td colSpan={8} className="px-5 py-8 text-center text-gray-500">Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={8} className="px-5 py-8 text-center text-gray-500">No users found</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td className="px-5 py-3 font-medium text-gray-900 dark:text-white">
                    {[u.firstName, u.lastName].filter(Boolean).join(" ") || "—"}
                  </td>
                  <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{u.email}</td>
                  <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{u.phone || "—"}</td>
                  <td className="px-5 py-3">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                      className={selectClass() + " !h-9 !py-1 text-xs"}
                    >
                      <option value="student">Student</option>
                      <option value="intern">Intern</option>
                      <option value="trainer">Trainer</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-5 py-3">
                    <label className="inline-flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                      <input
                        type="checkbox"
                        checked={u.role === "student" || Boolean(u.learnerAccess)}
                        disabled={u.role === "student"}
                        onChange={(e) => handleLearnerAccessToggle(u.id, e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300"
                        title={
                          u.role === "student"
                            ? "Students always have learner access"
                            : "Allow this user to sign in on www.edlernity.com for courses"
                        }
                      />
                      {u.role === "student" || u.learnerAccess ? "On" : "Off"}
                    </label>
                  </td>
                  <td className="px-5 py-3">
                    <RoleBadge role={u.isBlocked ? "blocked" : u.isVerified ? "verified" : "pending"} />
                  </td>
                  <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{formatDate(u.createdAt)}</td>
                  <td className="px-5 py-3 text-right space-x-3">
                    <button
                      type="button"
                      onClick={() => handleBlockToggle(u.id, !u.isBlocked)}
                      className="text-xs font-medium text-brand-500 hover:text-brand-600"
                    >
                      {u.isBlocked ? "Unblock" : "Block"}
                    </button>
                    {(u.role === "student" || u.role === "intern") && (
                      <button
                        type="button"
                        disabled={deletingId === u.id}
                        onClick={() => handleDelete(u.id, u.email)}
                        className="text-xs font-medium text-error-500 hover:text-error-600 disabled:opacity-50"
                      >
                        {deletingId === u.id ? "Deleting..." : "Delete"}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex gap-2 justify-center">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 text-sm rounded-lg border border-gray-200 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-gray-500">Page {page} of {totalPages}</span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 text-sm rounded-lg border border-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
