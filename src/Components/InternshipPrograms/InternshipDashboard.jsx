import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import {
  Award,
  BookOpen,
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
import { fetchStudentDashboard } from "./internshipApi";
import {
  fetchMyInternshipsFromBackend,
  isUserLoggedIn,
} from "./internshipCartUtils";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "schedule", label: "Schedule", icon: Calendar },
  { id: "classes", label: "Live Classes", icon: Video },
  { id: "recordings", label: "Recordings", icon: PlayCircle },
  { id: "notes", label: "Notes & Resources", icon: BookOpen },
  { id: "assignments", label: "Assignments", icon: ClipboardList },
  { id: "capstone", label: "Capstone", icon: Sparkles },
  { id: "announcements", label: "Announcements", icon: MessageCircle },
  { id: "bonuses", label: "Bonuses", icon: Award },
  { id: "certificate", label: "Certificate", icon: FileText },
];

function InternshipDashboard() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const track = getTrackBySlug(slug);
  const [activeSection, setActiveSection] = useState("overview");
  const [enrollment, setEnrollment] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!isUserLoggedIn()) {
      navigate("/auth/login", {
        replace: true,
        state: { redirectUrl: `/my-internships/${slug}` },
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
  }, [navigate, slug, track]);

  if (!track) {
    return <Navigate to="/internship-programs" replace />;
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
          <button
            type="button"
            onClick={() => setActiveSection("bonuses")}
            className="text-sm font-bold text-[#181FC5] hover:underline"
          >
            View all bonuses
          </button>
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
    <div className="space-y-4">
      {liveSchedule.length > 0 && (
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-extrabold text-slate-900 mb-2">Regular Live Slot</h3>
          <p className="text-sm text-slate-600 mb-6">Default weekly timing. Use Live Classes for meeting links.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {liveSchedule.map((slot, idx) => (
              <div key={`${slot.day}-${idx}`} className="rounded-2xl border border-slate-100 p-4 bg-slate-50">
                <p className="text-sm font-extrabold text-slate-900">{slot.day}</p>
                <p className="text-sm text-slate-600 mt-1 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#181FC5]" />
                  {slot.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {dashboard.modules.map((module) => (
          <div key={module.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-[#181FC5]">{module.week}</p>
            <p className="font-bold text-slate-900 mt-1">{module.topic || "Topic to be announced"}</p>
            {(module.liveClass?.schedule?.day || module.liveClass?.schedule?.time) && (
              <p className="text-sm text-slate-500 mt-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#181FC5] shrink-0" />
                {[module.liveClass.schedule.day, module.liveClass.schedule.time].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderClasses = () => (
    <div className="space-y-4">
      {dashboard.modules.map((module) => (
        <div key={module.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-[#181FC5]">{module.week}</p>
          <h3 className="text-lg font-extrabold text-slate-900 mt-1">{module.liveClass.title}</h3>
          <p className="text-sm text-slate-600 mt-1 mb-4">
            {[module.liveClass.schedule.day, module.liveClass.schedule.time].filter(Boolean).join(" · ") || "Timing TBA"}
          </p>
          {module.liveClass.meetingLink ? (
            <a
              href={module.liveClass.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#181FC5] text-white text-sm font-bold hover:bg-[#1418a0]"
            >
              <Video className="w-4 h-4" />
              Join Live Class
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          ) : (
            <p className="text-sm text-slate-500">Meeting link will be shared by your trainer.</p>
          )}
        </div>
      ))}
    </div>
  );

  const renderRecordings = () => (
    <div className="space-y-4">
      {dashboard.modules.map((module) => (
        <div key={module.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#181FC5]/10 flex items-center justify-center shrink-0">
              <PlayCircle className="w-6 h-6 text-[#181FC5]" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{module.week}</p>
              <p className="font-bold text-slate-900">{module.recording.title}</p>
              <p className="text-sm text-slate-500">{module.recording.duration}</p>
            </div>
          </div>
          {module.recording.url ? (
            <a
              href={module.recording.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#181FC5]/20 text-[#181FC5] text-sm font-bold hover:bg-[#181FC5]/5"
            >
              <PlayCircle className="w-4 h-4" />
              Watch Recording
            </a>
          ) : (
            <span className="text-sm text-slate-400">Coming soon</span>
          )}
        </div>
      ))}
    </div>
  );

  const renderNotes = () => (
    <div className="space-y-6">
      {dashboard.modules.map((module) => (
        <div key={module.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="font-extrabold text-slate-900">{module.week}</h3>
            <p className="text-sm text-slate-500 mt-0.5">{module.topic}</p>
          </div>
          <div className="space-y-3">
            {(module.notes || []).map((note) => (
              <div
                key={note.title}
                className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[#181FC5]" />
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{note.title}</p>
                    <p className="text-xs text-slate-500 uppercase font-bold">{note.type}</p>
                  </div>
                </div>
                {note.url ? (
                  <a
                    href={note.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#181FC5] hover:underline"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                ) : (
                  <span className="text-xs text-slate-400 font-semibold">Coming soon</span>
                )}
              </div>
            ))}
            {(module.resources || []).map((resource) => (
              <div
                key={resource.title}
                className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-violet-600" />
                  <p className="font-semibold text-slate-800 text-sm">{resource.title}</p>
                </div>
                {resource.url ? (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-[#181FC5] hover:underline"
                  >
                    View
                  </a>
                ) : (
                  <span className="text-xs text-slate-400 font-semibold">Coming soon</span>
                )}
              </div>
            ))}
            {(module.notes || []).length === 0 && (module.resources || []).length === 0 && (
              <p className="text-sm text-slate-500">No notes uploaded for this week yet.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderAssignments = () => (
    <div className="space-y-4">
      {dashboard.modules.filter((m) => !m.isCapstone).map((module) => (
        <div key={module.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-[#181FC5]">{module.week}</p>
          <h3 className="text-lg font-extrabold text-slate-900 mt-1">{module.assignment.title}</h3>
          {module.assignment.dueLabel && (
            <p className="text-sm text-slate-500 mt-1">{module.assignment.dueLabel}</p>
          )}
          {module.assignment.instructions && (
            <p className="text-sm text-slate-600 mt-2">{module.assignment.instructions}</p>
          )}
        </div>
      ))}
    </div>
  );

  const renderCapstone = () => (
    <div className="space-y-4">
      <div className="rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-6">
        <h3 className="text-xl font-extrabold text-slate-900 mb-2">Capstone Project</h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          Build, deploy, and present a portfolio-ready solution with mentor review.
        </p>
      </div>
      {dashboard.modules.filter((m) => m.isCapstone).map((module) => (
        <div key={module.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-violet-600">{module.week}</p>
          <h3 className="text-lg font-extrabold text-slate-900 mt-1">{module.topic}</h3>
          <p className="text-sm font-semibold text-slate-700 mt-2">{module.assignment.title}</p>
          {module.assignment.dueLabel && (
            <p className="text-sm text-slate-500 mt-1">{module.assignment.dueLabel}</p>
          )}
          {module.assignment.instructions && (
            <p className="text-sm text-slate-600 mt-2">{module.assignment.instructions}</p>
          )}
        </div>
      ))}
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

  const renderCertificate = () => (
    <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm max-w-2xl">
      <Award className="w-10 h-10 text-[#181FC5] mb-4" />
      <h3 className="text-2xl font-extrabold text-slate-900 mb-2">{dashboard.certificate.title}</h3>
      <p className="text-slate-600 leading-relaxed mb-4">{dashboard.certificate.requirement}</p>
      {dashboard.certificate.issued ? (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
          <p className="text-sm font-bold text-emerald-800 mb-1">Certificate issued</p>
          <p className="text-sm text-emerald-700">
            Issued to <strong>{dashboard.certificate.studentName}</strong>
            {dashboard.certificate.issuedAt && (
              <> on {new Date(dashboard.certificate.issuedAt).toLocaleDateString("en-IN")}</>
            )}
          </p>
          {dashboard.certificate.uuid && (
            <p className="text-xs text-emerald-600 mt-2 font-mono">ID: {dashboard.certificate.uuid}</p>
          )}
        </div>
      ) : (
        <p className="text-sm text-slate-500">
          Complete all modules and the capstone. Your certificate will be issued by the EdLernity admin team.
        </p>
      )}
    </div>
  );

  const sectionContent = {
    overview: renderOverview,
    schedule: renderSchedule,
    classes: renderClasses,
    recordings: renderRecordings,
    notes: renderNotes,
    assignments: renderAssignments,
    capstone: renderCapstone,
    announcements: renderAnnouncements,
    bonuses: renderBonuses,
    certificate: renderCertificate,
  };

  return (
    <BaseLayout>
      <SeoHead
        title={`${track.title} Dashboard - EdLernity`}
        description={`Learning dashboard for ${track.title} internship program.`}
        path={`/my-internships/${slug}`}
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
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        isActive
                          ? "bg-[#181FC5] text-white shadow-sm"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {item.label}
                    </button>
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
