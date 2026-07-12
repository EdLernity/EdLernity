import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Code, GraduationCap } from "lucide-react";

const companyLogos = [
  { name: "Google", src: "/Image/companies/google.svg" },
  { name: "Microsoft", src: "/Image/companies/microsoft.svg" },
  { name: "Amazon", src: "/Image/companies/amazon.svg" },
  { name: "Meta", src: "/Image/companies/meta.svg" },
  { name: "Netflix", src: "/Image/companies/netflix.svg" },
  { name: "Apple", src: "/Image/companies/apple.svg" },
  { name: "IBM", src: "/Image/companies/ibm.svg" },
  { name: "Accenture", src: "/Image/companies/accenture.svg" },
  { name: "Salesforce", src: "/Image/companies/salesforce.svg" },
  { name: "Adobe", src: "/Image/companies/adobe.svg" },
  { name: "Uber", src: "/Image/companies/uber.svg" },
  { name: "Airbnb", src: "/Image/companies/airbnb.svg" },
  { name: "Spotify", src: "/Image/companies/spotify.svg" },
  { name: "LinkedIn", src: "/Image/companies/linkedin.svg" },
];

function Offer() {
    const navigate = useNavigate();

    const offers = [
      {
        icon: <BookOpen className="h-6 w-6 text-blue-500" />,
        border: "border-blue-100 bg-blue-50/30 hover:border-blue-300",
        iconColor: "border-blue-100 bg-blue-50 text-blue-500",
        title: "Self-paced Courses",
        desc: "Learn & Upskill via comprehensive online modules tailored for deep comprehension.",
      },
      {
        icon: <Code className="h-6 w-6 text-orange-500" />,
        border: "border-orange-100 bg-orange-50/30 hover:border-orange-300",
        iconColor: "border-orange-100 bg-orange-50 text-orange-500",
        title: "Interactive Practice Platforms",
        desc: "Gain real experience by writing code inside fully interactive live sandbox environments.",
      },
      {
        icon: <GraduationCap className="h-6 w-6 text-red-500" />,
        border: "border-red-100 bg-red-50/30 hover:border-red-300",
        iconColor: "border-red-100 bg-red-50 text-red-500",
        title: "Live Classes",
        desc: "Participate in real-time classes and interact directly with active corporate mentors.",
      },
    ];

  const logoStrip = [...companyLogos, ...companyLogos];

    return (
        <section className="py-20 lg:py-28 bg-white border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-sm font-bold uppercase tracking-wider text-[#181FC5] bg-[#181FC5]/10 px-3.5 py-1.5 rounded-full">
                        Offerings Deck
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-6">
                        What EdLernity offers you?
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {offers.map((item) => (
            <button
              key={item.title}
              type="button"
              onClick={() => navigate("/courses/overview")}
              className={`flex items-start text-left rounded-3xl border p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all duration-300 bg-white ${item.border}`}
            >
              <div
                className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border shadow-sm ${item.iconColor}`}
              >
                        {item.icon}
                      </div>
                      <div className="ml-5">
                        <h3 className="font-extrabold text-slate-800 text-lg mb-2">
                          {item.title}
                        </h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                      </div>
            </button>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-16">
                    <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest text-center mb-12">
                        You’ll be in good company
                    </h3>
                    
                    <div className="w-full overflow-hidden relative">
                      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            <div className="flex animate-marquee whitespace-nowrap gap-14 py-4 items-center">
              {logoStrip.map((logo, index) => (
                <div
                  key={`${logo.name}-${index}`}
                  className="flex-shrink-0 flex items-center justify-center h-12 px-2 opacity-100 transition-transform duration-300 hover:scale-110"
                  title={logo.name}
                >
                  <img
                    src={logo.src}
                    alt={`${logo.name} logo`}
                    className="h-8 w-auto max-w-[110px] object-contain"
                    loading="lazy"
                  />
</div>
              ))}
                        </div>
                      </div>
                    </div>
            </div>
        </section>
    );
}

export default Offer;
