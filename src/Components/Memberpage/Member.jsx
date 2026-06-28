import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Award,
  BookOpen,
  GraduationCap,
  Infinity,
  Mail,
  Users,
} from "lucide-react";
import BaseLayout from "../../Layout/BaseLayout";
import SeoHead from "../SEO/SeoHead";
import { PAGE_SEO } from "../../Utils/seoConfig";

const stats = [
  { value: "10k+", label: "Members", desc: "Join a growing community of learners worldwide." },
  { value: "150+", label: "Hours", desc: "Access a rich library of expert-led content." },
  { value: "325+", label: "Lectures", desc: "Watch self-paced lectures anytime, anywhere." },
];

const features = [
  {
    icon: BookOpen,
    title: "12+ Courses",
    desc: "Access prerecorded online courses by professionals. Build skills that matter for your career.",
  },
  {
    icon: Infinity,
    title: "Lifetime Access",
    desc: "Unlimited lifetime access to 20+ courses covering practical, in-demand skills.",
  },
  {
    icon: Award,
    title: "Certified",
    desc: "Every EdLernity course includes certification to strengthen your resume and profile.",
  },
  {
    icon: GraduationCap,
    title: "EdLernity Academics",
    desc: "A curated platform for students with job support and placement preparation material.",
  },
];

const benefits = [
  {
    title: "Career Growth",
    desc: "Professional certifications often translate into better opportunities and increased income.",
  },
  {
    title: "Competitive Edge",
    desc: "Training your competitors don't have sets you apart in interviews and the workplace.",
  },
  {
    title: "Strong Foundation",
    desc: "Start your career with structured learning that prepares you from day one.",
  },
];

const planIncludes = [
  "Verified certificates for lifetime",
  "100+ upcoming courses",
  "Unlimited access to all courses",
  "Free access to EdLernity Academics",
];

function Member() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const handleCheckout = () => {
    const token = localStorage.getItem("_userAuth");
    if (!token) {
      navigate("/auth/login");
      return;
    }
    navigate("/payment", { state: { enrollingAllCourses: true } });
  };

  return (
    <BaseLayout>
      <SeoHead
        title={PAGE_SEO.member.title}
        description={PAGE_SEO.member.description}
        path={PAGE_SEO.member.path}
        keywords={PAGE_SEO.member.keywords}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f0f1ff] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="flex items-center gap-3 mb-6 justify-center lg:justify-start">
                <img src="/Image/Logo1.svg" alt="EdLernity" className="w-10 h-10" />
                <span className="text-xl font-bold text-[#181FC5]">EdLernity</span>
              </div>
              <div className="text-[#181FC5] text-xs sm:text-sm font-bold uppercase tracking-widest mb-4">
                LIFETIME LEARNING PASS
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-[#181FC5] leading-tight mb-6">
                EdLernity Lifetime Subscription
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed font-medium mb-8">
                Supercharge your learning journey with our comprehensive membership
                package — designed to give you the skills, certifications, and
                confidence to succeed in your career.
              </p>
              <button
                type="button"
                onClick={handleCheckout}
                className="inline-flex items-center px-8 py-3 text-white font-bold bg-gradient-to-r from-blue-500 to-pink-600 rounded-full hover:opacity-90 transition-opacity"
              >
                Get Access
              </button>
            </div>
            <div className="flex justify-center">
              <img
                src="/Image/online-learning-concept.svg"
                alt="EdLernity lifetime membership"
                className="w-full max-w-md lg:max-w-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#181FC5] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center text-white">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl sm:text-4xl font-extrabold">{stat.value}</p>
                <p className="text-lg font-semibold mt-2">{stat.label}</p>
                <p className="text-blue-100 text-sm mt-2 max-w-xs mx-auto">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing + features */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Pricing card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden lg:sticky lg:top-8">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-pink-600" />
              <div className="p-8 text-center">
                <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600 mb-2">
                  Join EdLernity
                </p>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Lifetime Pass</h2>
                <p className="text-5xl font-black text-slate-900 mb-1">₹899</p>
                <p className="text-sm text-slate-500 font-medium mb-6">One-time · Lifetime access</p>

                <ul className="text-left space-y-3 mb-8">
                  {planIncludes.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-slate-700 font-medium">
                      <span className="mt-1 w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">
                        ✓
                      </span>
                      {item.includes("upcoming") ? `${item} in ${currentYear}` : item}
                    </li>
                  ))}
                </ul>

                <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold text-[#181FC5] bg-[#181FC5]/10 rounded-full">
                  Save 90%
                </span>

                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full py-3 text-white font-bold bg-gradient-to-r from-blue-500 to-pink-600 rounded-full hover:opacity-90 transition-opacity"
                >
                  Get Access
                </button>
              </div>
            </div>

            {/* Features list */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
                  What's Included
                </h2>
                <p className="text-slate-600 font-medium">
                  Everything you need to learn, certify, and grow — in one membership.
                </p>
              </div>
              {features.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex gap-4 p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#f0f1ff] flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-[#181FC5]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 mb-1">{title}</h3>
                    <p className="text-slate-600 leading-relaxed font-medium">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits + certificate */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Why Choose Lifetime Membership?
              </h2>
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="p-5 rounded-xl bg-[#ECF7FF] border border-[#181FC5]/10"
                >
                  <h3 className="text-lg font-semibold text-indigo-600 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed font-medium">{benefit.desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center">
              <img
                src="/cert.png"
                alt="EdLernity sample certificate"
                className="rounded-xl shadow-lg border border-gray-100 w-full max-w-md mx-auto"
              />
              <p className="mt-4 text-lg font-bold text-slate-900">
                Sample Certificate
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#181FC5]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center text-white">
          <Users className="w-10 h-10 mx-auto mb-4 text-white/80" />
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Got a question?</h2>
          <p className="text-blue-100 font-medium mb-6">
            We'd love to talk more about what you need from your membership.
          </p>
          <a
            href="mailto:info@edlernity.com"
            className="inline-flex items-center gap-2 text-white font-semibold hover:underline"
          >
            <Mail className="w-5 h-5" />
            info@edlernity.com
          </a>
          <div className="mt-8">
            <Link
              to="/contact"
              className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-colors mr-3"
            >
              Contact Us
            </Link>
            <button
              type="button"
              onClick={handleCheckout}
              className="inline-flex items-center px-6 py-3 bg-white text-[#181FC5] font-semibold rounded-full hover:bg-blue-50 transition-colors mt-3 sm:mt-0"
            >
              Get Access
            </button>
          </div>
        </div>
      </section>
    </BaseLayout>
  );
}

export default Member;
