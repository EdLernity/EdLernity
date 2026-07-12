import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Users } from "lucide-react";
import BaseLayout from "../../Layout/BaseLayout";
import SeoHead from "../SEO/SeoHead";
import { showSnackbar } from "../Utils/enQueSnackBar";
import { isUserLoggedIn } from "./internshipCartUtils";
import { fetchTrainerPrograms } from "./internshipApi";

function TrainerInternshipDashboard() {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isUserLoggedIn()) {
      navigate("/auth/login", { replace: true, state: { redirectUrl: "/trainer/internships" } });
      return;
    }
    fetchTrainerPrograms()
      .then(setPrograms)
      .catch(() => {
        showSnackbar("Trainer access required.", "error", "top");
        navigate("/mycourses", { replace: true });
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <BaseLayout>
        <div className="min-h-[50vh] flex items-center justify-center text-slate-500 font-semibold">
          Loading trainer dashboard...
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <SeoHead title="Trainer Dashboard" path="/trainer/internships" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
        <Link to="/mycourses" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#181FC5] mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to My Learning
        </Link>

        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Trainer Dashboard</h1>
        <p className="text-slate-600 mb-8">Manage schedule, live classes, notes, assignments, and more for your programs.</p>

        {programs.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-600">
            No programs assigned yet. Ask admin to assign you to an internship track.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <div key={program.slug} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                {program.coverImage ? (
                  <img
                    src={program.coverImage}
                    alt={program.title}
                    className="w-full h-32 object-cover rounded-2xl mb-4"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-32 rounded-2xl mb-4 bg-gradient-to-br from-[#181FC5]/10 to-slate-100 flex items-center justify-center text-[#181FC5] font-bold text-sm">
                    {program.title}
                  </div>
                )}
                <p className="text-xs font-bold uppercase tracking-wider text-[#181FC5] mb-1">{program.category}</p>
                <h2 className="text-lg font-extrabold text-slate-900 mb-2">{program.title}</h2>
                <p className="text-sm text-slate-500 mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4" /> {program.studentCount} students
                </p>
                <Link
                  to={`/trainer/internships/${program.slug}`}
                  className="inline-flex items-center gap-2 w-full justify-center py-3 rounded-xl bg-[#181FC5] text-white font-bold hover:bg-[#1418a0]"
                >
                  <BookOpen className="w-4 h-4" /> Manage Program Content
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </BaseLayout>
  );
}

export default TrainerInternshipDashboard;
