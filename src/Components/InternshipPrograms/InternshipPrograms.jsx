import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Brain,
  Code,
  Cpu,
  Database,
  Terminal,
  Shield,
  CheckSquare,
  Cloud,
  Globe,
  BarChart2,
  Briefcase,
  Calendar,
  BookOpenCheck,
  CheckCircle2,
  Users,
  Mail,
  ArrowLeft
} from "lucide-react";
import BaseLayout from '../../Layout/BaseLayout';
import SeoHead from '../SEO/SeoHead';
import { PAGE_SEO } from '../../Utils/seoConfig';

const internshipTracks = [
  {
    id: 1,
    title: "Artificial Intelligence, Machine Learning & Generative AI",
    category: "AI & Machine Learning",
    icon: Brain,
    iconColor: "text-purple-600 bg-purple-50 border-purple-100",
    desc: "Master neural networks, predictive modeling, LLMs, Prompt Engineering, and deploy real-world custom AI/ML agents.",
    highlights: ["Live classes + Recordings", "All program notes & recordings", "E-Book included"],
    formUrl: "https://forms.gle/4JeqCsAveQRqWWq48",
    coverImage: "/Image/ai_ml_generative_banner.png",
    curriculum: [
      { week: "Month 1 (Week 1-4)", topic: "Machine Learning Foundations, Algorithms & Neural Networks" },
      { week: "Month 2 (Week 5-8)", topic: "LLMs, Prompt Engineering, NLP & RAG Integration" },
      { week: "Month 3 (Project Phase)", topic: "Live Capstone Project: Deploying custom neural predictive pipelines and agent services in production" }
    ],
    tools: ["Python", "TensorFlow/PyTorch", "Scikit-Learn", "HuggingFace", "LangChain", "OpenAI API"]
  },
  {
    id: 2,
    title: "Full Stack MERN/MEAN with AI",
    category: "Full Stack Tech",
    icon: Code,
    iconColor: "text-blue-600 bg-blue-50 border-blue-100",
    desc: "Build highly responsive web applications using React, Node, Express, MongoDB and integrate AI models.",
    highlights: ["Live classes + Recordings", "All program notes & recordings", "E-Book included"],
    formUrl: "https://forms.gle/4JeqCsAveQRqWWq48",
    coverImage: "/Image/full_stack_dev_banner.png",
    curriculum: [
      { week: "Month 1 (Week 1-4)", topic: "Frontend React.js/Angular & Responsive UI Layouts" },
      { week: "Month 2 (Week 5-8)", topic: "Backend Node.js/Express Services & MongoDB SQL Database" },
      { week: "Month 3 (Project Phase)", topic: "Live Capstone Project: Constructing and launching a full-scale AI-powered web app" }
    ],
    tools: ["React", "Node.js", "Express", "MongoDB", "GitHub"]
  },
  {
    id: 4,
    title: "Data Analytics & AI",
    category: "Data & Analytics",
    icon: Database,
    iconColor: "text-emerald-600 bg-emerald-50 border-emerald-100",
    desc: "Clean large datasets, build analytical pipelines, and utilize AI libraries to extract deep insights.",
    highlights: ["Live classes + Recordings", "All program notes & recordings", "E-Book included"],
    formUrl: "https://forms.gle/4JeqCsAveQRqWWq48",
    coverImage: "/Image/data_analytics_ai_banner.png",
    curriculum: [
      { week: "Month 1 (Week 1-4)", topic: "SQL database management, analytics queries & reporting" },
      { week: "Month 2 (Week 5-8)", topic: "Python data processing, Pandas charts & dashboard metrics" },
      { week: "Month 3 (Project Phase)", topic: "Live Capstone Project: Constructing complex AI-based predictive BI model dashboards" }
    ],
    tools: ["SQL", "Python", "Power BI", "Pandas", "Matplotlib"]
  },
  {
    id: 5,
    title: "Python Developer with AI",
    category: "Tech Development",
    icon: Terminal,
    iconColor: "text-amber-600 bg-amber-50 border-amber-100",
    desc: "Write modular Python script templates, scrape web databases, and build backend AI automations.",
    highlights: ["Live classes + Recordings", "All program notes & recordings", "E-Book included"],
    formUrl: "https://forms.gle/4JeqCsAveQRqWWq48",
    coverImage: "/Image/python_developer_ai_banner.png",
    curriculum: [
      { week: "Month 1 (Week 1-4)", topic: "Python scripts programming & OOP architectures" },
      { week: "Month 2 (Week 5-8)", topic: "Web scraping systems, Django/FastAPI backend servers" },
      { week: "Month 3 (Project Phase)", topic: "Live Capstone Project: Developing and hosting automated Python scripting and AI services" }
    ],
    tools: ["Python", "FastAPI", "Django", "BeautifulSoup", "Git"]
  },
  {
    id: 7,
    title: "Software Testing & QA",
    category: "Quality Assurance",
    icon: CheckSquare,
    iconColor: "text-teal-600 bg-teal-50 border-teal-100",
    desc: "Execute selenium script automation, write comprehensive test suites, and debug modular apps.",
    highlights: ["Live classes + Recordings", "All program notes & recordings", "E-Book included"],
    formUrl: "https://forms.gle/4JeqCsAveQRqWWq48",
    coverImage: "/Image/Secure data-bro.svg",
    curriculum: [
      { week: "Month 1 (Week 1-4)", topic: "Manual testing methods, test suites & cases design" },
      { week: "Month 2 (Week 5-8)", topic: "Selenium browser script automation & Postman API testing" },
      { week: "Month 3 (Project Phase)", topic: "Live Capstone Project: Constructing automated test suites and CI/CD pipelines" }
    ],
    tools: ["Selenium", "JavaScript", "Postman", "JUnit/TestNG", "JMeter"]
  },
  {
    id: 8,
    title: "Cloud Computing & DevOps",
    category: "Infrastructure",
    icon: Cloud,
    iconColor: "text-sky-600 bg-sky-50 border-sky-100",
    desc: "Understand AWS/Azure operations, docker container deployment, and building automated CI/CD pipelines.",
    highlights: ["Live classes + Recordings", "All program notes & recordings", "E-Book included"],
    formUrl: "https://forms.gle/4JeqCsAveQRqWWq48",
    coverImage: "/Image/cloud_devops_banner.png",
    curriculum: [
      { week: "Month 1 (Week 1-4)", topic: "AWS/Azure cloud resources configuration & networking" },
      { week: "Month 2 (Week 5-8)", topic: "Docker containers, Kubernetes, & Jenkins CI/CD automation" },
      { week: "Month 3 (Project Phase)", topic: "Live Capstone Project: Architecting automated auto-scaling cloud cluster environments" }
    ],
    tools: ["AWS", "Docker", "Kubernetes", "Jenkins", "Terraform"]
  },
  {
    id: 9,
    title: "Full Stack Web Development",
    category: "Full Stack Tech",
    icon: Globe,
    iconColor: "text-violet-600 bg-violet-50 border-violet-100",
    desc: "Master frontend layout structures, relational databases, web hosting, and complete project architecture.",
    highlights: ["Live classes + Recordings", "All program notes & recordings", "E-Book included"],
    formUrl: "https://forms.gle/4JeqCsAveQRqWWq48",
    coverImage: "/Image/full_stack_web_dev_banner.png",
    curriculum: [
      { week: "Month 1 (Week 1-4)", topic: "Advanced HTML5, Tailwind layout styles & React.js frontend" },
      { week: "Month 2 (Week 5-8)", topic: "Express.js backend services, routing & SQL/NoSQL databases" },
      { week: "Month 3 (Project Phase)", topic: "Live Capstone Project: Launching a production-ready responsive corporate web portal" }
    ],
    tools: ["React", "HTML5/CSS3", "JavaScript", "SQL/NoSQL", "Vercel"]
  },
  {
    id: 10,
    title: "Power BI & Business Analytics",
    category: "Data & Analytics",
    icon: BarChart2,
    iconColor: "text-orange-600 bg-orange-50 border-orange-100",
    desc: "Construct highly interactive dashboard metrics, custom DAX query scripts, and model business data.",
    highlights: ["Live classes + Recordings", "All program notes & recordings", "E-Book included"],
    formUrl: "https://forms.gle/4JeqCsAveQRqWWq48",
    coverImage: "/Image/power_bi_analytics_banner.png",
    curriculum: [
      { week: "Month 1 (Week 1-4)", topic: "Data cleaning, business query structures & modeling in Excel" },
      { week: "Month 2 (Week 5-8)", topic: "Dax calculations, metrics design & dashboard dashboards" },
      { week: "Month 3 (Project Phase)", topic: "Live Capstone Project: Deploying complete corporate business insights reporting model" }
    ],
    tools: ["Power BI", "Excel", "DAX", "SQL", "Tableau"]
  },
  {
    id: 11,
    title: "Project Management Certification Program",
    category: "Management",
    icon: Briefcase,
    iconColor: "text-rose-600 bg-rose-50 border-rose-100",
    desc: "Learn agile development sprints, client requirement tracking, and certified project lifecycle planning.",
    highlights: ["Live classes + Recordings", "All program notes & recordings", "E-Book included"],
    formUrl: "https://forms.gle/4JeqCsAveQRqWWq48",
    coverImage: "/Image/project_management_banner.png",
    curriculum: [
      { week: "Month 1 (Week 1-4)", topic: "Agile & Scrum frameworks, scheduling & lifecycle stages" },
      { week: "Month 2 (Week 5-8)", topic: "Cost budgeting, risk assessment, quality audits & planning" },
      { week: "Month 3 (Project Phase)", topic: "Live Capstone Project: Coordinating team sprints and product delivery roadmap simulation" }
    ],
    tools: ["Jira", "Trello", "MS Project", "Asana", "Miro"]
  }
];

function InternshipPrograms() {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const [selectedTrack, setSelectedTrack] = useState(null);

  // If a track is selected, render the dedicated inline details view
  if (selectedTrack) {
    const IconComponent = selectedTrack.icon;
    return (
      <BaseLayout>
        <SeoHead
          title={`${selectedTrack.title} - EdLernity Internship`}
          description={selectedTrack.desc}
          path={`/internship-programs/${selectedTrack.id}`}
        />

        {/* Back navigation bar */}
        <div className="bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => setSelectedTrack(null)}
              className="inline-flex items-center gap-2 text-slate-600 hover:text-[#181FC5] text-sm font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Internship Programs
            </button>
          </div>
        </div>

        {/* Detailed Program view */}
        <section className="bg-white py-12 lg:py-16 font-sans">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Left Column: Detail Info & Curriculum */}
              <div className="lg:col-span-8 space-y-8">
                <div>
                  <span className="inline-block px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-4">
                    {selectedTrack.category}
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
                    {selectedTrack.title}
                  </h1>
                  <p className="text-slate-600 text-base leading-relaxed font-medium">
                    {selectedTrack.desc}
                  </p>
                </div>

                {/* Cover Image inside details */}
                <div className="rounded-3xl overflow-hidden border border-slate-100 shadow-md">
                  <img
                    src={selectedTrack.coverImage}
                    alt={selectedTrack.title}
                    className="w-full h-auto max-h-[350px] object-cover"
                  />
                </div>

                {/* Key Tools Learned */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                    Key Tools & Technologies Learned
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {selectedTrack.tools.map((tool) => (
                      <span
                        key={tool}
                        className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Curriculum roadmap */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 mb-6">
                    Curriculum Syllabus Roadmap (Total 3 Months)
                  </h2>
                  <p className="text-slate-500 text-sm mb-4 font-semibold">
                    Note: The first 2 months focus on advanced core lessons. The final 3rd month is dedicated entirely to comprehensive Live Capstone Project execution.
                  </p>
                  <div className="space-y-4">
                    {selectedTrack.curriculum.map((step) => (
                      <div
                        key={step.week}
                        className="flex gap-4 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold rounded-xl self-start shrink-0">
                          {step.week}
                        </div>
                        <div>
                          <h4 className="text-base font-extrabold text-slate-800 leading-tight">
                            {step.topic}
                          </h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Enrollment Card */}
              <div className="lg:col-span-4 lg:sticky lg:top-8 bg-slate-50 rounded-3xl border border-slate-200/60 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${selectedTrack.iconColor}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Program Track</span>
                    <span className="text-sm font-extrabold text-slate-800 leading-none">{selectedTrack.category}</span>
                  </div>
                </div>

                <h3 className="text-lg font-extrabold text-slate-900 mb-4">
                  Internship Inclusions
                </h3>

                <ul className="space-y-3.5 mb-8">
                  {selectedTrack.highlights.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                      <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                  <li className="flex items-center gap-3 text-sm font-bold text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" />
                    <span className="text-indigo-600 font-extrabold">Final Month Project Phase</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm font-bold text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>ISO 9001:2015 Certified Certificate</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm font-bold text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>Govt. OPC Approved Credentials</span>
                  </li>
                </ul>

                <a
                  href={selectedTrack.formUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-4 text-center text-white font-bold bg-[#181FC5] hover:bg-[#1418a0] rounded-2xl transition-all shadow-lg text-base"
                >
                  Enroll Now
                </a>
              </div>

            </div>
          </div>
        </section>
      </BaseLayout>
    );
  }

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
                Total 3 Months Internship (2 Months Learning + Last Month Dedicated Project Work)
              </p>
              
              <p className="text-base text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8">
                Gain hands-on corporate training, construct complex full-scale projects in the final month, and receive professional mentorship along with government-recognized certifications. 
              </p>
              
              {/* Badges */}
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
                  <span className="text-sm font-semibold text-slate-700">3rd Month Project Focus</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <a
                  href="#tracks"
                  className="w-full sm:w-auto text-center px-8 py-4 text-white font-bold bg-gradient-to-r from-[#181FC5] to-[#4F46E5] rounded-full shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all text-base"
                >
                  Explore Tracks
                </a>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-5 flex justify-center relative">
              <img
                src="/Image/IMG_8469.PNG"
                alt="EdLernity Internship Drive 2026"
                className="w-full max-w-md lg:max-w-full rounded-3xl"
              />
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
              Total 3 Months Internship (Month 1 & 2 Learning curriculum + Month 3 Live Capstone Project work). Live class sessions plus E-book containing program notes and recorded archives included.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {internshipTracks.map((track) => {
              const IconComponent = track.icon;
              return (
                <div
                  key={track.id}
                  onClick={() => setSelectedTrack(track)}
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
                        setSelectedTrack(track);
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

        </div>
      </section>

      {/* Program Highlights */}
      <section className="py-20 lg:py-28 relative bg-slate-50 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-6">
                Program Highlights
              </h2>
              <p className="text-slate-600 leading-relaxed mb-10 text-lg font-medium">
                Unlock core internship modules, attend interactive mentor calls, and collaborate in peer workspace groups. Benefit from a 3-month setup with Month 3 dedicated to projects.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-5 border border-slate-100 rounded-2xl bg-white hover:bg-slate-100/50 transition-colors">
                  <div className="w-10 h-10 bg-[#181FC5]/10 text-[#181FC5] rounded-xl flex items-center justify-center mb-4">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-slate-800 mb-2">Live Classes + Recordings</h4>
                  <p className="text-sm text-slate-500">Live instruction coupled with recording archives for ease of learning.</p>
                </div>

                <div className="p-5 border border-slate-100 rounded-2xl bg-white hover:bg-slate-100/50 transition-colors">
                  <div className="w-10 h-10 bg-[#181FC5]/10 text-[#181FC5] rounded-xl flex items-center justify-center mb-4">
                    <BookOpenCheck className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-slate-800 mb-2">E-Books & Detailed Notes</h4>
                  <p className="text-sm text-slate-500">Includes comprehensive reading notes and guides for every program.</p>
                </div>

                <div className="p-5 border border-slate-100 rounded-2xl bg-white hover:bg-slate-100/50 transition-colors">
                  <div className="w-10 h-10 bg-[#181FC5]/10 text-[#181FC5] rounded-xl flex items-center justify-center mb-4">
                    <Users className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-slate-800 mb-2">Weekend Mentorship</h4>
                  <p className="text-sm text-slate-500">Live code reviews and feedback sessions with senior engineers.</p>
                </div>

                <div className="p-5 border border-slate-100 rounded-2xl bg-white hover:bg-slate-100/50 transition-colors">
                  <div className="w-10 h-10 bg-[#181FC5]/10 text-[#181FC5] rounded-xl flex items-center justify-center mb-4">
                    <Mail className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-slate-800 mb-2">Dedicated Q&A Support</h4>
                  <p className="text-sm text-slate-500">Immediate troubleshooting and guidance for coursework queries.</p>
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

      {/* Certification Section */}
      <section className="py-20 lg:py-28 bg-white relative font-sans">
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

      {/* Corporate Placements */}
      <section className="py-20 lg:py-24 bg-slate-50 relative overflow-hidden font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 text-center mb-16">
            Our Interns Now Work At
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-85">
            <div className="group bg-white border border-slate-100 rounded-2xl px-6 py-5 w-full flex items-center justify-center hover:bg-slate-100/50 hover:-translate-y-0.5 transition-all cursor-pointer shadow-sm min-h-[80px]">
              <svg viewBox="0 0 24 24" className="h-7 w-auto fill-current text-slate-400 group-hover:text-[#4285F4] transition-colors duration-300">
                <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.137 4.114-3.707 0-6.71-3.003-6.71-6.71s3.003-6.71 6.71-6.71c1.7 0 3.24.63 4.4 1.67l3.03-3.03C18.44 1.83 15.56 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.26 0 11.24-4.98 11.24-11.24 0-.79-.08-1.53-.24-2.24H12.24z"/>
              </svg>
            </div>
            <div className="group bg-white border border-slate-100 rounded-2xl px-6 py-5 w-full flex items-center justify-center hover:bg-slate-100/50 hover:-translate-y-0.5 transition-all cursor-pointer shadow-sm min-h-[80px]">
              <svg viewBox="0 0 23 23" className="h-6 w-auto fill-current text-slate-400 group-hover:text-[#00A4EF] transition-colors duration-300">
                <path d="M0 0h11v11H0zM12 0h11v11H12zM0 12h11v11H0zM12 12h11v11H12z" />
              </svg>
            </div>
            <div className="group bg-white border border-slate-100 rounded-2xl px-6 py-5 w-full flex items-center justify-center hover:bg-slate-100/50 hover:-translate-y-0.5 transition-all cursor-pointer shadow-sm min-h-[80px]">
              <svg viewBox="0 0 24 24" className="h-6 w-auto fill-current text-slate-400 group-hover:text-[#FF9900] transition-colors duration-300">
                <path d="M15.93 17.09c-.75-.54-1.63-.78-2.61-.78-1.4 0-2.31.62-2.31 1.67 0 1.05.91 1.57 2.27 1.57.94 0 1.76-.25 2.37-.73v-1.73zm1.66 3.99c-.75.64-1.8 1-3.08 1-2.9 0-4.66-1.42-4.66-3.83 0-2.31 1.75-3.69 4.88-3.69.96 0 1.94.13 2.86.38v-.5c0-1.25-.66-1.92-2.14-1.92-1.14 0-2.28.38-3.03.96-.26.2-.56-.05-.41-.33l.63-1.07c.2-.34.52-.51.87-.66A7.95 7.95 0 0 1 15.35 8c3.28 0 4.9 1.7 4.9 4.87v6.62c0 .88.35 1.34.7 1.67.26.24.16.58-.2.53-.41-.05-1.95-.3-2.69-.97l-.47-.64zm4.19.82C18.23 23.96 13.57 25 9.13 25c-3.9 0-7.55-1.08-10.45-3.02-.38-.25-.09-.73.34-.47 2.87 1.7 6.42 2.58 9.98 2.58 2.28 0 4.58-.37 6.64-1.12.35-.13.62.19.48.51z"/>
              </svg>
            </div>
            <div className="group bg-white border border-slate-100 rounded-2xl px-6 py-5 w-full flex items-center justify-center hover:bg-slate-100/50 hover:-translate-y-0.5 transition-all cursor-pointer shadow-sm min-h-[80px]">
              <svg viewBox="0 0 24 24" className="h-6 w-auto fill-current text-slate-400 group-hover:text-[#0668E1] transition-colors duration-300">
                <path d="M3.12 14.88c-1.44-1.44-1.44-3.84 0-5.28 1.44-1.44 3.84-1.44 5.28 0l1.2 1.2-1.2 1.2-1.2-1.2c-.72-.72-1.92-.72-2.64 0-.72.72-.72 1.92 0 2.64.72.72 1.92.72 2.64 0l4.32-4.32c1.44-1.44 3.84-1.44 5.28 0 1.44 1.44 1.44 3.84 0 5.28-1.44 1.44-3.84 1.44-5.28 0l-1.2-1.2 1.2-1.2 1.2 1.2c.72.72 1.92.72 2.64 0 .72-.72.72-.96 0-1.68-.72-.72-1.92-.72-2.64 0l-4.32 4.32c-1.44 1.44-3.84 1.44-5.28 0z" />
              </svg>
            </div>
            <div className="group bg-white border border-slate-100 rounded-2xl px-6 py-5 w-full flex items-center justify-center hover:bg-slate-100/50 hover:-translate-y-0.5 transition-all cursor-pointer shadow-sm min-h-[80px]">
              <svg viewBox="0 0 24 24" className="h-6 w-auto fill-current text-slate-400 group-hover:text-slate-900 transition-colors duration-300">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.82M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.49-.62.71-1.16 1.85-1.02 2.96 1.1.09 2.24-.55 2.95-1.39z"/>
              </svg>
            </div>
            <div className="group bg-white border border-slate-100 rounded-2xl px-6 py-5 w-full flex items-center justify-center hover:bg-slate-100/50 hover:-translate-y-0.5 transition-all cursor-pointer shadow-sm min-h-[80px]">
              <svg viewBox="0 0 24 24" className="h-7 w-auto fill-current text-slate-400 group-hover:text-[#E50914] transition-colors duration-300">
                <path d="M5.9 0h3.5v16.1L18.1 0h3.5v24h-3.5V7.9L9.4 24H5.9V0z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-gradient-to-br from-[#181FC5] to-[#4F46E5] relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full filter blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full filter blur-3xl pointer-events-none"></div>
        
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-6 leading-tight">
            Learn, Practice, and Get Certified!
          </h2>
          <p className="text-lg sm:text-xl opacity-90 mb-10 max-w-xl mx-auto leading-relaxed">
            Elevate your engineering skills and define your professional credentials today. Space is limited per cohort.
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
