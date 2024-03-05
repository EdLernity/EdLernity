import React from "react";
import { IoSearchOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function CoursesOffered() {

    const navigate = useNavigate()

    const handleClickMulti = () => {
        navigate()
    }

    const handleClickSingle = () => {
        navigate("/courses/overview")
    }

  return (
    <>
      <div className="container mx-auto gap-32 p-4 pb-8 md:flex md:items-start py-12 pt-20">
        {/* Left side with text */}
        <div className="w-[60%] animate__animated animate__backInLeft">
          <h1 className="text-2xl font-bold mb-4">Explore Our Courses</h1>
          <p className="text-gray-700 py-2">
            Welcome to EdLernity! Explore a wide range of courses designed to
            help you enhance your skills and achieve your learning goals,
            Discover industry-leading courses taught by experts in their fields,
            covering topics such as programming, data science, web development,
            and more.
          </p>
          <p className="text-gray-700 py-2">
            Whether you're a beginner looking to start your learning journey or
            an experienced professional seeking to expand your knowledge, we
            have courses tailored to meet your needs, Join thousands of students
            who have already benefited from our high-quality courses and unlock
            new opportunities for personal and professional growth.
          </p>
          <p className="text-gray-700 py-2">
            Take the next step towards advancing your career and mastering new
            skills. Explore our courses now and embark on your learning
            adventure with EdLernity!
          </p>
        </div>

        {/* Right side with image and text overlay */}
        <div className="relative w-[40%] animate__animated animate__backInRight">
          <img
            src="/Image/Intern2.png"
            alt="Course"
            className="w-96 h-[310px] rounded-lg"
          />
          <div className="absolute inset-0 top-5 right-20 flex flex-col items-center">
            <p className="text-white text-center font-bold mb-2 text-2xl">Our Courses</p>
            <p className="text-white text-center mb-1">Featured Courses</p>
            <button
              type="button"
              className="flex text-white rounded-md bg-[#1649FF] px-4 py-1 mt-2 items-center ml-1"
              onClick={handleClickSingle}
            >
              <IoSearchOutline className="mr-0.5" />
              Explore
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto gap-32 p-4 md:flex md:items-start py-12">
        {/* Left side with text */}

        <div className="relative w-[40%] animate__animated animate__backInLeft">
          <img
            src="/Image/Graph12.png" // Replace with your actual image URL
            alt="Course"
            className="w-[400px] h-[330px] rounded-lg max-w-[400px]"
          />
        </div>
        <div className="pr-20 animate__animated animate__backInRight">
          <h1 className="text-2xl font-bold mb-4">
            Enroll Now and Take Your Skills to the Next Level!
          </h1>
          <p className="text-gray-700 py-2">
            Ready to level up your skills and unlock new opportunities? Enroll
            in our courses today and embark on a journey of learning and growth,
            Join a community of learners and professionals who are passionate
            about expanding their knowledge and mastering new skills. Enroll now
            to access high-quality courses taught by industry experts.
          </p>
          <p className="text-gray-700 py-2">
            With our comprehensive courses, you'll gain practical skills and
            valuable insights that will empower you to succeed in your career
            and achieve your goals, From beginner-friendly courses to advanced
            specializations, we offer a diverse range of learning options to
            suit every skill level and interest. Enroll now and start learning
            at your own pace.
          </p>
          <p className="text-gray-700 py-2">
            Don't miss out on the chance to enhance your skills and advance your
            career. Enroll in our courses today and take the first step towards
            a brighter future!
          </p>
        </div>

        {/* Right side with image and text overlay */}
      </div>

      <div className="container mx-auto gap-32 p-4 md:flex md:items-start py-12">
        {/* Left side with text */}
        <div className="animate__animated animate__backInLeft">
          <h1 className="text-2xl font-bold mb-4">Unlock Unlimited Learning with Our Exclusive Membership!</h1>
          <p className="text-gray-700 py-2">
          Ready to supercharge your learning journey? Explore our exclusive membership options to gain unlimited access to our extensive library of 15+ courses and premium content, Our membership packages offer unparalleled value, giving you access to a wealth of knowledge across various domains. From programming and technology to business and personal development, there's something for everyone.
          </p>
          <p className="text-gray-700 py-2">
          With our membership, you'll enjoy flexible learning options, including on-demand access to all courses, exclusive webinars, and live Q&A sessions with industry experts, Discover the true potential of online learning with our membership perks, which include unlimited course enrollments, downloadable resources, and personalized learning paths tailored to your goals.
          </p>
          <p className="text-gray-700 py-2">
          Invest in your future with our membership plans and unlock a world of opportunities for growth and advancement. Join our community of lifelong learners and embark on a transformative learning experience today!.
          </p>
        </div>

        {/* Right side with image and text overlay */}
        <div className="relative w-[50%] pr-20 mb-12 animate__animated animate__backInRight">
          <img
            src="/Image/membership-image.png"
            alt="Course"
            className="w-[450px] h-[430px] rounded-lg max-w-[450px]"
          />
          <div className="absolute inset-0 top-3 right-20 flex flex-col items-center">
            <p className="text-black text-2xl font-extrabold text-center w-[80%] mb-6">One time Subscription 15+ Courses</p>
            <ul className="w-[60%] list-disc">
                <li className="text-black text-start">Subscription to unlimited access to all our courses</li>
                <li className="text-black text-start">1,000+ hours of learning</li>
                <li className="text-black text-start">Access to 100+ upcoming courses in 2025</li>
                <li className="text-black text-start">E-books worth ₹9,999</li>
            </ul>
            <button
              type="button"
              className="flex text-white rounded-md bg-[#25602A] px-4 py-1 mt-4 items-center ml-1"
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
