import React, { useState, useEffect } from "react";
import BaseLayout from "../../Layout/BaseLayout.jsx";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate } from "react-router-dom";

function MyCourses() {
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

  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();

  const [data, setData] = useState({
    userAllCoursesData: [],
  });

  const handleClick = (course) => {
    localStorage.setItem("current_course", course.folderName);
    localStorage.setItem("courseName", course.courseTitle);
    localStorage.setItem("userName", "Nikhil Raj");
    navigate(`/mycourses/${course._id}`, {
      state: { course },
    });
  };

  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const response = await axios.get(
          "http://3.110.210.79:3001/api/get-course-by-id"
        );

        console.log(response);

        if (response.status === 200) {
          setIsLoading(false);
        }
        const { data } = response.data;
        console.log(data);
        const updatedAllCoursesData = data.map((course) => ({
          ...course,
          buttonText: "Overview",
        }));

        setData({
          ...data,
          userAllCoursesData: updatedAllCoursesData,
        });

        const count = await axios.get(
          "http://3.110.210.79:3001/api/get-all-course-count"
        );
        setTotalCount(count.data.data);
      } catch (error) {
        console.error("Error fetching all course details:", error);
      }
    };

    fetchAllCourses();
  }, []);

  let name = localStorage.getItem("userName");

  return (
    <BaseLayout>
      <section className="w-screen h-full overflow-hidden">
        <div className="px-4 grid md:px-4 py-8 grid-cols-3 lg:grid-cols-3 gap-8 xl:gap-8">
          <div className="h-[600px] flex col-span-1 justify-center items-center overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            <div className="pl-5 flex flex-col space-y-4 lg:order-2 lg:row-start-1">
              <h2 className="text-5xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Hi, {name}
              </h2>
              <p className="w-[90%] text-gray-500 md:text-xl/relaxed dark:text-gray-400">
                Explore and master your enrolled courses, Enhance your skills
                with our curated content.
              </p>
              <div className="max-w-md flex flex-col justify-between rounded overflow-hidden border shadow-xl px-8 py-8">
                <span className="font-bold text-3xl py-4">
                  Total Courses : {totalCount ? totalCount : "0"}
                </span>
              </div>
              <div className="max-w-md flex flex-col justify-between rounded overflow-hidden border shadow-xl px-8 py-8">
                <span className="font-bold text-3xl py-4">
                  Total Enrolled Courses :{" "}
                  {data?.userAllCoursesData?.length || 0}
                </span>
              </div>
            </div>
          </div>
          <div className="grid gap-6 h-[700px] col-span-2 md:gap-8 items-stretch lg:order-1 lg:gap-10 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Enrolled Courses
            </h2>
            <div className="flex flex-row flex-wrap gap-1">
              {isLoading
                ? Array.from({ length: 9 }).map((_, index) => (
                    <div key={index}>
                      <Skeleton
                        width={300}
                        height={300}
                        style={{ marginBottom: "10px" }}
                      />
                    </div>
                  ))
                : data.userAllCoursesData.map((course, index) => (
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
          </div>
        </div>
      </section>
    </BaseLayout>
  );
}

export default MyCourses;
