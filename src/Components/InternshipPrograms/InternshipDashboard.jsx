import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import {
  Award,
  Calendar,
  CheckCircle2,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Lock,
  MessageCircle,
  PlayCircle,
  Sparkles,
  Video,
  ArrowLeft,
  ExternalLink,
  Clock,
  Download,
} from "lucide-react";
import BaseLayout from "../../Layout/BaseLayout";
import SeoHead from "../SEO/SeoHead";
import { getTrackBySlug } from "./internshipTracksData";
import { buildInternshipDashboard, mergeBonuses } from "./internshipDashboardData";
import {
  fetchStudentDashboard,
  fetchStudentCertificatePdfBlob,
  markLiveClassAttendance,
  submitProjectGithub,
} from "./internshipApi";
import {
  fetchMyInternshipsFromBackend,
  isUserLoggedIn,
} from "./internshipCartUtils";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "schedule", label: "Schedule", icon: Calendar },
  { id: "classes", label: "Live Classes", icon: Video },
  { id: "assignments", label: "Assignments", icon: ClipboardList },
  { id: "projects", label: "Projects", icon: Sparkles },
  { id: "announcements", label: "Announcements", icon: MessageCircle },
  { id: "bonuses", label: "Bonuses", icon: Award },
  { id: "completion", label: "Internship Completion", icon: CheckCircle2 },
  { id: "certificate", label: "Certificate", icon: FileText },
];

const NAV_IDS = new Set(NAV_ITEMS.map((item) => item.id));

function InternshipDashboard() {
  const { slug, section } = useParams();
  const navigate = useNavigate();
  const track = getTrackBySlug(slug);
  const activeSection = NAV_IDS.has(section) ? section : null;
  const [enrollment, setEnrollment] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [githubDrafts, setGithubDrafts] = useState({});
  const [submittingKey, setSubmittingKey] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [certificatePdfUrl, setCertificatePdfUrl] = useState("");
  const [certificatePdfLoading, setCertificatePdfLoading] = useState(false);
  const [certificatePdfError, setCertificatePdfError] = useState("");

  useEffect(() => {
    if (!isUserLoggedIn()) {
      navigate("/auth/login", {
        replace: true,
        state: {
          redirectUrl: `/my-internships/${slug}/${section && NAV_IDS.has(section) ? section : "overview"}`,
        },
      });
      return;
    }

    let active = true;
    const load = async () => {
      let match = null;
      try {
        const list = await fetchMyInternshipsFromBackend();
        if (!active) return;
        match = list.find((item) => item.slug === slug);
        if (!match) {
          setAuthorized(false);
          return;
        }
        setEnrollment(match);
        setAuthorized(true);
        const apiDashboard = await fetchStudentDashboard(slug);
        if (active) {
          setDashboard({
            ...apiDashboard,
            bonuses: mergeBonuses(apiDashboard?.bonuses),
          });
        }
      } catch {
        if (!active) return;
        if (track && match) {
          setDashboard(buildInternshipDashboard(track, match));
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    load();

    return () => {
      active = false;
    };
  }, [navigate, slug, section, track]);

  useEffect(() => {
    let objectUrl = "";
    let cancelled = false;

    const loadPdf = async () => {
      if (activeSection !== "certificate" || !dashboard?.certificate?.issued) {
        setCertificatePdfUrl("");
        setCertificatePdfError("");
        return;
      }
      setCertificatePdfLoading(true);
      setCertificatePdfError("");
      try {
        const blob = await fetchStudentCertificatePdfBlob(slug);
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setCertificatePdfUrl(objectUrl);
      } catch {
        if (!cancelled) {
          setCertificatePdfUrl("");
          setCertificatePdfError(
            "Could not load the certificate PDF. Please try again or contact support."
          );
        }
      } finally {
        if (!cancelled) setCertificatePdfLoading(false);
      }
    };

    loadPdf();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [activeSection, dashboard?.certificate?.issued, dashboard?.certificate?.id, slug]);

  if (!track) {
    return <Navigate to="/internship-programs" replace />;
  }

  if (!section) {
    return <Navigate to={`/my-internships/${slug}/overview`} replace />;
  }

  if (!activeSection) {
    return <Navigate to={`/my-internships/${slug}/overview`} replace />;
  }

  if (loading) {
    return (
      <BaseLayout>
        <div className="min-h-[60vh] flex items-center justify-center text-slate-500 font-semibold">
          Loading your program dashboard...
        </div>
      </BaseLayout>
    );
  }

  if (!authorized) {
    return (
      <BaseLayout>
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <Lock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h1 className="text-2xl font-extrabold text-slate-900 mb-3">Enrollment Required</h1>
          <p className="text-slate-600 mb-6">
            You need to enroll in this internship program to access the learning dashboard.
          </p>
          <Link
            to={`/internship-programs/${slug}`}
            className="inline-flex px-6 py-3 rounded-full bg-[#181FC5] text-white font-bold hover:bg-[#1418a0]"
          >
            View Program Details
          </Link>
        </div>
      </BaseLayout>
    );
  }

  if (!dashboard) {
    return (
      <BaseLayout>
        <div className="min-h-[60vh] flex items-center justify-center text-slate-500 font-semibold">
          Loading program content...
        </div>
      </BaseLayout>
    );
  }

  const announcements = dashboard.announcements || [];
  const highlights = dashboard.program?.highlights || [];
  const liveSchedule = dashboard.liveSchedule || [];
  const programTools = dashboard.program?.tools || [];
  const bonuses = mergeBonuses(dashboard.bonuses);
  const liveDaysLabel = liveSchedule.length
    ? liveSchedule.map((slot) => slot.day).filter(Boolean).join(" & ")
    : "—";
  const liveTimeLabel = liveSchedule[0]?.time || "—";

  const renderReznioAccess = (reznioBonus, compact = false) => {
    if (!reznioBonus?.active) {
      return (
        <p className={`text-sm ${compact ? "text-blue-100" : "text-blue-100"} mt-2`}>
          Your trainer will activate your Reznio access soon.
        </p>
      );
    }

    return (
      <div className={compact ? "mt-2 space-y-2" : "mt-4 space-y-3"}>
        <p className={`text-sm leading-relaxed ${compact ? "text-blue-100" : "text-blue-100"}`}>
          {reznioBonus.loginInstructions}
        </p>
        {reznioBonus.url && (
          <a
            href={reznioBonus.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 rounded-xl bg-white font-bold hover:bg-blue-50 ${
              compact ? "px-3 py-2 text-xs text-[#181FC5]" : "px-4 py-2.5 text-sm text-[#181FC5]"
            }`}
          >
            Login to Reznio
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
        )}
      </div>
    );
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-[#181FC5] mb-1">Your Program</p>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">{dashboard.program.title}</h2>
        <p className="text-slate-600 text-sm leading-relaxed mb-4">{dashboard.program.syllabusNote}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Duration", value: dashboard.program.duration },
            { label: "Live Days", value: liveDaysLabel },
            { label: "Class Time", value: liveTimeLabel },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{item.label}</p>
              <p className="text-base font-extrabold text-slate-900 mt-1">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {announcements.length > 0 && (
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-extrabold text-slate-900 mb-4">Announcements</h3>
          <div className="space-y-4">
            {announcements.slice(0, 3).map((item) => (
              <div key={item.id || item.title} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <MessageCircle className="w-5 h-5 text-[#181FC5] shrink-0 mt-0.5" />
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="font-bold text-slate-900">{item.title}</p>
                    {item.date && (
                      <span className="text-[10px] font-bold uppercase text-slate-400">{item.date}</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h3 className="text-lg font-extrabold text-slate-900">Included Bonuses</h3>
          <Link
            to={`/my-internships/${slug}/bonuses`}
            className="text-sm font-bold text-[#181FC5] hover:underline"
          >
            View all bonuses
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {bonuses.map((bonus) => (
            <div
              key={bonus.id}
              className={`rounded-2xl p-4 border ${
                bonus.id === "reznio"
                  ? "border-[#181FC5]/30 bg-gradient-to-br from-[#181FC5] to-[#4F46E5] text-white"
                  : "border-slate-100 bg-slate-50 text-slate-900"
              }`}
            >
              <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${bonus.id === "reznio" ? "text-blue-100" : "text-[#181FC5]"}`}>
                {bonus.id === "reznio" ? "Platform Access" : "Live Workshop"}
              </p>
              <p className="font-extrabold text-sm">{bonus.title}</p>
              <p className={`text-xs mt-1 leading-relaxed ${bonus.id === "reznio" ? "text-blue-100" : "text-slate-600"}`}>
                {bonus.description}
              </p>
              {bonus.id === "reznio" && renderReznioAccess(bonus, true)}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-extrabold text-slate-900 mb-4">What&apos;s Included</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {highlights.map((item) => (
            <div key={item} className="flex items-start gap-2 text-sm text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="space-y-3">
      {dashboard.modules.map((module) => {
        const classes = module.liveClasses?.length
          ? module.liveClasses
          : module.liveClass
            ? [module.liveClass]
            : [];
        return (
          <div key={module.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-[#181FC5]">{module.week}</p>
            <p className="font-bold text-slate-900 mt-1">{module.topic || "Topic to be announced"}</p>
            {classes.length > 0 && (
              <div className="mt-3 space-y-1.5">
                {classes.map((liveClass, idx) => (
                  <p key={liveClass.id || idx} className="text-sm text-slate-500 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#181FC5] shrink-0" />
                    <span className="font-medium text-slate-700">Class {idx + 1}:</span>
                    {[liveClass.schedule?.day, liveClass.schedule?.time].filter(Boolean).join(" · ") || "Timing TBA"}
                  </p>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderClasses = () => (
    <div className="space-y-6">
      {dashboard.modules.map((module) => {
        const classes = module.liveClasses?.length
          ? module.liveClasses
          : module.liveClass
            ? [module.liveClass]
            : [];
        return (
          <div key={module.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#181FC5]">{module.week}</p>
              <h3 className="text-lg font-extrabold text-slate-900 mt-1">{module.topic || "Live classes"}</h3>
              <p className="text-sm text-slate-500 mt-1">{classes.length} class{classes.length === 1 ? "" : "es"} this week</p>
            </div>
            {classes.length === 0 ? (
              <p className="text-sm text-slate-500">Classes will be shared by your trainer.</p>
            ) : (
              classes.map((liveClass, idx) => {
                const recordingUrl = liveClass.recordingUrl || "";
                const meetingLink = liveClass.meetingLink || "";
                const actionHref = recordingUrl || meetingLink;
                const isRecording = Boolean(recordingUrl);
                const noteTitle = liveClass.noteTitle || "";
                const noteUrl = liveClass.noteUrl || "";
                const attended = Boolean(liveClass.attended);
                const handleJoinLiveClass = async (event) => {
                  if (isRecording || !meetingLink || !liveClass.id) return;
                  // Always open the meeting; attendance only counts in the schedule window.
                  event.preventDefault();
                  window.open(meetingLink, "_blank", "noopener,noreferrer");
                  try {
                    const result = await markLiveClassAttendance(
                      slug,
                      liveClass.id,
                      module.weekIndex
                    );
                    const attendance = result?.attendance;
                    const marked = Boolean(result?.marked);
                    if (!marked) {
                      setSubmitMessage(
                        result?.reason ||
                          result?.message ||
                          "Meeting opened. Attendance is only marked during scheduled class hours."
                      );
                      setSubmitError("");
                    } else {
                      setSubmitMessage("Attendance marked for this live class.");
                      setSubmitError("");
                    }
                    setDashboard((prev) => {
                      if (!prev?.modules) return prev;
                      return {
                        ...prev,
                        modules: prev.modules.map((mod) => {
                          if (mod.weekIndex !== module.weekIndex) return mod;
                          const patchClass = (row) => {
                            if (row?.id !== liveClass.id) return row;
                            if (!marked) {
                              return {
                                ...row,
                                attendanceHint:
                                  result?.reason ||
                                  row.attendanceHint ||
                                  "Attendance is only marked during the scheduled class window.",
                                attendanceOpen: false,
                              };
                            }
                            return {
                              ...row,
                              attended: true,
                              joinedAt:
                                attendance?.joinedAt ||
                                row.joinedAt ||
                                new Date().toISOString(),
                              lastJoinedAt:
                                attendance?.lastJoinedAt || new Date().toISOString(),
                              joinCount:
                                attendance?.joinCount || (row.joinCount || 0) + 1,
                              attendanceOpen: true,
                              attendanceHint: "Attendance already marked for this class.",
                            };
                          };
                          return {
                            ...mod,
                            liveClasses: (mod.liveClasses || []).map(patchClass),
                            liveClass: patchClass(mod.liveClass),
                          };
                        }),
                      };
                    });
                  } catch {
                    // Still allow joining even if attendance API fails.
                  }
                };
                return (
                  <div
                    key={liveClass.id || idx}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Class {idx + 1}</p>
                        <p className="font-bold text-slate-900 mt-0.5">{liveClass.title}</p>
                        <p className="text-sm text-slate-600 mt-1">
                          {[liveClass.schedule?.day, liveClass.schedule?.time].filter(Boolean).join(" · ") || "Timing TBA"}
                        </p>
                        {attended ? (
                          <p className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Attendance marked
                            {liveClass.joinedAt
                              ? ` · ${new Date(liveClass.joinedAt).toLocaleString("en-IN")}`
                              : ""}
                          </p>
                        ) : liveClass.attendanceHint ? (
                          <p className="mt-1 text-xs font-semibold text-amber-700">
                            {liveClass.attendanceHint}
                          </p>
                        ) : (
                          <p className="mt-1 text-xs font-semibold text-slate-500">
                            Attendance counts only during scheduled class hours (IST).
                          </p>
                        )}
                      </div>
                      {actionHref ? (
                        <a
                          href={actionHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={isRecording ? undefined : handleJoinLiveClass}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#181FC5] text-white text-sm font-bold hover:bg-[#1418a0]"
                        >
                          {isRecording ? (
                            <PlayCircle className="w-4 h-4" />
                          ) : (
                            <Video className="w-4 h-4" />
                          )}
                          {isRecording ? "Watch Recording" : attended ? "Join again" : "Join Live Class"}
                          <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                        </a>
                      ) : (
                        <p className="text-sm text-slate-500">Meeting link pending</p>
                      )}
                    </div>
                    {(noteTitle || noteUrl) && (
                      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-4 h-4 text-[#181FC5] shrink-0" />
                          <p className="text-sm font-semibold text-slate-800 truncate">
                            {noteTitle || "Class notes"}
                          </p>
                        </div>
                        {noteUrl ? (
                          <a
                            href={noteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#181FC5] hover:underline"
                          >
                            <Download className="w-4 h-4" />
                            Notes
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400 font-semibold">Coming soon</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        );
      })}
    </div>
  );

  const handleSubmitProject = async (module) => {
    const weekIndex = module.weekIndex ?? 0;
    const key = `project:${weekIndex}`;
    const githubUrl =
      githubDrafts[weekIndex] ?? module.assignment?.mySubmission?.githubUrl ?? "";
    setSubmittingKey(key);
    setSubmitError("");
    setSubmitMessage("");
    try {
      const result = await submitProjectGithub(slug, weekIndex, githubUrl);
      setDashboard((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          modules: prev.modules.map((m) =>
            (m.weekIndex ?? 0) === weekIndex || m.id === module.id
              ? {
                  ...m,
                  assignment: {
                    ...m.assignment,
                    mySubmission: {
                      ...(result.submission || {}),
                      reviewStatus: result.submission?.reviewStatus || "pending",
                      reviewReason: result.submission?.reviewReason || "",
                    },
                  },
                }
              : m
          ),
        };
      });
      setSubmitMessage("GitHub URL submitted.");
    } catch (e) {
      setSubmitError(e?.response?.data?.message || "Failed to submit project");
    } finally {
      setSubmittingKey("");
    }
  };

  const renderAssignments = () => {
    const modules = dashboard.modules.filter((m) => !m.isCapstone);
    const cards = [];
    modules.forEach((module) => {
      const classes = module.liveClasses?.length
        ? module.liveClasses
        : module.liveClass
          ? [module.liveClass]
          : [];
      classes.forEach((liveClass, idx) => {
        const assignment = liveClass.assignment || {};
        const questionCount = (assignment.questions || []).length;
        if (!questionCount && !assignment.title) return;
        cards.push({ module, liveClass, idx, assignment, questionCount });
      });
    });

    if (!cards.length) {
      return (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
          No assignments published yet.
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {cards.map(({ module, liveClass, idx, assignment, questionCount }) => {
          const weekIndex = module.weekIndex ?? 0;
          const submitted = Boolean(assignment.mySubmission);
          return (
            <div
              key={`${module.id}-${liveClass.id || idx}`}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex flex-wrap items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-[#181FC5]">
                  {module.week} · Class {idx + 1}
                </p>
                <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                  {assignment.title || liveClass.title || "Assignment"}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  {[module.topic, assignment.dueLabel, questionCount ? `${questionCount} questions` : null]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                {submitted && (
                  <p className="text-sm font-semibold text-emerald-600 mt-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Submitted
                    {typeof assignment.mySubmission.mcqTotal === "number" &&
                      assignment.mySubmission.mcqTotal > 0 && (
                        <span>
                          · {assignment.mySubmission.mcqScore}/
                          {assignment.mySubmission.mcqTotal}
                        </span>
                      )}
                  </p>
                )}
              </div>
              <Link
                to={`/my-internships/${slug}/assignments/${weekIndex}/${encodeURIComponent(liveClass.id)}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#181FC5] text-white text-sm font-bold hover:bg-[#1418a0]"
              >
                View Assignment
              </Link>
            </div>
          );
        })}
      </div>
    );
  };

  const renderProjects = () => (
    <div className="space-y-4">
      <div className="rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-6">
        <h3 className="text-xl font-extrabold text-slate-900 mb-2">Projects</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          Build, deploy, and present a portfolio-ready solution. Submit your GitHub repository URL
          below.
        </p>
      </div>
      {(submitMessage || submitError) &&
        (activeSection === "projects" || activeSection === "classes") && (
        <p className={`text-sm font-semibold ${submitError ? "text-red-600" : "text-emerald-600"}`}>
          {submitError || submitMessage}
        </p>
      )}
      {dashboard.modules
        .filter((m) => m.isCapstone && !m.assignment?.isProjectSecondary)
        .map((module) => {
        const weekIndex = module.weekIndex ?? 0;
        const submitWeekIndex = module.assignment?.submitWeekIndex ?? weekIndex;
        const spanWeeks = Math.min(3, Math.max(1, Number(module.assignment?.spanWeeks) || 1));
        const submitted = Boolean(module.assignment?.mySubmission?.githubUrl);
        const githubValue =
          githubDrafts[submitWeekIndex] ??
          module.assignment?.mySubmission?.githubUrl ??
          "";
        const submitKey = `project:${submitWeekIndex}`;
        const docUrl = module.assignment?.documentUrl || "";
        return (
          <div key={module.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-violet-600">
              {module.week}
              {spanWeeks > 1 ? ` · ${spanWeeks}-week project` : ""}
            </p>
            <h3 className="text-lg font-extrabold text-slate-900 mt-1">{module.topic}</h3>
            <p className="text-sm font-semibold text-slate-700 mt-2">{module.assignment.title}</p>
            {module.assignment.dueLabel && (
              <p className="text-sm text-slate-500 mt-1">{module.assignment.dueLabel}</p>
            )}
            {module.assignment.instructions && (
              <p className="text-sm text-slate-600 mt-2">{module.assignment.instructions}</p>
            )}
            {docUrl && (
              <a
                href={docUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#181FC5] hover:underline"
              >
                {module.assignment.documentTitle || "Open project document"}
              </a>
            )}
            <label className="block">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500">
                GitHub URL
              </span>
              <input
                type="url"
                value={githubValue}
                disabled={false}
                onChange={(e) =>
                  setGithubDrafts((prev) => ({
                    ...prev,
                    [submitWeekIndex]: e.target.value,
                  }))
                }
                placeholder="https://github.com/username/repo"
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
              />
            </label>
            {submitted && (
              <div className="space-y-1">
                <p
                  className={`text-sm font-semibold flex items-center gap-1.5 ${
                    module.assignment.mySubmission?.reviewStatus === "approved"
                      ? "text-emerald-600"
                      : module.assignment.mySubmission?.reviewStatus === "rejected"
                        ? "text-red-600"
                        : "text-amber-600"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {module.assignment.mySubmission?.reviewStatus === "approved"
                    ? "Approved by trainer"
                    : module.assignment.mySubmission?.reviewStatus === "rejected"
                      ? "Rejected — please improve and resubmit"
                      : "Submitted · awaiting trainer review"}{" "}
                  <a
                    href={module.assignment.mySubmission.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    view repo
                  </a>
                </p>
                {module.assignment.mySubmission?.reviewStatus === "rejected" &&
                  module.assignment.mySubmission?.reviewReason && (
                    <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">
                      Trainer feedback: {module.assignment.mySubmission.reviewReason}
                    </p>
                  )}
              </div>
            )}
            {module.assignment.mySubmission?.reviewStatus !== "approved" && (
              <button
                type="button"
                disabled={submittingKey === submitKey || !githubValue.trim()}
                onClick={() =>
                  handleSubmitProject({
                    ...module,
                    weekIndex: submitWeekIndex,
                  })
                }
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#181FC5] text-white text-sm font-bold hover:bg-[#1418a0] disabled:opacity-60"
              >
                {submittingKey === submitKey
                  ? "Submitting…"
                  : module.assignment.mySubmission?.reviewStatus === "rejected"
                    ? "Resubmit GitHub URL"
                    : submitted
                      ? "Update GitHub URL"
                      : "Submit GitHub URL"}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderAnnouncements = () => (
    <div className="space-y-4">
      {announcements.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500 text-sm">
          No announcements yet. Your trainer will post updates here.
        </div>
      ) : (
        announcements.map((item) => (
          <div key={item.id || item.title} className="flex gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <MessageCircle className="w-5 h-5 text-[#181FC5] shrink-0 mt-0.5" />
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <p className="font-bold text-slate-900">{item.title}</p>
                {item.date && (
                  <span className="text-[10px] font-bold uppercase text-slate-400">{item.date}</span>
                )}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{item.body}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderBonuses = () => {
    const genaiBonus = bonuses.find((b) => b.id === "genai-workshop");
    const reznioBonus = bonuses.find((b) => b.id === "reznio");

    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <Sparkles className="w-6 h-6 text-violet-600 mb-3" />
          <h3 className="text-lg font-extrabold text-slate-900 mb-2">{genaiBonus.title}</h3>
          <p className="text-sm text-slate-600 leading-relaxed mb-4">{genaiBonus.description}</p>
          {genaiBonus.meetingLink ? (
            <a
              href={genaiBonus.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#181FC5] text-white text-sm font-bold hover:bg-[#1418a0]"
            >
              <Video className="w-4 h-4" />
              Join Workshop
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          ) : (
            <p className="text-sm text-slate-500">Workshop meeting link will be shared by your trainer.</p>
          )}
        </div>

        <div className="rounded-2xl border border-[#181FC5]/30 bg-gradient-to-br from-[#181FC5] to-[#4F46E5] p-6 text-white">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-100 mb-2">Included Platform</p>
              <h3 className="text-xl font-extrabold mb-2">{reznioBonus.title}</h3>
              <p className="text-sm text-blue-100 leading-relaxed">{reznioBonus.description}</p>
              {renderReznioAccess(reznioBonus)}
            </div>
            <img
              src="/Image/reznio_logo_white.png"
              alt="Reznio"
              className="h-10 w-auto object-contain shrink-0"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderCompletion = () => {
    const cert = dashboard.certificate || {};
    const completed = Boolean(cert.internshipCompleted);
    const awaiting = Boolean(cert.awaitingManagerIssuance);
    const issued = Boolean(cert.issued);

    return (
      <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm max-w-2xl space-y-5">
        <div>
          <CheckCircle2 className="w-10 h-10 text-[#181FC5] mb-4" />
          <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
            Internship completion
          </h3>
          <p className="text-slate-600 leading-relaxed">
            Your trainer marks the internship complete after assignments and projects. A manager
            then issues your official certificate.
          </p>
        </div>

        <ol className="space-y-3">
          <li
            className={`rounded-2xl border px-4 py-3 text-sm ${
              completed
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-slate-200 bg-slate-50 text-slate-600"
            }`}
          >
            <p className="font-bold">1. Trainer review</p>
            <p className="mt-1">
              {completed
                ? `Trainer marked internship completed${
                    cert.internshipCompletedAt
                      ? ` on ${new Date(cert.internshipCompletedAt).toLocaleDateString("en-IN")}`
                      : ""
                  }.`
                : "In progress — keep submitting assignments and projects."}
            </p>
          </li>
          <li
            className={`rounded-2xl border px-4 py-3 text-sm ${
              issued
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : awaiting
                  ? "border-amber-200 bg-amber-50 text-amber-900"
                  : "border-slate-200 bg-slate-50 text-slate-600"
            }`}
          >
            <p className="font-bold">2. Manager issues certificate</p>
            <p className="mt-1">
              {issued
                ? "Certificate has been issued. See the Certificate tab."
                : awaiting
                  ? "Trainer approved. Waiting for the manager to issue your certificate."
                  : "Available after your trainer marks the internship completed."}
            </p>
          </li>
        </ol>
      </div>
    );
  };

  const renderCertificate = () => (
    <div className="max-w-4xl space-y-5 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
      <div>
        <Award className="mb-4 h-10 w-10 text-[#181FC5]" />
        <h3 className="mb-2 text-2xl font-extrabold text-slate-900">
          {dashboard.certificate.programTitle || dashboard.certificate.title}
        </h3>
        <p className="leading-relaxed text-slate-600">
          {dashboard.certificate.issued
            ? "Your official internship completion certificate."
            : dashboard.certificate.requirement}
        </p>
      </div>

      {dashboard.certificate.issued ? (
        <>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
            <p className="mb-1 text-sm font-bold text-emerald-800">Certificate issued</p>
            <p className="text-sm text-emerald-700">
              Issued to <strong>{dashboard.certificate.studentName}</strong>
              {dashboard.certificate.issuedAt && (
                <> on {new Date(dashboard.certificate.issuedAt).toLocaleDateString("en-IN")}</>
              )}
            </p>
            {dashboard.certificate.uuid && (
              <p className="mt-2 font-mono text-xs text-emerald-600">
                ID: {dashboard.certificate.uuid}
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-3">
              {certificatePdfUrl && (
                <a
                  href={certificatePdfUrl}
                  download={`${(dashboard.certificate.studentName || "certificate").replace(/\s+/g, "_")}_internship_certificate.pdf`}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#181FC5] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#1418a0]"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </a>
              )}
              {certificatePdfUrl && (
                <a
                  href={certificatePdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#181FC5]/30 px-4 py-2.5 text-sm font-bold text-[#181FC5] hover:bg-[#181FC5]/5"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open in new tab
                </a>
              )}
            </div>
          </div>

          {certificatePdfLoading && (
            <p className="text-sm font-semibold text-slate-500">Loading certificate PDF…</p>
          )}
          {certificatePdfError && (
            <p className="text-sm font-semibold text-red-600">{certificatePdfError}</p>
          )}
          {certificatePdfUrl && !certificatePdfLoading && (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              <iframe
                title="Internship certificate PDF"
                src={certificatePdfUrl}
                className="h-[70vh] min-h-[480px] w-full bg-white"
              />
            </div>
          )}
        </>
      ) : dashboard.certificate.awaitingManagerIssuance ? (
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
          <p className="mb-1 text-sm font-bold text-amber-900">Awaiting manager</p>
          <p className="text-sm text-amber-800">
            Your trainer has marked the internship completed. The manager will issue your
            certificate next — it will appear here as a downloadable PDF.
          </p>
        </div>
      ) : (
        <p className="text-sm text-slate-500">
          Complete assignments and projects. After your trainer marks you complete, the manager
          will issue your certificate PDF here.
        </p>
      )}
    </div>
  );

  const sectionContent = {
    overview: renderOverview,
    schedule: renderSchedule,
    classes: renderClasses,
    assignments: renderAssignments,
    projects: renderProjects,
    announcements: renderAnnouncements,
    bonuses: renderBonuses,
    completion: renderCompletion,
    certificate: renderCertificate,
  };

  return (
    <BaseLayout>
      <SeoHead
        title={`${track.title} Dashboard - EdLernity`}
        description={`Learning dashboard for ${track.title} internship program.`}
        path={`/my-internships/${slug}/${activeSection}`}
      />

      <div className="bg-slate-50 min-h-screen font-sans">
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              type="button"
              onClick={() => navigate("/mycourses")}
              className="inline-flex items-center gap-2 text-slate-600 hover:text-[#181FC5] text-sm font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to My Learning
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-3xl overflow-hidden border border-slate-100 bg-white shadow-sm mb-8">
            <div className="grid lg:grid-cols-12">
              <div className="lg:col-span-4 xl:col-span-3 bg-gradient-to-br from-[#181FC5] to-[#4F46E5] p-6 text-white">
                <img
                  src={dashboard.program.coverImage}
                  alt={dashboard.program.title}
                  className="w-full h-32 object-cover rounded-2xl mb-4 border border-white/20"
                />
                <p className="text-xs font-bold uppercase tracking-wider text-blue-100">{dashboard.program.category}</p>
                <h1 className="text-xl font-extrabold mt-1 leading-snug">{dashboard.program.title}</h1>
                <p className="text-sm text-blue-100 mt-3">Internship Learning Dashboard</p>
              </div>
              <div className="lg:col-span-8 xl:col-span-9 p-6 flex flex-wrap items-center gap-6">
                <div className="flex-1 min-w-[200px]">
                  <p className="text-sm text-slate-500 font-semibold">{dashboard.program.duration}</p>
                  <p className="text-lg font-extrabold text-slate-900 mt-1">
                    {liveDaysLabel} · {liveTimeLabel}
                  </p>
                  <p className="text-sm text-slate-600 mt-2">{dashboard.program.batchLabel}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {programTools.slice(0, 4).map((tool) => (
                    <span
                      key={tool}
                      className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            <aside className="lg:col-span-3 xl:col-span-3">
              <nav className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto space-y-1 rounded-2xl border border-slate-100 bg-white p-2 shadow-sm">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <Link
                      key={item.id}
                      to={`/my-internships/${slug}/${item.id}`}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        isActive
                          ? "bg-[#181FC5] text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </aside>

            <main className="lg:col-span-9 xl:col-span-9 min-w-0">
              <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-slate-900">
                  {NAV_ITEMS.find((item) => item.id === activeSection)?.label}
                </h2>
              </div>
              {sectionContent[activeSection]?.()}
            </main>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}

export default InternshipDashboard;
