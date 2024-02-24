import React from "react";

function Certificate() {
  return (
    <div>
      <h1 className="text-center pb-4 mt-6 font-bold text-4xl text-[#1539cf] leading-6">
        To earn a Certificate
      </h1>

      <div className=" flex justify-center items-center mt-6 bg-[#EDEDED] h-32 w-full border-2 rounded-3xl">
        <p className="p-6 text-lg text-gray-700">
          Add this credential to your LinkedIn profile, resume, or CV Share it
          on social media and in your performance review jghjfhg jkhidfglkhk Add
          this credential to your LinkedIn profile, resume, or CV Share it on
          social media and in your performance review.
        </p>
      </div>
      <div className="flex mt-12">
        <img className="w-1/2" src="/image/Certificate.png" alt="cerificate" />
        <div className="flex flex-col w-1/2 justify-center items-center gap-8">
          <div className="relative cursor-pointer">
            <img className="absolute right-[86px] bottom-[86px]" src="/image/Arrow.png" alt="arrow" />
            <img
              className="w-[250px] h-[250px] "
              src="/image/Ellipse 65.png"
              alt="ellips"
            />
          </div>
          <p className="text-xl">You can download certificate from here.</p>
        </div>
      </div>
    </div>
  );
}

export default Certificate;
