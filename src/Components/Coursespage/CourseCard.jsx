// CourseCard.js
import React from 'react';

function CourseCard({ course, openModal }) {
  return (
    <div className="lg:w-1/3 lg:ml-4 mt-4 lg:mt-0 mr-5 flex items-center">
      <div className="relative" style={{ height: "100%" }}>
        <img
          src={course.image}
          alt={course.name}
          className="section3 rounded-2xl w-full max-w-md lg:max-w-full lg:w-full"
          style={{ height: "100%" }}
        />
        <button
          className="rounded-3xl w-12 h-12 px-4 cursor-pointer absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          onClick={() => openModal(course.video)}
        >
          <img
            src="/Image/Polygon 1.svg"
            alt="Play"
            className="bg-[#181FC5] rounded-3xl w-12 h-12 px-4 cursor-pointer"
            style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
          />
        </button>
      </div>
    </div>
  );
}

export default CourseCard;
