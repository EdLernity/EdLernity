"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  CrmCourse,
  CrmCourseAccessUser,
  fetchCourseAccess,
  fetchCrmCourses,
  grantCourseAccess,
  revokeCourseAccess,
} from "@/lib/crmApi";
import { inputClass, selectClass } from "@/lib/crmUtils";

export default function CrmCourseAccessPage() {
  const [courses, setCourses] = useState<CrmCourse[]>([]);
  const [users, setUsers] = useState<CrmCourseAccessUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [busyUserId, setBusyUserId] = useState<string | null>(null);
  const [courseByUser, setCourseByUser] = useState<Record<string, string>>({});

  const loadCourses = useCallback(async () => {
    try {
      setCourses(await fetchCrmCourses());
    } catch {
      setMessage("Failed to load courses");
    }
  }, []);

  const load = useCallback(async (term?: string) => {
    setLoading(true);
    try {
      setUsers(await fetchCourseAccess(term));
    } catch {
      setMessage("Failed to load course access");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  useEffect(() => {
    const handle = setTimeout(() => load(search.trim() || undefined), 350);
    return () => clearTimeout(handle);
  }, [search, load]);

  const run = async (userId: string, fn: () => Promise<unknown>, ok: string) => {
    setBusyUserId(userId);
    setMessage("");
    try {
      await fn();
      setMessage(ok);
      await load(search.trim() || undefined);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Action failed";
      setMessage(msg);
    } finally {
      setBusyUserId(null);
    }
  };

  const handleGrantCourse = (user: CrmCourseAccessUser) => {
    const courseId = courseByUser[user.id];
    if (!courseId) {
      setMessage("Select a course to grant");
      return;
    }
    run(
      user.id,
      () => grantCourseAccess({ userId: user.id, courseId }),
      `Course granted to ${user.name}`
    );
  };

  const handleGrantAll = (user: CrmCourseAccessUser) =>
    run(
      user.id,
      () => grantCourseAccess({ userId: user.id, allCourses: true }),
      `All-course access granted to ${user.name}`
    );

  const handleRevokeCourse = (user: CrmCourseAccessUser, courseId: string) =>
    run(
      user.id,
      () => revokeCourseAccess({ userId: user.id, courseId }),
      `Course revoked from ${user.name}`
    );

  const handleRevokeAll = (user: CrmCourseAccessUser) => {
    if (!window.confirm(`Revoke ALL course access from ${user.name}?`)) return;
    run(
      user.id,
      () => revokeCourseAccess({ userId: user.id, allCourses: true }),
      `All access revoked from ${user.name}`
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Course Access</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Grant or revoke course access for any user. Search by name or email to find a user;
          without a search, users who already have access are shown.
        </p>
      </div>

      {message && (
        <p className="text-sm text-brand-600 bg-brand-50 dark:bg-brand-500/10 rounded-lg px-4 py-2">
          {message}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Search user by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={inputClass() + " max-w-md"}
        />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th className="px-5 py-3 text-left font-medium text-gray-500">User</th>
              <th className="px-5 py-3 text-left font-medium text-gray-500">Current access</th>
              <th className="px-5 py-3 text-left font-medium text-gray-500">Grant</th>
              <th className="px-5 py-3 text-right font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-gray-500">
                  {search ? "No users match your search" : "No users with course access yet"}
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const busy = busyUserId === user.id;
                return (
                  <tr key={user.id}>
                    <td className="px-5 py-3 align-top">
                      <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                      <div className="text-xs text-gray-400 capitalize">{user.role}</div>
                    </td>
                    <td className="px-5 py-3 align-top">
                      {user.isAllCourse ? (
                        <span className="inline-flex rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-600 dark:bg-brand-500/10">
                          All courses
                        </span>
                      ) : user.courses.length === 0 ? (
                        <span className="text-xs text-gray-400">No access</span>
                      ) : (
                        <div className="flex flex-wrap gap-1.5 max-w-md">
                          {user.courses.map((course) => (
                            <span
                              key={course.id}
                              className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                            >
                              {course.title}
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => handleRevokeCourse(user, course.id)}
                                className="text-error-500 hover:text-error-600 disabled:opacity-50"
                                title="Revoke this course"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3 align-top">
                      <div className="flex flex-wrap items-center gap-2">
                        <select
                          value={courseByUser[user.id] || ""}
                          onChange={(e) =>
                            setCourseByUser((prev) => ({ ...prev, [user.id]: e.target.value }))
                          }
                          className={selectClass() + " !h-9 !py-1 text-xs max-w-[220px]"}
                          disabled={busy || user.isAllCourse}
                        >
                          <option value="">Select course...</option>
                          {courses.map((course) => (
                            <option key={course.id} value={course.id}>
                              {course.title}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          disabled={busy || user.isAllCourse}
                          onClick={() => handleGrantCourse(user)}
                          className="rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-600 disabled:opacity-50"
                        >
                          Grant
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-3 align-top text-right space-x-3 whitespace-nowrap">
                      {!user.isAllCourse && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => handleGrantAll(user)}
                          className="text-xs font-medium text-brand-500 hover:text-brand-600 disabled:opacity-50"
                        >
                          Grant all
                        </button>
                      )}
                      {(user.isAllCourse || user.courses.length > 0) && (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => handleRevokeAll(user)}
                          className="text-xs font-medium text-error-500 hover:text-error-600 disabled:opacity-50"
                        >
                          Revoke all
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400">
        Tip: use <span className="font-medium">Grant all</span> for users who bought the full
        bundle. Removing a single course also clears blanket &quot;all courses&quot; access.
      </p>
    </div>
  );
}
