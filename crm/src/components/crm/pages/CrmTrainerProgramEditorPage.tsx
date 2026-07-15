"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  completeTrainerInternship,
  completeTrainerInternshipBulk,
  fetchTrainerProgramConfig,
  fetchTrainerProgramProgress,
  fetchTrainerStudents,
  reviewTrainerProject,
  saveTrainerProgramConfig,
  TrainerProgramConfig,
  TrainerProgressStudent,
  TrainerStudentRow,
} from "@/lib/crmApi";

const SECTIONS = [
  { id: "schedule", label: "Schedule" },
  { id: "classes", label: "Live Classes" },
  { id: "projects", label: "Projects" },
  { id: "progress", label: "Progress" },
  { id: "bonuses", label: "Bonuses" },
  { id: "announcements", label: "Announcements" },
] as const;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white";

const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

const DEFAULT_CLASS_SLOTS = [
  { day: "Monday", time: "7:00 PM - 8:30 PM IST" },
  { day: "Wednesday", time: "7:00 PM - 8:30 PM IST" },
  { day: "Friday", time: "7:00 PM - 8:30 PM IST" },
];

function to12hLabel(hhmm: string): string {
  if (!hhmm || !/^\d{2}:\d{2}$/.test(hhmm)) return "";
  const [hStr, mStr] = hhmm.split(":");
  let hour = Number(hStr);
  const minutes = mStr;
  const suffix = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  if (hour === 0) hour = 12;
  return `${hour}:${minutes} ${suffix}`;
}

function parse12hTo24(token: string): string {
  const match = token
    .trim()
    .match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return "";
  let hour = Number(match[1]);
  const minutes = match[2];
  const suffix = match[3].toUpperCase();
  if (suffix === "AM") {
    if (hour === 12) hour = 0;
  } else if (hour !== 12) {
    hour += 12;
  }
  return `${String(hour).padStart(2, "0")}:${minutes}`;
}

/** Stored as "7:00 PM - 8:30 PM IST" (legacy free text still parses when possible). */
function parseScheduleTime(value: string): { start: string; end: string } {
  const cleaned = (value || "").replace(/\bIST\b/gi, "").trim();
  const parts = cleaned.split(/\s*-\s*/);
  if (parts.length >= 2) {
    const start = parse12hTo24(parts[0]) || (/^\d{2}:\d{2}$/.test(parts[0].trim()) ? parts[0].trim() : "");
    const end = parse12hTo24(parts[1]) || (/^\d{2}:\d{2}$/.test(parts[1].trim()) ? parts[1].trim() : "");
    return { start, end };
  }
  const single = parse12hTo24(cleaned) || (/^\d{2}:\d{2}$/.test(cleaned) ? cleaned : "");
  return { start: single, end: "" };
}

function buildScheduleTime(start: string, end: string): string {
  const startLabel = to12hLabel(start);
  const endLabel = to12hLabel(end);
  if (startLabel && endLabel) return `${startLabel} - ${endLabel} IST`;
  if (startLabel) return `${startLabel} IST`;
  return "";
}

function DaySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (day: string) => void;
}) {
  const known = WEEKDAYS.includes(value as (typeof WEEKDAYS)[number]);
  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className={inputClass}
    >
      <option value="">Select day</option>
      {!known && value ? <option value={value}>{value}</option> : null}
      {WEEKDAYS.map((day) => (
        <option key={day} value={day}>
          {day}
        </option>
      ))}
    </select>
  );
}

function TimeRangePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (time: string) => void;
}) {
  const { start, end } = parseScheduleTime(value);
  return (
    <div className="grid grid-cols-2 gap-2">
      <input
        type="time"
        value={start}
        onChange={(e) => onChange(buildScheduleTime(e.target.value, end))}
        className={inputClass}
        aria-label="Start time"
      />
      <input
        type="time"
        value={end}
        onChange={(e) => onChange(buildScheduleTime(start, e.target.value))}
        className={inputClass}
        aria-label="End time"
      />
    </div>
  );
}

function emptyClassAssignment() {
  return {
    title: "",
    dueLabel: "Submit before next live class",
    instructions: "",
    passingScore: 8,
    questions: [] as any[],
  };
}

function normalizeClassAssignment(raw: any) {
  const row = raw || {};
  const pass = Number(row.passingScore);
  return {
    title: row.title || "",
    dueLabel: row.dueLabel || "",
    instructions: row.instructions || "",
    passingScore: Number.isFinite(pass) ? Math.min(50, Math.max(1, Math.round(pass))) : 8,
    questions: Array.isArray(row.questions)
      ? row.questions.map((q: any, index: number) => ({
          id: q.id || `q-${index + 1}`,
          type: q.type === "text" ? "text" : "mcq",
          prompt: q.prompt || "",
          options: Array.isArray(q.options) ? q.options : ["", "", "", ""],
          correctOptionIndex:
            typeof q.correctOptionIndex === "number" ? q.correctOptionIndex : 0,
        }))
      : [],
  };
}

function createEmptyLiveClass(weekLabel: string, classIndex: number) {
  const slot = DEFAULT_CLASS_SLOTS[classIndex % DEFAULT_CLASS_SLOTS.length];
  return {
    id: `class-${Date.now()}-${classIndex}-${Math.random().toString(36).slice(2, 7)}`,
    title: `${weekLabel || "Week"} · Class ${classIndex + 1}`,
    meetingLink: "",
    recordingUrl: "",
    noteTitle: "",
    noteUrl: "",
    scheduleDay: slot.day,
    scheduleTime: slot.time,
    assignment: emptyClassAssignment(),
  };
}

function createEmptyModule(index: number) {
  const week = `Week ${index + 1}`;
  const liveClasses = DEFAULT_CLASS_SLOTS.map((_, classIndex) =>
    createEmptyLiveClass(week, classIndex)
  );
  return {
    weekIndex: index,
    week,
    topic: "",
    isCapstone: index >= 8,
    published: true,
    liveClasses,
    liveClass: {
      title: liveClasses[0].title,
      meetingLink: "",
      scheduleDay: liveClasses[0].scheduleDay,
      scheduleTime: liveClasses[0].scheduleTime,
    },
    recording: {
      title: `Week ${index + 1} Recording`,
      url: "",
      duration: "1h 45m",
    },
    notes: [],
    assignment: {
      title: index >= 8 ? `Project Milestone - Week ${index + 1}` : "",
      dueLabel: "Submit before next live class",
      instructions: "",
      type: index >= 8 ? "project" : "assignment",
      githubRequired: index >= 8,
    },
    resources: [],
  };
}

function ensureModuleLiveClasses(mod: any) {
  const legacyNotes = Array.isArray(mod.notes) ? mod.notes : [];
  const legacyAssignment =
    !mod.isCapstone && mod.assignment
      ? normalizeClassAssignment(mod.assignment)
      : null;

  if (Array.isArray(mod.liveClasses) && mod.liveClasses.length) {
    return mod.liveClasses.map((row: any, index: number) => {
      const legacyNote = legacyNotes[index] || {};
      let assignment = normalizeClassAssignment(row.assignment);
      if (
        index === 0 &&
        legacyAssignment &&
        !assignment.title &&
        !(assignment.questions || []).length
      ) {
        assignment = legacyAssignment;
      }
      return {
        id: row.id || `class-${index + 1}`,
        title: row.title || `${mod.week || "Week"} · Class ${index + 1}`,
        meetingLink: row.meetingLink || "",
        recordingUrl: row.recordingUrl || (index === 0 ? mod.recording?.url || "" : ""),
        noteTitle: row.noteTitle || legacyNote.title || "",
        noteUrl: row.noteUrl || legacyNote.url || "",
        scheduleDay: row.scheduleDay || "",
        scheduleTime: row.scheduleTime || "",
        assignment,
      };
    });
  }
  if (mod.liveClass) {
    const legacyNote = legacyNotes[0] || {};
    return [
      {
        id: "class-1",
        title: mod.liveClass.title || `${mod.week || "Week"} · Class 1`,
        meetingLink: mod.liveClass.meetingLink || "",
        recordingUrl: mod.liveClass.recordingUrl || mod.recording?.url || "",
        noteTitle: mod.liveClass.noteTitle || legacyNote.title || "",
        noteUrl: mod.liveClass.noteUrl || legacyNote.url || "",
        scheduleDay: mod.liveClass.scheduleDay || "",
        scheduleTime: mod.liveClass.scheduleTime || "",
        assignment: normalizeClassAssignment(
          mod.liveClass.assignment || legacyAssignment || emptyClassAssignment()
        ),
      },
    ];
  }
  return [createEmptyLiveClass(mod.week || "Week", 0)];
}

export default function CrmTrainerProgramEditorPage() {
  const params = useParams();
  const slug = String(params.slug || "");
  const router = useRouter();
  const [config, setConfig] = useState<TrainerProgramConfig | null>(null);
  const [students, setStudents] = useState<TrainerStudentRow[]>([]);
  const [section, setSection] = useState<(typeof SECTIONS)[number]["id"]>("schedule");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [progressLoading, setProgressLoading] = useState(false);
  const [progressError, setProgressError] = useState("");
  const [progressSummary, setProgressSummary] = useState<{
    studentCount: number;
    assignmentCount: number;
    projectCount: number;
    studentsWithAllAssignments: number;
    studentsWithAllProjects: number;
    internshipCompletedCount?: number;
    eligibleForCompletionCount?: number;
  } | null>(null);
  const [progressStudents, setProgressStudents] = useState<TrainerProgressStudent[]>([]);
  const [progressSearch, setProgressSearch] = useState("");
  const [progressFilter, setProgressFilter] = useState<
    "all" | "assignments_pending" | "assignments_done" | "projects_pending" | "projects_done"
  >("all");
  const [expandedStudentId, setExpandedStudentId] = useState("");
  const [selectedCompleteIds, setSelectedCompleteIds] = useState<string[]>([]);
  const [actionBusyKey, setActionBusyKey] = useState("");
  const [rejectDraft, setRejectDraft] = useState<Record<string, string>>({});

  useEffect(() => {
    const fromQuery = new URLSearchParams(window.location.search).get("section");
    if (SECTIONS.some((s) => s.id === fromQuery)) {
      setSection(fromQuery as (typeof SECTIONS)[number]["id"]);
    }
  }, []);

  useEffect(() => {
    if (!slug) return;
    Promise.all([fetchTrainerProgramConfig(slug), fetchTrainerStudents(slug)])
      .then(([cfg, studs]) => {
        setConfig(cfg);
        setStudents(studs);
      })
      .catch(() => {
        setError("Cannot access this program.");
        router.replace("/trainer");
      })
      .finally(() => setLoading(false));
  }, [slug, router]);

  const loadProgress = useCallback(async () => {
    if (!slug) return;
    setProgressLoading(true);
    setProgressError("");
    try {
      const data = await fetchTrainerProgramProgress(slug);
      setProgressSummary(data.summary);
      setProgressStudents(data.students || []);
      setSelectedCompleteIds((prev) =>
        prev.filter((id) =>
          (data.students || []).some((s) => s.id === id && s.eligibleForCompletion)
        )
      );
    } catch (e: any) {
      setProgressError(e?.response?.data?.message || "Failed to load progress");
      setProgressSummary(null);
      setProgressStudents([]);
    } finally {
      setProgressLoading(false);
    }
  }, [slug]);

  const handleReviewProject = async (
    student: TrainerProgressStudent,
    weekIndex: number,
    status: "approved" | "rejected" | "pending",
    projectTitle?: string
  ) => {
    const title = projectTitle || "this project";
    const reason = (rejectDraft[`${student.id}:${weekIndex}`] || "").trim();
    if (status === "rejected" && reason.length < 5) {
      setProgressError("Add a short rejection note explaining what to improve.");
      return;
    }

    const confirmText =
      status === "approved"
        ? `Approve ${student.name}'s submission for "${title}"?\n\nThis marks the project as verified.`
        : status === "rejected"
          ? `Reject ${student.name}'s submission for "${title}"?\n\nThey will need to improve and resubmit.\n\nFeedback: ${reason}`
          : `Revert the review decision for ${student.name} on "${title}"?\n\nStatus will go back to awaiting review.`;
    if (!window.confirm(confirmText)) return;

    const key = `${student.id}:project:${weekIndex}:${status}`;
    setActionBusyKey(key);
    setProgressError("");
    setMessage("");
    try {
      await reviewTrainerProject(slug, {
        studentId: student.id,
        weekIndex,
        status,
        reason: status === "rejected" ? reason : "",
      });
      setMessage(
        status === "approved"
          ? "Project approved."
          : status === "rejected"
            ? "Project rejected. Student can resubmit."
            : "Review decision reverted. Awaiting review again."
      );
      await loadProgress();
    } catch (e: any) {
      setProgressError(e?.response?.data?.message || "Failed to review project");
    } finally {
      setActionBusyKey("");
    }
  };

  const handleCompleteInternship = async (
    student: TrainerProgressStudent,
    options?: { override?: boolean }
  ) => {
    const override = Boolean(options?.override);
    if (!override && !student.eligibleForCompletion) return;
    if (student.internshipCompleted) return;

    const progressLine =
      `Assignments passed: ${student.assignmentsDone}/${student.assignmentsTotal}\n` +
      `Projects approved: ${student.projectsDone}/${student.projectsTotal}`;

    const ok = window.confirm(
      override
        ? `Override and mark internship completed for ${student.name}?\n\n` +
            `${progressLine}\n\n` +
            `They have not met all pass/approve requirements. Continue anyway?`
        : `Mark internship completed for ${student.name}?\n\n${progressLine}`
    );
    if (!ok) return;
    setActionBusyKey(`complete:${student.id}`);
    setProgressError("");
    setMessage("");
    try {
      await completeTrainerInternship(slug, student.id, { override });
      setMessage(
        override
          ? `Internship completed for ${student.name} (override).`
          : `Internship completed for ${student.name}.`
      );
      await loadProgress();
    } catch (e: any) {
      setProgressError(e?.response?.data?.message || "Failed to complete internship");
    } finally {
      setActionBusyKey("");
    }
  };

  const handleBulkComplete = async () => {
    const eligible = progressStudents.filter(
      (s) => s.eligibleForCompletion && selectedCompleteIds.includes(s.id)
    );
    if (!eligible.length) {
      setProgressError("Select eligible students first.");
      return;
    }
    const ok = window.confirm(
      `Mark internship completed for ${eligible.length} student(s)?\n\n` +
        eligible.map((s) => `• ${s.name}`).join("\n")
    );
    if (!ok) return;
    setActionBusyKey("bulk-complete");
    setProgressError("");
    setMessage("");
    try {
      const result = await completeTrainerInternshipBulk(
        slug,
        eligible.map((s) => s.id)
      );
      setMessage(
        `${result.message}${
          result.skipped?.length ? ` · ${result.skipped.length} skipped` : ""
        }`
      );
      setSelectedCompleteIds([]);
      await loadProgress();
    } catch (e: any) {
      setProgressError(e?.response?.data?.message || "Bulk complete failed");
    } finally {
      setActionBusyKey("");
    }
  };

  useEffect(() => {
    if (section === "progress") {
      loadProgress();
    }
  }, [section, loadProgress]);

  const updateModule = (index: number, path: string, value: string) => {
    setConfig((prev) => {
      if (!prev) return prev;
      const modules = [...(prev.modules || [])];
      const mod = { ...modules[index] };
      if (path === "liveClass.meetingLink") mod.liveClass = { ...mod.liveClass, meetingLink: value };
      else if (path === "liveClass.title") mod.liveClass = { ...mod.liveClass, title: value };
      else if (path === "liveClass.scheduleDay")
        mod.liveClass = { ...mod.liveClass, scheduleDay: value };
      else if (path === "liveClass.scheduleTime")
        mod.liveClass = { ...mod.liveClass, scheduleTime: value };
      else if (path === "week") mod.week = value;
      else if (path === "topic") mod.topic = value;
      else if (path === "recording.url")
        mod.recording = { ...mod.recording, url: value, available: Boolean(value) };
      else if (path === "recording.title") mod.recording = { ...mod.recording, title: value };
      else if (path === "assignment.title") mod.assignment = { ...mod.assignment, title: value };
      else if (path === "assignment.instructions")
        mod.assignment = { ...mod.assignment, instructions: value };
      else if (path === "assignment.dueLabel")
        mod.assignment = { ...mod.assignment, dueLabel: value };
      else if (path === "assignment.documentUrl")
        mod.assignment = { ...mod.assignment, documentUrl: value };
      else if (path === "assignment.documentTitle")
        mod.assignment = { ...mod.assignment, documentTitle: value };
      modules[index] = mod;
      return { ...prev, modules };
    });
  };

  const applyProjectSpan = (anchorModIndex: number, spanWeeksRaw: number) => {
    setConfig((prev) => {
      if (!prev) return prev;
      const spanWeeks = Math.min(3, Math.max(1, Number(spanWeeksRaw) || 1));
      const modules = (prev.modules || []).map((m: any) => ({
        ...m,
        assignment: { ...(m.assignment || {}) },
      }));
      const anchor = modules[anchorModIndex];
      if (!anchor) return prev;
      const anchorWeekIndex = anchor.weekIndex ?? anchorModIndex;

      // Clear previous links to this project.
      modules.forEach((mod: any, i: number) => {
        if (mod.assignment?.projectAnchorWeekIndex === anchorWeekIndex) {
          modules[i] = {
            ...mod,
            assignment: {
              ...mod.assignment,
              projectAnchorWeekIndex: null,
              spanWeeks: 1,
            },
          };
        }
      });

      modules[anchorModIndex] = {
        ...modules[anchorModIndex],
        isCapstone: true,
        assignment: {
          ...(modules[anchorModIndex].assignment || {}),
          type: "project",
          githubRequired: true,
          spanWeeks,
          projectAnchorWeekIndex: null,
        },
      };

      for (let offset = 1; offset < spanWeeks; offset += 1) {
        const targetWeekIndex = anchorWeekIndex + offset;
        const targetIndex = modules.findIndex(
          (m: any, i: number) => (m.weekIndex ?? i) === targetWeekIndex
        );
        if (targetIndex < 0) break;
        const target = modules[targetIndex];
        modules[targetIndex] = {
          ...target,
          isCapstone: true,
          assignment: {
            ...(target.assignment || {}),
            type: "project",
            githubRequired: true,
            title:
              target.assignment?.title ||
              `${modules[anchorModIndex].assignment?.title || "Project"} (continued)`,
            dueLabel: target.assignment?.dueLabel || "",
            instructions:
              target.assignment?.instructions ||
              "This week is part of a multi-week project. Submit on the project's start week.",
            documentUrl: "",
            documentTitle: "",
            spanWeeks: 1,
            projectAnchorWeekIndex: anchorWeekIndex,
          },
        };
      }

      return { ...prev, modules };
    });
  };

  const updateLiveClass = (
    modIndex: number,
    classIndex: number,
    field:
      | "title"
      | "meetingLink"
      | "recordingUrl"
      | "noteTitle"
      | "noteUrl"
      | "scheduleDay"
      | "scheduleTime",
    value: string
  ) => {
    setConfig((prev) => {
      if (!prev) return prev;
      const modules = [...(prev.modules || [])];
      const mod = { ...modules[modIndex] };
      const liveClasses = [...ensureModuleLiveClasses(mod)];
      liveClasses[classIndex] = { ...liveClasses[classIndex], [field]: value };
      mod.liveClasses = liveClasses;
      mod.liveClass = {
        title: liveClasses[0]?.title || "",
        meetingLink: liveClasses[0]?.meetingLink || "",
        recordingUrl: liveClasses[0]?.recordingUrl || "",
        noteTitle: liveClasses[0]?.noteTitle || "",
        noteUrl: liveClasses[0]?.noteUrl || "",
        scheduleDay: liveClasses[0]?.scheduleDay || "",
        scheduleTime: liveClasses[0]?.scheduleTime || "",
        assignment: liveClasses[0]?.assignment || emptyClassAssignment(),
      };
      const firstRecording =
        liveClasses.find((row: any) => row.recordingUrl)?.recordingUrl || "";
      mod.recording = {
        ...(mod.recording || {}),
        url: firstRecording,
        available: Boolean(firstRecording),
      };
      mod.notes = liveClasses
        .filter((row: any) => row.noteTitle || row.noteUrl)
        .map((row: any) => ({
          title: row.noteTitle || "Class notes",
          url: row.noteUrl || "",
          type: "pdf",
          available: Boolean(row.noteUrl),
        }));
      modules[modIndex] = mod;
      return { ...prev, modules };
    });
  };

  const addLiveClass = (modIndex: number) => {
    setConfig((prev) => {
      if (!prev) return prev;
      const modules = [...(prev.modules || [])];
      const mod = { ...modules[modIndex] };
      const liveClasses = [...ensureModuleLiveClasses(mod)];
      liveClasses.push(createEmptyLiveClass(mod.week || `Week ${modIndex + 1}`, liveClasses.length));
      mod.liveClasses = liveClasses;
      modules[modIndex] = mod;
      return { ...prev, modules };
    });
  };

  const deleteLiveClass = (modIndex: number, classIndex: number) => {
    setConfig((prev) => {
      if (!prev) return prev;
      const modules = [...(prev.modules || [])];
      const mod = { ...modules[modIndex] };
      const liveClasses = ensureModuleLiveClasses(mod).filter((_: any, i: number) => i !== classIndex);
      if (!liveClasses.length) return prev;
      mod.liveClasses = liveClasses;
      mod.liveClass = {
        title: liveClasses[0].title,
        meetingLink: liveClasses[0].meetingLink || "",
        recordingUrl: liveClasses[0].recordingUrl || "",
        noteTitle: liveClasses[0].noteTitle || "",
        noteUrl: liveClasses[0].noteUrl || "",
        scheduleDay: liveClasses[0].scheduleDay || "",
        scheduleTime: liveClasses[0].scheduleTime || "",
        assignment: liveClasses[0].assignment || emptyClassAssignment(),
      };
      mod.notes = liveClasses
        .filter((row: any) => row.noteTitle || row.noteUrl)
        .map((row: any) => ({
          title: row.noteTitle || "Class notes",
          url: row.noteUrl || "",
          type: "pdf",
          available: Boolean(row.noteUrl),
        }));
      modules[modIndex] = mod;
      return { ...prev, modules };
    });
  };

  const addLiveScheduleSlot = () => {
    setConfig((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        liveSchedule: [...(prev.liveSchedule || []), { day: "", time: "" }],
      };
    });
  };

  const deleteLiveScheduleSlot = (index: number) => {
    setConfig((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        liveSchedule: (prev.liveSchedule || []).filter((_: any, i: number) => i !== index),
      };
    });
  };

  const updateBonus = (id: string, field: string, value: string | boolean) => {
    setConfig((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        bonuses: (prev.bonuses || []).map((bonus: any) =>
          bonus.id === id ? { ...bonus, [field]: value } : bonus
        ),
      };
    });
  };

  const updateAnnouncement = (index: number, field: string, value: string) => {
    setConfig((prev) => {
      if (!prev) return prev;
      const announcements = [...(prev.announcements || [])];
      announcements[index] = { ...announcements[index], [field]: value };
      return { ...prev, announcements };
    });
  };

  const addAnnouncement = () => {
    setConfig((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        announcements: [
          ...(prev.announcements || []),
          { id: `ann-${Date.now()}`, title: "", body: "", date: "", type: "info" },
        ],
      };
    });
  };

  const deleteAnnouncement = (index: number) => {
    setConfig((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        announcements: (prev.announcements || []).filter((_: any, i: number) => i !== index),
      };
    });
  };

  const addScheduleWeek = () => {
    setConfig((prev) => {
      if (!prev) return prev;
      const modules = [...(prev.modules || [])];
      modules.push(createEmptyModule(modules.length));
      return { ...prev, modules };
    });
  };

  const deleteScheduleWeek = (index: number) => {
    setConfig((prev) => {
      if (!prev) return prev;
      const modules = (prev.modules || []).filter((_: any, i: number) => i !== index);
      return {
        ...prev,
        modules: modules.map((mod: any, i: number) => ({ ...mod, weekIndex: i })),
      };
    });
  };

  const toggleReznioActive = (checked: boolean) => {
    setConfig((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        bonuses: (prev.bonuses || []).map((bonus: any) => {
          if (bonus.id !== "reznio") return bonus;
          return {
            ...bonus,
            active: checked,
            url: checked && !bonus.url ? "https://reznio.com" : bonus.url,
            loginInstructions:
              checked && !bonus.loginInstructions
                ? "Log in with the same email you used to enroll on EdLernity. If you are new to Reznio, create an account first, then sign in to access your internship benefits."
                : bonus.loginInstructions,
          };
        }),
      };
    });
  };

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const saved = await saveTrainerProgramConfig(slug, {
        syllabusNote: config.syllabusNote,
        liveSchedule: config.liveSchedule,
        announcements: config.announcements || [],
        bonuses: config.bonuses || [],
        modules: config.modules,
      });
      setConfig(saved);
      setMessage("Program content saved.");
    } catch {
      setError("Save failed. Try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !config) {
    return <p className="text-sm text-gray-500">{error || "Loading program editor..."}</p>;
  }

  const genaiBonus = (config.bonuses || []).find((b: any) => b.id === "genai-workshop");
  const reznioBonus = (config.bonuses || []).find((b: any) => b.id === "reznio");

  const filteredProgressStudents = progressStudents.filter((student) => {
    const q = progressSearch.trim().toLowerCase();
    if (q) {
      const hay = `${student.name} ${student.email} ${student.phone || ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    const assignDone = Number(student.assignmentsDone) || 0;
    const assignTotal = Number(student.assignmentsTotal) || 0;
    const projectDone = Number(student.projectsDone) || 0;
    const projectTotal = Number(student.projectsTotal) || 0;

    if (progressFilter === "assignments_pending") {
      return assignTotal > 0 && assignDone < assignTotal;
    }
    if (progressFilter === "assignments_done") {
      return assignTotal > 0 && assignDone >= assignTotal;
    }
    if (progressFilter === "projects_pending") {
      return projectTotal > 0 && projectDone < projectTotal;
    }
    if (progressFilter === "projects_done") {
      return projectTotal > 0 && projectDone >= projectTotal;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <Link href="/trainer" className="text-sm font-medium text-brand-500 hover:text-brand-600">
          ← Back to My Programs
        </Link>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{config.title}</h1>
            <p className="mt-1 text-sm text-gray-500">
              {students.length} enrolled student{students.length === 1 ? "" : "s"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
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

      <div className="flex flex-wrap gap-2">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSection(s.id)}
            className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
              section === s.id
                ? "border-brand-500 bg-brand-500 text-white"
                : "border-gray-200 bg-white text-gray-600 hover:border-brand-200 dark:border-gray-700 dark:bg-white/[0.03] dark:text-gray-300"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        {section === "schedule" && (
          <div className="space-y-6">
            <Field label="Syllabus Note">
              <textarea
                rows={3}
                value={config.syllabusNote || ""}
                onChange={(e) => setConfig({ ...config, syllabusNote: e.target.value })}
                className={inputClass}
              />
            </Field>

            <div>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Default weekly slots (overview)
                </p>
                <button
                  type="button"
                  onClick={addLiveScheduleSlot}
                  className="rounded-xl border border-brand-200 px-3 py-1.5 text-xs font-semibold text-brand-500 hover:bg-brand-50"
                >
                  + Add slot
                </button>
              </div>
              <div className="space-y-3">
                {(config.liveSchedule || []).map((slot: any, i: number) => (
                  <div
                    key={i}
                    className="grid gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.02] sm:grid-cols-[1fr_1fr_auto]"
                  >
                    <Field label="Day">
                      <DaySelect
                        value={slot.day || ""}
                        onChange={(day) => {
                          const liveSchedule = [...config.liveSchedule];
                          liveSchedule[i] = { ...liveSchedule[i], day };
                          setConfig({ ...config, liveSchedule });
                        }}
                      />
                    </Field>
                    <Field label="Time">
                      <TimeRangePicker
                        value={slot.time || ""}
                        onChange={(time) => {
                          const liveSchedule = [...config.liveSchedule];
                          liveSchedule[i] = { ...liveSchedule[i], time };
                          setConfig({ ...config, liveSchedule });
                        }}
                      />
                    </Field>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => deleteLiveScheduleSlot(i)}
                        className="rounded-lg px-3 py-2.5 text-xs font-semibold text-error-500 hover:bg-error-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Weekly Schedule</h3>
                <p className="mt-1 text-xs text-gray-500">
                  Add weeks, topics, and timing for students.
                </p>
              </div>
              <button
                type="button"
                onClick={addScheduleWeek}
                className="rounded-xl border border-brand-200 px-4 py-2 text-sm font-semibold text-brand-500 hover:bg-brand-50"
              >
                + Add Week
              </button>
            </div>

            {(config.modules || []).map((mod: any, i: number) => (
              <div
                key={`${mod.week}-${i}`}
                className="space-y-3 rounded-xl border border-gray-100 p-4 dark:border-gray-800"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-bold text-gray-800 dark:text-white">
                    {mod.week || `Week ${i + 1}`}
                  </p>
                  {(config.modules || []).length > 1 && (
                    <button
                      type="button"
                      onClick={() => deleteScheduleWeek(i)}
                      className="rounded-lg px-3 py-1.5 text-xs font-semibold text-error-500 hover:bg-error-50"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Week Label">
                    <input
                      value={mod.week || ""}
                      onChange={(e) => updateModule(i, "week", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Project Week">
                    <select
                      value={mod.isCapstone ? "yes" : "no"}
                      onChange={(e) => {
                        setConfig((prev) => {
                          if (!prev) return prev;
                          const modules = [...prev.modules];
                          modules[i] = { ...modules[i], isCapstone: e.target.value === "yes" };
                          return { ...prev, modules };
                        });
                      }}
                      className={inputClass}
                    >
                      <option value="no">Regular week</option>
                      <option value="yes">Project week</option>
                    </select>
                  </Field>
                </div>
                <Field label="Topic">
                  <textarea
                    rows={2}
                    value={mod.topic || ""}
                    onChange={(e) => updateModule(i, "topic", e.target.value)}
                    className={inputClass}
                  />
                </Field>
                <p className="text-xs text-gray-500">
                  {(ensureModuleLiveClasses(mod).length || 0)} live class
                  {ensureModuleLiveClasses(mod).length === 1 ? "" : "es"} configured — manage links in the{" "}
                  <button
                    type="button"
                    onClick={() => setSection("classes")}
                    className="font-semibold text-brand-500 hover:underline"
                  >
                    Live Classes
                  </button>{" "}
                  tab.
                </p>
              </div>
            ))}
          </div>
        )}

        {section === "classes" && (
          <div className="space-y-6">
            <p className="text-sm text-gray-500">
              Each week defaults to 3 live classes. Add meeting/recording links, notes (title +
              URL), and create or edit the class assignment from each class card.
            </p>
            {(config.modules || []).map((mod: any, modIndex: number) => {
              const liveClasses = ensureModuleLiveClasses(mod);
              const weekIndex = mod.weekIndex ?? modIndex;
              return (
                <div
                  key={modIndex}
                  className="space-y-4 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.02]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">
                        {mod.week} — {mod.topic || "Untitled"}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {liveClasses.length} class{liveClasses.length === 1 ? "" : "es"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => addLiveClass(modIndex)}
                      className="rounded-xl border border-brand-200 px-3 py-1.5 text-xs font-semibold text-brand-500 hover:bg-brand-50"
                    >
                      + Add class
                    </button>
                  </div>

                  {liveClasses.map((liveClass: any, classIndex: number) => {
                    const assignment = normalizeClassAssignment(liveClass.assignment);
                    const questionCount = (assignment.questions || []).length;
                    const hasAssignment =
                      Boolean(assignment.title?.trim()) || questionCount > 0;
                    return (
                      <div
                        key={liveClass.id || classIndex}
                        className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-bold text-gray-800 dark:text-white">
                            Class {classIndex + 1}
                          </p>
                          {liveClasses.length > 1 && (
                            <button
                              type="button"
                              onClick={() => deleteLiveClass(modIndex, classIndex)}
                              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-error-500 hover:bg-error-50"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <Field label="Session Title">
                          <input
                            value={liveClass.title || ""}
                            onChange={(e) =>
                              updateLiveClass(modIndex, classIndex, "title", e.target.value)
                            }
                            className={inputClass}
                          />
                        </Field>
                        <Field label="Meeting Link">
                          <input
                            value={liveClass.meetingLink || ""}
                            onChange={(e) =>
                              updateLiveClass(modIndex, classIndex, "meetingLink", e.target.value)
                            }
                            placeholder="https://meet.google.com/..."
                            className={inputClass}
                          />
                        </Field>
                        <Field label="Recording URL">
                          <input
                            value={liveClass.recordingUrl || ""}
                            onChange={(e) =>
                              updateLiveClass(modIndex, classIndex, "recordingUrl", e.target.value)
                            }
                            placeholder="https://youtube.com/... or Drive link"
                            className={inputClass}
                          />
                        </Field>
                        <p className="text-xs text-gray-500">
                          Students see Join Live Class when a meeting link is set. After you add a
                          recording URL, they see Watch Recording instead.
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <Field label="Notes Title">
                            <input
                              value={liveClass.noteTitle || ""}
                              onChange={(e) =>
                                updateLiveClass(modIndex, classIndex, "noteTitle", e.target.value)
                              }
                              placeholder="Class 1 notes / slide deck"
                              className={inputClass}
                            />
                          </Field>
                          <Field label="Notes Link">
                            <input
                              value={liveClass.noteUrl || ""}
                              onChange={(e) =>
                                updateLiveClass(modIndex, classIndex, "noteUrl", e.target.value)
                              }
                              placeholder="https://drive.google.com/..."
                              className={inputClass}
                            />
                          </Field>
                        </div>
                        {!mod.isCapstone && liveClass.id && (
                          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-white/[0.02]">
                            <div className="min-w-0">
                              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Assignment
                              </p>
                              <p className="mt-0.5 text-sm text-gray-700 dark:text-gray-300">
                                {hasAssignment
                                  ? `${assignment.title || "Untitled"} · ${questionCount} question${
                                      questionCount === 1 ? "" : "s"
                                    }`
                                  : "No assignment yet for this class"}
                              </p>
                            </div>
                            <Link
                              href={`/trainer/${slug}/assignments/${weekIndex}/${encodeURIComponent(
                                liveClass.id
                              )}`}
                              className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
                            >
                              {hasAssignment ? "Edit Assignment" : "Create Assignment"}
                            </Link>
                          </div>
                        )}
                        <div className="grid gap-3 sm:grid-cols-2">
                          <Field label="Day">
                            <DaySelect
                              value={liveClass.scheduleDay || ""}
                              onChange={(day) =>
                                updateLiveClass(modIndex, classIndex, "scheduleDay", day)
                              }
                            />
                          </Field>
                          <Field label="Time">
                            <TimeRangePicker
                              value={liveClass.scheduleTime || ""}
                              onChange={(time) =>
                                updateLiveClass(modIndex, classIndex, "scheduleTime", time)
                              }
                            />
                          </Field>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}

        {section === "projects" && (
          <div className="space-y-6">
            <p className="text-sm text-gray-500">
              Configure project briefs, attach a requirements document URL, and set how many weeks
              each project spans (1–3). Students submit one GitHub URL per project on their Projects
              tab.
            </p>
            {(() => {
              const primaryProjects = (config.modules || []).filter(
                (m: any) =>
                  m.isCapstone && m.assignment?.projectAnchorWeekIndex == null
              );
              if (primaryProjects.length === 0) {
                return (
                  <p className="text-sm text-gray-500">
                    No project weeks yet. Mark a week as Project week in Schedule.
                  </p>
                );
              }
              return primaryProjects.map((mod: any) => {
                const i = config.modules.indexOf(mod);
                const weekIndex = mod.weekIndex ?? i;
                const spanWeeks = Math.min(
                  3,
                  Math.max(1, Number(mod.assignment?.spanWeeks) || 1)
                );
                const endWeek = weekIndex + spanWeeks - 1;
                return (
                  <div
                    key={i}
                    className="space-y-3 rounded-xl border border-violet-100 bg-violet-50/40 p-4 dark:border-violet-500/20 dark:bg-violet-500/5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-gray-800 dark:text-white">
                          {mod.week} — {mod.topic || "Untitled"}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500">
                          {spanWeeks === 1
                            ? "1-week project"
                            : `Spans weeks ${weekIndex + 1}–${endWeek + 1} · one GitHub submission`}
                        </p>
                      </div>
                    </div>
                    <Field label="Milestone Title">
                      <input
                        value={mod.assignment?.title || ""}
                        onChange={(e) => updateModule(i, "assignment.title", e.target.value)}
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Due Label">
                      <input
                        value={mod.assignment?.dueLabel || ""}
                        onChange={(e) => updateModule(i, "assignment.dueLabel", e.target.value)}
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Instructions">
                      <textarea
                        rows={3}
                        value={mod.assignment?.instructions || ""}
                        onChange={(e) =>
                          updateModule(i, "assignment.instructions", e.target.value)
                        }
                        className={inputClass}
                      />
                    </Field>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Document title">
                        <input
                          value={mod.assignment?.documentTitle || ""}
                          onChange={(e) =>
                            updateModule(i, "assignment.documentTitle", e.target.value)
                          }
                          placeholder="Project brief / requirements PDF"
                          className={inputClass}
                        />
                      </Field>
                      <Field label="Document URL">
                        <input
                          value={mod.assignment?.documentUrl || ""}
                          onChange={(e) =>
                            updateModule(i, "assignment.documentUrl", e.target.value)
                          }
                          placeholder="https://drive.google.com/... or PDF link"
                          className={inputClass}
                        />
                      </Field>
                    </div>
                    <Field label="Project length">
                      <select
                        value={spanWeeks}
                        onChange={(e) => applyProjectSpan(i, Number(e.target.value))}
                        className={inputClass}
                      >
                        <option value={1}>1 week</option>
                        <option value={2}>2 weeks (merged)</option>
                        <option value={3}>3 weeks (merged)</option>
                      </select>
                    </Field>
                    <p className="text-xs text-gray-500">
                      Merged weeks share one brief and one GitHub submission. Linked weeks stay
                      marked as project weeks in the schedule.
                    </p>
                  </div>
                );
              });
            })()}
          </div>
        )}

        {section === "progress" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Student progress tracker
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Search students and review assignment quiz and project GitHub completions.
                </p>
              </div>
              <button
                type="button"
                onClick={loadProgress}
                disabled={progressLoading}
                className="rounded-xl border border-brand-200 px-4 py-2 text-sm font-semibold text-brand-500 hover:bg-brand-50 disabled:opacity-60"
              >
                {progressLoading ? "Refreshing…" : "Refresh"}
              </button>
            </div>

            {progressError && (
              <p className="rounded-lg bg-error-50 px-4 py-2 text-sm text-error-500">
                {progressError}
              </p>
            )}

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {[
                {
                  label: "Students",
                  value: progressSummary?.studentCount ?? "—",
                },
                {
                  label: "Assignments passed",
                  value: progressSummary?.studentsWithAllAssignments ?? "—",
                },
                {
                  label: "Projects approved",
                  value: progressSummary?.studentsWithAllProjects ?? "—",
                },
                {
                  label: "Ready to complete",
                  value: progressSummary?.eligibleForCompletionCount ?? "—",
                },
                {
                  label: "Internship completed",
                  value: progressSummary?.internshipCompletedCount ?? "—",
                },
              ].map((card) => (
                <div
                  key={card.label}
                  className="rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.02]"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {card.label}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                    {card.value}
                  </p>
                </div>
              ))}
            </div>

            {(progressSummary?.eligibleForCompletionCount || 0) > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand-100 bg-brand-50/50 px-4 py-3 dark:border-brand-500/20 dark:bg-brand-500/5">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {selectedCompleteIds.length} eligible student
                  {selectedCompleteIds.length === 1 ? "" : "s"} selected for bulk complete
                </p>
                <button
                  type="button"
                  disabled={!selectedCompleteIds.length || actionBusyKey === "bulk-complete"}
                  onClick={handleBulkComplete}
                  className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
                >
                  {actionBusyKey === "bulk-complete"
                    ? "Completing…"
                    : "Bulk: Completed internship"}
                </button>
              </div>
            )}

            <div className="space-y-3">
              <input
                value={progressSearch}
                onChange={(e) => setProgressSearch(e.target.value)}
                placeholder="Search by name, email, or phone…"
                className={inputClass}
              />
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { id: "all", label: "All students" },
                    { id: "assignments_pending", label: "Assignments incomplete" },
                    { id: "assignments_done", label: "All assignments complete" },
                    { id: "projects_pending", label: "Projects incomplete" },
                    { id: "projects_done", label: "All projects complete" },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setProgressFilter(opt.id)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                      progressFilter === opt.id
                        ? "bg-brand-500 text-white"
                        : "border border-gray-200 bg-white text-gray-600 hover:border-brand-200 hover:text-brand-600 dark:border-gray-700 dark:bg-transparent dark:text-gray-300"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                Showing {filteredProgressStudents.length} of {progressStudents.length} students
                {progressFilter !== "all" ? " · filter active" : ""}
              </p>
            </div>

            {progressLoading && !progressStudents.length ? (
              <p className="text-sm text-gray-500">Loading progress…</p>
            ) : filteredProgressStudents.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-white/[0.02]">
                No students match this search/filter.
                {progressFilter !== "all" && (
                  <button
                    type="button"
                    onClick={() => setProgressFilter("all")}
                    className="mt-3 block w-full text-sm font-semibold text-brand-500"
                  >
                    Clear filter
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-100 text-sm dark:divide-gray-800">
                    <thead className="bg-gray-50 dark:bg-white/[0.03]">
                      <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                        <th className="px-4 py-3">Student</th>
                        <th className="px-4 py-3">Assignments passed</th>
                        <th className="px-4 py-3">Projects approved</th>
                        <th className="px-4 py-3">Attendance</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white dark:divide-gray-800 dark:bg-transparent">
                      {filteredProgressStudents.map((student) => {
                        const expanded = expandedStudentId === student.id;
                        const assignDone =
                          student.assignmentsTotal > 0 &&
                          student.assignmentsDone === student.assignmentsTotal;
                        const projectDone =
                          student.projectsTotal > 0 &&
                          student.projectsDone === student.projectsTotal;
                        return (
                          <React.Fragment key={student.id}>
                            <tr className="align-top">
                              <td className="px-4 py-3">
                                <div className="flex items-start gap-2">
                                  {student.eligibleForCompletion && (
                                    <input
                                      type="checkbox"
                                      className="mt-1"
                                      checked={selectedCompleteIds.includes(student.id)}
                                      onChange={(e) => {
                                        setSelectedCompleteIds((prev) =>
                                          e.target.checked
                                            ? [...prev, student.id]
                                            : prev.filter((id) => id !== student.id)
                                        );
                                      }}
                                      aria-label={`Select ${student.name}`}
                                    />
                                  )}
                                  <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                      {student.name}
                                    </p>
                                    <p className="text-xs text-gray-500">{student.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <p className="font-semibold text-gray-800 dark:text-white">
                                  {student.assignmentsDone}/{student.assignmentsTotal}
                                </p>
                                <p className="text-[11px] text-gray-500">
                                  {student.assignmentsSubmitted ?? 0} submitted
                                </p>
                                <div className="mt-1 h-1.5 w-28 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                                  <div
                                    className="h-full rounded-full bg-brand-500"
                                    style={{
                                      width: `${student.assignmentCompletionPercent}%`,
                                    }}
                                  />
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <p className="font-semibold text-gray-800 dark:text-white">
                                  {student.projectsDone}/{student.projectsTotal}
                                </p>
                                <p className="text-[11px] text-gray-500">
                                  {student.projectsSubmitted ?? 0} submitted
                                </p>
                                <div className="mt-1 h-1.5 w-28 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                                  <div
                                    className="h-full rounded-full bg-violet-500"
                                    style={{
                                      width: `${student.projectCompletionPercent}%`,
                                    }}
                                  />
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <p className="font-semibold text-gray-800 dark:text-white">
                                  {student.attendanceDone ?? 0}/
                                  {student.attendanceTotal ?? 0}
                                </p>
                                <p className="text-[11px] text-gray-500">
                                  live class joins
                                </p>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex flex-wrap gap-1.5">
                                  {student.internshipCompleted ? (
                                    <span className="rounded-full bg-success-50 px-2 py-0.5 text-[11px] font-semibold text-success-600">
                                      {student.internshipCompletedOverride
                                        ? "Completed (override)"
                                        : "Internship completed"}
                                    </span>
                                  ) : (
                                    <>
                                      <span
                                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                          assignDone
                                            ? "bg-success-50 text-success-600"
                                            : "bg-amber-50 text-amber-700"
                                        }`}
                                      >
                                        {assignDone
                                          ? "Assignments passed"
                                          : "Assignments open"}
                                      </span>
                                      <span
                                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                          projectDone
                                            ? "bg-success-50 text-success-600"
                                            : "bg-violet-50 text-violet-700"
                                        }`}
                                      >
                                        {projectDone
                                          ? "Projects approved"
                                          : "Projects open"}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex flex-col items-end gap-2">
                                  {student.eligibleForCompletion && (
                                    <button
                                      type="button"
                                      disabled={actionBusyKey === `complete:${student.id}`}
                                      onClick={() => handleCompleteInternship(student)}
                                      className="rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
                                    >
                                      {actionBusyKey === `complete:${student.id}`
                                        ? "Saving…"
                                        : "Completed internship"}
                                    </button>
                                  )}
                                  {!student.internshipCompleted &&
                                    !student.eligibleForCompletion &&
                                    ((student.assignmentsTotal || 0) > 0 ||
                                      (student.projectsTotal || 0) > 0) && (
                                      <button
                                        type="button"
                                        disabled={actionBusyKey === `complete:${student.id}`}
                                        onClick={() =>
                                          handleCompleteInternship(student, {
                                            override: true,
                                          })
                                        }
                                        className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100 disabled:opacity-60 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200 dark:hover:bg-amber-500/20"
                                      >
                                        {actionBusyKey === `complete:${student.id}`
                                          ? "Saving…"
                                          : "Override complete"}
                                      </button>
                                    )}
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setExpandedStudentId(expanded ? "" : student.id)
                                    }
                                    className="rounded-lg px-3 py-1.5 text-xs font-semibold text-brand-500 hover:bg-brand-50"
                                  >
                                    {expanded ? "Hide" : "Details"}
                                  </button>
                                </div>
                              </td>
                            </tr>
                            {expanded && (
                              <tr>
                                <td
                                  colSpan={6}
                                  className="bg-gray-50 px-4 py-4 dark:bg-white/[0.02]"
                                >
                                  <div className="grid gap-4 lg:grid-cols-3">
                                    <div className="space-y-2">
                                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Assignments
                                      </p>
                                      {student.assignments.length === 0 ? (
                                        <p className="text-sm text-gray-500">
                                          No published class assignments yet.
                                        </p>
                                      ) : (
                                        student.assignments.map((item) => (
                                          <div
                                            key={item.key}
                                            className="rounded-lg border border-gray-200 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
                                          >
                                            <div className="flex items-start justify-between gap-2">
                                              <div>
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                  {item.title}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                  {item.weekLabel} · {item.classTitle}
                                                </p>
                                              </div>
                                              <div className="flex shrink-0 flex-col items-end gap-1">
                                                <span
                                                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                                    item.submitted
                                                      ? "bg-brand-50 text-brand-600"
                                                      : "bg-gray-100 text-gray-500"
                                                  }`}
                                                >
                                                  {item.submitted ? "Submitted" : "Pending"}
                                                </span>
                                                {item.submitted && (
                                                  <span
                                                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                                      item.passed
                                                        ? "bg-success-50 text-success-600"
                                                        : "bg-error-50 text-error-500"
                                                    }`}
                                                  >
                                                    {item.passed ? "Pass" : "Fail"}
                                                  </span>
                                                )}
                                              </div>
                                            </div>
                                            {item.submitted && (
                                              <p className="mt-1 text-xs text-gray-500">
                                                {item.submittedAt
                                                  ? new Date(
                                                      item.submittedAt
                                                    ).toLocaleString("en-IN")
                                                  : "Submitted"}
                                                {typeof item.mcqTotal === "number" &&
                                                  item.mcqTotal > 0 &&
                                                  ` · MCQ ${item.mcqScore}/${item.mcqTotal}`}
                                                {typeof item.passingScore === "number" &&
                                                  ` · Pass ≥ ${item.passingScore}`}
                                              </p>
                                            )}
                                          </div>
                                        ))
                                      )}
                                    </div>
                                    <div className="space-y-2">
                                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Projects
                                      </p>
                                      {student.projects.length === 0 ? (
                                        <p className="text-sm text-gray-500">
                                          No project weeks configured.
                                        </p>
                                      ) : (
                                        student.projects.map((item) => {
                                          const rejectKey = `${student.id}:${item.weekIndex}`;
                                          const reviewBusyApprove =
                                            actionBusyKey ===
                                            `${student.id}:project:${item.weekIndex}:approved`;
                                          const reviewBusyReject =
                                            actionBusyKey ===
                                            `${student.id}:project:${item.weekIndex}:rejected`;
                                          return (
                                            <div
                                              key={item.key}
                                              className="space-y-2 rounded-lg border border-gray-200 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
                                            >
                                              <div className="flex items-start justify-between gap-2">
                                                <div>
                                                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                    {item.title}
                                                  </p>
                                                  <p className="text-xs text-gray-500">
                                                    {item.weekLabel}
                                                    {item.topic ? ` · ${item.topic}` : ""}
                                                  </p>
                                                </div>
                                                <span
                                                  className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                                                    item.reviewStatus === "approved"
                                                      ? "bg-success-50 text-success-600"
                                                      : item.reviewStatus === "rejected"
                                                        ? "bg-error-50 text-error-500"
                                                        : item.submitted
                                                          ? "bg-amber-50 text-amber-700"
                                                          : "bg-gray-100 text-gray-500"
                                                  }`}
                                                >
                                                  {!item.submitted
                                                    ? "Pending"
                                                    : item.reviewStatus === "approved"
                                                      ? "Approved"
                                                      : item.reviewStatus === "rejected"
                                                        ? "Rejected"
                                                        : "Awaiting review"}
                                                </span>
                                              </div>
                                              {item.submitted && item.githubUrl && (
                                                <a
                                                  href={item.githubUrl}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="inline-block text-xs font-semibold text-brand-500 hover:underline"
                                                >
                                                  Open GitHub
                                                </a>
                                              )}
                                              {item.reviewStatus === "rejected" &&
                                                item.reviewReason && (
                                                  <p className="text-xs text-error-500">
                                                    Feedback: {item.reviewReason}
                                                  </p>
                                                )}
                                              {item.submitted &&
                                                !student.internshipCompleted && (
                                                  <div className="space-y-2 border-t border-gray-100 pt-2 dark:border-gray-800">
                                                    {item.reviewStatus !== "approved" && (
                                                      <textarea
                                                        rows={2}
                                                        value={rejectDraft[rejectKey] || ""}
                                                        onChange={(e) =>
                                                          setRejectDraft((prev) => ({
                                                            ...prev,
                                                            [rejectKey]: e.target.value,
                                                          }))
                                                        }
                                                        placeholder={
                                                          item.reviewStatus === "rejected"
                                                            ? "Update feedback if rejecting again, or approve…"
                                                            : "If rejecting, explain what to improve…"
                                                        }
                                                        className={inputClass}
                                                      />
                                                    )}
                                                    {item.reviewStatus === "approved" && (
                                                      <textarea
                                                        rows={2}
                                                        value={rejectDraft[rejectKey] || ""}
                                                        onChange={(e) =>
                                                          setRejectDraft((prev) => ({
                                                            ...prev,
                                                            [rejectKey]: e.target.value,
                                                          }))
                                                        }
                                                        placeholder="Required only if you change to Reject…"
                                                        className={inputClass}
                                                      />
                                                    )}
                                                    <div className="flex flex-wrap gap-2">
                                                      {item.reviewStatus !== "approved" && (
                                                        <button
                                                          type="button"
                                                          disabled={reviewBusyApprove}
                                                          onClick={() =>
                                                            handleReviewProject(
                                                              student,
                                                              item.weekIndex,
                                                              "approved",
                                                              item.title
                                                            )
                                                          }
                                                          className="rounded-lg bg-success-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-success-600 disabled:opacity-60"
                                                        >
                                                          {reviewBusyApprove
                                                            ? "Saving…"
                                                            : item.reviewStatus === "rejected"
                                                              ? "Change to Approve"
                                                              : "Approve"}
                                                        </button>
                                                      )}
                                                      {item.reviewStatus !== "rejected" && (
                                                        <button
                                                          type="button"
                                                          disabled={reviewBusyReject}
                                                          onClick={() =>
                                                            handleReviewProject(
                                                              student,
                                                              item.weekIndex,
                                                              "rejected",
                                                              item.title
                                                            )
                                                          }
                                                          className="rounded-lg bg-error-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-error-600 disabled:opacity-60"
                                                        >
                                                          {reviewBusyReject
                                                            ? "Saving…"
                                                            : item.reviewStatus === "approved"
                                                              ? "Change to Reject"
                                                              : "Reject"}
                                                        </button>
                                                      )}
                                                      {(item.reviewStatus === "approved" ||
                                                        item.reviewStatus === "rejected") && (
                                                        <button
                                                          type="button"
                                                          disabled={
                                                            actionBusyKey ===
                                                            `${student.id}:project:${item.weekIndex}:pending`
                                                          }
                                                          onClick={() =>
                                                            handleReviewProject(
                                                              student,
                                                              item.weekIndex,
                                                              "pending",
                                                              item.title
                                                            )
                                                          }
                                                          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-white/5"
                                                        >
                                                          {actionBusyKey ===
                                                          `${student.id}:project:${item.weekIndex}:pending`
                                                            ? "Saving…"
                                                            : "Revert decision"}
                                                        </button>
                                                      )}
                                                    </div>
                                                  </div>
                                                )}
                                            </div>
                                          );
                                        })
                                      )}
                                    </div>
                                    <div className="space-y-2 lg:col-span-1">
                                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Live class attendance
                                      </p>
                                      {(student.attendance || []).length === 0 ? (
                                        <p className="text-sm text-gray-500">
                                          No live classes with links yet.
                                        </p>
                                      ) : (
                                        (student.attendance || []).map((item) => (
                                          <div
                                            key={item.key}
                                            className="rounded-lg border border-gray-100 bg-white px-3 py-2 dark:border-gray-800 dark:bg-white/[0.02]"
                                          >
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                              {item.title}
                                            </p>
                                            <p className="text-[11px] text-gray-500">
                                              {item.weekLabel}
                                            </p>
                                            <p
                                              className={`mt-1 text-xs font-semibold ${
                                                item.attended
                                                  ? "text-success-600"
                                                  : "text-amber-700"
                                              }`}
                                            >
                                              {item.attended
                                                ? `Attended${
                                                    item.joinedAt
                                                      ? ` · ${new Date(
                                                          item.joinedAt
                                                        ).toLocaleString()}`
                                                      : ""
                                                  }${
                                                    item.joinCount && item.joinCount > 1
                                                      ? ` · ${item.joinCount} joins`
                                                      : ""
                                                  }`
                                                : "Not joined yet"}
                                            </p>
                                          </div>
                                        ))
                                      )}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {section === "bonuses" && (
          <div className="space-y-6">
            <div className="space-y-4 rounded-xl border border-violet-100 bg-violet-50/40 p-5 dark:border-violet-500/20 dark:bg-violet-500/5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">
                  Included Bonus
                </p>
                <h3 className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                  {genaiBonus?.title || "GenAI & Prompt Engineering Workshop"}
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {genaiBonus?.description ||
                    "Live workshop on LLM APIs, prompt patterns, and building AI features."}
                </p>
              </div>
              <Field label="Workshop Meeting Link">
                <input
                  value={genaiBonus?.meetingLink || ""}
                  onChange={(e) => updateBonus("genai-workshop", "meetingLink", e.target.value)}
                  placeholder="https://meet.google.com/..."
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="space-y-4 rounded-xl border border-brand-200 bg-brand-50/40 p-5 dark:border-brand-500/20 dark:bg-brand-500/5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-500">
                    Included Platform
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                    {reznioBonus?.title || "Reznio Job-Search Platform"}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {reznioBonus?.description ||
                      "Premium job-search tools, resume insights, and interview prep access."}
                  </p>
                </div>
                <label className="inline-flex cursor-pointer items-center gap-3 select-none">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {reznioBonus?.active ? "Activated" : "Activate"}
                  </span>
                  <input
                    type="checkbox"
                    checked={Boolean(reznioBonus?.active)}
                    onChange={(e) => toggleReznioActive(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                  />
                </label>
              </div>

              {reznioBonus?.active ? (
                <>
                  <Field label="Reznio Login Link">
                    <input
                      value={reznioBonus?.url || ""}
                      onChange={(e) => updateBonus("reznio", "url", e.target.value)}
                      placeholder="https://reznio.com"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Login Instructions for Students">
                    <textarea
                      rows={4}
                      value={reznioBonus?.loginInstructions || ""}
                      onChange={(e) => updateBonus("reznio", "loginInstructions", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                </>
              ) : (
                <p className="text-sm text-gray-500">
                  Turn on Activate when students should access Reznio.
                </p>
              )}
            </div>
          </div>
        )}

        {section === "announcements" && (
          <div className="space-y-4">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-gray-500">
                Students see announcements on their Overview tab.
              </p>
              <button
                type="button"
                onClick={addAnnouncement}
                className="rounded-xl border border-brand-200 px-4 py-2 text-sm font-semibold text-brand-500 hover:bg-brand-50"
              >
                + Add Announcement
              </button>
            </div>

            {(config.announcements || []).length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-white/[0.02]">
                No announcements yet.
              </div>
            ) : (
              (config.announcements || []).map((ann: any, i: number) => (
                <div
                  key={ann.id || i}
                  className="space-y-3 rounded-xl border border-gray-100 p-4 dark:border-gray-800"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-bold text-gray-800 dark:text-white">
                      Announcement {i + 1}
                    </p>
                    <button
                      type="button"
                      onClick={() => deleteAnnouncement(i)}
                      className="rounded-lg px-3 py-1.5 text-xs font-semibold text-error-500 hover:bg-error-50"
                    >
                      Delete
                    </button>
                  </div>
                  <Field label="Title">
                    <input
                      value={ann.title || ""}
                      onChange={(e) => updateAnnouncement(i, "title", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Body">
                    <textarea
                      rows={3}
                      value={ann.body || ""}
                      onChange={(e) => updateAnnouncement(i, "body", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Date Label">
                      <input
                        value={ann.date || ""}
                        onChange={(e) => updateAnnouncement(i, "date", e.target.value)}
                        placeholder="e.g. Mar 12, 2026"
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Type">
                      <select
                        value={ann.type || "info"}
                        onChange={(e) => updateAnnouncement(i, "type", e.target.value)}
                        className={inputClass}
                      >
                        <option value="info">Info</option>
                        <option value="update">Update</option>
                        <option value="reminder">Reminder</option>
                        <option value="bonus">Bonus</option>
                      </select>
                    </Field>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
