import React, { useState, useEffect } from "react";
import VideoPlayer from "./Video/VideoPlayer";
import CourseContent from "./Coursecontent/Coursecontent";
import Certificate from "../Certificate/Certificate";
import axios from "axios";

function Courses() {
  const [folderName, setFolderName] = useState("");
  const [courses, setCourses] = useState([]);
  let [count, setCount] = useState(1);
  const [courseTitle, setCourseTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [fileName, setFileName] = useState("");

  // Get all courses in a specific folder on server side.
  useEffect(() => {
    const folderName = localStorage.getItem("current_course");
    setFolderName(folderName);
    axios
      .get(`http://localhost:3001/api/courses/${folderName}`)
      .then((res) => {
        const extractedTitles = res.data.videos
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

        axios
          .get(
            `http://localhost:3001/api/courses/${folderName}/${"01 - Introduction to the Tutorial Masterclass.mp4"}`
          )
          .then((res) => {
            setVideoUrl(res.data.videoUrl);
          });
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }, []);

  const setUrl = (event) => {
    let video;
    let fileNameForVideo;
    video = event.target.textContent;
    setCourseTitle(video);
    const parts = video.split("."); // Split the video name by dot
    if (parts.length === 2) {
      let index = parts[0].trim();
      if (index.length === 1) {
        index = `0${index}`; // Pad single-digit index with leading zero
      }
      fileNameForVideo = `${index} - ${parts[1].trim()}.mp4`; // Combine index and file
      setFileName(fileNameForVideo); // Update the fileName state
    } else {
      return null; // Invalid format, return null or handle accordingly
    }
    axios
      .get(
        `http://localhost:3001/api/courses/${folderName}/${encodeURIComponent(fileNameForVideo)}`
      )
      .then((res) => {
        setVideoUrl(res.data.videoUrl);
      });
  };

  const course = {
    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt 
    ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullam
    colaboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in 
    voluptate velit esse cillum dolore.`,
  };

  return (
    <>
      <div className="px-24 mt-10">
        <div className="flex w-full">
          <div className="flex flex-col w-4/6">
            <div className="mt-4">
              <VideoPlayer videoUrl={videoUrl} />
            </div>
            <div className="pl-4 pr-24 py-4">
              <h1 className="text-xl font-bold">{courseTitle}</h1>
              <div className="mt-4">
                <p>{course.description}</p>
              </div>
            </div>
          </div>
          <div className="w-2/6">
            <CourseContent
              setUrl={setUrl}
              courseTitle="New Text"
              videos={courses}
            />
          </div>
        </div>
        <hr className="h-[1px] border-0 text-gray-800 bg-gray-800 mt-1" />
        <Certificate />
      </div>
    </>
  );
}

export default Courses;
