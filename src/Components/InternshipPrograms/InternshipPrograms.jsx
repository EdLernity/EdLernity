import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  BookOpenCheck,
  CheckCircle2,
  Users,
  Mail,
  Star,
  Clock,
  Zap,
  Award,
  ShieldCheck,
  Briefcase,
  Sparkles,
  ChevronDown
} from "lucide-react";
import BaseLayout from '../../Layout/BaseLayout';
import SeoHead from '../SEO/SeoHead';
import { PAGE_SEO } from '../../Utils/seoConfig';
import { internshipTracks } from './internshipTracksData';

const internshipFaqs = [
  {
    q: "How much time should I set aside each week?",
    a: "Most interns spend about 6-10 hours a week across live sessions, recordings, and practice. Prefer to move faster or fit learning around college and work? EdLernity supports both - join mentor-led live classes when you can, and catch up with recordings and notes at your own pace without falling behind the cohort."
  },
  {
    q: "Who can join the EdLernity Internship Program?",
    a: "Students, fresh graduates, and early-career professionals who want hands-on industry exposure. If you are ready to learn by building real projects, you are a fit - prior job experience is not required."
  },
  {
    q: "How long is the internship and what is the format?",
    a: "The program runs for 3 months: core live learning in the first phase, then a dedicated live capstone project month. You get live classes, recordings, notes, and mentor support throughout."
  },
  {
    q: "What are the timings of the classes?",
    a: "Classes are tailored for convenience, kicking off after 6 PM to suit your busy schedules and commitments. Dive in when you're ready to learn!"
  },
  {
    q: "Is this a remote internship?",
    a: "Yes. EdLernity internships are designed for remote participation so you can learn from anywhere while still working in a structured cohort with live sessions and project deadlines."
  },
  {
    q: "What certificate will I receive?",
    a: "On successful completion - including project work and hands-on skill evaluation - you receive an EdLernity Certificate of Internship. It is issued under our ISO 9001:2015 quality framework and government-registered OPC credentials."
  },
  {
    q: "How do I earn the certification?",
    a: "Complete your track modules, deliver your live capstone project, and demonstrate skills through hands-on sessions. Meeting EdLernity’s practical benchmarks confirms certification under our quality standards."
  },
  {
    q: "Do I get GenAI workshop access with every track?",
    a: "Yes. Enrolling in any internship track includes complimentary access to the GenAI & Prompt Engineering workshop - covering LLMs, prompt patterns, and RAG-style workflows."
  },
  {
    q: "What is Reznio and do interns get it?",
    a: "Yes. Right after you enroll in any EdLernity internship, you get complimentary Reznio access - one platform for ATS-ready resumes, interview practice, company research, job tracking, and offer negotiation. Skills from your internship, strategy for your job search."
  },
  {
    q: "Will I get placement or career support?",
    a: "You build portfolio-ready project work, receive mentor feedback, and earn a credential employers recognize. With Reznio included, you also get tools to tailor applications, practice interviews, and track offers - plus our hiring and internship partner network."
  }
];

function InternshipPrograms() {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const [openFaq, setOpenFaq] = useState(0);

  const batchMonth = new Date().toLocaleString("en-US", { month: "long" });
  const seatsLeft = 60;

  const alumniCompanies = [
    { name: "Google", src: "/Image/companies/google.svg" },
    { name: "Microsoft", src: "/Image/companies/microsoft.svg" },
    { name: "Amazon", src: "/Image/companies/amazon.svg" },
    { name: "Meta", src: "/Image/companies/meta.svg" },
    { name: "Apple", src: "/Image/companies/apple.svg" },
    { name: "Netflix", src: "/Image/companies/netflix.svg" },
    { name: "IBM", src: "/Image/companies/ibm.svg" },
    { name: "Accenture", src: "/Image/companies/accenture.svg" },
    { name: "Salesforce", src: "/Image/companies/salesforce.svg" },
    { name: "Adobe", src: "/Image/companies/adobe.svg" },
    { name: "Uber", src: "/Image/companies/uber.svg" },
    { name: "LinkedIn", src: "/Image/companies/linkedin.svg" },
  ];
  const alumniLogoStrip = [...alumniCompanies, ...alumniCompanies];



  // Otherwise, render the grid of all tracks
  return (
    <BaseLayout>
      <SeoHead
        title={PAGE_SEO.careers?.title || "EdLernity Internship Programs"}
        description={PAGE_SEO.careers?.description || "Explore professional remote internship tracks with live classes, e-books, and certifications."}
        path="/internship-programs"
        keywords={PAGE_SEO.careers?.keywords || "internships, AI, Full Stack, machine learning, data science, software testing"}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#ECEFFE] via-[#F4F6FF] to-white pt-10 pb-20 lg:pt-16 lg:pb-28 font-sans">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#181FC5]/5 rounded-full filter blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-pink-500/5 rounded-full filter blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#181FC5]/10 text-[#181FC5] text-xs font-bold uppercase tracking-wider mb-6 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-[#181FC5]"></span>
                Internship Drive {currentYear}
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-none mb-6">
                EdLernity <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#181FC5] to-[#4F46E5]">Internship Program</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-600 font-medium mb-4">
                Live mentor-led internship · Capstone project · ISO-backed certificate
              </p>
              
              <p className="text-base text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-6">
                Build portfolio-ready work with industry mentors, ship a live capstone in your final month, and walk away with government-recognized credentials - plus complimentary GenAI workshop and Reznio job-search access after enrollment.
              </p>
              
              {/* Urgency / demand proof */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 max-w-2xl mx-auto lg:mx-0">
                <div className="relative overflow-hidden rounded-2xl bg-white border border-rose-100 shadow-sm px-4 py-3.5 text-left group hover:-translate-y-0.5 transition-transform sm:col-span-1">
                  <div className="absolute -right-2 -top-2 w-16 h-16 bg-rose-500/10 rounded-full blur-xl group-hover:scale-125 transition-transform" />
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-rose-500 mb-1">
                    <Zap className="w-3.5 h-3.5 animate-pulse" />
                    Batch Starting
                  </div>
                  <p className="text-xl font-extrabold text-slate-900 leading-none">{batchMonth}</p>
                  <p className="mt-1.5 text-xs font-bold text-rose-600">Enrollment closing soon</p>
                </div>

                <div className="relative overflow-hidden rounded-2xl bg-white border border-indigo-100 shadow-sm px-4 py-3.5 text-left group hover:-translate-y-0.5 transition-transform">
                  <div className="absolute -right-2 -top-2 w-16 h-16 bg-[#181FC5]/10 rounded-full blur-xl group-hover:scale-125 transition-transform" />
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#181FC5] mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    Duration
                  </div>
                  <p className="text-xl font-extrabold text-slate-900 leading-none">3 Months</p>
                  <p className="mt-1.5 text-xs font-semibold text-slate-500">Live learning + capstone</p>
                </div>

                <div className="relative overflow-hidden rounded-2xl bg-white border border-amber-100 shadow-sm px-4 py-3.5 text-left group hover:-translate-y-0.5 transition-transform">
                  <div className="absolute -right-2 -top-2 w-16 h-16 bg-amber-400/20 rounded-full blur-xl group-hover:scale-125 transition-transform" />
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-600 mb-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
                    Program Rating
                  </div>
                  <p className="text-xl font-extrabold text-slate-900 leading-none flex items-baseline gap-1">
                    4.8
                    <span className="text-sm font-bold text-amber-500">/ 5</span>
                  </p>
                  <p className="mt-1.5 text-xs font-semibold text-slate-500">Trusted by 10k+ learners</p>
                </div>
              </div>

              {/* Campaign urgency - seats left */}
              <div className="mb-8 max-w-2xl mx-auto lg:mx-0 rounded-2xl border border-rose-200 bg-gradient-to-r from-rose-50 via-white to-indigo-50 px-4 py-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-rose-500 mb-1 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 animate-pulse" />
                      {batchMonth} Internship Drive
                    </p>
                    <p className="text-lg sm:text-xl font-extrabold text-slate-900 leading-none">
                      Only <span className="text-rose-600">{seatsLeft} seats left</span>
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500 text-white text-xs font-bold animate-pulse">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                    </span>
                    Filling fast
                  </span>
                </div>
                <p className="mt-2.5 text-xs text-slate-500 font-medium">
                  Limited seats this drive - enroll now before registration closes.
                </p>
              </div>

              {/* Trust + offer strip */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8">
                <div className="bg-white/80 backdrop-blur border border-slate-100 shadow-sm rounded-xl px-3.5 py-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-semibold text-slate-700">ISO 9001:2015 Certified</span>
                </div>
                <div className="bg-white/80 backdrop-blur border border-slate-100 shadow-sm rounded-xl px-3.5 py-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-semibold text-slate-700">Govt. Registered OPC</span>
                </div>
                <div className="bg-white/80 backdrop-blur border border-slate-100 shadow-sm rounded-xl px-3.5 py-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#181FC5]" />
                  <span className="text-xs font-semibold text-slate-700">GenAI workshop included</span>
                </div>
                <div className="bg-white/80 backdrop-blur border border-emerald-100 shadow-sm rounded-xl px-3.5 py-2 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-semibold text-slate-700">Reznio access after enroll</span>
                </div>
                <div className="bg-[#181FC5]/5 border border-[#181FC5]/15 shadow-sm rounded-xl px-3.5 py-2 flex items-center gap-2">
                  <span className="text-xs font-bold text-[#181FC5]">
                    From <span className="line-through opacity-60 font-semibold">₹25,000</span> ₹5,599
                  </span>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <a
                  href="#tracks"
                  className="w-full sm:w-auto text-center px-8 py-4 text-white font-bold bg-gradient-to-r from-[#181FC5] to-[#4F46E5] rounded-full shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all text-base"
                >
                  Explore Tracks
                </a>
                <a
                  href="#flexible-learning"
                  className="w-full sm:w-auto text-center px-8 py-4 text-[#181FC5] font-bold bg-white border border-[#181FC5]/20 rounded-full shadow-sm hover:bg-[#f0f1ff] hover:scale-[1.02] active:scale-[0.98] transition-all text-base"
                >
                  How Learning Works
                </a>
              </div>
              <p className="mt-3 text-xs text-slate-500 font-medium text-center lg:text-left">
                Limited seats this drive · 3-month program · Project-based certification
              </p>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-5 flex justify-center relative">
              <img
                src="/Image/IMG_8567.PNG"
                alt="EdLernity Internship Drive 2026"
                className="w-full max-w-md lg:max-w-full rounded-3xl"
              />
            </div>

          </div>
        </div>
      </section>

      {/* Flexible learning */}
      <section id="flexible-learning" className="py-16 lg:py-20 bg-white border-y border-slate-100 relative font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-wider mb-4 border border-amber-100">
                Built Around Your Schedule
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
                How Much Time Do You Need Each Week?
              </h2>
              <p className="text-slate-600 leading-relaxed font-medium">
                Whether you want to sprint or steady-pace, EdLernity fits around college, work, and life - without dropping mentor support or cohort structure.
              </p>
            </div>
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 hover:border-[#181FC5]/20 hover:bg-white transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#181FC5]/10 text-[#181FC5] flex items-center justify-center mb-4">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-900 mb-2">Mentor-led live path</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Join live classes, ask doubts in real time, and stay accountable with cohort milestones - ideal if you thrive with structure and guided feedback.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 hover:border-[#181FC5]/20 hover:bg-white transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#181FC5]/10 text-[#181FC5] flex items-center justify-center mb-4">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-900 mb-2">Self-paced with recordings</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Miss a session? Replay recordings, use program notes and e-books, and catch up on your schedule - typically about 6-10 focused hours a week.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Internship Tracks List */}
      <section id="tracks" className="py-20 lg:py-28 bg-slate-50 relative font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-3">
              Professional Programs
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              Choose Your Internship Program
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#181FC5] to-[#4F46E5] mx-auto rounded-full mb-4"></div>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium">
              Total 3 Months / 12 Weeks Internship (Weeks 1-8 core lessons + Weeks 9-12 Live Capstone Project). Live class sessions plus E-book containing program notes and recorded archives included.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {internshipTracks.map((track) => {
              const IconComponent = track.icon;
              return (
                <div
                  key={track.id}
                  onClick={() => navigate(`/internship-programs/${track.slug}`)}
                  className="group bg-white rounded-3xl border border-slate-100 shadow-md hover:shadow-xl hover:border-[#181FC5]/20 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer"
                >
                  {/* Card Banner Image */}
                  <div className="h-48 w-full relative overflow-hidden bg-slate-100 shrink-0">
                    <img 
                      src={track.coverImage} 
                      alt={track.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                    <span className="absolute top-4 right-4 text-[10px] font-bold text-indigo-600 bg-white/95 backdrop-blur px-3 py-1 rounded-full shadow-sm">
                      {track.category}
                    </span>
                  </div>

                  <div className="p-8 flex-grow">
                    {/* Header: Icon & Category */}
                    <div className="flex justify-between items-center mb-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${track.iconColor}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                    </div>

                    {/* Title & Desc */}
                    <h3 className="text-xl font-extrabold text-slate-800 mb-3 group-hover:text-[#181FC5] transition-colors leading-tight">
                      {track.title}
                    </h3>
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed font-medium">
                      {track.desc}
                    </p>

                    {/* Highlights List */}
                    <ul className="space-y-3">
                      {track.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-center gap-2.5 text-xs font-bold text-slate-600">
                          <CheckCircle2 className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="p-8 pt-0 border-t border-slate-50 flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/internship-programs/${track.slug}`);
                      }}
                      className="block w-full py-3 text-white font-bold bg-[#181FC5] hover:bg-[#1418a0] rounded-xl transition-all shadow-md text-sm text-center"
                    >
                      View Details & Curriculum
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bonus GenAI Workshop - below all internship cards */}
          <div className="mt-12 rounded-3xl border border-[#181FC5]/15 bg-gradient-to-r from-[#f0f1ff] via-white to-[#fdf2f8] p-6 sm:p-8 shadow-sm">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-50 text-pink-600 text-xs font-bold uppercase tracking-wider mb-3 border border-pink-100">
                  Special Workshop Access
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#181FC5] mb-3">
                  GenAI & Prompt Engineering Workshop
                </h3>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <div className="inline-flex items-baseline gap-2 rounded-full bg-white border border-pink-100 px-4 py-2 shadow-sm">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Market value</span>
                    <span className="text-lg font-extrabold text-slate-400 line-through decoration-2">₹9,999</span>
                    <span className="text-xl font-extrabold text-emerald-600">FREE</span>
                  </div>
                  <span className="text-xs font-bold text-pink-600 bg-pink-50 border border-pink-100 px-3 py-1.5 rounded-full animate-pulse">
                    Save ₹9,999 with enrollment
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Choose any internship track and get complimentary access to our GenAI & Prompt Engineering
                  workshop - dive into LLMs, prompt patterns, fine-tuning, RAG frameworks, and build customized
                  Generative AI workflows.
                </p>
                <ul className="grid sm:grid-cols-2 gap-2 text-sm font-semibold text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#181FC5] shrink-0" />
                    Included with every internship
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#181FC5] shrink-0" />
                    Live classes + recordings
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#181FC5] shrink-0" />
                    Program notes & e-book
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#181FC5] shrink-0" />
                    LLM, RAG & prompt patterns
                  </li>
                </ul>
              </div>
              <div className="lg:col-span-4 flex justify-center">
                <img
                  src="/Image/genai_prompt_eng_banner.png"
                  alt="GenAI & Prompt Engineering Workshop"
                  className="w-full max-w-xs rounded-2xl shadow-md border border-slate-100 object-cover"
                />
              </div>
            </div>
          </div>

          {/* Bonus Reznio - included after enrollment */}
          <div className="mt-8 rounded-3xl border border-emerald-200/60 bg-gradient-to-r from-emerald-50 via-white to-[#f0f1ff] p-6 sm:p-8 shadow-sm">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-100">
                  Special Platform Access
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
                  Reznio - Your Entire Job Search. One Platform.
                </h3>
                <p className="text-[#181FC5] font-extrabold text-sm uppercase tracking-wide mb-3">
                  You’re qualified. Now strengthen your strategy.
                </p>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <div className="inline-flex items-baseline gap-2 rounded-full bg-white border border-emerald-100 px-4 py-2 shadow-sm">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Market value</span>
                    <span className="text-lg font-extrabold text-slate-400 line-through decoration-2">₹1,499</span>
                    <span className="text-sm font-bold text-slate-400">/mo</span>
                    <span className="text-xl font-extrabold text-emerald-600">FREE</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
                    ~₹4,497 value over 3 months
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Enroll in any EdLernity internship and unlock Reznio right after enrollment - resume tailoring,
                  ATS scoring, mock interviews, company research, job tracking, and salary negotiation in one place.
                </p>
                <ul className="grid sm:grid-cols-2 gap-2 text-sm font-semibold text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    Included with every internship
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ATS-ready resume + match score
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    AI interview practice & research
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    Tracker, portfolio & offer coaching
                  </li>
                </ul>
              </div>
              <div className="lg:col-span-4 flex justify-center items-center">
                <div className="rounded-2xl bg-black px-6 py-8 flex items-center justify-center shadow-md w-full max-w-xs">
                  <img
                    src="/Image/reznio_logo_white.png"
                    alt="Reznio"
                    className="w-full max-w-[180px] h-auto object-contain"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Combined bonus value stack */}
          <div className="mt-6 rounded-2xl border border-[#181FC5]/15 bg-[#181FC5] text-white px-5 py-4 sm:px-7 sm:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-md">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/70 mb-1">Bonus stack with every enrollment</p>
              <p className="text-sm sm:text-base font-semibold leading-snug">
                GenAI workshop + Reznio access - market value{' '}
                <span className="line-through opacity-70">₹14,496</span>{' '}
                <span className="text-emerald-300 font-extrabold">included free</span> when you join at ₹5,599
              </p>
            </div>
            <a
              href="#tracks"
              className="shrink-0 inline-flex justify-center px-5 py-2.5 rounded-full bg-white text-[#181FC5] text-sm font-bold hover:bg-slate-50 transition-colors"
            >
              Claim Both Free
            </a>
          </div>

        </div>
      </section>
      <section className="py-20 lg:py-28 relative bg-slate-50 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#181FC5]/10 text-[#181FC5] text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                Mentorship That Matters
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
                Learn from Industry Experts
              </h2>
              <p className="text-slate-600 leading-relaxed mb-10 text-lg font-medium">
                EdLernity mentors bring real product and engineering experience into every cohort. You learn fundamentals the way teams actually ship - live sessions, project feedback, and a peer environment that keeps you accountable.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-5 border border-slate-100 rounded-2xl bg-white hover:bg-slate-100/50 transition-colors">
                  <div className="w-10 h-10 bg-[#181FC5]/10 text-[#181FC5] rounded-xl flex items-center justify-center mb-4">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-slate-800 mb-2">Live Classes + Recordings</h4>
                  <p className="text-sm text-slate-500">Join interactive sessions and revisit every class anytime from the recording archive.</p>
                </div>

                <div className="p-5 border border-slate-100 rounded-2xl bg-white hover:bg-slate-100/50 transition-colors">
                  <div className="w-10 h-10 bg-[#181FC5]/10 text-[#181FC5] rounded-xl flex items-center justify-center mb-4">
                    <BookOpenCheck className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-slate-800 mb-2">E-Books & Program Notes</h4>
                  <p className="text-sm text-slate-500">Structured notes and guides for every module so revision stays simple and focused.</p>
                </div>

                <div className="p-5 border border-slate-100 rounded-2xl bg-white hover:bg-slate-100/50 transition-colors">
                  <div className="w-10 h-10 bg-[#181FC5]/10 text-[#181FC5] rounded-xl flex items-center justify-center mb-4">
                    <Users className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-slate-800 mb-2">Cohort Mentorship</h4>
                  <p className="text-sm text-slate-500">Weekend reviews and mentor feedback so your projects improve with every iteration.</p>
                </div>

                <div className="p-5 border border-slate-100 rounded-2xl bg-white hover:bg-slate-100/50 transition-colors">
                  <div className="w-10 h-10 bg-[#181FC5]/10 text-[#181FC5] rounded-xl flex items-center justify-center mb-4">
                    <Mail className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-slate-800 mb-2">Dedicated Doubt Support</h4>
                  <p className="text-sm text-slate-500">Ask questions as you learn - get timely guidance so blockers never stall your progress.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center relative bg-white p-6 rounded-3xl border border-slate-100 shadow-md">
              <img
                src="/Image/IMG_8535.PNG"
                alt="Learn from industry experts at EdLernity"
                className="w-full max-w-xs h-auto object-contain hover:scale-105 transition-transform duration-300"
              />
            </div>

          </div>
        </div>
      </section>

      {/* What You'll Get + How certification works */}
      <section className="py-20 lg:py-28 bg-white relative font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-100">
                Outcomes
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
                What You Walk Away With
              </h2>
              <p className="text-slate-600 mb-8 leading-relaxed font-medium">
                More than a line on your resume - an EdLernity internship builds proof of skill employers can trust.
              </p>
              <ul className="space-y-4">
                {[
                  { icon: Award, text: "A digital Certificate of Internship recognized under EdLernity’s ISO-backed quality standards" },
                  { icon: ShieldCheck, text: "Stronger credibility with recruiters through verified, project-backed credentials" },
                  { icon: Briefcase, text: "Clearer pathways to roles in AI, full stack, cloud, Salesforce, and data careers" },
                  { icon: Sparkles, text: "A sharper professional profile backed by live project work and GenAI workshop exposure" },
                  { icon: Briefcase, text: "Complimentary Reznio access after enrollment - resumes, interviews, research & offers in one platform" },
                  { icon: CheckCircle2, text: "Visible proof that you invested in upskilling with a structured, mentor-led cohort" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.text} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#181FC5]/10 text-[#181FC5] flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-4.5 h-4.5 w-4 h-4" />
                      </div>
                      <span className="text-slate-700 font-medium leading-relaxed">{item.text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-[#f0f1ff] via-white to-slate-50 border border-[#181FC5]/10 p-7 sm:p-9 shadow-sm">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#181FC5]/10 text-[#181FC5] text-xs font-bold uppercase tracking-wider mb-4">
                Certification Path
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
                How You Get Certified
              </h3>
              <p className="text-slate-600 leading-relaxed mb-6 font-medium">
                Complete your track modules, deliver your live capstone project, and demonstrate skills through hands-on sessions. Once you meet EdLernity’s practical benchmarks, your internship certificate is issued.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <div className="rounded-2xl bg-white border border-slate-100 px-4 py-4 text-center shadow-sm">
                  <Award className="w-5 h-5 text-[#181FC5] mx-auto mb-2" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Evaluation</p>
                  <p className="text-base font-extrabold text-slate-900">Capstone Project</p>
                </div>
                <div className="rounded-2xl bg-white border border-slate-100 px-4 py-4 text-center shadow-sm">
                  <BookOpenCheck className="w-5 h-5 text-[#181FC5] mx-auto mb-2" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Format</p>
                  <p className="text-base font-extrabold text-slate-900">Hands-on Sessions</p>
                </div>
                <div className="rounded-2xl bg-white border border-slate-100 px-4 py-4 text-center shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto mb-2" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Focus</p>
                  <p className="text-base font-extrabold text-slate-900">Applied Skills</p>
                </div>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                Certification reflects real project delivery and practical performance from live classes, not theory alone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Certification Section */}
      <section className="py-20 lg:py-28 bg-slate-50 relative font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div className="lg:order-2">
              <span className="text-sm font-bold uppercase tracking-wider text-[#181FC5] bg-[#181FC5]/10 px-3 py-1 rounded-full">CREDENTIAL</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 mb-6 leading-tight">
                Government-Approved & Internationally Recognized Certification
              </h2>
              
              <p className="text-slate-600 mb-8 leading-relaxed font-medium">
                Unlock career doors worldwide. Upon successful completion of project work, you get certified under global standardization policies.
              </p>

              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <div className="w-5 h-5 bg-[#181FC5]/10 rounded-full flex items-center justify-center mt-1 text-[#181FC5]">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-slate-600 font-medium">
                    <strong className="text-slate-800">ISO 9001:2015 certified</strong> by QFS Management Systems LLP, guaranteeing absolute academic quality protocols.
                  </p>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-5 h-5 bg-[#181FC5]/10 rounded-full flex items-center justify-center mt-1 text-[#181FC5]">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-slate-600 font-medium">
                    <strong className="text-slate-800">Accredited by SCC</strong> (Standards Council of Canada) for verified corporate credibility.
                  </p>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-5 h-5 bg-[#181FC5]/10 rounded-full flex items-center justify-center mt-1 text-[#181FC5]">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-slate-600 font-medium">
                    <strong className="text-slate-800">Govt. Registered OPC</strong> verification guaranteeing the legitimacy of your completion certificate.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:order-1 flex justify-center relative">
              <img
                src="/Image/MARKETING _20240427_185457_0000.jpg"
                alt="EdLernity Government Approved Certification Mockup"
                className="w-full max-w-2xl object-contain hover:scale-[1.01] transition-transform duration-300"
              />
            </div>

          </div>
        </div>
      </section>

      {/* Alumni companies - scrolling marquee */}
      <section className="py-20 lg:py-24 bg-slate-50 relative overflow-hidden font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#181FC5] text-center mb-4">
            Where Our Alumni Thrive
          </h2>
          <p className="text-gray-600 text-center max-w-xl mx-auto mb-12">
            EdLernity alumni take the skills, projects, and credentials from their internship into roles at leading companies worldwide.
          </p>
        </div>
        <div className="w-full overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />
          <div className="flex animate-marquee-ltr whitespace-nowrap gap-5 py-2 items-stretch">
            {alumniLogoStrip.map((company, index) => (
              <div
                key={`${company.name}-${index}`}
                className="flex-shrink-0 bg-white border border-slate-100 rounded-2xl px-8 py-5 flex items-center justify-center shadow-sm min-h-[88px] min-w-[160px]"
                title={company.name}
              >
                <img
                  src={company.src}
                  alt={`${company.name} logo`}
                  className="h-8 w-auto max-w-[110px] object-contain"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 lg:py-28 bg-white relative font-sans">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider mb-3">
              FAQ
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">
              Questions Before You Enroll
            </h2>
            <p className="text-slate-600 font-medium">
              Straight answers about EdLernity internships, certification, and what to expect in your cohort.
            </p>
          </div>

          <div className="space-y-3">
            {internshipFaqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.q}
                  className={`rounded-2xl border transition-all ${
                    isOpen ? "border-[#181FC5]/25 bg-[#f8f9ff] shadow-sm" : "border-slate-200 bg-white"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="font-bold text-slate-800 text-sm sm:text-base">{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-[#181FC5]" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-gradient-to-br from-[#181FC5] to-[#4F46E5] relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full filter blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full filter blur-3xl pointer-events-none"></div>
        
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 text-white text-xs font-bold uppercase tracking-wider mb-5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
            {batchMonth} Drive · Only {seatsLeft} seats left
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-6 leading-tight">
            Ready to Build Your Career Proof?
          </h2>
          <p className="text-lg sm:text-xl opacity-90 mb-4 max-w-xl mx-auto leading-relaxed">
            Join EdLernity’s next internship cohort - live mentorship, real projects, GenAI workshop + Reznio job-search access, and a credential that stands out.
          </p>
          <p className="text-sm font-semibold text-white/80 mb-10">
            3-month program · Seats filling fast · Enroll before registration closes
          </p>
          <a
            href="https://forms.gle/4JeqCsAveQRqWWq48"
            className="inline-block px-10 py-4 bg-white text-[#181FC5] font-bold text-lg rounded-full shadow-2xl hover:scale-105 hover:bg-slate-50 transition-all"
          >
            Register / Enroll Now
          </a>
        </div>
      </section>
    </BaseLayout>
  );
}

export default InternshipPrograms;
