"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Select, { StylesConfig } from "react-select";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import {
  CrmCourse,
  CrmCourseAccessOption,
  CrmCourseAccessUser,
  fetchCourseAccess,
  fetchCourseAccessUsers,
  fetchCrmCourses,
  grantCourseAccess,
  revokeCourseAccess,
} from "@/lib/crmApi";
import { inputClass, selectClass } from "@/lib/crmUtils";

type SelectOption = { value: string; label: string };

const rsStyles: StylesConfig<SelectOption, false> = {
  control: (base, state) => ({
    ...base,
    minHeight: 44,
    borderRadius: 8,
    borderColor: state.isFocused ? "#7592ff" : "#d1d5db",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(70,95,255,0.1)" : "none",
    backgroundColor: "transparent",
    fontSize: 14,
    "&:hover": { borderColor: "#7592ff" },
  }),
  menuPortal: (base) => ({ ...base, zIndex: 1000000 }),
  option: (base, state) => ({
    ...base,
    fontSize: 14,
    backgroundColor: state.isSelected
      ? "#465fff"
      : state.isFocused
        ? "#eef2ff"
        : "transparent",
    color: state.isSelected ? "#fff" : "#111827",
  }),
};

export default function CrmCourseAccessPage() {
  const [courses, setCourses] = useState<CrmCourse[]>([]);
  const [users, setUsers] = useState<CrmCourseAccessUser[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [busyUserId, setBusyUserId] = useState<string | null>(null);

  const { isOpen, openModal, closeModal } = useModal();

  const loadCourses = useCallback(async () => {
    try {
      setCourses(await fetchCrmCourses());
    } catch {
      setMessage("Failed to load courses");
    }
  }, []);

  const load = useCallback(async (term: string, pageNum: number) => {
    setLoading(true);
    try {
      const data = await fetchCourseAccess({
        search: term || undefined,
        page: pageNum,
        limit: 20,
      });
      setUsers(data.users);
      setTotalPages(data.pagination.pages);
      setTotal(data.pagination.total);
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
    const handle = setTimeout(() => load(search.trim(), page), 350);
    return () => clearTimeout(handle);
  }, [search, page, load]);

  const reload = () => load(search.trim(), page);

  const run = async (userId: string, fn: () => Promise<unknown>, ok: string) => {
    setBusyUserId(userId);
    setMessage("");
    try {
      await fn();
      setMessage(ok);
      await reload();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Action failed";
      setMessage(msg);
    } finally {
      setBusyUserId(null);
    }
  };

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
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Course Access</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Grant or revoke course access for any user. Use the search to find a user; without a
            search, users who already have access are shown.
          </p>
        </div>
        <button
          type="button"
          onClick={openModal}
          className="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600"
        >
          + Grant access
        </button>
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
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className={inputClass() + " max-w-md"}
        />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-x-auto">
        <table className="w-full text-sm min-w-[760px]">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th className="px-5 py-3 text-left font-medium text-gray-500">User</th>
              <th className="px-5 py-3 text-left font-medium text-gray-500">Current access</th>
              <th className="px-5 py-3 text-right font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <tr>
                <td colSpan={3} className="px-5 py-8 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-5 py-8 text-center text-gray-500">
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
                    <td className="px-5 py-3 align-top text-right whitespace-nowrap">
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

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 text-sm rounded-lg border border-gray-200 disabled:opacity-50 dark:border-gray-700"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-gray-500">
            Page {page} of {totalPages} · {total} users
          </span>
          <button
            type="button"
            disabled={page >= totalPages || loading}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-4 py-2 text-sm rounded-lg border border-gray-200 disabled:opacity-50 dark:border-gray-700"
          >
            Next
          </button>
        </div>
      )}

      <GrantAccessModal
        isOpen={isOpen}
        onClose={closeModal}
        courses={courses}
        onGranted={(msg) => {
          setMessage(msg);
          reload();
        }}
      />
    </div>
  );
}

function GrantAccessModal({
  isOpen,
  onClose,
  courses,
  onGranted,
}: {
  isOpen: boolean;
  onClose: () => void;
  courses: CrmCourse[];
  onGranted: (message: string) => void;
}) {
  const [users, setUsers] = useState<CrmCourseAccessOption[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userId, setUserId] = useState("");
  const [isAllCourse, setIsAllCourse] = useState("");
  const [courseId, setCourseId] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setUserId("");
      setIsAllCourse("");
      setCourseId("");
      setPaymentId("");
      setError("");
      return;
    }
    setLoadingUsers(true);
    fetchCourseAccessUsers()
      .then(setUsers)
      .catch(() => setError("Failed to load users"))
      .finally(() => setLoadingUsers(false));
  }, [isOpen]);

  const allSelected = isAllCourse === "yes";

  const userOptions = useMemo<SelectOption[]>(
    () => users.map((u) => ({ value: u.id, label: `${u.name} | ${u.email}` })),
    [users]
  );
  const courseOptions = useMemo<SelectOption[]>(
    () => courses.map((c) => ({ value: c.id, label: c.title })),
    [courses]
  );
  const menuPortalTarget = typeof document !== "undefined" ? document.body : undefined;

  const handleSubmit = async () => {
    if (!userId) {
      setError("Select a username");
      return;
    }
    if (!allSelected && !courseId) {
      setError("Select a course (or set 'Is All Course Subscribed' to Yes)");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const selectedName = users.find((u) => u.id === userId)?.name || "user";
      await grantCourseAccess({
        userId,
        allCourses: allSelected,
        courseId: allSelected ? undefined : courseId,
        paymentId: paymentId.trim() || undefined,
      });
      onGranted(
        allSelected
          ? `All-course access granted to ${selectedName}`
          : `Course access granted to ${selectedName}`
      );
      onClose();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to grant access";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[520px] p-6 lg:p-8 m-4">
      <h4 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
        Grant course access
      </h4>

      {error && (
        <p className="mb-4 text-sm text-error-500 bg-error-50 dark:bg-error-500/10 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="space-y-5">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
            User name
          </label>
          <Select<SelectOption>
            instanceId="course-access-user"
            options={userOptions}
            value={userOptions.find((o) => o.value === userId) || null}
            onChange={(opt) => setUserId(opt?.value || "")}
            isLoading={loadingUsers}
            isClearable
            placeholder={loadingUsers ? "Loading users..." : "Select username"}
            styles={rsStyles}
            menuPortalTarget={menuPortalTarget}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
            Is All Course Subscribed
          </label>
          <select
            value={isAllCourse}
            onChange={(e) => setIsAllCourse(e.target.value)}
            className={selectClass()}
          >
            <option value="">Is All Course Subscribed</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        {!allSelected && (
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
              Courses
            </label>
            <Select<SelectOption>
              instanceId="course-access-course"
              options={courseOptions}
              value={courseOptions.find((o) => o.value === courseId) || null}
              onChange={(opt) => setCourseId(opt?.value || "")}
              isClearable
              placeholder="Select Courses"
              styles={rsStyles}
              menuPortalTarget={menuPortalTarget}
            />
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
            Payment ID
          </label>
          <input
            type="text"
            value={paymentId}
            onChange={(e) => setPaymentId(e.target.value)}
            placeholder="Enter Payment Id"
            className={inputClass()}
          />
        </div>

        <div className="flex justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={handleSubmit}
            className="rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
