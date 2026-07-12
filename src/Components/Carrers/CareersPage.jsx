import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Award,
  Briefcase,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  Users,
} from "lucide-react";
import BaseLayout from "../../Layout/BaseLayout";
import SeoHead from "../SEO/SeoHead";
import { PAGE_SEO } from "../../Utils/seoConfig";
import { careerPerks, internshipRoles } from "../../StaticObj/careersData";

function CareersPage() {
  const currentYear = new Date().getFullYear();

  return (
    <BaseLayout>
      <SeoHead
        title={PAGE_SEO.careers.title}
        description={PAGE_SEO.careers.description}
        path={PAGE_SEO.careers.path}
        keywords={PAGE_SEO.careers.keywords}
      />

      {/* Hero — matches Home / About */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#ECEFFE] via-[#F4F6FF] to-white pt-12 pb-20 lg:pt-20 lg:pb-32">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#181FC5]/5 rounded-full filter blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#181FC5]/10 text-[#181FC5] text-xs font-semibold uppercase tracking-wider mb-6">
                Careers & Internships · {currentYear}
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-none mb-6">
                Greening Careers,{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#181FC5] to-[#4F46E5]">
                  Expanding Horizons
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-medium mb-4">
                Join EdLernity and grow your skills in business, marketing, lead
                generation, human resources, or technology — with mentorship,
                real projects, and certifications that strengthen your profile.
              </p>
              <p className="text-base text-slate-500 leading-relaxed mb-8">
                Explore open internship tracks below and apply directly. For our
                paid tech internship programs with live classes and capstone projects,
                visit Internship Programs.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <a
                  href="#open-positions"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#181FC5] to-[#4F46E5] text-white font-bold rounded-full hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.02] transition-all text-base"
                >
                  View Open Positions
                  <ArrowRight className="w-5 h-5" />
                </a>
                <Link
                  to="/internship-programs"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/60 backdrop-blur border border-slate-200 text-slate-700 font-bold rounded-full hover:bg-slate-50 hover:scale-[1.02] transition-all text-base shadow-sm"
                >
                  Tech Internship Programs
                </Link>
              </div>
            </div>

            <div className="flex justify-center relative">
              <div className="absolute inset-0 bg-[#181FC5]/5 rounded-3xl filter blur-2xl transform rotate-3 pointer-events-none" />
              <img
                src="/Image/IMG_8567.PNG"
                alt="Careers at EdLernity"
                className="relative w-full max-w-md lg:max-w-lg hover:scale-[1.01] transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Perks — matches About stats gradient */}
      <section className="bg-gradient-to-br from-[#181FC5] to-[#4F46E5] py-20 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full filter blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {careerPerks.map((perk) => (
              <div key={perk.title} className="text-center sm:text-left">
                <Award className="w-8 h-8 mx-auto sm:mx-0 mb-3 text-blue-200" />
                <p className="text-lg font-extrabold mb-2">{perk.title}</p>
                <p className="text-blue-100 text-sm leading-relaxed">
                  {perk.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open positions */}
      <section id="open-positions" className="py-20 lg:py-28 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#181FC5]/10 text-[#181FC5] text-xs font-semibold uppercase tracking-wider mb-4">
              <Briefcase className="w-4 h-4" />
              Internship Opportunities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">
              Open Internship Positions
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#181FC5] to-[#4F46E5] mx-auto rounded-full mt-4 mb-4" />
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Choose the track that matches your interests and apply through our
              official Google Form for each role.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {internshipRoles.map((role) => (
              <article
                key={role.id}
                className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#181FC5]/10 transition-all overflow-hidden flex flex-col"
              >
                <div className="relative h-48 overflow-hidden bg-[#ECEFFE]">
                  <img
                    src={role.image}
                    alt={role.title}
                    className={`w-full h-full ${role.imageClass} group-hover:scale-105 transition-transform duration-500`}
                  />
                  <span className="absolute top-4 left-4 bg-white/95 text-[#181FC5] text-xs font-bold uppercase px-3 py-1 rounded-full shadow-sm">
                    {role.track}
                  </span>
                  <span className="absolute top-4 right-4 bg-gradient-to-r from-[#181FC5] to-[#4F46E5] text-white text-xs font-bold uppercase px-3 py-1 rounded-full">
                    {role.duration}
                  </span>
                  {role.preferred && (
                    <span className="absolute bottom-4 left-4 right-4 bg-[#181FC5] text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-md">
                      {role.preferredNote}
                    </span>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#181FC5] mb-2">
                    {role.category}
                  </p>
                  <h3 className="text-xl font-extrabold text-slate-900 mb-3 group-hover:text-[#181FC5] transition-colors">
                    {role.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {role.description}
                  </p>

                  <ul className="space-y-2 mb-6">
                    {role.highlights.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-slate-600"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 mb-6 pt-4 border-t border-slate-100">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#181FC5]" />
                      {role.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#181FC5]" />
                      {role.duration}
                    </span>
                  </div>

                  {role.applyUrl ? (
                    <a
                      href={role.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-flex items-center justify-center gap-2 w-full py-3 text-white font-bold bg-gradient-to-r from-[#181FC5] to-[#4F46E5] rounded-full hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
                    >
                      Apply Now
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="mt-auto w-full py-3 text-[#181FC5] font-bold bg-[#ECEFFE] rounded-full cursor-not-allowed"
                    >
                      Apply Soon
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Why intern — matches About section layout */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="w-full rounded-3xl overflow-hidden shadow-lg border border-slate-100 bg-slate-900">
              <video
                src="/Image/animatew_this_walking_and_comi.mp4"
                autoPlay
                loop
                muted
                playsInline
                controlsList="nodownload"
                onContextMenu={(e) => e.preventDefault()}
                className="w-full h-auto object-cover"
              />
            </div>
            <div>
              <span className="text-sm font-bold uppercase tracking-wider text-[#181FC5] bg-[#181FC5]/10 px-3 py-1 rounded-full">
                Why EdLernity
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 mb-4 leading-tight">
                Why Intern at EdLernity?
              </h2>
              <p className="text-slate-600 leading-relaxed mb-8 text-lg">
                Our internship programs are designed for students and early-career
                professionals who want structured learning with real
                responsibilities — not just certificates on paper.
              </p>
              <div className="space-y-4">
                {[
                  "Hands-on tasks across live business scenarios",
                  "Mentorship from experienced team leads",
                  "Internship completion certificate from EdLernity",
                  "Exposure to edtech, operations, and product workflows",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 p-5 rounded-2xl bg-[#ECEFFE] border border-[#181FC5]/10"
                  >
                    <Users className="w-5 h-5 text-[#181FC5] shrink-0 mt-0.5" />
                    <p className="text-slate-700 text-sm font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA — matches About / Reviews */}
      <section className="py-20 bg-gradient-to-br from-[#181FC5] to-[#4F46E5] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full filter blur-3xl pointer-events-none" />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center text-white relative">
          <Sparkles className="w-10 h-10 mx-auto mb-4 text-white/80" />
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
            Read What Our Interns Say
          </h2>
          <p className="text-blue-100 mb-8 leading-relaxed">
            Explore real internship experiences and success stories from the
            EdLernity community.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/reviews"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#181FC5] font-bold rounded-full hover:bg-blue-50 hover:scale-[1.02] transition-all"
            >
              View Reviews
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </BaseLayout>
  );
}

export default CareersPage;
