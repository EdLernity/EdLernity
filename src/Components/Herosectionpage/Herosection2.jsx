import React from "react";
import { Timer, Award, Key, Globe } from "lucide-react";

function Herosection2() {
  const chooseData = [
    {
      icon: <Timer className="w-6 h-6 text-red-500" />,
      title: "Flexible Time",
      bgColor: "bg-red-50 border-red-100/50",
      text: "Learn on your own terms with our flexible timing options. Join EdLernity to pursue your educational goals without sacrificing your lifestyle.",
    },
    {
      icon: <Award className="w-6 h-6 text-blue-500" />,
      title: "ISO Certification",
      bgColor: "bg-blue-50 border-blue-100/50",
      text: "At EdLernity, we offer certified programs for your career or academic growth. Our ISO 9001:2015 certification ensures excellence.",
    },
    {
      icon: <Key className="w-6 h-6 text-orange-500" />,
      title: "Membership Options",
      bgColor: "bg-orange-50 border-orange-100/50",
      text: "Discover flexible, affordable membership options at EdLernity. Join our community for lifelong learning and professional growth.",
    },
    {
      icon: <Globe className="w-6 h-6 text-indigo-500" />,
      title: "Access Anywhere",
      bgColor: "bg-indigo-50 border-indigo-100/50",
      text: "Embrace learning anytime, anywhere with EdLernity. Break free from traditional constraints and empower yourself with knowledge.",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#ECF7FF]/30 border-y border-[#ECF7FF]/50 relative overflow-hidden">
      {/* Background Accent Decorative Elements */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 border border-dashed border-indigo-200/55 rounded-full pointer-events-none -mr-48"></div>
      <div className="absolute left-0 top-1/4 w-72 h-72 bg-blue-500/5 rounded-full filter blur-3xl pointer-events-none -ml-36"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="text-sm font-bold uppercase tracking-wider text-[#181FC5] bg-[#181FC5]/10 px-3.5 py-1.5 rounded-full">
            Why choose EdLernity?
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-6 max-w-2xl mx-auto leading-tight">
            Designed for Real-World Tech Readiness
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {chooseData.map((card, index) => (
            <div
              key={index}
              className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 hover:border-[#181FC5]/10 transition-all duration-300 flex flex-col items-start"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm border ${card.bgColor}`}>
                {card.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3 uppercase tracking-wide">
                {card.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {card.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Herosection2;