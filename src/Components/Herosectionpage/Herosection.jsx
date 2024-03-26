import "animate.css";
import React from "react";
import { useNavigate } from "react-router-dom";


function Herosection() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/courses/overview");
  };

  return (
    <div className="h-full w-full bg-gradient-to-b from-white to-[#f0f1ff] bg-no-repeat overflow-hidden">
      
    <div className="px-5 xl:px-0 max-w-3xl lg:max-w-5xl xl:max-w-5xl w-full mx-auto relative">
      <div className="flex justify-start items-end my-5 xl:my- mb-[15rem] md:mb-[0rem]">
        <div className="md:max-w-[400px] flex flex-col gap-6 my-14">
          <div>
            <h1 className="text-[#8541dd] xl:text-[52px] text-[40px] font-extrabold leading-[50px]">
            Build your skill to advance your career path
            </h1>
          </div>
          <div>
            <p className="text-[#83869a]">
            Welcome to our innovative platform-EdLernity, Where
          knowledge meets eternity. Explore a world of endless
          possibilities as you embark on a journey of learning and
          discovery, tailored to your pace and preferences
            </p>
          </div>
          <div>
            <button className="py-3 px-7 text-white font-bold bg-gradient-to-r from-blue-500 to-pink-600 rounded-3xl group relative overflow-hidden">
              Get Started
              <div className="absolute duration-300 inset-0 w-full h-full transition-all scale-0 group-hover:scale-100 group-hover:bg-white/30 rounded-2xl"></div>
            </button>
          </div>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 md:translate-x-0 md:-right-32 md:left-auto xl:-right-80 xl:-top-20 md:-top-5 lg:-right-28 lg:-top-14 ">
          <img
            src="/Image/background.png"
            alt=""
            className="relative md:max-w-[500px] lg:max-w-[600px] xl:max-w-[650px] hidden md:block"
          />
          <img
            src="/Image/mobileback.png"
            alt="mobileback"
            className="relative -bottom-72 md:hidden block max-w-[343px] sm:max-w-[400px]"
          />
        </div>
      </div>
     
    </div>
   
  </div>
  );
}

export default Herosection;
