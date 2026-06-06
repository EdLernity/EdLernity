// CourseDetails.js
import React from 'react';

function CourseDetails({ badges, description }) {
  return (
    <div className="lg:w-2/3 lg:pl-4 mt-4 lg:mt-0">
      <div className='flex items-center justify-center lg:justify-between flex-wrap'>
        {badges.map((badge, index) => (
          <div key={index} className='badge bg-[#181FC5] flex items-center px-4 p-1 gap-2 mb-2 lg:mb-0 lg:mr-2 w-full lg:w-auto'>
            <img src={badge.image} alt={badge.alt} className='w-6 h-6' />
            <h4 className='text-white font-semibold text-sm'>{badge.text}</h4>
          </div>
        ))}
      </div>
      <hr className='mt-5 text-black border-gray-900 font-bold' style={{ color: "#000000" }} />
      <p className="text-base lg:text-lg leading-relaxed" style={{ fontFamily: "Roboto" }}>
        {description}
      </p>
    </div>
  );
}

export default CourseDetails;
