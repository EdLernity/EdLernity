import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
} from "@material-tailwind/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate } from "react-router-dom";
import BaseLayout from "../../Layout/BaseLayout";
import { BACKEND_URL } from "../../URL_Config";

function Courses1() {
  const [isLoading, setIsLoading] = useState(true);
  const cardStyle = {
    position: "relative",
    width: "300px",
    margin: "10px",
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    overflow: "hidden",
  };

  const imageStyle = {
    width: "100%",
    height: "auto",
    borderRadius: "8px",
  };

  const textStyle = {
    position: "absolute",
    top: "25%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "#fff",
    fontSize: "2.0rem",
    fontWeight: "bold",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
  };

  const [data, setData] = useState({
    allCoursesData: [],
    popularCoursesData: [],
    coursesData: [],
  });
  const navigate = useNavigate();

  const handleClick = (course) => {
   
    navigate(`${window.location.pathname}/${course._id}`, {
      state: { course, data },
    });
  };

  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const response = await axios.get(
          BACKEND_URL + "/api/v1/course/get-all-course-details",
          {
            params: {
              isFromUI: true, // or false depending on your requirement
            },
          }
        );
        if (response.status === 200) {
          setIsLoading(false);
        }
        const { data } = response.data;
        console.log(data);
        const updatedAllCoursesData = data.map((course) => ({
          ...course,
          buttonText: "Overview",
        }));

        let updatedCoursesData = data.map((course) => ({
          ...course,
          buttonText: "Explore",
        }));

        updatedCoursesData = updatedCoursesData.slice(0, 4);

        const popularCourses = data.filter((d) => {
          return d.isPopular === true;
        });

        setData({
          ...data,
          allCoursesData: updatedAllCoursesData,
          coursesData: updatedCoursesData,
          popularCoursesData: popularCourses,
        });
      } catch (error) {
        console.error("Error fetching all course details:", error);
      }
    };

    fetchAllCourses();
  }, []);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState([]);

  const handleOpen = (course) => {
    console.log(course);
    setSelectedCourse(course);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  console.log(isLoading);

  return (
    <BaseLayout>
      <Helmet>
        <meta charSet="utf-8" />
        <title>EdLernity | Courses </title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      <h1
        className="text-3xl mt-10 lg:ml-24 sm:ml-4 text-center lg:text-left font-bold"
        style={{ color: "#181FC5" }}
      >
        Explore Course{" "}
      </h1>

      <div class="flex overflow-x-scroll pb-10 hide-scroll-bar pt-3">
        <div class="flex flex-nowrap lg:ml-[5.5rem] md:ml-20 ml-[4rem] ">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <div class="inline-block px-3">
                  <div class="w-64 h-64 max-w-xs overflow-hidden rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out"></div>
                </div>
              ))
            : data.coursesData.map((course, index) => (
                <>
                  <div class="inline-block px-3">
                    <div
                      onClick={() => handleClick(course)}
                      class="w-64 h-64 max-w-xs cursor-pointer overflow-hidden rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out"
                    >
                      <img
                        src={course.courseBanner}
                        alt={course.courseTitle}
                        class="mb-3 h-full w-full rounded-xl 3xl:h-full 3xl:w-full"
                      />
                    </div>
                  </div>
                </>
              ))}
        </div>
      </div>
      <div hidden={data.popularCoursesData.length===0}>
        <h1
          className="text-3xl mt-10 lg:ml-24 sm:ml-4 text-center lg:text-left font-bold"
          style={{ color: "#181FC5" }}
        >
          Popular Courses
        </h1>
        <div class="flex overflow-x-scroll pb-10 hide-scroll-bar pt-3">
          <div class="flex flex-nowrap lg:ml-[5rem] md:ml-20 ml-[4rem] ">
            {isLoading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <div class="inline-block px-3">
                    <div class="w-64 h-64 max-w-xs overflow-hidden rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out"></div>
                  </div>
                ))
              : data.popularCoursesData.map((popularCourse, index) => (
                  <>
                    <div
                      key={index}
                      onClick={() => handleClick(popularCourse)}
                      class="relative max-w-sm min-w-[340px] bg-white shadow-md rounded-3xl p-2 mx-1 my-3 duration-300 cursor-pointer hover:scale-105 hover:shadow-lg"
                    >
                      <div class="overflow-x-hidden rounded-2xl relative">
                        <div class="relative">
                          <img
                            class="w-full rounded-lg"
                            src={popularCourse.courseBanner}
                            alt="Colors"
                          />
                          {/* <p class="absolute top-0 bg-green-300 text-gray-800 font-semibold py-1 px-3 rounded-br-lg rounded-tl-lg">₹{popularCourse?.initialPrice}</p> */}
                          <p class="absolute top-0 right-0 bg-cyan-300 text-gray-800 font-semibold py-1 px-3 rounded-tr-lg rounded-bl-lg">
                            {popularCourse?.discountInPercentage}% Discount
                          </p>
                        </div>
                        {/* <p class="absolute right-2 top-2 bg-white rounded-full p-2 cursor-pointer group">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 group-hover:opacity-50 opacity-70" fill="none" viewBox="0 0 24 24" stroke="black">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </p> */}
                      </div>

                      <div class="p-4">
                        <h2 class="mb-2 text-lg font-medium dark:text-white text-gray-900">
                          {popularCourse.courseTitle}
                        </h2>
                        <p class="mb-2 text-base dark:text-gray-300 text-gray-700">
                          {`${(popularCourse?.courseDesc || "").slice(0, 50)}${
                            (popularCourse?.courseDesc || "").length > 100
                              ? "..."
                              : ""
                          }`}
                        </p>

                        <div class="flex items-center">
                          <p class="mr-2 text-lg font-semibold text-gray-900 dark:text-white">
                            ₹{popularCourse?.offeredPrice}
                          </p>
                          <p class="text-base  font-medium text-gray-500 line-through dark:text-gray-300">
                            ₹{popularCourse?.initialPrice}
                          </p>
                          <p class="ml-auto text-base font-medium text-green-500">
                            {" "}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ))}
          </div>
        </div>
      </div>
      <div>
        <h1
          className="text-3xl mt-10 lg:ml-24 sm:ml-4 text-center lg:text-left font-bold"
          style={{ color: "#181FC5" }}
        >
          All Courses{" "}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:mx-24 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-4 mb-16">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <div key={index}>
                  <Skeleton
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                    height={260}
                    style={{ marginBottom: "10px" }}
                  />
                </div>
              ))
            : data.allCoursesData.map((course, index) => (
              <div className="flex-shrink-0  relative overflow-hidden bg-blue-900 rounded-lg max-w-md shadow-lg transition-all  duration-1000  hover:bg-blue-600  hover:shadow-xl   z-40 group ">
              <svg className="absolute bottom-0 left-0 mb-8" viewBox="0 0 375 283" fill="none" style={{ transform: 'scale(1.5)', opacity: 0.1 }}>
                <rect x="159.52" y="175" width="152" height="152" rx="8" transform="rotate(-45 159.52 175)" fill="white" />
                <rect y="107.48" width="152" height="152" rx="8" transform="rotate(-45 0 107.48)" fill="white" />
              </svg>
              <div className="relative pt-10 px-10 flex items-center justify-center">
                <div className="block absolute w-48 h-48 bottom-0 left-0 -mb-24 ml-3" style={{ background: 'radial-gradient(black, transparent 60%)', transform: 'rotate3d(0, 0, 1, 20deg) scale3d(1, 0.6, 1)', opacity: 0.2 }}></div>
                <img className="relative w-40" src={course.courseBanner} alt=""/>
              </div>
              <div className="relative text-white px-6 pb-6 mt-6">
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
                  <span onClick={() => handleClick(course)} className="block cursor-pointer bg-white rounded-full text-purple-500 text-sm font-bold px-3 py-2 leading-none  items-center">Browse</span>
                </div>
              </div>
            </div>
              ))}
        </div>

        {/* Dialog */}
        {selectedCourse && (
          <Dialog
            className="bg-[#181FC5]"
            open={openDialog}
            handler={handleClose}
          >
            <DialogHeader className="justify-between text-white">
              {selectedCourse.courseTitle}
              <IconButton
                color="white"
                size="sm"
                variant="text"
                onClick={handleClose}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </IconButton>
            </DialogHeader>
            <DialogBody>
              <img
                src={`/Image/${selectedCourse?.image}`}
                alt={selectedCourse?.courseTitle}
                className="w-32 h-32 text-white object-cover mb-4 rounded-lg"
              />
              <p className="text-gray-200">{selectedCourse?.courseDesc}</p>
            </DialogBody>
            <DialogFooter className="flex justify-between">
              <div>
                <div>
                  <span className="text-red-500">
                    - {selectedCourse?.discountInPercentage} %
                  </span>{" "}
                  <span className="ml-1 text-xs font-semibold sm:text-sm text-white">
                    ₹{selectedCourse?.offeredPrice}
                  </span>
                </div>
                <div>
                  <span className="text-white">Price :</span>
                  <span className="ml-1 text-xl sm:text-sm line-through text-gray-400">
                    ₹{selectedCourse?.initialPrice}
                  </span>
                </div>
              </div>
              <button
                
                className="text-white bg-blue-500 px-8 py-2 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue mr-1"
              >
                <span>Explore</span>
              </button>
            </DialogFooter>
          </Dialog>
        )}
      </div>
    </BaseLayout>
  );
}

export default Courses1;
