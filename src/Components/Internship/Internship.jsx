import "animate.css";
import React from "react";
import { useNavigate } from "react-router-dom";

function Internship() {
  const navigate = useNavigate();

  const internshipData = [
    {
      text: "One Time Membership",
      img: "IMG_8532.PNG",
      link: "/member"
    },
    {
      text: "Key Features",
      img: "IMG_8533.PNG",
      link: "/courses/overview"
    },
    {
      text: "Upcoming Internships",
      img: "IMG_8534.PNG",
      link: "/internship-programs"
    },
    {
      text: "EdLernity Academics",
      img: "IMG_8535.PNG",
      link: "/courses/overview"
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#181FC5]/10 text-[#181FC5] text-xs font-semibold uppercase tracking-wider mb-4">
            Our Offerings
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            What We Offer Here
          </h2>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {internshipData.map((data, index) => (
            <div
              key={index}
              onClick={() => navigate(data.link)}
              className="group flex flex-col bg-white rounded-3xl border border-slate-100/80 shadow-md hover:shadow-[0_0_25px_rgba(24,31,197,0.3)] hover:border-[#181FC5]/30 hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden p-5 sm:p-6 h-64 sm:h-80"
            >
              {/* Image Container with Center Alignment & Fit */}
              <div className="flex-grow flex items-center justify-center overflow-hidden mb-4">
                <img
                  src={`/Image/${data.img}`}
                  alt={data.text}
                  className="max-h-full max-w-full object-contain group-hover:scale-110 group-hover:-translate-y-2 group-hover:rotate-1 transition-all duration-500 ease-out"
                />
              </div>

              {/* Card Body */}
              <div className="flex items-center justify-between shrink-0 bg-white">
                <h3 className="text-slate-900 text-xs sm:text-base font-extrabold tracking-wide leading-tight group-hover:text-[#181FC5] transition-colors duration-300">
                  {data.text}
                </h3>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-slate-100 flex items-center justify-center text-[#181FC5] group-hover:bg-[#181FC5] group-hover:text-white group-hover:shadow-[0_0_10px_rgba(24,31,197,0.4)] transition-all duration-300 shadow-sm flex-shrink-0 ml-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-3 h-3 sm:w-4 sm:h-4 transform group-hover:rotate-45 transition-transform duration-300"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Internship;