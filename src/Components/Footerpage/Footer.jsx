import React, { useState } from "react";
import ChatBot from "./ChatBot";
import Whatsapp from "./Whatsapp";
const LINKS = [
  {
    title: "Company",
    items: [
      { label: "Home", url: "/" },
      { label: "Student Stories", url: "#StudentSayAboutUs" },
      { label: "About Us", url: "/about" },
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
    window.location.replace("https://api.whatsapp.com/send?phone=918073306479")
  };

  const closeChatBot = () => {
    setIsChatBotOpen(false);
  };

  return (
    <>
      <footer class="w-full text-gray-700 bg-gray-100 body-font">
        <div class="container flex flex-col flex-wrap px-5 py-24 mx-auto md:items-center lg:items-start md:flex-row md:flex-no-wrap">
          <div class="flex-shrink-0 w-[20rem] mx-auto text-center md:mx-0 md:text-left">
            <a class="flex items-center justify-center font-medium text-gray-900 title-font md:justify-start">
              <img alt="logo" src="/Image/Logo1.svg" className="w-12" />
            </a>
            <p class="mt-2 text-sm text-gray-500">
              <b>EdLernity</b>: One platform, endless learning. Explore diverse
              Upskilling, Placement Prep, and Certification Courses with
              video-based learning, practice exercises, and personalized
              modules. Study at your own pace with 20+ Upskilling, 200+
              Placement Prep, and 20+ Certification Courses.
            </p>
            <div class="mt-4 ">
              <span class="inline-flex justify-center mt-2 sm:ml-auto sm:mt-0 sm:justify-start gap-2">
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
              </span>
            </div>
          </div>
          <div class="flex flex-wrap flex-grow mt-10 -mb-10 text-center md:pl-20 md:mt-0 md:text-left">
            <div class="w-full px-4 lg:w-1/4 md:w-1/2">
              {/* <h2 class="mb-3 text-sm font-medium tracking-widest text-gray-900 uppercase title-font">Support</h2>
                    <nav class="mb-10 list-none">
                        <li class="mt-3">
                            <a class="text-gray-500 cursor-pointer hover:text-gray-900">Contact Support</a>
                        </li>
                        <li class="mt-3">
                            <a class="text-gray-500 cursor-pointer hover:text-gray-900">Help Resources</a>
                        </li>
                        <li class="mt-3">
                            <a class="text-gray-500 cursor-pointer hover:text-gray-900">Release Updates</a>
                        </li>
                    </nav> */}
            </div>
            <div class="w-full px-4 lg:w-1/4 md:w-1/2">
              <h2 class="mb-3 text-sm font-medium tracking-widest text-gray-900 uppercase title-font">
                About
              </h2>
              <nav class="mb-10 list-none">
                {LINKS[0].items.map((item, idx) => (
                  <li class="mt-3">
                    <a
                      href={item.url}
                      class="text-gray-500 cursor-pointer hover:text-gray-900"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </nav>
            </div>
            <div class="w-full px-4 lg:w-1/4 md:w-1/2">
              <h2 class="mb-3 text-sm font-medium tracking-widest text-gray-900 uppercase title-font">
                Platform
              </h2>
              <nav class="mb-10 list-none">
                {LINKS[1].items.map((item, idx) => (
                  <li class="mt-3">
                    <a
                      href={item.url}
                      class="text-gray-500 cursor-pointer hover:text-gray-900"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </nav>
            </div>
            <div class="w-full px-4 lg:w-1/4 md:w-1/2">
              <h2 class="mb-3 text-sm font-medium tracking-widest text-gray-900 uppercase title-font">
                Contact
              </h2>
              <nav class="mb-10 list-none">
                {LINKS[2].items.map((item, idx) => (
                  <li class="mt-3">
                    <a
                      href={item.url}
                      class="text-gray-500 cursor-pointer hover:text-gray-900"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </nav>
            </div>
          </div>
        </div>
        <div class="bg-gray-300">
          <div class="container px-5 py-4 mx-auto">
            <p class="text-sm text-gray-700 capitalize xl:text-center">
              &copy; {currentYear} EdLernity Tech (OPC) Private Limited. All
              rights reserved{" "}
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
