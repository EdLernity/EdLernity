import React from "react";
import { CiPlay1 } from "react-icons/ci";

function Coursecontent({ courseTitle, videos , setUrl}) {

  const handleClick = (event) => {
    console.log(event)
    setUrl(event);
  };

  return (
    <div>
      <h1 className="text-center pb-4 font-bold text-2xl text-[#1539cf] leading-6">{courseTitle}</h1>
      <div className="bg-[#F2F2F2] rounded-xl px-6 pt-1.5 pb-6 max-h-[585px] overflow-y-auto shadow-2xl">
        {videos.map((videoTitle,index) => {
          return (
            <>
              <div key={index} className="flex items-end mt-4">
                <CiPlay1 size={20} color="#78A9FF" />
                <p className="cursor-pointer font-medium leading-6 text-sm ml-2" onClick={handleClick}>{videoTitle}</p>
              </div>
              <hr className="h-0.5 text-color-[#D2D2D2] bg-[#D2D2D2] w-full mt-3" />
            </>
          );
        })}
      </div>
    </div>
  );
}

export default Coursecontent;
