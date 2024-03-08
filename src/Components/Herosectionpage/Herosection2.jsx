import React, { useEffect } from "react";
import { animateScroll as scroll } from "react-scroll";
import { useInView } from "react-intersection-observer";

const heroSectionContent = [
  {
    img: "timer.png",
    altImg: "timerImage",
    title: "Flexible time",
    text: "Online education allows teachers and students to set their own pace of learning, and there is added flexibility in setting a schedule that fits everyone's agenda. ",
  },
  {
    img: "certificate-867.png",
    altImg: "certificateImage",
    title: "Certificate",
    text: "Online education allows teachers and students to set their own pace of learning, and there is added flexibility in setting a schedule that fits everyone's agenda. ",
  },
  {
    img: "export-arrow.png",
    altImg: "exportArrowImage",
    title: "Membership options",
    text: "Online education allows teachers and students to set their own pace of learning, and there is added flexibility in setting a schedule that fits everyone's agenda. ",
  },
  {
    img: "price-label.png",
    altImg: "priceLabelImage",
    title: "Access anywhere",
    text: "Online education allows teachers and students to set their own pace of learning, and there is added flexibility in setting a schedule that fits everyone's agenda. ",
  },
];

function Herosection2() {
  const { ref, inView } = useInView({
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

  return (
    <div
      className="flex flex-col-reverse sm:flex-row mt-16"
      style={{ paddingLeft: "1rem" }}
      ref={ref}
    >
      <div className="w-full sm:w-[40%] text-center sm:text-left flex-col justify-between relative">
        <div className="animate__animated animate__backInLeft flex-col justify-between max-w-full z-[10]">
          <h1 className="text-5xl text-left font-bold max-sm:text-lg sm:text-lg lg:text-6xl pt-5 text-[#333]">
            Why choose EdLernity?
          </h1>

          <p className="mt-4 sm:mt-8 text-lg text-[#4F4E4E] text-left w-full sm:w-[60%]">
            EdLernity provides industry-leading courses on-demand & online.
          </p>
          <div className="item-center flex justify-center sm:mt-8 w-full sm:w-[60%]">
            <div className="bg-[#2F35CB] rounded-3xl py-2">
              <button className="text-white text-base px-8">Get Started</button>
            </div>
          </div>
        </div>
        <div className="animate__animated animate__backInLeft flex items-center max-w-full m-0 z-10">
          <img
            src="/Image/orange_yellowish_circle.png"
            alt="yelloish circle"
            className="w-[200px] h-[200px] left-[-100px] top-10 absolute animate__animated animate__backInLeft drop-shadow-[-6px_8px_4px_gray]"
          />
          <img
            src="/Image/blue_circle_small.png"
            alt="Blue circle"
            className="w-[60px] h-[60px] left-[120px] top-40 absolute animate__animated animate__backInLeft drop-shadow-[-6px_8px_4px_gray]"
          />
        </div>
      </div>
      <div className="flex p-2 flex-wrap w-full sm:w-[60%]">
        {heroSectionContent.map((data, index) => (
          <div
            key={index}
            className="w-full sm:w-[50%] max-sm:w-full pl-4 sm:pl-8 pb-4 sm:pb-16 px-4 sm:px-8 animate__animated animate__backInRight"
          >
            <div className="bg-gray-400 w-[50px] sm:w-[70px] h-[50px] sm:h-[70px] rounded-full mb-2 sm:mb-4 p-2 sm:p-4">
              <img
                src={`/Image/hersection2/${data.img}`}
                alt={data.altImg}
                className="mb-1"
              />
            </div>
            <h1 className="font-bold text-xl sm:text-2xl mb-2">{data.title}</h1>
            <p className="text-[#484646] text-sm sm:text-base lg:text-lg mb-2">
              {data.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Herosection2;
