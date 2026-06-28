import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import React, { useState } from 'react';
import BaseLayout from '../../Layout/BaseLayout';
import SeoHead from '../SEO/SeoHead';
import { PAGE_SEO } from '../../Utils/seoConfig';
import {
  CheckCircle2,
  Calendar,
  BookOpenCheck,
  Users,
  Mail
} from "lucide-react";

function InternShip() {
  const currentYear = new Date().getFullYear();
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const curriculumBD = [
    {
      title: 'Prerequisites',
      description: 'Excellent communication skills, basic understanding of markets, and a proactive learning attitude.'
    },
    {
      title: 'Week 1-2: Corporate Growth & Outreach',
      description: 'Understand core market outreach, construct executive business drafts, and perform strategic lead research.'
    },
    {
      title: 'Week 3-4: CRM & Pipelines',
      description: 'Implement CRM tracking software tools, manage active sales pipeline layers, and evaluate client engagement rates.'
    },
    {
      title: 'Week 5-6: Negotiations & Pitching',
      description: 'Conduct interactive pitching mock calls, outline pricing matrices, and analyze client requirement metrics.'
    },
    {
      title: 'Week 7-8: BD Capstone Project',
      description: 'Build and present a comprehensive corporate growth and strategic market partnership proposal for a live case study.'
    }
  ];

  const curriculumSM = [
    {
      title: 'Prerequisites',
      description: 'Familiarity with digital media platforms, creative copywriting ideas, and basic analytics concepts.'
    },
    {
      title: 'Week 1-2: Marketing Strategy',
      description: 'Define target audience personas, map digital campaign strategies, and analyze competitive landscapes.'
    },
    {
      title: 'Week 3-4: Social & SEO Sprints',
      description: 'Manage SEO keyword mappings, optimize on-page indexing layout metrics, and coordinate social media content calendars.'
    },
    {
      title: 'Week 5-6: Paid Ads & Copywriting',
      description: 'Design interactive visual copywriting copy, outline mock Google/Meta ad strategies, and calculate campaign ROI.'
    },
    {
      title: 'Week 7-8: Marketing Capstone Project',
      description: 'Plan, design, and pitch an end-to-end digital launch campaign roadmap for a premium tech product service.'
    }
  ];

  const curriculumHR = [
    {
      title: 'Prerequisites',
      description: 'Strong interpersonal capabilities, structured organization style, and interest in talent recruitment.'
    },
    {
      title: 'Week 1-2: Recruitment & Sourcing',
      description: 'Draft industry standard job descriptions, review applicant CV databases, and identify target recruitment portals.'
    },
    {
      title: 'Week 3-4: Candidate Screening',
      description: 'Structure vetting scorecards, coordinate mock interview loops, and learn candidate tracking frameworks.'
    },
    {
      title: 'Week 5-6: Employee Relations & Onboarding',
      description: 'Design onboarding checklists, draft corporate policies slides, and learn team engagement analytics.'
    },
    {
      title: 'Week 7-8: HR Capstone Project',
      description: 'Design a complete virtual onboarding and end-to-end talent acquisition roadmap program layout.'
    }
  ];

  const curriculumTech = [
    {
      title: 'Prerequisites',
      description: 'Basic coding experience in JavaScript, Python, or Web Development. (Preferred for technical candidates)'
    },
    {
      title: 'Month 1 (Week 1-4): Agile Git & Frontend UI',
      description: 'Master Git workflows, repository branch settings, and construct modular layout components using modern CSS/JS.'
    },
    {
      title: 'Month 2 (Week 5-8): Backend APIs & SQL/NoSQL Databases',
      description: 'Set up Express/FastAPI server routes, write clean query interfaces, and model database relationships.'
    },
    {
      title: 'Month 3 (Project Phase): Live Production Launch',
      description: 'Dedicate the entire last month to designing, building, testing, and deploying a scalable, real-world tech application.'
    }
  ];

  const mergedContentArray = [curriculumBD, curriculumSM, curriculumHR, curriculumTech];
  const trackTitles = [
    "Business Development Internship",
    "Sales and Marketing Internship",
    "Human Resources Internship",
    "Technical Internship"
  ];

  const handleOpen = (idx) => {
    setIndex(idx);
    setOpen(!open);
  };

  const options = [
    { value: 'https://forms.gle/4JeqCsAveQRqWWq48', label: 'Business Development | 2 Months' },
    { value: 'https://forms.gle/4JeqCsAveQRqWWq48', label: 'Sales & Marketing | 2 Months' },
    { value: 'https://forms.gle/4JeqCsAveQRqWWq48', label: 'Human Resources | 2 Months' },
    { value: 'https://forms.gle/4JeqCsAveQRqWWq48', label: 'Technical Internship | 3 Months' },
  ];

  return (
    <BaseLayout>
      <SeoHead
        title={PAGE_SEO.careers?.title || "Careers & Internships - EdLernity"}
        description={PAGE_SEO.careers?.description || "Explore and apply for remote internships in Business, Marketing, HR, and Tech."}
        path="/internship"
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#ECEFFE] via-[#F4F6FF] to-white pt-10 pb-20 lg:pt-16 lg:pb-28 font-sans">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#181FC5]/5 rounded-full filter blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-pink-500/5 rounded-full filter blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column (Content) */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#181FC5]/10 text-[#181FC5] text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-[#181FC5]"></span>
                Internship Cohort {currentYear}
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-none mb-6">
                EdLernity <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#181FC5] to-[#4F46E5]">Internship Tracks</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-600 font-medium mb-4">
                The Ultimate Launchpad towards your Career Goals.
              </p>
              
              <p className="text-base text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8">
                Gain hands-on corporate experience, construct complex projects, and receive professional mentorship along with government-recognized certifications.
              </p>
              
              {/* Stats/Badges */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
                <div className="bg-white/80 backdrop-blur border border-slate-100 shadow-sm rounded-xl px-4 py-2.5 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-semibold text-slate-700">ISO 9001:2015 Certified</span>
                </div>
                <div className="bg-white/80 backdrop-blur border border-slate-100 shadow-sm rounded-xl px-4 py-2.5 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-semibold text-slate-700">Government Approved</span>
                </div>
                <div className="bg-white/80 backdrop-blur border border-slate-100 shadow-sm rounded-xl px-4 py-2.5 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#181FC5]" />
                  <span className="text-sm font-semibold text-slate-700">100% Remote / Flexible</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <a
                  href="https://forms.gle/4JeqCsAveQRqWWq48"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto text-center px-8 py-4 text-white font-bold bg-gradient-to-r from-[#181FC5] to-[#4F46E5] rounded-full shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all text-base"
                >
                  Apply Directly
                </a>
                <a
                  href="#tracks"
                  className="w-full sm:w-auto text-center px-8 py-4 text-slate-700 font-semibold bg-white border border-slate-200 rounded-full hover:bg-slate-50 hover:text-[#181FC5] transition-all text-base shadow-sm"
                >
                  Explore Tracks
                </a>
              </div>
            </div>

            {/* Right Column (Premium 3D Image Representation) */}
            <div className="lg:col-span-5 flex justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#181FC5]/10 to-pink-500/10 rounded-3xl filter blur-2xl transform rotate-6 pointer-events-none"></div>
              <div className="relative bg-white/40 backdrop-blur border border-white/40 p-4 sm:p-6 rounded-3xl shadow-2xl overflow-hidden hover:scale-[1.01] transition-transform duration-300">
                <img
                  src="/Image/internship_hero_2026.png"
                  alt="EdLernity Internship Drive 2026"
                  className="w-full max-w-md lg:max-w-full rounded-2xl drop-shadow-[0_15px_30px_rgba(24,31,197,0.12)]"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Internship Cards */}
      <section id="tracks" className="py-20 lg:py-28 bg-slate-50 relative font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              Choose Your Internship Track
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#181FC5] to-[#4F46E5] mx-auto rounded-full mb-4"></div>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium">
              Select the professional track that aligns with your domain interests and career trajectory.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Track 1: Business Development */}
            <div className="group bg-white rounded-3xl border border-slate-100 shadow-md hover:shadow-xl hover:border-[#181FC5]/20 transition-all duration-300 overflow-hidden flex flex-col justify-between">
              <div>
                <div className="relative h-44 overflow-hidden">
                  <img
                    src="/Image/business_dev_card.png"
                    alt="Business Development"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-amber-500 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full tracking-wide">
                    2 Months
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-[#181FC5] transition-colors leading-snug">
                    Business Development
                  </h3>
                  <p className="text-slate-500 text-sm mb-6 leading-relaxed font-medium">
                    Drive strategic partnerships, lead corporate outreach campaigns, compile market analysis, and architect client relationship strategies.
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-50 flex flex-col gap-2">
                <a
                  href="https://forms.gle/4JeqCsAveQRqWWq48"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-2.5 text-white text-sm font-bold bg-[#181FC5] hover:bg-[#1418a0] rounded-xl transition-all"
                >
                  Apply now
                </a>
                <Button
                  onClick={() => handleOpen(0)}
                  className="block w-full text-center py-2.5 text-[#181FC5] font-bold bg-[#181FC5]/5 rounded-xl hover:bg-[#181FC5]/10 shadow-none hover:shadow-none transition-all normal-case text-xs"
                >
                  View Details & Curriculum
                </Button>
              </div>
            </div>

            {/* Track 2: Sales & Marketing */}
            <div className="group bg-white rounded-3xl border border-slate-100 shadow-md hover:shadow-xl hover:border-[#181FC5]/20 transition-all duration-300 overflow-hidden flex flex-col justify-between">
              <div>
                <div className="relative h-44 overflow-hidden">
                  <img
                    src="/Image/sales_marketing_card.png"
                    alt="Sales and Marketing"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-amber-500 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full tracking-wide">
                    2 Months
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-[#181FC5] transition-colors leading-snug">
                    Sales & Marketing
                  </h3>
                  <p className="text-slate-500 text-sm mb-6 leading-relaxed font-medium">
                    Plan social outreach, curate campaign visuals, analyze marketing analytics dashboards, and assist in business growth lead conversion.
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-50 flex flex-col gap-2">
                <a
                  href="https://forms.gle/4JeqCsAveQRqWWq48"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-2.5 text-white text-sm font-bold bg-[#181FC5] hover:bg-[#1418a0] rounded-xl transition-all"
                >
                  Apply now
                </a>
                <Button
                  onClick={() => handleOpen(1)}
                  className="block w-full text-center py-2.5 text-[#181FC5] font-bold bg-[#181FC5]/5 rounded-xl hover:bg-[#181FC5]/10 shadow-none hover:shadow-none transition-all normal-case text-xs"
                >
                  View Details & Curriculum
                </Button>
              </div>
            </div>

            {/* Track 3: Human Resources */}
            <div className="group bg-white rounded-3xl border border-slate-100 shadow-md hover:shadow-xl hover:border-[#181FC5]/20 transition-all duration-300 overflow-hidden flex flex-col justify-between">
              <div>
                <div className="relative h-44 overflow-hidden">
                  <img
                    src="/Image/hr_internship_card.png"
                    alt="Human Resources"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-amber-500 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full tracking-wide">
                    2 Months
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-[#181FC5] transition-colors leading-snug">
                    Human Resources
                  </h3>
                  <p className="text-slate-500 text-sm mb-6 leading-relaxed font-medium">
                    Coordinate talent recruitment drives, screen candidate applications, structure onboarding frameworks, and drive employee relations.
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-50 flex flex-col gap-2">
                <a
                  href="https://forms.gle/4JeqCsAveQRqWWq48"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-2.5 text-white text-sm font-bold bg-[#181FC5] hover:bg-[#1418a0] rounded-xl transition-all"
                >
                  Apply now
                </a>
                <Button
                  onClick={() => handleOpen(2)}
                  className="block w-full text-center py-2.5 text-[#181FC5] font-bold bg-[#181FC5]/5 rounded-xl hover:bg-[#181FC5]/10 shadow-none hover:shadow-none transition-all normal-case text-xs"
                >
                  View Details & Curriculum
                </Button>
              </div>
            </div>

            {/* Track 4: Technical Internship */}
            <div className="group bg-white rounded-3xl border border-slate-100 shadow-md hover:shadow-xl hover:border-[#181FC5]/20 transition-all duration-300 overflow-hidden flex flex-col justify-between">
              <div>
                <div className="relative h-44 overflow-hidden">
                  <img
                    src="/Image/IMG_8470.PNG"
                    alt="Technical Internship"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-pink-500 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-full tracking-wide shadow-md">
                    3 Months
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-[#181FC5] transition-colors leading-snug">
                    Technical Internship
                  </h3>
                  <p className="text-slate-500 text-sm mb-6 leading-relaxed font-medium">
                    Develop full-scale web/app components, design responsive interfaces, and model database architectures. (Technical candidates preferred for hiring).
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-50 flex flex-col gap-2">
                <a
                  href="https://forms.gle/4JeqCsAveQRqWWq48"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-2.5 text-white text-sm font-bold bg-[#181FC5] hover:bg-[#1418a0] rounded-xl transition-all"
                >
                  Apply now
                </a>
                <Button
                  onClick={() => handleOpen(3)}
                  className="block w-full text-center py-2.5 text-[#181FC5] font-bold bg-[#181FC5]/5 rounded-xl hover:bg-[#181FC5]/10 shadow-none hover:shadow-none transition-all normal-case text-xs"
                >
                  View Details & Curriculum
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Program Highlights */}
      <section className="py-20 lg:py-28 relative bg-white font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-6">
                Program Highlights
              </h2>
              <p className="text-slate-600 leading-relaxed mb-10 text-lg font-medium">
                Unlock core internship modules, attend interactive mentor calls, and collaborate in peer workspace groups. Benefit from a 3-month setup for tech roles, with Month 3 dedicated to projects.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-5 border border-slate-100 rounded-2xl bg-slate-50 hover:bg-slate-100/50 transition-colors">
                  <div className="w-10 h-10 bg-[#181FC5]/10 text-[#181FC5] rounded-xl flex items-center justify-center mb-4">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-slate-800 mb-2">Live Class Support</h4>
                  <p className="text-sm text-slate-500">Live instruction coupled with recording archives for ease of learning.</p>
                </div>

                <div className="p-5 border border-slate-100 rounded-2xl bg-slate-50 hover:bg-slate-100/50 transition-colors">
                  <div className="w-10 h-10 bg-[#181FC5]/10 text-[#181FC5] rounded-xl flex items-center justify-center mb-4">
                    <BookOpenCheck className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-slate-800 mb-2">E-Books & Detailed Notes</h4>
                  <p className="text-sm text-slate-500">Includes comprehensive reading notes and guides for every program.</p>
                </div>

                <div className="p-5 border border-slate-100 rounded-2xl bg-slate-50 hover:bg-slate-100/50 transition-colors">
                  <div className="w-10 h-10 bg-[#181FC5]/10 text-[#181FC5] rounded-xl flex items-center justify-center mb-4">
                    <Users className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-slate-800 mb-2">Weekend Mentorship</h4>
                  <p className="text-sm text-slate-500">Live code reviews and feedback sessions with senior engineers.</p>
                </div>

                <div className="p-5 border border-slate-100 rounded-2xl bg-slate-50 hover:bg-slate-100/50 transition-colors">
                  <div className="w-10 h-10 bg-[#181FC5]/10 text-[#181FC5] rounded-xl flex items-center justify-center mb-4">
                    <Mail className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-slate-800 mb-2">Dedicated Q&A Support</h4>
                  <p className="text-sm text-slate-500">Immediate troubleshooting and guidance for coursework.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 to-[#181FC5]/10 rounded-3xl filter blur-xl transform -rotate-3 pointer-events-none"></div>
              <img
                src="/Image/online-learning-concept.svg"
                alt="Program highlights"
                className="w-full max-w-md lg:max-w-lg rounded-2xl relative hover:scale-[1.01] transition-transform duration-300"
              />
            </div>

          </div>
        </div>
      </section>

      {/* Certification */}
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
              <div className="absolute inset-0 bg-indigo-500/5 rounded-3xl filter blur-3xl transform pointer-events-none"></div>
              <div className="bg-white p-4 rounded-3xl shadow-xl border border-slate-100 hover:scale-[1.01] transition-transform duration-300">
                <img
                  src="/Image/MARKETING _20240427_185457_0000.jpg"
                  alt="EdLernity Government Approved Certification Mockup"
                  className="w-full max-w-md rounded-2xl"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Curriculum Modal Dialog */}
      <Dialog
        open={open}
        handler={() => setOpen(false)}
        className="max-w-xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100"
      >
        <DialogHeader className="px-8 pt-8 pb-4 flex flex-col items-start font-sans">
          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block mb-1">
            Program Curriculum
          </span>
          <h3 className="text-2xl font-extrabold text-slate-900 leading-tight">
            {trackTitles[index]}
          </h3>
        </DialogHeader>
        <DialogBody divider className="px-8 py-6 max-h-[60vh] overflow-y-auto font-sans">
          <div className="space-y-5">
            {mergedContentArray[index]?.map((module, idx) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                <h4 className="text-sm font-extrabold text-indigo-600 uppercase tracking-wider mb-1">
                  {module.title}
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed font-medium whitespace-pre-line">
                  {module.description}
                </p>
              </div>
            ))}
          </div>
        </DialogBody>
        <DialogFooter className="px-8 py-4 bg-slate-50 border-t border-slate-100 gap-3 font-sans">
          <button
            onClick={() => setOpen(false)}
            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
          <a
            href="https://forms.gle/4JeqCsAveQRqWWq48"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-2.5 bg-[#181FC5] text-white text-sm font-bold rounded-xl hover:bg-[#1418a0] transition-colors"
          >
            Enroll Now
          </a>
        </DialogFooter>
      </Dialog>
    </BaseLayout>
  );
}

export default InternShip;
