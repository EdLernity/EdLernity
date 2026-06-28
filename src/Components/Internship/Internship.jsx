import "animate.css";
import React from "react";

function Internship() {
  const internshipData = [
    {
      text: "One Time Membership",
      img: "pic1.png",
    },
    {
      text: "Key Features",
      img: "pic2.png",
    },
    {
      text: "Upcoming Internships",
      img: "pic3.png",
    },
    {
      text: "EdLernity Academics",
      img: "pic4.png",
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
              className="group relative rounded-3xl overflow-hidden aspect-square shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer border border-slate-100/50"
            >
              {/* Card Image */}
              <img
                src={`/Image/internship/${data.img}`}
                alt={data.text}
                className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Subtle visual gradient overlay for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

              {/* Text and Arrow Link */}
              <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 flex items-end justify-between z-10">
                <h3 className="text-white text-xs sm:text-base md:text-xl font-bold tracking-wide leading-tight max-w-[70%]">
                  {data.text}
                </h3>
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#181FC5] transition-all shadow-sm flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform group-hover:rotate-45 transition-transform duration-300"
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