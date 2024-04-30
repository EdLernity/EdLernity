import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { animateScroll as scroll } from "react-scroll";

function Herosection2() {
  const { inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  useEffect(() => {
    if (inView) {
      scroll.scrollToTop({
        duration: 800,
      });
    }
  }, [inView]);
  const [showMenu, setShowMenu] = useState(false);
  const [active, setActive] = useState("Home");
  const heroSectionContent = [
    {
      img: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      ),
      altImg: "timerImage",
      title: "Flexible time",
      logoBg: "bg-[#FFD4D4]",
      text: "Learn on your terms with our flexible timing options. Join EdLernity to pursue your educational goals without sacrificing your lifestyle",
    },
    {
      img: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
          />
        </svg>
      ),
      altImg: "certificateImage",
      title: "Certificate",
      logoBg: "bg-[#D4F0FF]",
      text: "At EdLernity, we offer certified programs for your career or academic growth. Our ISO 9001:2015 certification ensures excellence. Ready to join us?",
    },
    {
      img: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
          />
        </svg>
      ),
      altImg: "exportArrowImage",
      title: "Membership options",
      logoBg: "bg-[#FFDED4]",
      text: "Discover flexible, affordable membership options at EdLernity. Join our community for lifelong learning and professional growth.",
    },
    {
      img: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      ),
      altImg: "priceLabelImage",
      title: "Access anywhere",
      logoBg: "bg-[#D4F0FF]",
      text: "Embrace learning anytime, anywhere with EdLernity. Break free from traditional constraints and empower yourself with knowledge wherever you go.",
    },
  ];

  return (
    <div className="w-full relative sm:h-[650px] h-[500px] py-28 overflow-hidden md:mt-28 mt-14">
      <div className="absolute right-16 top-56 h-96 p-2 w-96 border-dashed border-[#000000] border-[1px] rounded-full"></div>
      <div className="max-w-[1293px] mr-3 w-full sm:h-[578px] h-[500px] bg-[#ECF7FF] rounded-tr-[137px] sm:rounded-tr-[400px] absolute top-0 z-10"></div>
      <div className="!z-30 absolute top-0 h-full w-full flex flex-col gap-24 py-24">
        <div className=" flex flex-col sm:gap-16 md:gap-24 gap-12">
          <div className="mx-auto md:text-5xl text-4xl text-[#331B3B] font-hindVadodara -tracking-[0.01] leading-[106.3%]">
            <h1 className=" font-bold self-center text-center">
              Why choose EdLernity?
            </h1>
          </div>
          <div className="lg:pl-32 sm:pl-8 px-5 flex gap-12">
            <div class="flex overflow-x-scroll pb-10 hide-scroll-bar pt-3">
              <div className=" flex justify-center gap-3">
                {heroSectionContent?.map((card, index) => (
                  <div class="inline-block px-3">
                    <div
                    data-aos="flip-left"
                      key={index}
                      className="p-[18px]  flex flex-col justify-start bg-white shadow-3xl rounded-[10px] overflow-hidden w-[18rem] md:w-full"
                    >
                      <div
                        className={`w-[52px] h-12 flex justify-center items-center rounded-[10px] ${card?.logoBg}`}
                      >
                        {card.img}
                      </div>
                      <div>
                        <span className="text-base mt-3 overflow-hidden uppercase font-bold font-hindVadodara leading-[137.3%] -tracking-tighter">
                          {card.title}
                        </span>
                      </div>
                      <div>
                        <span className="text-[15px] mt-1.5 max-w-[230px] h-full max-h-16 Light font-light font-hindVadodara leading-[145.3%] tracking-[0.02]">
                          {card.text}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Herosection2;
