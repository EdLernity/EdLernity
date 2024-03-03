import React from "react";
import "animate.css";
function Herosection() {
  return (
    <div className="flex flex-col bg-[#F1F0F0] bg-cover bg-center text-white p-14 text-center min-h-[600px] justify-between relative">

      <div className="animate__animated animate__backInLeft flex flex-col justify-between w-[40%] max-w-full m-0 z-[10]">
        <h1
          className=" text-white text-6xl text-left font-extrabold  max-sm:text-xl pt-5"
          style={{ color: "#1539CF" }}
        >
          Build your skill to advance your career path
        </h1>
        <hr className="mt-8 h-1 bg-[#1539CF] w-[90%]"></hr>
        <p className="mt-8 text-lg text-[#4F4E4E] text-left w-[90%]">
          Learning is a life long journey that in future we never find the
          terming stop searching,enjoy the process.
        </p>
        <div className="item-center flex justify-center sm:mt-8 w-[90%]">
          <div className="bg-[#2F35CB] rounded-3xl py-2">
            <button className="text-white text-base px-8">Get Started</button>
          </div>
        </div>
      </div>
      <div class="animate__animated animate__backInLeft flex items-center max-w-full m-0 z-10">
        <div class="flex flex-row items-center text-black pr-8">
          <img
            src="/Image/blue_tick.png"
            alt="blue_tick"
            className="pr-2 w-8"
          />
          <p>Experienced mentor</p>
        </div>
        <div class="flex flex-row items-center text-black px-8">
          <img
            src="/Image/blue_tick.png"
            alt="blue_tick"
            className="pr-2 w-8"
          />
          <p>Quality videos</p>
        </div>
        <div class="flex flex-row items-center text-black px-8">
          <img
            src="/Image/blue_tick.png"
            alt="blue_tick"
            className="pr-2 w-8"
          />
          <p>Affordable prices</p>
        </div>
      </div>
        <img src="/Image/voilet_circle.png"
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
          alt=" girl"
          className="w-[200px] h-[300px] absolute right-[100px] top-[404px] animate__animated animate__backInRight drop-shadow-[10px_12px_4px_gray]"
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
