import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import BaseLayout from "../../Layout/BaseLayout";
import SeoHead from "../SEO/SeoHead";
import { showSnackbar } from "../Utils/enQueSnackBar";
import { isUserLoggedIn } from "./internshipCartUtils";
import {
  fetchTrainerProgramConfig,
  fetchTrainerStudents,
  saveTrainerProgramConfig,
} from "./internshipApi";

const SECTIONS = [
  { id: "schedule", label: "Schedule" },
  { id: "classes", label: "Live Classes" },
  { id: "recordings", label: "Recordings" },
  { id: "notes", label: "Notes & Resources" },
  { id: "assignments", label: "Assignments" },
  { id: "capstone", label: "Capstone" },
  { id: "bonuses", label: "Bonuses" },
  { id: "announcements", label: "Announcements" },
];

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 block">{label}</span>
      {children}
    </label>
  );
}

function inputClass(extra = "") {
  return `w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm ${extra}`;
}

function TrainerProgramEditor() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [config, setConfig] = useState(null);
  const [students, setStudents] = useState([]);
  const [section, setSection] = useState("schedule");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isUserLoggedIn()) {
      navigate("/auth/login", { replace: true });
      return;
    }
    Promise.all([fetchTrainerProgramConfig(slug), fetchTrainerStudents(slug)])
      .then(([cfg, studs]) => {
        setConfig(cfg);
        setStudents(studs);
      })
      .catch(() => {
        showSnackbar("Cannot access this program.", "error", "top");
        navigate("/trainer/internships", { replace: true });
      })
      .finally(() => setLoading(false));
  }, [slug, navigate]);

  const updateModule = (index, path, value) => {
    setConfig((prev) => {
      const modules = [...(prev.modules || [])];
      const mod = { ...modules[index] };
      if (path === "liveClass.meetingLink") mod.liveClass = { ...mod.liveClass, meetingLink: value };
      else if (path === "liveClass.title") mod.liveClass = { ...mod.liveClass, title: value };
      else if (path === "liveClass.scheduleDay") mod.liveClass = { ...mod.liveClass, scheduleDay: value };
      else if (path === "liveClass.scheduleTime") mod.liveClass = { ...mod.liveClass, scheduleTime: value };
      else if (path === "week") mod.week = value;
      else if (path === "topic") mod.topic = value;
      else if (path === "recording.url") mod.recording = { ...mod.recording, url: value, available: Boolean(value) };
      else if (path === "recording.title") mod.recording = { ...mod.recording, title: value };
      else if (path === "assignment.title") mod.assignment = { ...mod.assignment, title: value };
      else if (path === "assignment.instructions") mod.assignment = { ...mod.assignment, instructions: value };
      else if (path === "assignment.dueLabel") mod.assignment = { ...mod.assignment, dueLabel: value };
      modules[index] = mod;
      return { ...prev, modules };
    });
  };

  const updateNote = (modIndex, noteIndex, field, value) => {
    setConfig((prev) => {
      const modules = [...prev.modules];
      const notes = [...(modules[modIndex].notes || [])];
      notes[noteIndex] = { ...notes[noteIndex], [field]: value, available: field === "url" ? Boolean(value) : notes[noteIndex].available };
      modules[modIndex] = { ...modules[modIndex], notes };
      return { ...prev, modules };
    });
  };

  const updateBonus = (id, field, value) => {
    setConfig((prev) => ({
      ...prev,
      bonuses: (prev.bonuses || []).map((bonus) =>
        bonus.id === id ? { ...bonus, [field]: value } : bonus
      ),
    }));
  };

  const updateAnnouncement = (index, field, value) => {
    setConfig((prev) => {
      const announcements = [...(prev.announcements || [])];
      announcements[index] = { ...announcements[index], [field]: value };
      return { ...prev, announcements };
    });
  };

  const addAnnouncement = () => {
    setConfig((prev) => ({
      ...prev,
      announcements: [
        ...(prev.announcements || []),
        {
          id: `ann-${Date.now()}`,
          title: "",
          body: "",
          date: "",
          type: "info",
        },
      ],
    }));
  };

  const deleteAnnouncement = (index) => {
    setConfig((prev) => ({
      ...prev,
      announcements: (prev.announcements || []).filter((_, i) => i !== index),
    }));
  };

  const createEmptyModule = (index) => ({
    weekIndex: index,
    week: `Week ${index + 1}`,
    topic: "",
    isCapstone: index >= 8,
    published: true,
    liveClass: {
      title: `Week ${index + 1} Live Session`,
      meetingLink: "",
      scheduleDay: index % 2 === 0 ? "Tuesday" : "Friday",
      scheduleTime: "7:00 PM - 9:00 PM IST",
    },
    recording: {
      title: `Week ${index + 1} Recording`,
      url: "",
      duration: "1h 45m",
    },
    notes: [
      { title: `Week ${index + 1} Session Notes (PDF)`, url: "", type: "pdf" },
      { title: `Week ${index + 1} Slide Deck`, url: "", type: "slides" },
    ],
    assignment: {
      title: index >= 8 ? `Capstone Milestone - Week ${index + 1}` : `Week ${index + 1} Practice Assignment`,
      dueLabel: "Submit before next live class",
      instructions: "",
      type: index >= 8 ? "project" : "assignment",
    },
    resources: [],
  });

  const addScheduleWeek = () => {
    setConfig((prev) => {
      const modules = [...(prev.modules || [])];
      modules.push(createEmptyModule(modules.length));
      return { ...prev, modules };
    });
  };

  const deleteScheduleWeek = (index) => {
    setConfig((prev) => {
      const modules = (prev.modules || []).filter((_, i) => i !== index);
      return {
        ...prev,
        modules: modules.map((mod, i) => ({ ...mod, weekIndex: i })),
      };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const saved = await saveTrainerProgramConfig(slug, {
        syllabusNote: config.syllabusNote,
        liveSchedule: config.liveSchedule,
        announcements: config.announcements || [],
        bonuses: config.bonuses || [],
        modules: config.modules,
      });
      setConfig(saved);
      showSnackbar("Program content saved", "success", "top");
    } catch {
      showSnackbar("Save failed", "error", "top");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !config) {
    return (
      <BaseLayout>
        <div className="min-h-[50vh] flex items-center justify-center text-slate-500 font-semibold">
          Loading program editor...
        </div>
      </BaseLayout>
    );
  }

  const regularModules = (config.modules || []).filter((m) => !m.isCapstone);
  const capstoneModules = (config.modules || []).filter((m) => m.isCapstone);
  const genaiBonus = (config.bonuses || []).find((b) => b.id === "genai-workshop");
  const reznioBonus = (config.bonuses || []).find((b) => b.id === "reznio");

  const toggleReznioActive = (checked) => {
    setConfig((prev) => ({
      ...prev,
      bonuses: (prev.bonuses || []).map((bonus) => {
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
    }));
  };

  return (
    <BaseLayout>
      <SeoHead title={`Manage ${config.title}`} path={`/trainer/internships/${slug}`} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
        <Link to="/trainer/internships" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#181FC5] mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Trainer Dashboard
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">{config.title}</h1>
            <p className="text-slate-600 text-sm mt-1">{students.length} enrolled students</p>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#181FC5] text-white font-bold hover:bg-[#1418a0] disabled:opacity-60"
          >
            <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSection(s.id)}
              className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                section === s.id
                  ? "bg-[#181FC5] text-white border-[#181FC5]"
                  : "bg-white text-slate-600 border-slate-200 hover:border-[#181FC5]/30"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          {section === "schedule" && (
            <div className="space-y-6">
              <Field label="Syllabus Note">
                <textarea
                  rows={3}
                  value={config.syllabusNote || ""}
                  onChange={(e) => setConfig({ ...config, syllabusNote: e.target.value })}
                  className={inputClass()}
                />
              </Field>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Default Live Days (shown at top of student schedule)
                </p>
                <div className="space-y-3">
                  {(config.liveSchedule || []).map((slot, i) => (
                    <div key={i} className="grid sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <Field label="Day">
                        <input
                          value={slot.day || ""}
                          onChange={(e) => {
                            const liveSchedule = [...config.liveSchedule];
                            liveSchedule[i] = { ...liveSchedule[i], day: e.target.value };
                            setConfig({ ...config, liveSchedule });
                          }}
                          className={inputClass()}
                        />
                      </Field>
                      <Field label="Time">
                        <input
                          value={slot.time || ""}
                          onChange={(e) => {
                            const liveSchedule = [...config.liveSchedule];
                            liveSchedule[i] = { ...liveSchedule[i], time: e.target.value };
                            setConfig({ ...config, liveSchedule });
                          }}
                          className={inputClass()}
                        />
                      </Field>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Weekly Schedule</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Add weeks, topics, and timing. Students see the same list on their Schedule tab.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addScheduleWeek}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#181FC5]/20 text-[#181FC5] text-sm font-bold hover:bg-[#181FC5]/5"
                >
                  <Plus className="w-4 h-4" /> Add Week
                </button>
              </div>

              {(config.modules || []).map((mod, i) => (
                <div key={`${mod.week}-${i}`} className="p-4 rounded-2xl border border-slate-100 bg-white space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-extrabold text-slate-800">{mod.week || `Week ${i + 1}`}</p>
                    {(config.modules || []).length > 1 && (
                      <button
                        type="button"
                        onClick={() => deleteScheduleWeek(i)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-rose-600 text-xs font-bold hover:bg-rose-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    )}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Field label="Week Label">
                      <input
                        value={mod.week || ""}
                        onChange={(e) => updateModule(i, "week", e.target.value)}
                        placeholder="Week 1"
                        className={inputClass()}
                      />
                    </Field>
                    <Field label="Capstone Week">
                      <select
                        value={mod.isCapstone ? "yes" : "no"}
                        onChange={(e) => {
                          setConfig((prev) => {
                            const modules = [...prev.modules];
                            modules[i] = { ...modules[i], isCapstone: e.target.value === "yes" };
                            return { ...prev, modules };
                          });
                        }}
                        className={inputClass()}
                      >
                        <option value="no">Regular week</option>
                        <option value="yes">Capstone week</option>
                      </select>
                    </Field>
                  </div>
                  <Field label="Topic">
                    <textarea
                      rows={2}
                      value={mod.topic || ""}
                      onChange={(e) => updateModule(i, "topic", e.target.value)}
                      placeholder="What students will cover this week"
                      className={inputClass()}
                    />
                  </Field>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Field label="Day">
                      <input
                        value={mod.liveClass?.scheduleDay || ""}
                        onChange={(e) => updateModule(i, "liveClass.scheduleDay", e.target.value)}
                        placeholder="Tuesday"
                        className={inputClass()}
                      />
                    </Field>
                    <Field label="Time">
                      <input
                        value={mod.liveClass?.scheduleTime || ""}
                        onChange={(e) => updateModule(i, "liveClass.scheduleTime", e.target.value)}
                        placeholder="7:00 PM - 9:00 PM IST"
                        className={inputClass()}
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          )}

          {section === "classes" && (
            <div className="space-y-6">
              <p className="text-sm text-slate-600">
                Paste Google Meet / Zoom links. Students can join as soon as a link is saved.
              </p>
              {(config.modules || []).map((mod, i) => (
                <div key={i} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 space-y-3">
                  <p className="font-extrabold text-slate-900">{mod.week} — {mod.topic || "Untitled"}</p>
                  <Field label="Session Title">
                    <input value={mod.liveClass?.title || ""} onChange={(e) => updateModule(i, "liveClass.title", e.target.value)} className={inputClass()} />
                  </Field>
                  <Field label="Meeting Link">
                    <input value={mod.liveClass?.meetingLink || ""} onChange={(e) => updateModule(i, "liveClass.meetingLink", e.target.value)} placeholder="https://meet.google.com/..." className={inputClass()} />
                  </Field>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Field label="Day">
                      <input value={mod.liveClass?.scheduleDay || ""} onChange={(e) => updateModule(i, "liveClass.scheduleDay", e.target.value)} className={inputClass()} />
                    </Field>
                    <Field label="Time">
                      <input value={mod.liveClass?.scheduleTime || ""} onChange={(e) => updateModule(i, "liveClass.scheduleTime", e.target.value)} className={inputClass()} />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          )}

          {section === "recordings" && (
            <div className="space-y-6">
              {(config.modules || []).map((mod, i) => (
                <div key={i} className="p-4 rounded-2xl border border-slate-100 space-y-3">
                  <p className="font-bold text-slate-800">{mod.week}</p>
                  <Field label="Recording Title">
                    <input value={mod.recording?.title || ""} onChange={(e) => updateModule(i, "recording.title", e.target.value)} className={inputClass()} />
                  </Field>
                  <Field label="Recording URL (YouTube / Drive)">
                    <input value={mod.recording?.url || ""} onChange={(e) => updateModule(i, "recording.url", e.target.value)} className={inputClass()} />
                  </Field>
                </div>
              ))}
            </div>
          )}

          {section === "notes" && (
            <div className="space-y-6">
              {(config.modules || []).map((mod, mi) => (
                <div key={mi} className="p-4 rounded-2xl border border-slate-100 space-y-3">
                  <p className="font-bold text-slate-800">{mod.week}</p>
                  {(mod.notes || []).map((note, ni) => (
                    <div key={ni} className="grid sm:grid-cols-2 gap-3">
                      <Field label="Title">
                        <input value={note.title || ""} onChange={(e) => updateNote(mi, ni, "title", e.target.value)} className={inputClass()} />
                      </Field>
                      <Field label="File URL">
                        <input value={note.url || ""} onChange={(e) => updateNote(mi, ni, "url", e.target.value)} className={inputClass()} />
                      </Field>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {section === "assignments" && (
            <div className="space-y-6">
              {regularModules.map((mod) => {
                const i = config.modules.indexOf(mod);
                return (
                  <div key={i} className="p-4 rounded-2xl border border-slate-100 space-y-3">
                    <p className="font-bold text-slate-800">{mod.week}</p>
                    <Field label="Assignment Title">
                      <input value={mod.assignment?.title || ""} onChange={(e) => updateModule(i, "assignment.title", e.target.value)} className={inputClass()} />
                    </Field>
                    <Field label="Due Label">
                      <input value={mod.assignment?.dueLabel || ""} onChange={(e) => updateModule(i, "assignment.dueLabel", e.target.value)} className={inputClass()} />
                    </Field>
                    <Field label="Instructions">
                      <textarea rows={3} value={mod.assignment?.instructions || ""} onChange={(e) => updateModule(i, "assignment.instructions", e.target.value)} className={inputClass()} />
                    </Field>
                  </div>
                );
              })}
            </div>
          )}

          {section === "capstone" && (
            <div className="space-y-6">
              {capstoneModules.map((mod) => {
                const i = config.modules.indexOf(mod);
                return (
                  <div key={i} className="p-4 rounded-2xl border border-violet-100 bg-violet-50/50 space-y-3">
                    <p className="font-bold text-slate-800">{mod.week} — {mod.topic}</p>
                    <Field label="Milestone Title">
                      <input value={mod.assignment?.title || ""} onChange={(e) => updateModule(i, "assignment.title", e.target.value)} className={inputClass()} />
                    </Field>
                    <Field label="Instructions">
                      <textarea rows={3} value={mod.assignment?.instructions || ""} onChange={(e) => updateModule(i, "assignment.instructions", e.target.value)} className={inputClass()} />
                    </Field>
                    <Field label="Live Review Call Link">
                      <input value={mod.liveClass?.meetingLink || ""} onChange={(e) => updateModule(i, "liveClass.meetingLink", e.target.value)} className={inputClass()} />
                    </Field>
                  </div>
                );
              })}
            </div>
          )}

          {section === "bonuses" && (
            <div className="space-y-6">
              <p className="text-sm text-slate-600">
                Configure included bonuses for your students. GenAI uses a meeting link; Reznio is activated when you are ready.
              </p>
              <div className="p-5 rounded-2xl border border-violet-100 bg-violet-50/40 space-y-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-violet-600">Included Bonus</p>
                  <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                    {genaiBonus?.title || "GenAI & Prompt Engineering Workshop"}
                  </h3>
                  <p className="text-sm text-slate-600 mt-2">
                    {genaiBonus?.description || "Live workshop on LLM APIs, prompt patterns, and building AI features."}
                  </p>
                </div>
                <Field label="Workshop Meeting Link">
                  <input
                    value={genaiBonus?.meetingLink || ""}
                    onChange={(e) => updateBonus("genai-workshop", "meetingLink", e.target.value)}
                    placeholder="https://meet.google.com/..."
                    className={inputClass()}
                  />
                </Field>
              </div>

              <div className="p-5 rounded-2xl border border-[#181FC5]/20 bg-[#181FC5]/5 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#181FC5]">Included Platform</p>
                    <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                      {reznioBonus?.title || "Reznio Job-Search Platform"}
                    </h3>
                    <p className="text-sm text-slate-600 mt-2">
                      {reznioBonus?.description || "Premium job-search tools, resume insights, and interview prep access."}
                    </p>
                  </div>
                  <label className="inline-flex items-center gap-3 cursor-pointer select-none">
                    <span className="text-sm font-bold text-slate-700">
                      {reznioBonus?.active ? "Activated" : "Activate"}
                    </span>
                    <span className="relative inline-flex h-7 w-12 shrink-0">
                      <input
                        type="checkbox"
                        checked={Boolean(reznioBonus?.active)}
                        onChange={(e) => toggleReznioActive(e.target.checked)}
                        className="peer sr-only"
                      />
                      <span className="absolute inset-0 rounded-full bg-slate-300 transition peer-checked:bg-[#181FC5]" />
                      <span className="absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
                    </span>
                  </label>
                </div>

                {reznioBonus?.active ? (
                  <>
                    <Field label="Reznio Login Link">
                      <input
                        value={reznioBonus?.url || ""}
                        onChange={(e) => updateBonus("reznio", "url", e.target.value)}
                        placeholder="https://reznio.com"
                        className={inputClass()}
                      />
                    </Field>
                    <Field label="Login Instructions for Students">
                      <textarea
                        rows={4}
                        value={reznioBonus?.loginInstructions || ""}
                        onChange={(e) => updateBonus("reznio", "loginInstructions", e.target.value)}
                        placeholder="Tell students how to log in..."
                        className={inputClass()}
                      />
                    </Field>
                    <p className="text-xs text-slate-500">
                      Students will see this link and instructions on their Bonuses tab once activated.
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-slate-500">
                    Turn on the toggle when students should access Reznio. Until then, they will see a pending message.
                  </p>
                )}
              </div>
            </div>
          )}

          {section === "announcements" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <p className="text-sm text-slate-600">
                  Add as many announcements as you need. Students see them on the Overview tab.
                </p>
                <button
                  type="button"
                  onClick={addAnnouncement}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#181FC5]/20 text-[#181FC5] text-sm font-bold hover:bg-[#181FC5]/5"
                >
                  <Plus className="w-4 h-4" /> Add Announcement
                </button>
              </div>

              {(config.announcements || []).length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500 text-sm">
                  No announcements yet. Click &quot;Add Announcement&quot; to create one.
                </div>
              ) : (
                (config.announcements || []).map((ann, i) => (
                  <div key={ann.id || i} className="p-4 rounded-2xl border border-slate-100 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-extrabold text-slate-800">Announcement {i + 1}</p>
                      <button
                        type="button"
                        onClick={() => deleteAnnouncement(i)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-rose-600 text-xs font-bold hover:bg-rose-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                    <Field label="Title">
                      <input
                        value={ann.title || ""}
                        onChange={(e) => updateAnnouncement(i, "title", e.target.value)}
                        className={inputClass()}
                      />
                    </Field>
                    <Field label="Body">
                      <textarea
                        rows={3}
                        value={ann.body || ""}
                        onChange={(e) => updateAnnouncement(i, "body", e.target.value)}
                        className={inputClass()}
                      />
                    </Field>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <Field label="Date Label">
                        <input
                          value={ann.date || ""}
                          onChange={(e) => updateAnnouncement(i, "date", e.target.value)}
                          placeholder="e.g. Mar 12, 2026"
                          className={inputClass()}
                        />
                      </Field>
                      <Field label="Type">
                        <select
                          value={ann.type || "info"}
                          onChange={(e) => updateAnnouncement(i, "type", e.target.value)}
                          className={inputClass()}
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
    </BaseLayout>
  );
}

export default TrainerProgramEditor;
