"use client";

import React, { useEffect, useState } from "react";
import {
  assignStudent,
  assignTrainer,
  fetchAdminPrograms,
  setUserRoleByEmail,
  UserRole,
} from "@/lib/crmApi";
import { inputClass, selectClass } from "@/lib/crmUtils";

export default function CrmOperationsPage() {
  const [programs, setPrograms] = useState<Array<{ slug: string; title: string }>>([]);
  const [message, setMessage] = useState("");
  const [studentForm, setStudentForm] = useState({
    studentEmail: "",
    internshipSlug: "",
    trainerEmail: "",
  });
  const [trainerForm, setTrainerForm] = useState({ trainerEmail: "", internshipSlug: "" });
  const [roleForm, setRoleForm] = useState({ email: "", role: "trainer" as UserRole });

  useEffect(() => {
    fetchAdminPrograms().then(setPrograms).catch(() => setMessage("Failed to load programs"));
  }, []);

  const handleAssignStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await assignStudent(studentForm);
      setMessage("Student assigned successfully");
      setStudentForm({ studentEmail: "", internshipSlug: "", trainerEmail: "" });
    } catch {
      setMessage("Failed to assign student");
    }
  };

  const handleAssignTrainer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await assignTrainer(trainerForm);
      setMessage("Trainer assigned successfully");
      setTrainerForm({ trainerEmail: "", internshipSlug: "" });
    } catch {
      setMessage("Failed to assign trainer");
    }
  };

  const handleSetRole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setUserRoleByEmail(roleForm);
      setMessage(`Role updated to ${roleForm.role}`);
      setRoleForm({ email: "", role: "trainer" });
    } catch {
      setMessage("Failed to update role");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Operations</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Assign students, trainers, and manage roles</p>
      </div>

      {message && (
        <p className="text-sm text-brand-600 bg-brand-50 dark:bg-brand-500/10 rounded-lg px-4 py-2">{message}</p>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <form onSubmit={handleAssignStudent} className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Assign Student</h2>
          <input
            type="email"
            required
            placeholder="Student email"
            value={studentForm.studentEmail}
            onChange={(e) => setStudentForm({ ...studentForm, studentEmail: e.target.value })}
            className={inputClass()}
          />
          <select
            required
            value={studentForm.internshipSlug}
            onChange={(e) => setStudentForm({ ...studentForm, internshipSlug: e.target.value })}
            className={selectClass()}
          >
            <option value="">Select program</option>
            {programs.map((p) => (
              <option key={p.slug} value={p.slug}>{p.title}</option>
            ))}
          </select>
          <input
            type="email"
            placeholder="Trainer email (optional)"
            value={studentForm.trainerEmail}
            onChange={(e) => setStudentForm({ ...studentForm, trainerEmail: e.target.value })}
            className={inputClass()}
          />
          <button type="submit" className="w-full py-3 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600">
            Assign Student
          </button>
        </form>

        <form onSubmit={handleAssignTrainer} className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Assign Trainer</h2>
          <input
            type="email"
            required
            placeholder="Trainer email"
            value={trainerForm.trainerEmail}
            onChange={(e) => setTrainerForm({ ...trainerForm, trainerEmail: e.target.value })}
            className={inputClass()}
          />
          <select
            required
            value={trainerForm.internshipSlug}
            onChange={(e) => setTrainerForm({ ...trainerForm, internshipSlug: e.target.value })}
            className={selectClass()}
          >
            <option value="">Select program</option>
            {programs.map((p) => (
              <option key={p.slug} value={p.slug}>{p.title}</option>
            ))}
          </select>
          <button type="submit" className="w-full py-3 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600">
            Assign Trainer
          </button>
        </form>

        <form onSubmit={handleSetRole} className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 space-y-4 lg:col-span-2 max-w-xl">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Set User Role</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              type="email"
              required
              placeholder="User email"
              value={roleForm.email}
              onChange={(e) => setRoleForm({ ...roleForm, email: e.target.value })}
              className={inputClass()}
            />
            <select
              value={roleForm.role}
              onChange={(e) => setRoleForm({ ...roleForm, role: e.target.value as UserRole })}
              className={selectClass()}
            >
              <option value="student">Student</option>
              <option value="trainer">Trainer</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="px-6 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 dark:bg-white dark:text-gray-900">
            Update Role
          </button>
        </form>
      </div>
    </div>
  );
}
