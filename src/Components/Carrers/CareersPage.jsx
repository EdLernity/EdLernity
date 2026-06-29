import React from "react";
import { Link } from "react-router-dom";
import {
  Award,
  Briefcase,
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

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f0f1ff] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <p className="text-sm font-semibold uppercase tracking-wider text-[#181FC5] mb-4">
                Careers at EdLernity · {currentYear}
              </p>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-[#181FC5] leading-tight mb-6">
                Greening Careers, Expanding Horizons
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-4">
                Join EdLernity and grow your skills in business, marketing, human
                resources, or technology — with mentorship, real projects, and
                certifications that strengthen your professional profile.
              </p>
              <p className="text-base text-gray-500 leading-relaxed mb-8">
                Explore our open internship tracks below. Application forms will
                be linked here soon.
              </p>
              <a
                href="#open-positions"
                className="inline-flex items-center px-8 py-3 text-white font-bold bg-gradient-to-r from-blue-500 to-pink-600 rounded-full hover:opacity-90 transition-opacity"
              >
                View Open Positions
              </a>
            </div>
            <div className="flex justify-center">
              <img
                src="/Image/IMG_8470.PNG"
                alt="Careers at EdLernity"
                className="w-full max-w-lg rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="bg-[#181FC5] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-white">
            {careerPerks.map((perk) => (
              <div key={perk.title} className="text-center sm:text-left">
                <Award className="w-8 h-8 mx-auto sm:mx-0 mb-3 text-blue-200" />
                <h2 className="text-lg font-bold mb-2">{perk.title}</h2>
                <p className="text-blue-100 text-sm leading-relaxed">
                  {perk.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open positions */}
      <section id="open-positions" className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#181FC5]/10 text-[#181FC5] text-xs font-bold uppercase tracking-wider mb-4">
              <Briefcase className="w-4 h-4" />
              Internship Opportunities
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#181FC5] mb-4">
              Open Internship Positions
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Choose the track that matches your interests. Google Form application
              links will be added for each role shortly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {internshipRoles.map((role) => (
              <article
                key={role.id}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-[#181FC5]/20 transition-all overflow-hidden flex flex-col"
              >
                <div className="relative h-52 overflow-hidden bg-gray-100">
                  <img
                    src={role.image}
                    alt={role.title}
                    className={`w-full h-full ${role.imageClass} group-hover:scale-105 transition-transform duration-500`}
                  />
                  <span className="absolute top-4 left-4 bg-white/95 text-[#181FC5] text-xs font-bold uppercase px-3 py-1 rounded-full shadow-sm">
                    {role.track}
                  </span>
                  <span className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold uppercase px-3 py-1 rounded-full">
                    {role.duration}
                  </span>
                  {role.preferred && (
                    <span className="absolute bottom-4 left-4 right-4 bg-[#181FC5] text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-md">
                      {role.preferredNote}
                    </span>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#181FC5] mb-2">
                    {role.category}
                  </p>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#181FC5] transition-colors">
                    {role.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {role.description}
                  </p>

                  <ul className="space-y-2 mb-6">
                    {role.highlights.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <Sparkles className="w-4 h-4 text-[#181FC5] shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-500 mb-6 pt-4 border-t border-gray-100">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {role.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {role.duration}
                    </span>
                  </div>

                  {role.applyUrl ? (
                    <a
                      href={role.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto block w-full text-center py-3 text-white font-bold bg-gradient-to-r from-blue-500 to-pink-600 rounded-full hover:opacity-90 transition-opacity"
                    >
                      Apply Now
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="mt-auto w-full py-3 text-[#181FC5] font-bold bg-[#181FC5]/10 rounded-full cursor-not-allowed"
                      title="Google Form link coming soon"
                    >
                      Apply Soon — Form Link Coming
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Culture */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-slate-900 relative">
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
              <h2 className="text-2xl sm:text-3xl font-bold text-[#181FC5] mb-4">
                Why Intern at EdLernity?
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
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
                    className="flex items-start gap-3 p-4 rounded-xl bg-[#ECF7FF] border border-[#181FC5]/10"
                  >
                    <Users className="w-5 h-5 text-[#181FC5] shrink-0 mt-0.5" />
                    <p className="text-gray-700 text-sm font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#181FC5]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Read What Our Interns Say
          </h2>
          <p className="text-blue-100 mb-8">
            Explore real internship experiences and success stories from the
            EdLernity community.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/reviews"
              className="inline-flex items-center px-6 py-3 bg-white text-[#181FC5] font-semibold rounded-full hover:bg-blue-50 transition-colors"
            >
              View Reviews
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
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
