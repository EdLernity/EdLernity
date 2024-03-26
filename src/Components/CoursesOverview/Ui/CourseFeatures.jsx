import React from 'react';

function CourseFeatures({ contentList }) {
  return (
    <>
      <span className="block mx-auto text-lg font-semibold tracking-wider text-gray-600 text-center">What you'll learn</span>

      <div className="flex flex-wrap ml-2 mr-2 lg:w-4/5 sm:mx-auto sm:mb-2 -mx-2">
        {contentList?.split(",").map((item, index) => (
          <div className="sm:w-1/2 w-full p-1" key={index}>
            <div className="bg-gray-100 rounded flex p-4 h-full items-center">
              <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"
                className="text-indigo-500 w-6 h-6 flex-shrink-0 mr-4" viewBox="0 0 24 24">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                <path d="M22 4L12 14.01l-3-3"></path>
              </svg>
              <span className="font-medium">{item}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default CourseFeatures;
