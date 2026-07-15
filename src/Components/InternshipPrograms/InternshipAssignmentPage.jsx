import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import BaseLayout from "../../Layout/BaseLayout";
import SeoHead from "../SEO/SeoHead";
import { fetchStudentDashboard, submitClassAssignment } from "./internshipApi";
import { isUserLoggedIn } from "./internshipCartUtils";

function InternshipAssignmentPage() {
  const { slug, weekIndex: weekParam, classId } = useParams();
  const weekIndex = Number(weekParam);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [module, setModule] = useState(null);
  const [liveClass, setLiveClass] = useState(null);
  const [programTitle, setProgramTitle] = useState("");
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isUserLoggedIn()) {
      navigate("/auth/login", {
        replace: true,
        state: {
          redirectUrl: `/my-internships/${slug}/assignments/${weekParam}/${classId}`,
        },
      });
      return;
    }

    let active = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchStudentDashboard(slug);
        if (!active) return;
        setProgramTitle(data?.program?.title || slug);
        const mod = (data?.modules || []).find(
          (m) => (m.weekIndex ?? 0) === weekIndex && !m.isCapstone
        );
        if (!mod) {
          setError("Assignment week not found.");
          setModule(null);
          setLiveClass(null);
          return;
        }
        const classes = mod.liveClasses?.length
          ? mod.liveClasses
          : mod.liveClass
            ? [mod.liveClass]
            : [];
        const cls = classes.find((c) => c.id === classId) || null;
        if (!cls) {
          setError("Assignment class not found.");
          setModule(mod);
          setLiveClass(null);
          return;
        }
        setModule(mod);
        setLiveClass(cls);

        const submissionAnswers = {};
        (cls.assignment?.mySubmission?.answers || []).forEach((a) => {
          submissionAnswers[a.questionId] = {
            selectedIndex: a.selectedIndex,
            textAnswer: a.textAnswer || "",
          };
        });
        const initial = {};
        (cls.assignment?.questions || []).forEach((q) => {
          initial[q.id] = submissionAnswers[q.id] || {
            selectedIndex: null,
            textAnswer: "",
          };
        });
        setAnswers(initial);
      } catch (e) {
        if (active) {
          setError(e?.response?.data?.message || "Failed to load assignment.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [slug, weekIndex, weekParam, classId, navigate]);

  if (!Number.isInteger(weekIndex) || weekIndex < 0 || !classId) {
    return <Navigate to={`/my-internships/${slug}`} replace />;
  }

  const assignment = liveClass?.assignment || {};
  const questions = assignment.questions || [];
  const submitted = Boolean(assignment.mySubmission);

  const setAnswerField = (questionId, field, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], [field]: value },
    }));
  };

  const handleSubmit = async () => {
    if (!questions.length || submitted) return;
    setSubmitting(true);
    setError("");
    setMessage("");
    try {
      const payloadAnswers = questions.map((q) => ({
        questionId: q.id,
        selectedIndex: q.type === "mcq" ? answers[q.id]?.selectedIndex ?? null : null,
        textAnswer: q.type === "text" ? answers[q.id]?.textAnswer || "" : "",
      }));
      const result = await submitClassAssignment(slug, classId, {
        weekIndex,
        answers: payloadAnswers,
      });
      setLiveClass((prev) =>
        prev
          ? {
              ...prev,
              assignment: {
                ...prev.assignment,
                questions: result.questions || prev.assignment.questions,
                mySubmission: result.submission,
              },
            }
          : prev
      );
      setMessage("Assignment submitted.");
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to submit assignment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BaseLayout>
      <SeoHead
        title={`${assignment.title || "Assignment"} - ${programTitle}`}
        description="Complete your internship class assignment."
        path={`/my-internships/${slug}/assignments/${weekIndex}/${classId}`}
      />

      <div className="bg-slate-50 min-h-screen font-sans">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <Link
            to={`/my-internships/${slug}/assignments`}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#181FC5] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Assignments
          </Link>

          {loading ? (
            <div className="rounded-2xl border border-slate-100 bg-white p-8 text-sm text-slate-500">
              Loading assignment…
            </div>
          ) : error && !liveClass ? (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-700">
              {error}
            </div>
          ) : (
            <>
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-[#181FC5]">
                  {module?.week} · {liveClass?.title}
                </p>
                <h1 className="text-2xl font-extrabold text-slate-900">
                  {assignment.title || liveClass?.title || "Assignment"}
                </h1>
                {module?.topic && (
                  <p className="text-sm text-slate-500">{module.topic}</p>
                )}
                {assignment.dueLabel && (
                  <p className="text-sm text-slate-500">{assignment.dueLabel}</p>
                )}
                {assignment.instructions && (
                  <p className="text-sm text-slate-600 leading-relaxed pt-2">
                    {assignment.instructions}
                  </p>
                )}
                {submitted && (
                  <p className="text-sm font-semibold text-emerald-600 pt-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Submitted
                    {typeof assignment.mySubmission?.mcqTotal === "number" &&
                      assignment.mySubmission.mcqTotal > 0 && (
                        <span>
                          · MCQ score {assignment.mySubmission.mcqScore}/
                          {assignment.mySubmission.mcqTotal}
                        </span>
                      )}
                  </p>
                )}
              </div>

              {(error || message) && (
                <p
                  className={`text-sm font-semibold ${
                    error ? "text-red-600" : "text-emerald-600"
                  }`}
                >
                  {error || message}
                </p>
              )}

              {questions.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-sm text-slate-500">
                  Questions coming soon.
                </div>
              ) : (
                <div className="space-y-4">
                  {questions.map((q, qIndex) => (
                    <div
                      key={q.id || qIndex}
                      className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-3"
                    >
                      <p className="text-sm font-bold text-slate-900">
                        Q{qIndex + 1}. {q.prompt}
                      </p>
                      {q.type === "mcq" ? (
                        <div className="space-y-2">
                          {(q.options || []).map((opt, oIndex) => {
                            const selected = answers[q.id]?.selectedIndex === oIndex;
                            const showCorrect =
                              submitted && typeof q.correctOptionIndex === "number";
                            const isCorrect = q.correctOptionIndex === oIndex;
                            return (
                              <label
                                key={oIndex}
                                className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm cursor-pointer ${
                                  showCorrect && isCorrect
                                    ? "border-emerald-300 bg-emerald-50"
                                    : selected
                                      ? "border-[#181FC5]/40 bg-slate-50"
                                      : "border-slate-200 bg-white"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`q-${q.id}`}
                                  disabled={submitted}
                                  checked={selected}
                                  onChange={() =>
                                    setAnswerField(q.id, "selectedIndex", oIndex)
                                  }
                                />
                                <span>{opt}</span>
                              </label>
                            );
                          })}
                        </div>
                      ) : (
                        <textarea
                          rows={4}
                          disabled={submitted}
                          value={answers[q.id]?.textAnswer || ""}
                          onChange={(e) =>
                            setAnswerField(q.id, "textAnswer", e.target.value)
                          }
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
                          placeholder="Your answer"
                        />
                      )}
                    </div>
                  ))}

                  {!submitted && (
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={handleSubmit}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#181FC5] text-white text-sm font-bold hover:bg-[#1418a0] disabled:opacity-60"
                    >
                      {submitting ? "Submitting…" : "Submit answers"}
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </BaseLayout>
  );
}

export default InternshipAssignmentPage;
