import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BaseLayout from "../../Layout/BaseLayout";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  IconButton,
} from "@material-tailwind/react";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Helmet } from "react-helmet";

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
    localStorage.setItem("current_course", course.folderName);
    localStorage.setItem("courseName", course.courseTitle);
    localStorage.setItem("userName", "Nikhil Raj");
    navigate(`${window.location.pathname}/${course._id}`, {
      state: { course , data },
    });
  };

  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const response = await axios.get(
          "http://3.110.210.79:3001/api/get-all-course-details", {
            params: {
              isFromUI: true // or false depending on your requirement
            }
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
      <div className="flex flex-wrap justify-around p-20">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div key={index}>
                <Skeleton
                  width={300}
                  height={300}
                  style={{ marginBottom: "10px" }}
                />
              </div>
            ))
          : data.coursesData.map((course, index) => (
              <div
                key={index}
                className="relative w-300 m-10 text-center shadow-lg rounded-2xl overflow-hidden animate__animated animate__pulse"
                style={cardStyle}
              >
                <img
                  src={`/Image/${course.image}`}
                  alt={course.courseTitle}
                  style={{ filter: "blur(2px)", ...imageStyle }}
                />
                <div
                  className="absolute top-25 left-50 transform -translate-x-50 -translate-y-50 text-white font-bold text-2xl"
                  style={textStyle}
                >
                  {course.courseTitle}
                </div>
                <div className="absolute bottom-5 left-0 right-0 text-center">
                  <button
                    className="text-black bg-gray-200 px-6 text-center py-2 rounded-3xl justify-center"
                    onClick={() => handleClick(course)}
                  >
                    {course.buttonText}
                  </button>
                </div>
              </div>
            ))}
      </div>
      <div>
        <h1
          className="text-3xl mt-10 lg:ml-24 sm:ml-4 text-center lg:text-left font-bold"
          style={{ color: "#181FC5" }}
        >
          Popular Courses
        </h1>
        {isLoading
          ? Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="mx-4 md:mx-24 mt-8">
                <Skeleton
                  className="items-center justify-between py-4 flex md:flex-row px-4 md:px-8 h-32"
                  style={{ marginBottom: "10px", borderRadius: "16px" }}
                />
              </div>
            ))
          : data.popularCoursesData.map((popularCourse, index) => (
              <div
                key={index}
                className="bg-[#181FC5] items-center justify-between mx-4 md:mx-24 mt-8 rounded-2xl py-4 flex md:flex-row px-4 md:px-8 cursor-pointer"
                onClick={() => handleClick(popularCourse)}
              >
                <div className="mb-2 md:mb-0 md:mr-4">
                  <h1 className="text-xl text-nowrap text-white animate-pulse">
                    {popularCourse.courseTitle}
                  </h1>
                </div>
                <div>
                  <img
                    src={`/Image/${popularCourse.image}`}
                    alt="polular course"
                    className="w-24 md:ml-2 animate-pulse"
                  />
                </div>
              </div>
            ))}
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
                <div
                  key={index}
                  className="bg-[#181FC5] p-4 rounded-lg shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <img
                      src={`/Image/${course.image}`}
                      alt={course.courseTitle}
                      className="w-24 h-24 object-cover mb-4 rounded-lg"
                    />
                    <h2 className="text-xl text-white font-bold mb-2">
                      {course.courseTitle}
                    </h2>
                    <p
                      className="text-gray-200 whitespace-nowrap"
                      style={{ overflow: "hidden", textOverflow: "ellipsis" }}
                    >
                      {course.courseDesc}
                    </p>
                  </div>
                  <div className="mt-4">
                    <button
                      className="text-white bg-blue-500 px-4 py-2 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
                      onClick={() => handleOpen(course)}
                    >
                      {course.buttonText}
                    </button>
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
                onClick={() => handleClick(selectedCourse)}
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
