"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  fetchTrainerProgramConfig,
  generateTrainerClassQuestions,
  saveTrainerProgramConfig,
  TrainerProgramConfig,
} from "@/lib/crmApi";

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white";

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

function ensureModuleLiveClasses(mod: any) {
  if (Array.isArray(mod.liveClasses) && mod.liveClasses.length) {
    return mod.liveClasses.map((row: any, index: number) => ({
      id: row.id || `class-${index + 1}`,
      title: row.title || `${mod.week || "Week"} · Class ${index + 1}`,
      meetingLink: row.meetingLink || "",
      recordingUrl: row.recordingUrl || "",
      noteTitle: row.noteTitle || "",
      noteUrl: row.noteUrl || "",
      scheduleDay: row.scheduleDay || "",
      scheduleTime: row.scheduleTime || "",
      assignment: normalizeClassAssignment(row.assignment),
    }));
  }
  return [
    {
      id: "class-1",
      title: mod.liveClass?.title || `${mod.week || "Week"} · Class 1`,
      meetingLink: mod.liveClass?.meetingLink || "",
      recordingUrl: mod.liveClass?.recordingUrl || "",
      noteTitle: mod.liveClass?.noteTitle || "",
      noteUrl: mod.liveClass?.noteUrl || "",
      scheduleDay: mod.liveClass?.scheduleDay || "",
      scheduleTime: mod.liveClass?.scheduleTime || "",
      assignment: normalizeClassAssignment(mod.liveClass?.assignment),
    },
  ];
}

export default function CrmTrainerAssignmentEditorPage() {
  const params = useParams();
  const router = useRouter();
  const slug = String(params.slug || "");
  const weekIndex = Number(params.weekIndex);
  const classId = decodeURIComponent(String(params.classId || ""));

  const [config, setConfig] = useState<TrainerProgramConfig | null>(null);
  const [modIndex, setModIndex] = useState(-1);
  const [classIndex, setClassIndex] = useState(-1);
  const [assignment, setAssignment] = useState(emptyClassAssignment());
  const [classMeta, setClassMeta] = useState<{ title: string; week: string; topic: string }>({
    title: "",
    week: "",
    topic: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [aiDraft, setAiDraft] = useState({
    numMcq: 3,
    difficulty: "medium",
    focus: "",
    contextText: "",
  });
  const [contextPdf, setContextPdf] = useState<File | null>(null);

  useEffect(() => {
    if (!slug || !Number.isInteger(weekIndex) || weekIndex < 0 || !classId) {
      router.replace("/trainer");
      return;
    }
    fetchTrainerProgramConfig(slug)
      .then((cfg) => {
        const modules = cfg.modules || [];
        const mi = modules.findIndex((m: any, i: number) => (m.weekIndex ?? i) === weekIndex);
        if (mi < 0) {
          setError("Week not found.");
          return;
        }
        const mod = modules[mi];
        if (mod.isCapstone) {
          setError("Project weeks do not use class assignments.");
          return;
        }
        const classes = ensureModuleLiveClasses(mod);
        const ci = classes.findIndex((c: any) => c.id === classId);
        if (ci < 0) {
          setError("Class not found.");
          return;
        }
        setConfig(cfg);
        setModIndex(mi);
        setClassIndex(ci);
        setAssignment(normalizeClassAssignment(classes[ci].assignment));
        setClassMeta({
          title: classes[ci].title || `Class ${ci + 1}`,
          week: mod.week || `Week ${weekIndex + 1}`,
          topic: mod.topic || "",
        });
      })
      .catch(() => {
        setError("Cannot access this program.");
        router.replace("/trainer");
      })
      .finally(() => setLoading(false));
  }, [slug, weekIndex, classId, router]);

  const updateAssignment = (updater: (prev: any) => any) => {
    setAssignment((prev) => updater(normalizeClassAssignment(prev)));
  };

  const handleGenerate = async () => {
    if (!classId) return;
    setGenerating(true);
    setError("");
    setMessage("");
    try {
      const { questions, usedContext } = await generateTrainerClassQuestions(slug, classId, {
        weekIndex,
        numMcq: Number(aiDraft.numMcq) || 0,
        numText: 0,
        difficulty: aiDraft.difficulty || "medium",
        focus: aiDraft.focus || "",
        contextText: aiDraft.contextText || "",
        contextPdf,
      });
      updateAssignment((a) => ({
        ...a,
        title: a.title || `${classMeta.title} Assignment`,
        questions: [...(a.questions || []), ...(questions || [])],
      }));
      const bits = [
        usedContext?.hasPdf ? "PDF" : null,
        usedContext?.hasText ? "pasted notes" : null,
      ].filter(Boolean);
      setMessage(
        bits.length
          ? `Questions generated from ${bits.join(" + ")}. Review, then Save.`
          : "Questions generated. Review, then Save."
      );
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || "Failed to generate questions");
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!config || modIndex < 0 || classIndex < 0) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const modules = [...(config.modules || [])];
      const mod = { ...modules[modIndex] };
      const liveClasses = [...ensureModuleLiveClasses(mod)];
      liveClasses[classIndex] = {
        ...liveClasses[classIndex],
        assignment: normalizeClassAssignment(assignment),
      };
      mod.liveClasses = liveClasses;
      modules[modIndex] = mod;

      const saved = await saveTrainerProgramConfig(slug, {
        syllabusNote: config.syllabusNote,
        liveSchedule: config.liveSchedule,
        announcements: config.announcements,
        bonuses: config.bonuses,
        modules,
      });
      setConfig(saved);
      setMessage("Assignment saved.");
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to save assignment");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-gray-500">Loading assignment editor…</p>;
  }

  if (error && modIndex < 0) {
    return (
      <div className="space-y-3">
        <Link
          href={`/trainer/${slug}?section=classes`}
          className="text-sm font-medium text-brand-500"
        >
          ← Back to Live Classes
        </Link>
        <p className="rounded-lg bg-error-50 px-4 py-2 text-sm text-error-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/trainer/${slug}?section=classes`}
          className="text-sm font-medium text-brand-500 hover:text-brand-600"
        >
          ← Back to Live Classes
        </Link>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-500">
              {classMeta.week}
              {classMeta.topic ? ` · ${classMeta.topic}` : ""}
            </p>
            <h1 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              {classMeta.title}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Edit questions and AI generation for this class assignment.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Assignment"}
          </button>
        </div>
      </div>

      {message && (
        <p className="rounded-lg bg-success-50 px-4 py-2 text-sm text-success-600">{message}</p>
      )}
      {error && (
        <p className="rounded-lg bg-error-50 px-4 py-2 text-sm text-error-500">{error}</p>
      )}

      <div className="space-y-3 rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.02]">
        <Field label="Assignment Title">
          <input
            value={assignment.title}
            onChange={(e) => updateAssignment((a) => ({ ...a, title: e.target.value }))}
            className={inputClass}
          />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Due Label">
            <input
              value={assignment.dueLabel}
              onChange={(e) => updateAssignment((a) => ({ ...a, dueLabel: e.target.value }))}
              className={inputClass}
            />
          </Field>
          <Field label="Passing mark (min correct MCQs)">
            <input
              type="number"
              min={1}
              max={50}
              value={assignment.passingScore ?? 8}
              onChange={(e) =>
                updateAssignment((a) => ({
                  ...a,
                  passingScore: Math.min(50, Math.max(1, Number(e.target.value) || 8)),
                }))
              }
              className={inputClass}
            />
          </Field>
        </div>
        <p className="text-xs text-gray-500">
          Default is 8. Students need at least this many correct MCQs to pass (or all
          questions if the quiz has fewer than the passing mark).
        </p>
        <Field label="Instructions">
          <textarea
            rows={3}
            value={assignment.instructions}
            onChange={(e) =>
              updateAssignment((a) => ({ ...a, instructions: e.target.value }))
            }
            className={inputClass}
          />
        </Field>
      </div>

      <div className="space-y-3 rounded-xl border border-brand-100 bg-brand-50/40 p-4 dark:border-brand-500/20 dark:bg-brand-500/5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-500">
            Generate with Gemini
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Uses class topic plus optional pasted notes or PDF context.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="# MCQ">
            <input
              type="number"
              min={1}
              max={10}
              value={aiDraft.numMcq}
              onChange={(e) =>
                setAiDraft((d) => ({ ...d, numMcq: Number(e.target.value) }))
              }
              className={inputClass}
            />
          </Field>
          <Field label="Difficulty">
            <select
              value={aiDraft.difficulty}
              onChange={(e) => setAiDraft((d) => ({ ...d, difficulty: e.target.value }))}
              className={inputClass}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </Field>
          <div className="flex items-end">
            <button
              type="button"
              disabled={generating}
              onClick={handleGenerate}
              className="w-full rounded-xl bg-brand-500 px-3 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
            >
              {generating ? "Generating…" : "Generate"}
            </button>
          </div>
        </div>
        <Field label="Focus (optional)">
          <input
            value={aiDraft.focus}
            onChange={(e) => setAiDraft((d) => ({ ...d, focus: e.target.value }))}
            placeholder="e.g. React hooks, SQL joins"
            className={inputClass}
          />
        </Field>
        <Field label="Paste context / notes (optional)">
          <textarea
            rows={4}
            value={aiDraft.contextText}
            onChange={(e) => setAiDraft((d) => ({ ...d, contextText: e.target.value }))}
            placeholder="Paste lecture outline, key points, or transcript excerpts…"
            className={inputClass}
          />
        </Field>
        <Field label="Upload context PDF (optional)">
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={(e) => setContextPdf(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-500 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white"
            />
            {contextPdf && (
              <button
                type="button"
                onClick={() => setContextPdf(null)}
                className="text-xs font-semibold text-error-500"
              >
                Clear {contextPdf.name}
              </button>
            )}
          </div>
        </Field>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() =>
            updateAssignment((a) => ({
              ...a,
              questions: [
                ...(a.questions || []),
                {
                  id: `q-${Date.now()}-mcq`,
                  type: "mcq",
                  prompt: "",
                  options: ["", "", "", ""],
                  correctOptionIndex: 0,
                },
              ],
            }))
          }
          className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
        >
          + Add MCQ
        </button>
        <button
          type="button"
          onClick={() =>
            updateAssignment((a) => ({
              ...a,
              questions: [
                ...(a.questions || []),
                {
                  id: `q-${Date.now()}-text`,
                  type: "text",
                  prompt: "",
                  options: [],
                  correctOptionIndex: 0,
                },
              ],
            }))
          }
          className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
        >
          + Add text
        </button>
      </div>

      {(assignment.questions || []).length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500">
          No questions yet. Generate with AI or add manually.
        </div>
      ) : (
        <div className="space-y-3">
          {assignment.questions.map((q: any, qIndex: number) => (
            <div
              key={q.id || qIndex}
              className="space-y-2 rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.02]"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  {q.type === "text" ? "Text" : "MCQ"} · Q{qIndex + 1}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    updateAssignment((a) => ({
                      ...a,
                      questions: a.questions.filter((_: any, i: number) => i !== qIndex),
                    }))
                  }
                  className="text-xs font-semibold text-error-500"
                >
                  Remove
                </button>
              </div>
              <Field label="Prompt">
                <textarea
                  rows={2}
                  value={q.prompt || ""}
                  onChange={(e) =>
                    updateAssignment((a) => {
                      const questions = [...a.questions];
                      questions[qIndex] = { ...questions[qIndex], prompt: e.target.value };
                      return { ...a, questions };
                    })
                  }
                  className={inputClass}
                />
              </Field>
              {q.type === "mcq" && (
                <>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {(q.options || ["", "", "", ""]).slice(0, 4).map(
                      (opt: string, oIndex: number) => (
                        <Field key={oIndex} label={`Option ${oIndex + 1}`}>
                          <input
                            value={opt}
                            onChange={(e) =>
                              updateAssignment((a) => {
                                const questions = [...a.questions];
                                const options = [
                                  ...(questions[qIndex].options || ["", "", "", ""]),
                                ];
                                options[oIndex] = e.target.value;
                                questions[qIndex] = { ...questions[qIndex], options };
                                return { ...a, questions };
                              })
                            }
                            className={inputClass}
                          />
                        </Field>
                      )
                    )}
                  </div>
                  <Field label="Correct option">
                    <select
                      value={q.correctOptionIndex ?? 0}
                      onChange={(e) =>
                        updateAssignment((a) => {
                          const questions = [...a.questions];
                          questions[qIndex] = {
                            ...questions[qIndex],
                            correctOptionIndex: Number(e.target.value),
                          };
                          return { ...a, questions };
                        })
                      }
                      className={inputClass}
                    >
                      <option value={0}>Option 1</option>
                      <option value={1}>Option 2</option>
                      <option value={2}>Option 3</option>
                      <option value={3}>Option 4</option>
                    </select>
                  </Field>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
