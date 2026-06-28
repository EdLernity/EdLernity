import React from "react";
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
     

      {/* <div className="container mx-auto gap-4 p-4 md:flex md:flex-col lg:flex-row xl:flex-row md:items-start py-8">
       
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
      </div> */}
<div className="container mx-auto gap-4 p-4 md:flex md:flex-col lg:flex-row xl:flex-row md:items-start py-8">
      <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
      <div className="p-8 sm:p-10 lg:flex-auto">
        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">Explore Our Courses</h3>
        <p className="mt-6 text-base leading-relaxed text-slate-600 font-medium">  Welcome to EdLernity! Explore a wide range of courses designed to
            help you enhance your skills and achieve your learning goals.
            Discover industry-leading courses taught by experts in their fields,
            covering topics such as programming, data science, web development,
            and more.
            <br></br>
            Whether you're a beginner looking to start your learning journey or
            an experienced professional seeking to expand your knowledge, we
            have courses tailored to meet your needs. Join thousands of students
            who have already benefited from our high-quality courses and unlock
            new opportunities for personal and professional growth.</p>
            
        <div className="mt-10 flex items-center gap-x-4">
          <h4 className="flex-none text-sm font-bold uppercase tracking-wider text-indigo-600">What’s included</h4>
          <div className="h-px flex-auto bg-gray-100"></div>
        </div>
        <ul role="list" className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-slate-600 font-medium sm:grid-cols-2 sm:gap-6">
          <li className="flex gap-x-3">
            <svg className="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
            </svg>
            Subscription to unlimited access to all our courses
          </li>
          <li className="flex gap-x-3">
            <svg className="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
            </svg>
            1,000+ hours of learning
          </li>
          <li className="flex gap-x-3">
            <svg className="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
            </svg>
            ISO Certified
          </li>
          <li className="flex gap-x-3">
            <svg className="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
            </svg>
            Access to 100+ upcoming courses in 2025
          </li>
          <li className="flex gap-x-3">
            <svg className="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
            </svg>
            E-books worth ₹9,999
          </li>
        </ul>
      </div>
      <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
      <div onClick={handleClickSingle} className="cursor-pointer flex-shrink-0 p-10 relative overflow-hidden bg-white rounded-lg max-w-md shadow-lg transition-all  duration-1000  hover:bg-blue-100  hover:shadow-xl   z-40 group ">
              <svg className="absolute bottom-0 left-0 mb-8" viewBox="0 0 375 283" fill="" style={{ transform: 'scale(1.5)', opacity: 0.1 }}>
                <rect x="159.52" y="175" width="152" height="152" rx="8" transform="rotate(-45 159.52 175)" fill="blue" />
                <rect y="107.48" width="152" height="152" rx="8" transform="rotate(-45 0 107.48)" fill="blue" />
              </svg>
          <div className="mx-auto max-w-xs px-8">
            
            <p className="text-base font-bold text-center text-slate-600">Explore Our Courses</p>
            <p className="mt-6 flex items-baseline justify-center gap-x-2">
            Starting from 
              <span className="text-5xl font-extrabold tracking-tight text-slate-900">₹599</span>
              <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">INR</span>
            </p>
            <span  className="mt-10 block w-full rounded-md bg-gray-900 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Explore</span>
            <p className="mt-6 text-xs leading-5 text-gray-600">Pay once, own it forever</p>
          </div>
        </div>
      </div>
    </div>
      </div>
      <div className="container mx-auto gap-4 p-4 md:flex md:flex-col lg:flex-row xl:flex-row md:items-start py-8">
      <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
      <div className="p-8 sm:p-10 lg:flex-auto">
        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">One-time Subscription 12+ Courses</h3>
        <p className="mt-6 text-base leading-relaxed text-slate-600 font-medium">One-time Subscription: Access 12+ Courses. Pay once, unlock unlimited learning. Dive into diverse topics, from coding to business skills, with our comprehensive course bundle.</p>
        <div className="mt-10 flex items-center gap-x-4">
          <h4 className="flex-none text-sm font-bold uppercase tracking-wider text-indigo-600">What’s included</h4>
          <div className="h-px flex-auto bg-gray-100"></div>
        </div>
        <ul role="list" className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-slate-600 font-medium sm:grid-cols-2 sm:gap-6">
          <li className="flex gap-x-3">
            <svg className="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
            </svg>
            Subscription to unlimited access to all our courses
          </li>
          <li className="flex gap-x-3">
            <svg className="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
            </svg>
            1,000+ hours of learning
          </li>
          <li className="flex gap-x-3">
            <svg className="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
            </svg>
            ISO Certified
          </li>
          <li className="flex gap-x-3">
            <svg className="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
            </svg>
            Access to 100+ upcoming courses in 2025
          </li>
          <li className="flex gap-x-3">
            <svg className="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
            </svg>
            E-books worth ₹9,999
          </li>
        </ul>
      </div>
      <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
      <div onClick={handleClickMulti} className="cursor-pointer flex-shrink-0 p-10 relative overflow-hidden bg-white rounded-lg max-w-md shadow-lg transition-all  duration-1000  hover:bg-blue-100  hover:shadow-xl   z-40 group ">
              <svg className="absolute bottom-0 left-0 mb-8" viewBox="0 0 375 283" fill="none" style={{ transform: 'scale(1.5)', opacity: 0.1 }}>
                <rect x="159.52" y="175" width="152" height="152" rx="8" transform="rotate(-45 159.52 175)" fill="blue" />
                <rect y="107.48" width="152" height="152" rx="8" transform="rotate(-45 0 107.48)" fill="blue" />
              </svg>
          <div className="mx-auto max-w-xs px-8">
            
            <p className="text-base font-bold text-slate-600">EdLernity's Lifetime subscription</p>
            <p className="mt-6 flex items-baseline justify-center gap-x-2">
              <span className="text-5xl font-extrabold tracking-tight text-slate-900">₹ 899</span>
              <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">INR</span>
            </p>
            <span  className="mt-10 block w-full rounded-md bg-gray-900 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Explore</span>
            <p className="mt-6 text-xs leading-5 text-gray-600">Pay once, own it forever</p>
          </div>
        </div>
      </div>
    </div>
      </div>

      {/* Third Card: Lifetime Subscription */}
      <div className="container mx-auto gap-4 p-4 md:flex md:flex-col lg:flex-row xl:flex-row md:items-start py-8">
        <div className="mx-auto mt-4 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-8 lg:mx-0 lg:flex lg:max-w-none">
          <div className="p-8 sm:p-10 lg:flex-auto">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">One-time Subscription 12+ Courses</h3>
            <p className="mt-6 text-base leading-relaxed text-slate-600 font-medium">One-time Subscription: Access 12+ Courses. Pay once, unlock unlimited learning. Dive into diverse topics, from coding to business skills, with our comprehensive course bundle.</p>
            <div className="mt-10 flex items-center gap-x-4">
              <h4 className="flex-none text-sm font-bold uppercase tracking-wider text-indigo-600">What's included</h4>
              <div className="h-px flex-auto bg-gray-100"></div>
            </div>
            <ul role="list" className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-slate-600 font-medium sm:grid-cols-2 sm:gap-6">
              <li className="flex gap-x-3">
                <svg className="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                Subscription to unlimited access to all our courses
              </li>
              <li className="flex gap-x-3">
                <svg className="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                1,000+ hours of learning
              </li>
              <li className="flex gap-x-3">
                <svg className="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                ISO Certified
              </li>
              <li className="flex gap-x-3">
                <svg className="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                Access to 100+ upcoming courses in 2025
              </li>
              <li className="flex gap-x-3">
                <svg className="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                E-books worth ₹9,999
              </li>
            </ul>
          </div>
          <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
            <div onClick={handleClickMulti} className="cursor-pointer flex-shrink-0 p-10 relative overflow-hidden bg-white rounded-lg max-w-md shadow-lg transition-all duration-1000 hover:bg-blue-100 hover:shadow-xl z-40 group">
              <svg className="absolute bottom-0 left-0 mb-8" viewBox="0 0 375 283" fill="none" style={{ transform: 'scale(1.5)', opacity: 0.1 }}>
                <rect x="159.52" y="175" width="152" height="152" rx="8" transform="rotate(-45 159.52 175)" fill="blue" />
                <rect y="107.48" width="152" height="152" rx="8" transform="rotate(-45 0 107.48)" fill="blue" />
              </svg>
              <div className="mx-auto max-w-xs px-8">
                <p className="text-base font-bold text-slate-600">EdLernity's Lifetime subscription</p>
                <p className="mt-6 flex items-baseline justify-center gap-x-2">
                  <span className="text-5xl font-extrabold tracking-tight text-slate-900">₹ 899</span>
                  <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">INR</span>
                </p>
                <span className="mt-10 block w-full rounded-md bg-gray-900 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Explore</span>
                <p className="mt-6 text-xs leading-5 text-gray-600">Pay once, own it forever</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CoursesOffered;
