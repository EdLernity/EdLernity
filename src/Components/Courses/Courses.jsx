import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { apiInstancePrivate } from "../../Utils/AxiosInstance";
import Certificate from "../Certificate/Certificate";
import Loader from "../Utils/Spinner";
import VideoPlayer from "./Video/VideoPlayer";
const StarRating = (props) => {
  const { ratingValue, setRating, courseId, handleRating } = props; // Added courseId
  const handleStarClick = (rating) => {
    setRating(rating); // Set the rating
    handleRating(courseId, rating); // Call handleRating with courseId
  };

  return (
    <div style={{ display: "flex" }}>
      {[...Array(5)].map((star, i) => {
        const rating = i + 1;
        return (
          <label key={i} onClick={() => handleStarClick(rating)}>
            {" "}
            {/* Call handleStarClick when star is clicked */}
            {rating <= ratingValue ? (
              <svg
                className="h-5 w-5 shrink-0 fill-amber-400 cursor-pointer"
                viewBox="0 0 256 256"
              >
                <path d="M239.2 97.4A16.4 16.4 0 00224.6 86l-59.4-4.1-22-55.5A16.4 16.4 0 00128 16h0a16.4 16.4 0 00-15.2 10.4L90.4 82.2 31.4 86A16.5 16.5 0 0016.8 97.4 16.8 16.8 0 0022 115.5l45.4 38.4L53.9 207a18.5 18.5 0 007 19.6 18 18 0 0020.1.6l46.9-29.7h.2l50.5 31.9a16.1 16.1 0 008.7 2.6 16.5 16.5 0 0015.8-20.8l-14.3-58.1L234 115.5A16.8 16.8 0 00239.2 97.4z" />
              </svg>
            ) : (
              <svg
                className="h-5 w-5 shrink-0 fill-gray-300 cursor-pointer"
                viewBox="0 0 256 256"
              >
                <path d="M239.2 97.4A16.4 16.4 0 00224.6 86l-59.4-4.1-22-55.5A16.4 16.4 0 00128 16h0a16.4 16.4 0 00-15.2 10.4L90.4 82.2 31.4 86A16.5 16.5 0 0016.8 97.4 16.8 16.8 0 0022 115.5l45.4 38.4L53.9 207a18.5 18.5 0 007 19.6 18 18 0 0020.1.6l46.9-29.7h.2l50.5 31.9a16.1 16.1 0 008.7 2.6 16.5 16.5 0 0015.8-20.8l-14.3-58.1L234 115.5A16.8 16.8 0 00239.2 97.4z" />
              </svg>
            )}
          </label>
        );
      })}
    </div>
  );
};

function Courses() {
  const location = useLocation();
  const { id } = useParams();
  
  
  console.log(id);
  const [playlist, setPlaylist] = useState([]);
  const [loading, setloading] = useState(false);
  const [rating, setRating] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null); // State to manage selected video
  const [activeIndex, setActiveIndex] = useState(0); // State to manage active playlist item index
  const [course, setCourse] = useState("");
  let navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("_userAuth");
    if (!token) {
      navigate("/auth/login", { replace: true });
    }
  }, []);
  const handleRating = (courseId, rating) => {
    apiInstancePrivate
      .post("/api/v1/course/rate-course", {
        courseId: courseId,
        rating: rating,
      })
      .then((res) => {})
      .catch((err) => {
        //console.log(err);
      })
      .finally(() => {});
  };

  useEffect(() => {
    setloading(true);
    apiInstancePrivate
      .post("/api/v1/course/get-course-watching", {
        courseId: id,
      })
      .then((res) => {
        console.log(res)
        setCourse(res.data.courseName)
        setPlaylist(res.data.data.lessonList);
        setSelectedVideo(res.data.data.lessonList[0]);
        setRating(res.data.rating);
      })
      .catch((err) => {
        //console.log(err);
      })
      .finally(() => {
        setloading(false);
      });
  }, [course]);

  // Function to handle video selection
  const handleVideoSelect = (video, index) => {
    setSelectedVideo(video);
    setActiveIndex(index); // Set active index when playlist item is clicked
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div class="w-full">
          <div class="flex   bg-white  rounded-lg overflow-hidden mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div class=" p-5 border-b">
                {selectedVideo && (
                  <VideoPlayer
                    video={selectedVideo}
                    courseBanner={course?.courseBanner}
                  />
                )}{" "}
                {/* Render VideoPlayer if video is selected */}
                <div class="flex flex-col px-2 w-full">
                  <span class="text-xs text-gray-700 uppercase font-medium ">
                    now playing
                  </span>
                  <span class="text-sm text-red-500 capitalize font-semibold pt-1">
                    {/* Display video title */}
                    {selectedVideo ? selectedVideo.title : ""}
                  </span>
                  <span class="text-xs text-gray-500 uppercase font-medium ">
                    {/* {`- "${selectedVideo?.artist}"`} */}
                  </span>
                </div>
              </div>

              <div class="flex-col p-5 hidden md:flex">
                <div class="border-b pb-1 flex justify-between items-center mb-2">
                  <span class=" text-base font-semibold uppercase text-gray-700">
                    {" "}
                    Course Structure
                  </span>
                  {/* <StarRating
                  ratingValue={rating}
                  setRating={setRating}
                  courseId={course?._id}
                  handleRating={handleRating}
                /> */}
                </div>

                {/* Mapping through playlist to render dynamic playlist */}
                <div className="h-96 overflow-y-auto">
                  {playlist?.map((video, index) => (
                    <>
                      <div
                        key={index}
                        class={`flex border-b py-3 cursor-pointer ${
                          activeIndex === index ? "bg-gray-200" : ""
                        } hover:shadow-md px-2`}
                        onClick={() => handleVideoSelect(video, index)} // Select video on click
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="w-6 h-6 my-1"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                          />
                        </svg>

                        <div class="flex flex-col px-2 w-full">
                          <span class="text-md text-red-500 capitalize font-semibold pt-1">
                            {video.title}
                          </span>
                        </div>
                      </div>
                    </>
                  ))}
                </div>
              </div>
              <div class="px-5 md:hidden">
                <details class="group">
                  <summary class="flex justify-between items-center font-medium cursor-pointer list-none">
                    <span class=" text-base font-semibold uppercase text-gray-700">
                      {" "}
                      Course Structure
                    </span>
                    <span class="transition group-open:rotate-180">
                      <svg
                        fill="none"
                        height="24"
                        shape-rendering="geometricPrecision"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        viewBox="0 0 24 24"
                        width="24"
                      >
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </summary>
                  <p class="text-neutral-600 mt-3 group-open:animate-fadeIn">
                    <div className="h-96 overflow-y-auto">
                      {playlist?.map((video, index) => (
                        <>
                          <div
                            key={index}
                            class={`flex border-b py-3 cursor-pointer ${
                              activeIndex === index ? "bg-gray-200" : ""
                            } hover:shadow-md px-2`}
                            onClick={() => handleVideoSelect(video, index)} // Select video on click
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              class="w-6 h-6 my-1"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                              />
                            </svg>

                            <div class="flex flex-col px-2 w-full">
                              <span class="text-md text-red-500 capitalize font-semibold pt-1">
                                {video.title}
                              </span>
                            </div>
                          </div>
                        </>
                      ))}
                    </div>
                  </p>
                </details>
              </div>
            </div>
          </div>

         <Certificate courseName={course} courseId={id}/>
        </div>
      )}
    </>
  );
}

export default Courses;
