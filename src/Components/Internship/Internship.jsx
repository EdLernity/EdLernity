import "animate.css";
import React from "react";

function Internship() {

  const intershipData = [
    {
      text: "One time membership",
      img: "pic1.png",
    },
    {
      text: "Key Features ",
      img: "pic2.png",
    },
    {
      text: " Upcoming internships ",
      img: "pic3.png",
    },
    {
      text: "EdLernity Academics",
      img: "pic4.png",
    },
  ];

  return (
    <>
     <div className="mx-auto md:text-5xl text-4xl text-[#181fc5] font-hindVadodara -tracking-[0.01] leading-[106.3%] mt-2">
            <h1 className=" font-extrabold self-center text-center">
              What we offer here
            </h1>
          </div>
    <div className="flex justify-center overflow-x-scroll pb-2 hide-scroll-bar">
      
      <div className="flex flex-nowrap lg:ml-[5rem] md:ml-20 ml-[52rem] text-center">
        {intershipData.map((data, index) => (
          <div data-aos="flip-up" className="inline-block px-3" key={index}>
            <article className="relative w-64 h-64 isolate flex flex-col justify-end overflow-hidden rounded-2xl px-8 pb-8 pt-40 max-w-sm mx-auto mt-10">
              <img src={`/Image/internship/${data.img}`} alt="University of Southern California" className="absolute inset-0 h-full w-full object-cover"/>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40"></div>
              <h3 className="z-10 mt-3 text-lg font-bold text-white">{data.text}</h3>
            </article>
          </div>
        ))}
      </div>
    </div>
    {/* <h1
        className="text-xl text-center font-extrabold mb-10"
        style={{ color: "#8541dd" }}
      >
        Stay in the loop with the latest updates in the tech industry
      </h1> */}
    </>
  );
}

export default Internship;
