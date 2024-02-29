import React from "react";

function Certificate() {
  return (
    <div>
      <h1 className="text-center pb-4 mt-6 font-bold text-4xl text-[#1539cf] leading-6">
        To earn a Certificate
      </h1>

      <div class="flex justify-center items-center mt-6 bg-[#EDEDED] h-auto md:h-32 w-full md:w-auto border-2 rounded-3xl px-4 py-6 md:px-6 md:py-8">
        <p class="text-lg text-gray-700 text-center md:text-left">
          Add this credential to your LinkedIn profile, resume, or CV Share it
          on social media and in your performance review jghjfhg jkhidfglkhk Add
          this credential to your LinkedIn profile, resume, or CV Share it on
          social media and in your performance review.
        </p>
      </div>

      <div className="flex mt-12 flex-col md:flex-row xl:flex-row">
        <img
          className="md:w-1/2 xl:w-1/2"
          src="/image/Certificate.png"
          alt="cerificate"
        />
        <div className="flex flex-row-reverse md:flex-col xl:flex-col sm:flex-col mt-6 md:mt-0 xl:mt-0 sm:mt-0 md:w-1/2 xl:w-1/2 justify-center items-center gap-8">
          <div class="relative cursor-pointer w-full md:w-auto sm:w-auto xl:w-auto px-4 sm:mt-4">
            <img
              className="absolute h-12 md:h-auto xl:h-auto sm:h-auto left-10 bottom-6 md:right-8 md:left-14 md:bottom-10 xl:right-8 xl:left-14 xl:bottom-10 sm:right-8 sm:left-14 sm:bottom-10"
              src="/image/Arrow.png"
              alt="arrow"
            />
            <img
              className="w-24 h-24 md:w-40 md:h-40 xl:w-40 xl:h-40 sm:w-40 sm:h-40"
              src="/image/Ellipse 65.png"
              alt="ellipse"
            />
          </div>
          <p className="text-xl px-8 pr-2 pb-2">You can download certificate from here.</p>
        </div>
      </div>
    </div>
  );
}

export default Certificate;
