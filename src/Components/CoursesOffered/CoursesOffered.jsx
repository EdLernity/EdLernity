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
        <div className="relative w-full md:w-[40%] lg:w-[40%] xl:w-[40%] mb-4">
          <img
            src="/Image/stats-home.png" 
            alt="Course"
           className="w-[350px] h-[300px] rounded-lg max-w-[350px]"
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
        {/* Left side with text */}
        <div className="w-full mb-4">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4 lg:mb-6">
            Unlock Unlimited Learning with Our Exclusive Membership!
          </h1>
          <p className="text-gray-700 py-2 text-sm md:text-base ">
            Ready to supercharge your learning journey? Explore our exclusive
            membership options to gain unlimited access to our extensive library
            of 15+ courses and premium content. Our membership packages offer
            unparalleled value, giving you access to a wealth of knowledge
            across various domains. From programming and technology to business
            and personal development, there's something for everyone.
          </p>
          <p className="text-gray-700 py-2 text-sm md:text-base ">
            With our membership, you'll enjoy flexible learning options,
            including on-demand access to all courses, exclusive webinars, and
            live Q&A sessions with industry experts. Discover the true potential
            of online learning with our membership perks, which include
            unlimited course enrollments, downloadable resources, and
            personalized learning paths tailored to your goals.
          </p>
          <p className="text-gray-700 py-2 text-sm md:text-base ">
            Invest in your future with our membership plans and unlock a world
            of opportunities for growth and advancement. Join our community of
            lifelong learners and embark on a transformative learning experience
            today!
          </p>
        </div>

        {/* Right side with image and text overlay */}
        <div className="relative w-full md:w-[50%] lg:w-[50%] xl:w-[50%] pr-4 sm:pr-8 md:pr-12 lg:pr-20 mb-4">
          <img
            src="/Image/membership.png"
            alt="Course"
            className="w-full h-[300px] md:h-[430px] rounded-lg max-w-[450px]"
          />
          <div className="absolute inset-0 top-3 right-4 sm:right-8 md:right-12 lg:right-20 flex flex-col items-center">
            <p className="text-black text-2xl font-extrabold text-center w-[80%] mb-4">
              One-time Subscription 15+ Courses
            </p>
            <ul className="w-[60%] list-disc text-sm md:text-base lg:text-lg">
              <li className="text-black text-start">
                Subscription to unlimited access to all our courses
              </li>
              <li className="text-black text-start">1,000+ hours of learning</li>
              <li className="text-black text-start">
                Access to 100+ upcoming courses in 2025
              </li>
              <li className="text-black text-start">E-books worth ₹9,999</li>
            </ul>
            <button
              type="button"
              className="flex text-white rounded-md bg-[#000] px-3 py-1 mt-4 items-center text-sm md:text-base lg:text-lg"
              onClick={handleClickMulti}
            >
              <IoSearchOutline className="mr-0.5" />
              Explore
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CoursesOffered;
