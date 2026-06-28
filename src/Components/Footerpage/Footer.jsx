import React, { useState } from "react";
import ChatBot from "./ChatBot";
import Whatsapp from "./Whatsapp";

const LINKS = [
  {
    title: "Company",
    items: [
      { label: "Home", url: "/" },
      { label: "Reviews", url: "/reviews" },
      { label: "Student Stories", url: "/reviews" },
      { label: "About Us", url: "/about" },
      { label: "Careers", url: "/careers" },
      { label: "Contact Us", url: "/contact" },
      { label: "Help and Support", url: "/contact" },
    ],
  },
  {
    title: "Legal",
    items: [
      { label: "Privacy Policy", url: "/privacy-policy" },
      { label: "Term and Condition", url: "/terms-and-conditions" },
      {
        label: "Cancellation and Refund Policy",
        url: "/cancellation-and-refund-policy",
      },
    ],
  },
  {
    title: "Contact",
    items: [
      { label: "+91 8073306479", url: "tel:+918073306479" },
      { label: "info@edlernity.com", url: "mailto:info@edlernity.com" },
    ],
  },
];

const currentYear = new Date().getFullYear();

function Footer() {
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);

  const openChatBot = () => {
    window.location.replace("https://api.whatsapp.com/send?phone=918073306479");
  };

  const closeChatBot = () => {
    setIsChatBotOpen(false);
  };

  return (
    <>
      <footer className="w-full bg-[#f8fafc] text-slate-600 border-t border-slate-200 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Brand Column */}
            <div className="lg:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
              <a href="/" className="flex items-center justify-center md:justify-start mb-6">
                <img alt="logo" src="/Image/Logo1.svg" className="w-10 h-auto" />
                <span className="ml-3 text-slate-900 text-xl font-extrabold tracking-tight">EdLernity</span>
              </a>
              <p className="text-sm text-slate-500 leading-relaxed font-medium mb-6 max-w-sm">
                <b>EdLernity</b>: One platform, endless learning. Explore diverse Upskilling, Placement Prep, and Certification Courses with video-based learning, practice exercises, and personalized modules.
              </p>
              
              {/* Social Icons */}
              <div className="flex gap-3">
                <a
                  href="https://www.linkedin.com/company/edlernity/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:border-[#181FC5] hover:bg-slate-50 transition-all duration-300 shadow-sm"
                >
                  <img alt="linkedin" src="/Image/image 16.png" className="w-4 h-4 opacity-80 hover:opacity-100" />
                </a>
                <a
                  href="https://www.instagram.com/edlernity/?utm_source=ig_web_button_share_sheet&igshid=OGQ5ZDc2ODk2ZA%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:border-[#181FC5] hover:bg-slate-50 transition-all duration-300 shadow-sm"
                >
                  <img alt="instagram" src="/Image/image 17.png" className="w-4 h-4 opacity-80 hover:opacity-100" />
                </a>
                <a
                  href="https://twitter.com/EdLernity"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:border-[#181FC5] hover:bg-slate-50 transition-all duration-300 shadow-sm"
                >
                  <img alt="x" src="/Image/image 15.png" className="w-4 h-4 opacity-80 hover:opacity-100" />
                </a>
              </div>
            </div>

            {/* Links Columns */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
              
              {/* Company Links */}
              <div>
                <h3 className="text-slate-900 text-xs font-bold uppercase tracking-wider mb-6">
                  {LINKS[0].title}
                </h3>
                <ul className="space-y-3.5">
                  {LINKS[0].items.map((item, idx) => (
                    <li key={idx}>
                      <a
                        href={item.url}
                        className="text-slate-500 hover:text-[#181FC5] text-sm font-medium transition-colors duration-200"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal Links */}
              <div>
                <h3 className="text-slate-900 text-xs font-bold uppercase tracking-wider mb-6">
                  {LINKS[1].title}
                </h3>
                <ul className="space-y-3.5">
                  {LINKS[1].items.map((item, idx) => (
                    <li key={idx}>
                      <a
                        href={item.url}
                        className="text-slate-500 hover:text-[#181FC5] text-sm font-medium transition-colors duration-200"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact & ISO */}
              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="text-slate-900 text-xs font-bold uppercase tracking-wider mb-6">
                    {LINKS[2].title}
                  </h3>
                  <ul className="space-y-3.5 mb-6">
                    {LINKS[2].items.map((item, idx) => (
                      <li key={idx}>
                        <a
                          href={item.url}
                          className="text-slate-500 hover:text-[#181FC5] text-sm font-medium transition-colors duration-200"
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* ISO Badge */}
                <div className="mt-4 md:mt-0">
                  <img
                    alt="ISO Accreditation"
                    src="/Image/Iso.png"
                    className="w-32 h-auto opacity-80 hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-200 bg-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500 text-center md:text-left font-medium">
              &copy; {currentYear} EdLernity Tech (OPC) Private Limited. All rights reserved.
            </p>
            <p className="text-xs text-slate-400 font-medium">
              ISO 9001:2015 Certified Organization
            </p>
          </div>
        </div>
      </footer>
      
      <Whatsapp onOpenChatBot={openChatBot} />
      {isChatBotOpen && <ChatBot onClose={closeChatBot} />}
    </>
  );
}

export default Footer;
