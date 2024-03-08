import React, { useState } from "react";
import { Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import ChatBot from "./ChatBot";
import Whatsapp from "./Whatsapp";

const LINKS = [
  {
    title: "Company",
    items: [
      { label: "Our Company", url: "/company" },
      { label: "Student Stories", url: "/student-stories" },
      { label: "Contact Us", url: "/contact-us" },
      { label: "About Us", url: "/about" },
      { label: "Help and Support", url: "/help" },
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
    setIsChatBotOpen(true);
  };

  const closeChatBot = () => {
    setIsChatBotOpen(false);
  };

  return (
    <>
      <footer className="relative w-full bg-black pt-12 pb-6 text-white">
        <div className="mx-auto w-full px-8 ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-sm:px-8">
            <div className="mb-6">
              <div className="flex items-center gap-4">
                <img alt="logo" src="/Image/Logo1.svg" className="w-12" />
                <Typography variant="h5">EdLernity</Typography>
              </div>
              <Typography variant="paragraph" className="mt-4 text-sm">
                EdLernity offers you the opportunity to learn without limits -
                all the Upskilling Courses, Placement Preparation, and Various
                Certification Courses on a single platform. Our Platform
                includes Video-based learning, Practice Exercises, and a
                personalized learning module that empowers learners with the
                ability to study at their own pace without any limitations. We
                offer 20+ Upskilling Courses, 200+ Placement Preparation
                materials, and 20+ Certification Courses.
              </Typography>
            </div>

            <div className="grid grid-cols-1 max-sm:justify-center sm:grid-cols-2 md:grid-cols-3 text-white gap-4">
              {LINKS.map(({ title, items }) => (
                <div key={title} className="text-center">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-3 text-white text-lg uppercase font-semibold"
                  >
                    {title}
                  </Typography>
                  <ul>
                    {items.map(({ label, url }) => (
                      <li key={label}>
                        <NavLink
                          to={url}
                          className="py-1.5 font-normal text-white transition-colors hover:text-blue-gray-600"
                        >
                          {label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <Whatsapp onOpenChatBot={openChatBot} />
            {isChatBotOpen && <ChatBot onClose={closeChatBot} />}
          </div>

          <div className="mt-8 flex flex-col items-center justify-center border-t border-blue-gray-50 py-4 md:flex-row md:justify-between">
            <Typography
              variant="small"
              className="mb-4 text-center text-white font-normal md:mb-0"
            >
              &copy; {currentYear}{" "}
              <Link to="/">EdLernity Tech (OPC) Private Limited</Link>. All
              Rights Reserved.
            </Typography>

            <div className="flex gap-4 sm:justify-center">
              <a
                href="https://www.linkedin.com/company/edlernity/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-100"
              >
                <img
                  alt="linkedin"
                  src="/Image/image 16.png"
                  className="w-5 h-5"
                />
              </a>
              <a
                href="https://www.instagram.com/edlernity/?utm_source=ig_web_button_share_sheet&igshid=OGQ5ZDc2ODk2ZA%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-100"
              >
                <img
                  alt="instagram"
                  src="/Image/image 17.png"
                  className="w-5 h-5"
                />
              </a>
              <a
                href="https://twitter.com/EdLernity"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-100"
              >
                <img alt="x" src="/Image/image 15.png" className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
