import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import CourseCard from "../../Coursespage/CourseCard";
import VideoModal from "../../Coursespage/VideoModal";
import BaseLayout from "../../../Layout/BaseLayout";
import CourseDetails from "../../Coursespage/CourseDetails";
import { StarIcon } from "@heroicons/react/solid";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import { Rating } from "@material-tailwind/react";
import { NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import './Ui.css';
import useErrorToast from '../../../Hooks/useErrorToast';

function Ui() {
  const location = useLocation();
  const { course, data } = location?.state ?? {};
  const [isOpen, setIsOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState("");
  const [open, setOpen] = useState("");
  const handleOpen = (value) => setOpen(open === value ? null : value);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [firstVideoUrl,setFirstVideoUrl] = useState("");
  const [error, setError] = useState(null);

  const openModal = (videoUrl) => {
    setCurrentVideo(videoUrl);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setCurrentVideo("");
  };

  useEffect(() => {
    const folderName = localStorage.getItem("current_course");
    // try {
    //   axios.get(`http://3.110.210.79:3001/api/courses/${folderName}/${course?.videoNames[0]}`)
    //   .then((res) => {
    //     setFirstVideoUrl(res?.data?.videoUrl);
    //   }).catch((err) => {
    //     setError(err);
    //   });
    // } catch (err) {
    //   setError(err);
    //   console.log("Error getting the video url from server." , error);
    // }
  }, [course?.videoNames]);

  useErrorToast(error);

  const cardData = [
    {
        image: '/Image/Rectangle.png',
        video: 'https://www.youtube.com/embed/udMeRUz-7WY?autoplay=1&mute=1',
        // video: firstVideoUrl,
    },
];

const badges = [
{ image: "/Image/Badge.png", alt: "Top Choice Badge", text: "Top Choice" },
{
  image: "/Image/Fire.png",
  alt: "Most Popular Badge",
  text: "Most Popular",
},
{ image: "/Image/Fire.png", alt: "Best ROI Badge", text: "Best ROI" },
];

  function Icon({ id, open }) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className={`${
          id === open ? "rotate-180" : ""
        } h-5 w-5 transition-transform`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
        />
      </svg>
    );
  }

  const reviewData = [
    {
      id: 1,
      image: "sejal-kesharwani.jpeg",
      comment:
        "Edlernity offers a variety of courses for students who are really keen to start a career in the IT field. It has become easy to learn programming languages in an amazing way with the help of experts.",
      name: "Surabhi Kesarwani",
    },
    {
      id: 2,
      image: "roshan-kumar.jpeg",
      comment:
        "The Subscription Course Package is an excellent investment for anyone committed to continuous learning and personal growth. Its flexibility, quality content, and supportive environment make it a standout choice in the crowded online learning landscape. I highly recommend EdLernity's Life time subscription it to anyone looking to expand their knowledge and skills in a convenient and effective manner. ",
      name: "Roshan Kumar",
    },
    {
      id: 3,
      image: "sraadha-gupta.jpeg",
      comment:
        "Great course, so many important topics covered in depth. There were many assessments which made us confident with our skills. I would like to enroll in more courses offered by EdLernity.",
      name: "Shraddha Gupta",
    },
    {
      id: 4,
      image: "tamanna.jpeg",
      comment:
        "Upon completing each course, learners receive a certificate of completion, which can be a valuable addition to their resume or professional portfolio. The certificates attest to the learner's mastery of the course material and can enhance their credibility in their chosen field and Overall, the Lifetime Membership of EdLernity is comprehensive and flexible learning experience that empowers learners to acquire new skills, advance their careers, and pursue their passions effectively and efficiently.",
      name: "Tamanna",
    },
    {
      id: 5,
      image: "manjari-rastogi.jpeg",
      comment:
        "Edlernity offers a variety of courses for students who are really keen to start a career in the IT field. It has become easy to learn programming languages in an amazing way with the help of experts.",
      name: "Manjari Rastogi",
    },
    {
      id: 6,
      image: "uzmaafreen-shirasangi.jpeg",
      comment:
        "Edlernity is one of the most amazing platform to get a chance for learning and improving all technical skills required for all IT students it's worthy to have an opportunity to learn and acquire skills of languages that provided by their inspired and professional teachers ..happy learning with EdLernity.",
      name: "Uzmaafreen Shirasangi",
    },
    {
      id: 7,
      image: "muthhar-dargah.jpeg",
      comment:
        "The quality of the course content is exceptional. Each module is well-structured, with clear explanations and practical examples that facilitate understanding and retention of the material. The instructors are knowledgeable and engaging, providing valuable insights and guidance throughout the learning process with EdLernity.This sense of community fosters a supportive learning environment and encourages peer-to-peer learning and networking.",
      name: "Muthhar Dargah",
    },
    {
      id: 8,
      image: "nafeesa-lachan.jpeg",
      comment:
        "One of the most impressive aspects of the course package of EdLernity is its flexibility. With lifetime access, I could progress through the courses at my own pace, allowing me to balance my learning with other commitments. Additionally, the diverse selection of courses catered to different interests and skill levels, ensuring there was always something new and relevant to explore. I can confidently say that it exceeded my expectations in every aspect.",
      name: "Nafeesa Lachan",
    },
  ];

  const topPicksData = [
    {
      data : data?.popularCoursesData[3],
      rating: 5,
      duration: "5.2 hours",
      language: "English",
    },
    {
      data : data?.popularCoursesData[1],
      rating: 4.5,
      duration: "7.4 hours",
      language: "English",
    },
    {
      data : data?.popularCoursesData[2],
      rating: 4.3,
      duration: "10 hours",
      language: "English",
    },
    {
      data : data?.popularCoursesData[0],
      rating: 4.2,
      duration: "8 hours",
      language: "English",
    }
    // Add more data for additional cards
  ];

  const [visibleCards, setVisibleCards] = useState(1);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % reviewData.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prevSlide) => (prevSlide - 1 + reviewData.length) % reviewData.length
    );
  };

  const handleResize = () => {
    const screenWidth = window.innerWidth;

    if (screenWidth >= 768) {
      setVisibleCards(3);
    } else {
      setVisibleCards(1);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <BaseLayout>
        <Helmet>
          <meta charSet="utf-8" />
          <title>EdLernity {course?.courseTitle ? `| ${course?.courseTitle}` : ""}</title>
          <link rel="canonical" href="http://mysite.com/example" />
        </Helmet>

        <h1
          className="text-3xl mt-10 lg:ml-24 sm:ml-4 text-center lg:text-left font-bold"
          style={{ color: "#181FC5" }}
        >
          {course?.courseTitle}
        </h1>

        <div className="mt-10">
          <div className="flex flex-col lg:flex-row mx-2 lg:mx-24">
            {cardData?.map((course, index) => (
              <CourseCard key={index} course={course} openModal={openModal} />
            ))}

            <CourseDetails
              badges={badges}
              description={course?.courseOverviewDesc}
            />
          </div>

          <VideoModal
            isOpen={isOpen}
            closeModal={closeModal}
            videoUrl={currentVideo}
          />
        </div>

        <div className="flex items-center mt-5 gap-24  justify-center flex-wrap">
          <div className="bg-[#181FC5] flex items-center px-4  p-1 gap-2 mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto">
            <img
              src="/Image/Badge.png"
              alt="Top Choice Badge"
              className="w-6 h-6"
            />
            <h4 className="text-white font-semibold text-sm">{course?.videoNames?.length} Lectures</h4>
          </div>

          <div className="bg-[#181FC5] flex items-center px-4 p-1 gap-2 mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto">
            <img
              src="/Image/Fire.png"
              alt="Most Popular Badge"
              className="w-6 h-6"
            />
            <h4 className="text-white font-semibold text-sm">3.5 hours</h4>
          </div>

          <div className="bg-[#181FC5] flex items-center px-4 p-1 gap-2 mb-2 sm:mb-0 sm:mr-2 w-full sm:w-auto">
            <img
              src="/Image/Fire.png"
              alt="Most Popular Badge"
              className="w-6 h-6"
            />
            <h4 className="text-white font-semibold text-sm">English</h4>
          </div>

          <div className="bg-[#181FC5] flex items-center px-4 p-1 gap-2 w-full sm:w-auto">
            <img
              src="/Image/Fire.png"
              alt="Best ROI Badge"
              className="w-6 h-6"
            />
            <h4 className="text-white font-semibold text-sm">Life Time</h4>
          </div>
        </div>

        <div className="item-center flex justify-center mt-8 sm:mt-24 animate-pulse">
          <div className="bg-[#2F35CB] rounded-2xl px-4 sm:px-12 py-2 sm:p-3">
            <NavLink to="/payment-method">
              <button className="text-white text-base sm:text-lg px-8 sm:px-24">
                Enroll now
              </button>
            </NavLink>
          </div>
        </div>

        <div
          className="flex justify-center mt-5 items-center flex-col"
          style={{ marginLeft: "20px" }}
        >
          <div className="flex flex-row">
            {[...Array(5)].map((_, index) => (
              <StarIcon
                key={index}
                className="w-4 h-4 sm:w-5 sm:h-5"
                style={{ color: "#353BCC" }}
              />
            ))}
            <p className="ml-2 text-xs sm:text-sm" style={{ color: "#353BCC" }}>
              5 Reviews
            </p>
          </div>
          <div>
            <span className="text-red-500">
              - {course?.discountInPercentage} %
            </span>{" "}
            <span className="ml-1 text-xs font-semibold sm:text-sm">
              ₹{course?.offeredPrice}
            </span>
          </div>
          <div>
            <span className="text-[#353BCC]">Price :</span>
            <span className="ml-1 text-xl sm:text-sm line-through text-gray-600">
              ₹{course?.initialPrice}
            </span>
          </div>
        </div>
        <div className="mt-24">
          <div className="flex items-center px-4 sm:px-8 md:px-12 lg:justify-center">
            <div className="relative bg-gray-300 py-8 sm:py-12 rounded-l-3xl px-4 sm:px-8 md:px-12 overflow-hidden">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 text-blue-600">
                Earn a Career Certificate
              </h2>
              <p className="text-gray-700">
                Add this credential to your LinkedIn profile, resume, or CV.
                Share it on social media and in your performance review.
              </p>
            </div>
            <img
              src="/Image/Certificate of Completion (E.png"
              alt="Certificate"
              className="w-24 sm:w-48 md:w-64 lg:w-96 rounded-xl h-auto ml-[-10px] relative z-10"
            />
          </div>
        </div>

        <div className="mt-12">
          <h1
            className="text-3xl  mt-10  text-center font-bold "
            style={{ color: "#181FC5" }}
          >
            {course?.courseTitle} Training Syllabus
          </h1>
          {course?.courseContentDescription.map((c, index) => (
            <div key={index} className="mt-4 items-center justify-center px-12">
              <Accordion
                open={open === index}
                icon={<Icon id={index} open={open} />}
              >
                <AccordionHeader
                  onClick={() => handleOpen(index)}
                  style={{ color: "#181FC5" }}
                >
                  {c.question}
                </AccordionHeader>
                <AccordionBody>{c.answer}</AccordionBody>
              </Accordion>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <h1
            className="text-center font-bold text-3xl"
            style={{ color: "#181FC5" }}
          >
            Review from Learners
          </h1>
          <div className="flex flex-col gap-4">
            <div className="flex mt-5 justify-center items-center">
              <Rating readonly value={4} ratedColor="blue" />
              <span className="text-gray-600 ml-2">4.3 Reviews</span>
            </div>
          </div>
          <div className="flex justify-center mt-8 -space-x-4 items-center relative overflow-x-auto">
            <button
              className="absolute left-0 top-1/2 transform -translate-y-1/2"
              onClick={prevSlide}
            >
              <ChevronLeftIcon className="w-12 h-12 text-gray-600" />
            </button>

            <div className="max-w-screen-lg mx-auto mt-10 w-full">
              <div className="flex items-center justify-center flex-wrap">
                {reviewData?.map(
                  (item, index) =>
                    index >= currentSlide &&
                    index < currentSlide + visibleCards && (
                      <div
                        key={index}
                        className="w-full sm:w-1/2 md:w-1/3 lg:w-[28%] p-4"
                      >
                        <div className="review-container rounded-md h-96 bg-[#D9D9D9]">
                          <div className="w-full h-48 sm:h-32 mx-auto bg-blue-500 rounded-t-md">
                            <img
                              src={`/Image/user-review-img/${item?.image}`}
                              alt={item?.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <h2 className="text-xl font-bold mb-2">
                              {item?.name}
                            </h2>
                            <p>{item?.comment}</p>
                          </div>
                        </div>
                      </div>
                    )
                )}
              </div>
            </div>

            <button
              className="absolute right-0 top-1/2 transform -translate-y-1/2"
              onClick={nextSlide}
            >
              <ChevronRightIcon className="w-12 h-12 text-gray-600" />
            </button>
          </div>

          <div className="flex justify-center mt-4 space-x-2">
            {reviewData?.map((_, index) => (
              <div
                key={index}
                className={`dot w-4 h-4 rounded-full ${
                  index === currentSlide ? "bg-blue-500" : "bg-gray-300"
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>

        <div className="mt-12 pb-16">
          <h4
            className="text-3xl mt-10 lg:ml-10 font-bold text-center"
            style={{ color: "#181FC5" }}
          >
            Our Top Picks for You
          </h4>
          <div className="flex justify-center items-center mt-6 overflow-x-auto">
            <div className="flex space-x-4">
              {topPicksData?.map((item, index) => (
                <div key={index} className="bg-blue-700 rounded-2xl p-8">
                  <h5 className="text-white text-center py-10 text-lg font-semibold">
                    {item?.data?.courseTitle}
                  </h5>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center">
                      <StarIcon className="w-5 h-5 text-white mr-1" />
                      <span className="text-white">{item?.rating}</span>
                    </div>
                    <p className="text-white ml-4">
                      {item?.duration} | {item?.language}
                    </p>
                  </div>
                  <div className="flex  rounded-2xl justify-between items-center gap-4 mt-4">
                    <p className="text-white">{item?.price}</p>
                    <NavLink to="/payment-method">
                      <button className="text-white">Know more {">"} </button>
                    </NavLink>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </BaseLayout>
    </>
  );
}

export default Ui;
