import React, { useState, useEffect } from "react";
import VideoPlayer from "./Video/VideoPlayer";
import CourseContent from "./Coursecontent/Coursecontent";
import Certificate from "../Certificate/Certificate";
import axios from "axios";
import { useLocation } from "react-router-dom";
import useErrorToast from '../../Hooks/useErrorToast';


function Courses() {
  const location = useLocation();
  const { course } = location.state;
  const [folderName, setFolderName] = useState("");
  const [courses, setCourses] = useState([]);
  let [count] = useState(1);
  const [courseTitle, setCourseTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Get all courses in a specific folder on server side.
  useEffect(() => {
    const folderName = localStorage.getItem("current_course");
    setFolderName(folderName);
        const extractedTitles = course.videoNames
          .map((item, index) => {
            let match = item.match(/\d+\s*-\s*(.*)\.mp4/);
            let currentCount = count + index; // Add index to count

            let formattedCount = currentCount.toString().padStart(2, "0");

            match = `${formattedCount}. ${match[1]}`;

            if (match && match[1]) {
              return match;
            } else {
              console.log("Title not found in the file path.");
              return null;
            }
          })
          .filter((title) => title !== null); // Filter out null values
        setCourses(extractedTitles);
        setCourseTitle(extractedTitles[0]);
        try {
          axios
          .get(
            `http://3.110.210.79:3001/api/courses/${folderName}/${encodeURIComponent(course.videoNames[0])}`
          )
          .then((res) => {
            setVideoUrl(res?.data?.videoUrl);
            setIsLoading(false);
          });
        } catch (err) {
          setError(err);
          console.error(`Error getting video URL for`, err);
        }
  }, []);

  const setUrl = (event) => {
    let video;
    let fileNameForVideo;
    video = event.target.textContent;
    console.log(event)
    setCourseTitle(video);
    const parts = video.split("."); // Split the video name by dot
    if (parts.length === 2) {
      let index = parts[0].trim();
      if (index > 10) {
        index = `0${index}`;
      }
      fileNameForVideo = `${index} - ${parts[1].trim()}.mp4`; // Combine index and file
    } else {
      return null; // Invalid format, return null or handle accordingly
    }
    try {
      axios
      .get(
        `http://3.110.210.79:3001/api/courses/${folderName}/${encodeURIComponent(fileNameForVideo)}`
      )
      .then((res) => {
        setVideoUrl(res?.data?.videoUrl);
        setIsLoading(false);
      });
    } catch (err) {
      setError(err);
      console.error("Error getting courses ",err)
    }
  };

  useErrorToast(error);

  return (
    <>
      <div className="px-4 md:px-12 md:mt-10 xl:px-24 xl:mt-6">
        <h1 className="text-center pb-4 font-bold text-2xl text-[#1539cf] leading-6 md:hidden xl:hidden mt-8 md:mt-0 xl:mt-0">{courseTitle}</h1>
        <div className="flex w-full flex-col md:flex-row xl:flex-row">
          <div className="flex flex-col md:w-4/6 xl:w-4/6">
            <div className="mt-4">
              <VideoPlayer isLoading={isLoading} videoUrl={videoUrl} />
            </div>
            <div className="pl-4 pr-4 md:pr-24 xl:pr-24 py-4">
              <h1 className="text-xl font-bold">{courseTitle}</h1>
              <div className="mt-4">
                <p>{course?.courseDesc}</p>
              </div>
            </div>
          </div>
          <div className="md:w-2/6 mx-2 md:ml-8 xl:ml-8 sm:ml-4">
            <CourseContent
              isLoading={isLoading}
              setUrl={setUrl}
              courseTitle={course?.courseTitle}
              videos={courses}
            />
          </div>
        </div>
        <hr className="h-[1px] border-0 text-gray-800 bg-gray-800 mt-4 md:mt-1 sm:mt-4 xl:mt-1" />
        <Certificate />
      </div>
    </>
  );
}

export default Courses;
