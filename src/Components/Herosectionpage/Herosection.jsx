import React from "react";
import "animate.css";
import { useNavigate } from "react-router-dom";
import { RiDoubleQuotesL, RiDoubleQuotesR} from "react-icons/ri";


function Herosection() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/courses/overview");
  };

  return (
    <div className="flex flex-col bg-[#F1F0F0] bg-cover bg-center text-white p-8 sm:p-14 text-center min-h-[600px] justify-between relative">
      {/* <div className="animate__animated animate__backInLeft flex flex-col justify-between w-full max-w-full m-0 z-[10]">
        <h1
          className="text-white text-4xl sm:text-6xl text-left font-extrabold max-sm:text-xl pt-5"
          style={{ color: "#1539CF" }}
        >
          Build your skill to advance your career path
        </h1>
        <hr className="mt-4 sm:mt-8 h-1 bg-[#1539CF] w-[90%]"></hr>
        <p className="mt-4 sm:mt-8 text-lg text-[#4F4E4E] text-left w-[90%]">
          Learning is a lifelong journey that in the future we never find the
          terming stop searching, enjoy the process.
        </p>
        <div className="item-center flex justify-center sm:mt-8 w-[90%]">
          <div className="bg-[#2F35CB] rounded-3xl py-2">
            <button className="text-white text-base px-6 sm:px-8" onClick={handleClick}>Get Started</button>
          </div>
        </div>
      </div> */}
      <div className="animate__animated animate__backInLeft flex flex-col justify-between max-sm:w-full lg:w-[40%] max-w-full m-0 z-[10]">
        <h1
          className="text-white text-4xl w sm:text-6xl text-left font-extrabold max-sm:text-xl pt-5"
          style={{
            color: "#1539CF",
            fontSize: window.innerWidth <= 640 ? "6xl" : "",
          }}
        >
          Build your skill to advance your career path
        </h1>
        <hr className="mt-4 sm:mt-8 h-1 bg-[#1539CF] w-[90%]"></hr>
        <p
          className="mt-4 sm:mt-8 text-lg text-[#4F4E4E] text-left w-[90%]"
          style={{ fontSize: window.innerWidth <= 640 ? "lg" : "" }}
        >
          <span className="inline-flex"><RiDoubleQuotesL/> &nbsp;</span>
          Welcome to our innovative platform-EdLernity, Where
          knowledge meets eternity. Explore a world of endless
          possibilities as you embark on a journey of learning and
          discovery, tailored to your pace and preferences
          <span className="inline-flex">&nbsp;<RiDoubleQuotesR/></span>
        </p>
        <div className="item-center flex justify-center sm:mt-8 w-[90%]">
          <div className="bg-[#2F35CB] rounded-3xl py-2">
            <button
              className="text-white text-base px-6 sm:px-8"
              onClick={handleClick}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
      <div className="animate__animated animate__backInLeft flex flex-col sm:flex-row items-center max-w-full m-0 z-10 " style={{ marginRight: "120px" }}>
        <div className="flex flex-col sm:flex-row max-w-full m-0 z-10">
          <div className="flex sm:text-left flex-row items-center text-black pr-4 mb-4 sm:mb-0">
            <img
              src="/Image/blue_tick.png"
              alt="blue_tick"
              className="pr-2 w-8"
            />
            <p className="sm:text-left">Experienced mentor</p>
          </div>
          <div className="flex sm:text-left flex-row items-center text-black pr-4 mb-4 sm:mb-0">
            <img
              src="/Image/blue_tick.png"
              alt="blue_tick"
              className="pr-2 w-8"
            />
            <p className="sm:text-left">Quality videos</p>
          </div>
          <div className="flex sm:text-left flex-row items-center text-black pr-4 mb-4 sm:mb-0">
            <img
              src="/Image/blue_tick.png"
              alt="blue_tick"
              className="pr-2 w-8"
            />
            <p className="sm:text-left">Affordable prices</p>
          </div>
        </div>
      </div>
      <img
        src="/Image/voilet_circle.png"
        alt="voilet circle"
        className="w-[60px] h-[60px] absolute right-[665px] top-[300px] animate__animated animate__backInRight drop-shadow-[6px_3px_4px_gray]"
      />
      <img
        src="/Image/rectangle_boy.png"
        alt="boy"
        className="w-[200px] h-[300px] absolute right-[450px] animate__animated animate__backInRight drop-shadow-[10px_12px_4px_gray]"
      />
      <img
        src="/Image/yellow_circle.png"
        alt="circle yellow"
        className="w-[200px] h-[200px] absolute right-[100px] top-[200] animate__animated animate__backInRight drop-shadow-[-6px_8px_4px_gray]"
      />
      <img
        src="/Image/Rectangle_girl.png"
        alt="girl"
        className="w-[200px] h-[300px] absolute right-[10vw] sm:right-[100px] transform -translateY-[-400px] top-[404px] animate__animated animate__backInRight drop-shadow-[10px_12px_4px_gray]"
      />
      <img
        src="/Image/blue_circle.png"
        alt="circle blue"
        className="w-[200px] h-[200px] absolute right-[450px] top-[495px] animate__animated animate__backInRight drop-shadow-[-6px_8px_4px_gray]"
      />
    </div>
  );
}

export default Herosection;
