import React from "react";
import { IoSearchOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function CoursesOffered() {
  const navigate = useNavigate();

  const handleClickMulti = () => {
    navigate("/member");
  };

  const handleClickSingle = () => {
    navigate("/courses/overview");
  };

  return (
    <>
      <div className="container mx-auto gap-4 p-4 md:flex md:flex-col lg:flex-row xl:flex-row md:items-start py-8">
        {/* Left side with text */}
        <div className="w-full md:w-[60%] lg:w-[60%] xl:w-[60%] mb-4">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4 lg:mb-6">
            Explore Our Courses
          </h1>
          <p className="text-gray-700 py-2 text-sm md:text-base ">
            Welcome to EdLernity! Explore a wide range of courses designed to
            help you enhance your skills and achieve your learning goals.
            Discover industry-leading courses taught by experts in their fields,
            covering topics such as programming, data science, web development,
            and more.
          </p>
          <p className="text-gray-700 py-2 text-sm md:text-base ">
            Whether you're a beginner looking to start your learning journey or
            an experienced professional seeking to expand your knowledge, we
            have courses tailored to meet your needs. Join thousands of students
            who have already benefited from our high-quality courses and unlock
            new opportunities for personal and professional growth.
          </p>
          <p className="text-gray-700 py-2 text-sm md:text-base ">
            Take the next step towards advancing your career and mastering new
            skills. Explore our courses now and embark on your learning
            adventure with EdLernity!
          </p>
        </div>

        {/* Right side with image and text overlay */}
        <div className="relative w-full md:w-[40%] lg:w-[40%] xl:w-[40%] mb-4">
        
          <img
            src="/Image/our_course.png"
            alt="Course"
            className="w-96 h-[310px] rounded-lg"
          />

       
          <div className="absolute inset-0 top-5 md:top-10 right-4 md:right-10 lg:right-16 flex flex-col items-center">
            <p className="text-white text-center font-bold mb-2 text-base md:text-lg lg:text-xl">
              Our Courses
            </p>
            <p className="text-white text-center mb-1 text-sm md:text-base lg:text-lg">
              Featured Courses
            </p>
            <button
              type="button"
              className="flex text-white rounded-md bg-[#7D96F0] px-3 py-1 mt-2 items-center ml-1 text-xs md:text-sm lg:text-base"
              onClick={handleClickSingle}
            >
              <IoSearchOutline className="mr-0.5" />
              Explore
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto gap-4 p-4 md:flex md:flex-col lg:flex-row xl:flex-row md:items-start py-8">
        {/* Left side with text */}
        <div className="relative  md:w-[40%] lg:w-[40%] xl:w-[40%] mb-4">
          <img
            src="/Image/stats-home.png" 
            alt="Course"
            className="w-96 h-[310px] rounded-lg"
          />
        </div>
        <div className="pr-4 sm:pr-8 md:pr-12 lg:pr-20">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4 lg:mb-6">
            Enroll Now and Take Your Skills to the Next Level!
          </h1>
          <p className="text-gray-700 py-2 text-sm md:text-base ">
            Ready to level up your skills and unlock new opportunities? Enroll
            in our courses today and embark on a journey of learning and growth,
            Join a community of learners and professionals who are passionate
            about expanding their knowledge and mastering new skills. Enroll now
            to access high-quality courses taught by industry experts.
          </p>
          <p className="text-gray-700 py-2 text-sm md:text-base ">
            With our comprehensive courses, you'll gain practical skills and
            valuable insights that will empower you to succeed in your career
            and achieve your goals. From beginner-friendly courses to advanced
            specializations, we offer a diverse range of learning options to
            suit every skill level and interest. Enroll now and start learning
            at your own pace.
          </p>
          <p className="text-gray-700 py-2 text-sm md:text-base ">
            Don't miss out on the chance to enhance your skills and advance your
            career. Enroll in our courses today and take the first step towards
            a brighter future!
          </p>
        </div>
      </div>

      <div className="container mx-auto gap-4 p-4 md:flex md:flex-col lg:flex-row xl:flex-row md:items-start py-8">
      <div class="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
      <div class="p-8 sm:p-10 lg:flex-auto">
        <h3 class="text-2xl font-bold tracking-tight text-gray-900">One-time Subscription 15+ Courses</h3>
        <p class="mt-6 text-base leading-7 text-gray-600">One-time Subscription: Access 15+ Courses. Pay once, unlock unlimited learning. Dive into diverse topics, from coding to business skills, with our comprehensive course bundle.</p>
        <div class="mt-10 flex items-center gap-x-4">
          <h4 class="flex-none text-sm font-semibold leading-6 text-indigo-600">What’s included</h4>
          <div class="h-px flex-auto bg-gray-100"></div>
        </div>
        <ul role="list" class="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6">
          <li class="flex gap-x-3">
            <svg class="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
            </svg>
            Subscription to unlimited access to all our courses
          </li>
          <li class="flex gap-x-3">
            <svg class="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
            </svg>
            1,000+ hours of learning
          </li>
          <li class="flex gap-x-3">
            <svg class="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
            </svg>
            Access to 100+ upcoming courses in 2025
          </li>
          <li class="flex gap-x-3">
            <svg class="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
            </svg>
            E-books worth ₹9,999
          </li>
        </ul>
      </div>
      <div class="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
      <div onClick={handleClickMulti} className="cursor-pointer flex-shrink-0 p-10 relative overflow-hidden bg-white rounded-lg max-w-md shadow-lg transition-all  duration-1000  hover:bg-blue-100  hover:shadow-xl   z-40 group ">
              <svg className="absolute bottom-0 left-0 mb-8" viewBox="0 0 375 283" fill="none" style={{ transform: 'scale(1.5)', opacity: 0.1 }}>
                <rect x="159.52" y="175" width="152" height="152" rx="8" transform="rotate(-45 159.52 175)" fill="blue" />
                <rect y="107.48" width="152" height="152" rx="8" transform="rotate(-45 0 107.48)" fill="blue" />
              </svg>
          <div class="mx-auto max-w-xs px-8">
            
            <p class="text-base font-semibold text-gray-600">EdLernity's Lifetime subscription</p>
            <p class="mt-6 flex items-baseline justify-center gap-x-2">
              <span class="text-5xl font-bold tracking-tight text-gray-900">₹ 989</span>
              <span class="text-sm font-semibold leading-6 tracking-wide text-gray-600">INR</span>
            </p>
            <span  class="mt-10 block w-full rounded-md bg-gray-900 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Explore</span>
            <p class="mt-6 text-xs leading-5 text-gray-600">Pay once, own it forever</p>
          </div>
        </div>
      </div>
    </div>
      </div>
    </>
  );
}

export default CoursesOffered;
