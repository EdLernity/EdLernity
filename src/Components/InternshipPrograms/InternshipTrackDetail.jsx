import React, { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import BaseLayout from "../../Layout/BaseLayout";
import SeoHead from "../SEO/SeoHead";
import { getTrackBySlug, getTrackStats, SYLLABUS_NOTE } from "./internshipTracksData";
import {
  buildInternshipCart,
  isUserLoggedIn,
  saveInternshipCart,
} from "./internshipCartUtils";

function InternshipTrackDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const track = getTrackBySlug(slug);
  const [activeAccordion, setActiveAccordion] = useState(0);

  if (!track) {
    return <Navigate to="/internship-programs" replace />;
  }

  const IconComponent = track.icon;
  const stats = getTrackStats(track.title);

  const handleEnrollNow = () => {
    const cart = buildInternshipCart(track);
    saveInternshipCart(cart);

    if (!isUserLoggedIn()) {
      navigate("/auth/login", {
        state: {
          redirectUrl: "/cart",
          cart,
          message: "Please log in to continue enrollment.",
        },
      });
      return;
    }

    navigate("/cart", { state: { cart } });
  };

  return (
    <BaseLayout>
      <SeoHead
        title={`${track.title} - EdLernity Internship`}
        description={track.desc}
        path={`/internship-programs/${track.slug}`}
      />

      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            type="button"
            onClick={() => navigate("/internship-programs")}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-[#181FC5] text-sm font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Internship Programs
          </button>
        </div>
      </div>

      <section className="bg-white py-12 lg:py-16 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-8 space-y-8">
              <div>
                <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#181FC5]/10 text-[#181FC5] text-xs font-bold uppercase tracking-wider mb-4">
                  {track.category}
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 leading-tight flex items-center gap-3">
                  <span className={`hidden sm:inline-flex w-12 h-12 rounded-2xl items-center justify-center border ${track.iconColor}`}>
                    <IconComponent className="w-6 h-6" />
                  </span>
                  {track.title}
                </h1>
                <p className="text-slate-600 text-base leading-relaxed font-medium">{track.desc}</p>
              </div>

              <div className="rounded-3xl overflow-hidden border border-slate-100 shadow-md">
                <img
                  src={track.coverImage}
                  alt={track.title}
                  className="w-full h-auto max-h-[350px] object-cover"
                />
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700">
                  Program Highlights
                </h3>
                <p className="text-xs text-slate-500 font-semibold mb-2">
                  Transform Your Skills with Our Comprehensive Program
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <li className="flex items-center gap-3 text-sm font-bold text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-[#181FC5] shrink-0" />
                    <span>Designed for students & job seekers</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm font-bold text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-[#181FC5] shrink-0" />
                    <span>ISO 9001:2015 Certification</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm font-bold text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-[#181FC5] shrink-0" />
                    <span>Government OPC Approved Credentials</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm font-bold text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-[#181FC5] shrink-0" />
                    <span>Fosters expertise & live capstone project work</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm font-bold text-slate-600 col-span-1 md:col-span-2">
                    <CheckCircle2 className="w-5 h-5 text-[#181FC5] shrink-0" />
                    <span>100+ Hiring and Internship Corporate Partners</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm font-bold text-slate-600 col-span-1 md:col-span-2">
                    <CheckCircle2 className="w-5 h-5 text-pink-500 shrink-0" />
                    <span>Special access: GenAI & Prompt Engineering workshop included</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm font-bold text-slate-600 col-span-1 md:col-span-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>Special access: Reznio job-search platform included after enrollment</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Key Tools & Technologies Learned
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {track.tools.map((tool) => (
                    <span
                      key={tool}
                      className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 mb-2">Syllabus</h2>
                <p className="text-slate-500 text-xs sm:text-sm mb-4 font-semibold">
                  Note: {SYLLABUS_NOTE}
                </p>
                <div className="space-y-3">
                  {track.curriculum.map((step, idx) => (
                    <div
                      key={`${step.week}-${idx}`}
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm"
                    >
                      <button
                        type="button"
                        onClick={() => setActiveAccordion(activeAccordion === idx ? -1 : idx)}
                        className="w-full flex items-center justify-between p-5 text-left font-extrabold text-slate-800 hover:bg-slate-50 transition-colors"
                      >
                        <span className="flex items-center gap-3">
                          <span className="px-2.5 py-1 bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold rounded-lg shrink-0">
                            {step.week}
                          </span>
                          <span className="text-sm sm:text-base">{step.topic.split(":")[0] || step.topic}</span>
                        </span>
                        <svg
                          className={`w-5 h-5 text-slate-400 transform transition-transform duration-300 ${
                            activeAccordion === idx ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {activeAccordion === idx && (
                        <div className="px-5 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                          {step.topic}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 lg:sticky lg:top-8 bg-[#151B40] text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-800">
              <h3 className="text-xl font-bold mb-2">Apply for {track.title}</h3>

              <div className="mb-4 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold">
                    Program Fee
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                    Save 78%
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-slate-500 line-through decoration-1">₹25,000</span>
                  <span className="text-2xl font-extrabold text-emerald-400">₹5,599</span>
                  <span className="text-[10px] text-slate-400">INR</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 mb-6 font-medium">
                Enroll to add this internship to your cart with GenAI workshop and Reznio access included.
              </p>

              <button
                type="button"
                onClick={handleEnrollNow}
                className="block w-full py-4 text-center text-white font-bold bg-[#181FC5] hover:bg-[#1418a0] rounded-xl transition-all shadow-md text-sm uppercase tracking-widest hover:scale-[1.01] active:scale-[0.99]"
              >
                Enroll Now
              </button>

              <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
                <div className="flex items-center gap-2.5 text-xs text-slate-300 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>ISO 9001:2015 Certified Certificate</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-300 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Govt. Approved Experience letter</span>
                </div>
                <Link
                  to="/internship-programs"
                  className="inline-flex text-xs font-semibold text-indigo-300 hover:text-white transition-colors"
                >
                  View all internship tracks
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 border-t border-slate-100 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 text-center mb-10">
            Here's Why You Need to Master {track.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 text-center shadow-sm hover:scale-[1.01] transition-transform">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#181FC5] block mb-2">{stats.jobs}</span>
              <span className="text-sm font-bold text-slate-500 uppercase tracking-wider block">
                Active Job Openings
              </span>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-6 text-center shadow-sm hover:scale-[1.01] transition-transform">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#181FC5] block mb-2">{stats.market}</span>
              <span className="text-sm font-bold text-slate-500 uppercase tracking-wider block">
                Global Market Size
              </span>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-6 text-center shadow-sm hover:scale-[1.01] transition-transform">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#181FC5] block mb-2">{stats.salary}</span>
              <span className="text-sm font-bold text-slate-500 uppercase tracking-wider block">
                Average Annual Salary
              </span>
            </div>
          </div>
        </div>
      </section>
    </BaseLayout>
  );
}

export default InternshipTrackDetail;
