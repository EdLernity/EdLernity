import {
  Accordion,
  AccordionBody,
  AccordionHeader
} from "@material-tailwind/react";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Store } from "../../../Context";
import BaseLayout from "../../../Layout/BaseLayout";
import SeoHead from "../../SEO/SeoHead";
import { testimonialsData } from "../../../StaticObj/testimonials";
import { BACKEND_URL } from "../../../URL_Config";
import { buildCourseSchema } from "../../../Utils/seoConfig";
import CourseFeatures from "./CourseFeatures";
import StarRating from "./CourseRating";
import Testimonials from "./Testimonials";
import "./Ui.css";

function Ui() {
  const location = useLocation();
  const { dynamicValue: courseId } = useParams();
  const { course, data } = location?.state ?? {};
  const { enrolledList } = useContext(Store);
  const [activeCourse, setActiveCourse] = useState(course ?? null);
  const [catalogData, setCatalogData] = useState(data ?? null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState("");
  const [open, setOpen] = useState("");
  const handleOpen = (value) => setOpen(open === value ? null : value);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [topPicks, setTopPicks] = useState([]);
  const [error, setError] = useState(null);
const navigate=useNavigate();
  const openModal = (videoUrl) => {
    setCurrentVideo(videoUrl);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setCurrentVideo("");
  };

  useEffect(() => {
    if (course) {
      setActiveCourse(course);
      setCatalogData(data);
      return;
    }

    if (!courseId) return;

    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          BACKEND_URL + "/api/v1/course/get-all-course-details",
          { params: { isFromUI: true } }
        );
        const courses = response.data.data;
        const found = courses.find((c) => c._id === courseId);
        if (found) {
          setActiveCourse(found);
          setCatalogData({
            allCoursesData: courses,
            popularCoursesData: courses.filter((d) => d.isPopular),
            coursesData: courses.slice(0, 4),
          });
        }
      } catch (err) {
        setError(err);
      }
    };

    fetchCourse();
  }, [course, courseId, data]);

  useEffect(() => {
    if (!activeCourse?.tags || !activeCourse?._id) return;

    axios
      .get(
        BACKEND_URL +
          `/api/v1/course/get-all-videos-tags/${activeCourse.tags}/${activeCourse._id}`
      )
      .then((res) => {
        setTopPicks(res?.data?.courses);
      })
      .catch((err) => {
        setError(err);
      });
  }, [activeCourse]);

  // useErrorToast(error);

  const handleClick = (course) => {
    
  
    
    navigate(`/courses/overview/${course._id}`, {
      state: { course, data: catalogData },
    });
  };
  const cardData = [
    {
      image: "/Image/Rectangle.png",
      video: "https://www.youtube.com/embed/udMeRUz-7WY?autoplay=1&mute=1",
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
  const handleCheckout = () => {
    const token = localStorage.getItem("_userAuth");
    if (!token) {
        // Get the current URL to use as a redirect URL
        const currentPath = window.location.pathname;
        
        // Navigate to login with redirect URL
        navigate('/auth/login', {
            state: { redirectUrl: currentPath, course: activeCourse }
        });
        return;
    } else {
        navigate("/payment", {
            state: { course: activeCourse },
        });
    }
}


const getCourseRating=(rating)=>{
  const sumOfRatings = rating?.reduce((total, score) => total + score.rating, 0);
  // Calculate the average rating
const averageRating = Math.round(sumOfRatings / rating?.length);
return averageRating;
}
  

  const topPicksData = [
    {
      data: catalogData?.popularCoursesData[3],
      rating: 5,
      duration: "5.2 hours",
      language: "English",
    },
    {
      data: catalogData?.popularCoursesData[1],
      rating: 4.5,
      duration: "7.4 hours",
      language: "English",
    },
    {
      data: catalogData?.popularCoursesData[2],
      rating: 4.3,
      duration: "10 hours",
      language: "English",
    },
    {
      data: catalogData?.popularCoursesData[0],
      rating: 4.2,
      duration: "8 hours",
      language: "English",
    },
    // Add more data for additional cards
  ];

  const [visibleCards, setVisibleCards] = useState(1);

  

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
        {activeCourse && (
          <SeoHead
            title={`${activeCourse.courseTitle} Online Course`}
            description={
              activeCourse.courseOverviewDesc ||
              activeCourse.courseDesc ||
              `Learn ${activeCourse.courseTitle} with EdLernity's expert-led online course.`
            }
            path={`/courses/overview/${activeCourse._id}`}
            keywords={`${activeCourse.courseTitle} course, online ${activeCourse.courseTitle}, EdLernity`}
            ogImage={activeCourse.courseBanner}
            ogType="product"
            jsonLd={buildCourseSchema(activeCourse)}
          />
        )}

        <div class="container max-w-xl p-6 mx-auto space-y-12 lg:px-8 lg:max-w-7xl">
          <h1
            style={{ color: "#181FC5" }}
            class="text-lg items-start justify-start  font-bold text-left sm:text-5xl"
          >
            {activeCourse?.courseTitle}
          </h1>

          <div class="mt-8 lg:-mx-6 lg:flex lg:items-center">
          <img class="object-cover w-full lg:mx-6 lg:w-1/2 rounded-xl h-72 lg:h-[30rem]" src={activeCourse?.
courseBanner} alt={activeCourse?.courseTitle ? `${activeCourse.courseTitle} course banner` : "Course banner"}/>
            <div class="mt-6 lg:w-1/2 lg:mt-0 lg:mx-6 ">
                

               

                <p class="mt-3 text-md text-gray-600 dark:text-gray-300 md:text-md">
                {activeCourse?.courseOverviewDesc}
                </p>

                
                <div class="flex flex-wrap gap-2 mt-2">
                  <div class="center relative inline-block select-none whitespace-nowrap rounded-lg bg-indigo-500 py-2 px-3.5 align-baseline font-sans text-xs font-bold uppercase leading-none text-white">
                    <div class="absolute top-2/4 left-1 h-5 w-5 -translate-y-2/4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122"
                        />
                      </svg>
                    </div>
                    <div class="ml-4 mt-px">
                      {activeCourse?.videosLength} Lectures
                    </div>
                  </div>

                 
                  
                  <div class="center relative inline-block select-none whitespace-nowrap rounded-lg bg-indigo-500 py-2 px-3.5 align-baseline font-sans text-xs font-bold uppercase leading-none text-white">
                    <div class="absolute top-2/4 left-1 h-5 w-5 -translate-y-2/4">
                    <svg fill="#ffffff" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M235.57178,214.21094l-56-112a4.00006,4.00006,0,0,0-7.15528,0l-22.854,45.708a92.04522,92.04522,0,0,1-55.57275-20.5752A99.707,99.707,0,0,0,123.90723,60h28.08691a4,4,0,0,0,0-8h-60V32a4,4,0,0,0-8,0V52h-60a4,4,0,0,0,0,8h91.90772a91.74207,91.74207,0,0,1-27.91895,62.03357A91.67371,91.67371,0,0,1,65.23389,86.667a4,4,0,0,0-7.542,2.668,99.63009,99.63009,0,0,0,24.30469,38.02075A91.5649,91.5649,0,0,1,23.99414,148a4,4,0,0,0,0,8,99.54451,99.54451,0,0,0,63.99951-23.22461,100.10427,100.10427,0,0,0,57.65479,22.97192L116.4165,214.21094a4,4,0,1,0,7.15528,3.57812L138.46631,188H213.522l14.89453,29.78906a4,4,0,1,0,7.15528-3.57812ZM142.46631,180l33.52783-67.05566L209.522,180Z"></path> </g></svg>
                    </div>
                    <div class="ml-4 mt-px">
                    English
                    </div>
                  </div>
                 
                  <div class="center relative inline-block select-none whitespace-nowrap rounded-lg bg-indigo-500 py-2 px-3.5 align-baseline font-sans text-xs font-bold uppercase leading-none text-white">
                    <div class="absolute top-2/4 left-1 h-5 w-5 -translate-y-2/4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mb-1">
  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6A2.25 2.25 0 0 1 6 3.75h1.5m9 0h-9" />
</svg>

                    </div>
                    <div class="ml-4 mt-px">
                    LifeTime
                    </div>
                  </div>
                  
                  {/* {course?.enrollmentCount>0&&<div  class="center relative inline-block select-none whitespace-nowrap rounded-lg bg-indigo-500 py-2 px-3.5 align-baseline font-sans text-xs font-bold uppercase leading-none text-white">
                    <div class="absolute top-2/4 left-1 h-5 w-5 -translate-y-2/4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
</svg>

                    </div>
                    <div class="ml-4 mt-px">
                    {course?.enrollmentCount} students enrolled
                    </div>
                  </div>} */}
                 
                </div>
                <div
          className="flex justify-center mt-5 items-center flex-col"
          style={{ marginLeft: "20px" }}
        >
         
          <div class="flex items-center space-x-4 my-4">
          <div>
            <div class="rounded-lg bg-gray-100 flex py-2 px-3">
              <span class="text-indigo-400 mr-1 mt-1">₹</span>
              <span class="font-bold text-indigo-600 text-3xl">{activeCourse?.offeredPrice}</span>
            </div>
          </div>
          <div class="flex-1">
            <p class="text-green-500 text-xl font-semibold">Save {activeCourse?.discountInPercentage} %</p>
            <span className="ml-1 text-xl sm:text-sm line-through text-gray-600">
              ₹{activeCourse?.initialPrice}
            </span>
          </div>
        </div>
         
        <StarRating rating={getCourseRating(activeCourse?.courseScore?.map(score => score?.rating))} />
        </div>
        <div className="item-center flex justify-center mt-8  ">
        {activeCourse && enrolledList.includes(activeCourse._id)?
        <button onClick={()=>navigate("/mycourses")} class="px-8 py-2 bg-indigo-600 text-white text-md font-medium rounded-lg hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500 w-60">Go to Course</button>
        :<button onClick={handleCheckout} class="px-8 py-2 bg-indigo-600 text-white text-md font-medium rounded-lg hover:bg-indigo-500 focus:outline-none focus:bg-indigo-500 w-60">Enroll Now</button>
}</div>
            </div>
            
        </div>
      
        </div>

        <CourseFeatures contentList={activeCourse?.contentList} />
        
        

        

       
        
        <div className="mt-8 sm:mt-12 md:mt-16 lg:mt-24">
    <div className="flex flex-col sm:flex-row items-center px-4 sm:px-8 md:px-[1rem] lg:justify-center">
        <div className="relative bg-gray-300 py-8 sm:py-12 rounded-l-3xl px-4 sm:px-8 md:px-12 mb-4 sm:mb-0  md:w-1/2 overflow-hidden">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 text-blue-600">
                Earn a Career Certificate
            </h2>
            <p className="text-gray-700">
                Add this credential to your LinkedIn profile, resume, or CV.
                Share it on social media and in your performance review.
            </p>
        </div>
        <img
            src="/Image/Course completion certificate _20240427_184541_0000[1]_page-0001.jpg"
            alt="Certificate"
            className="w-full sm:w-auto md:w-1/2 lg:w-1/3 rounded-xl h-auto"
        />
    </div>
</div>


        <div className="mt-12">
          <h2
            className="text-md lg:text-2xl mt-10  text-center font-bold "
            style={{ color: "#181FC5" }}
          >
            {activeCourse?.courseTitle} Training Syllabus
          </h2>
          {activeCourse?.courseContentDescription?.map((c, index) => (
            <div key={index} className="mt-4 items-center justify-center px-12">
              <Accordion
                open={open === index}
                icon={<Icon id={index} open={open} />}
              >
                <AccordionHeader
                  onClick={() => handleOpen(index)}
                  style={{ color: "#181FC5" }}
                >
                  {c.title}
                </AccordionHeader>
                <AccordionBody>{c.description}</AccordionBody>
              </Accordion>
            </div>
          ))}
        </div>
       
        <Testimonials
        testimonials={testimonialsData}
        />

        <div className="mt-2 pb-16">
          <h4
            className="text-3xl mt-1 lg:ml-10 font-bold text-center"
            style={{ color: "#181FC5" }}
          >
            Our Top Picks for You
          </h4>
         <div class="flex overflow-x-scroll pb-10 hide-scroll-bar pt-3 ms-10">
            <div className="flex space-x-4">
            {topPicks?.map((course, index) => (
              <>
              <div className="flex-shrink-0 p-5 relative overflow-hidden bg-blue-900 rounded-lg max-w-md shadow-lg transition-all  duration-1000  hover:bg-blue-600  hover:shadow-xl   z-40 group ">
              <svg className="absolute bottom-0 left-0 mb-8" viewBox="0 0 375 283" fill="none" style={{ transform: 'scale(1.5)', opacity: 0.1 }}>
                <rect x="159.52" y="175" width="152" height="152" rx="8" transform="rotate(-45 159.52 175)" fill="white" />
                <rect y="107.48" width="152" height="152" rx="8" transform="rotate(-45 0 107.48)" fill="white" />
              </svg>
              <div className="relative pt-10 px-10 flex items-center justify-center">
                <div className="block absolute w-48 h-48 bottom-0 left-0 -mb-24 ml-3" style={{ background: 'radial-gradient(black, transparent 60%)', transform: 'rotate3d(0, 0, 1, 20deg) scale3d(1, 0.6, 1)', opacity: 0.2 }}></div>
                <img className="relative w-40" src={course.courseBanner} alt={`${course.courseTitle} course thumbnail`}/>
              </div>
              <div className="relative text-white px- pb-6 mt-6 ">
                <span className="block font-semibold -mb-1">{`${(course?.courseTitle || "").slice(0, 20)}${
                            (course?.courseTitle || "").length > 100
                              ? "..."
                              : ""
                          }`}</span>
                <div className="flex justify-between">
                  <span className="block  text-sm opacity-75">{`${(course?.courseDesc || "").slice(0, 20)}${
                            (course?.courseDesc || "").length > 100
                              ? "..."
                              : ""
                          }`}</span>
                  <span onClick={()=>handleClick(course)} className="block cursor-pointer bg-white rounded-full text-purple-500 text-sm font-bold px-3 py-2 leading-none  items-center">Browse</span>
                </div>
              </div>
            </div>
              </>
              ))}
            </div>
          </div>
        </div>
      </BaseLayout>
    </>
  );
}

export default Ui;
