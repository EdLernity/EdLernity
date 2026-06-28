import "animate.css";
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, ShieldCheck } from "lucide-react";

function Herosection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-[#F4F6FF] to-[#ECEFFE] pt-12 pb-20 lg:pt-20 lg:pb-32">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#181FC5]/5 rounded-full filter blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-12 gap-16 items-center">

          {/* Left Column */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#181FC5]/10 text-[#181FC5] text-xs font-semibold uppercase tracking-wider mb-6">
              Pioneering Technical Career Capabilities
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-none mb-6">
              Build your skill to <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#181FC5] to-[#4F46E5]">advance your career path</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed font-medium mb-8 max-w-2xl mx-auto lg:mx-0">
              Welcome to our innovative platform - EdLernity, where knowledge meets eternity. Explore a world of endless career opportunities, tailored to your own pace and professional preferences.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <Link
                to="/courses/overview"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#181FC5] to-[#4F46E5] text-white font-bold rounded-full hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-105 transition-all text-base"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/careers"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/60 backdrop-blur border border-slate-200 text-slate-700 font-bold rounded-full hover:bg-slate-50 hover:scale-105 transition-all text-base shadow-sm"
              >
                Explore Internships
              </Link>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="absolute inset-0 bg-[#181FC5]/5 rounded-3xl filter blur-2xl transform rotate-3 pointer-events-none"></div>

            <div className="relative w-full max-w-md lg:max-w-lg">
              <img
                src="/Image/background.png"
                alt="EdLernity Background"
                className="w-full drop-shadow-[0_15px_30px_rgba(24,31,197,0.08)] hidden md:block rounded-3xl"
              />
              <img
                src="/Image/mobileback.png"
                alt="EdLernity Mobile"
                className="w-full drop-shadow-[0_15px_30px_rgba(24,31,197,0.08)] md:hidden block rounded-2xl"
              />

              {/* Floating Glass Cards */}
              <div className="absolute -top-6 -left-6 bg-white/80 backdrop-blur border border-white/60 p-4 rounded-2xl shadow-xl hidden xl:flex items-center gap-3 animate-bounce-slow hover:scale-105 transition-transform duration-300">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#181FC5]">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-450 font-semibold uppercase">Mentorship</p>
                  <p className="text-sm font-bold text-slate-800">1-on-1 Guidance</p>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 bg-white/80 backdrop-blur border border-white/60 p-4 rounded-2xl shadow-xl hidden xl:flex items-center gap-3 animate-bounce-slow-delayed hover:scale-105 transition-transform duration-300">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-450 font-semibold uppercase">ISO Certified</p>
                  <p className="text-sm font-bold text-slate-800">Quality Assured</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Herosection;