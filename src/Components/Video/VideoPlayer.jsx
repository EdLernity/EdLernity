import { useEffect, useRef } from "react";

const VideoPlayer = ({ id, ...props }) => {
  const videoRef = useRef();
  const cloudinaryRef = useRef();
  // const playerRef = useRef();

  // Store the Cloudinary window instance to a ref when the page renders

  useEffect(() => {
    if (cloudinaryRef.current) return;

    cloudinaryRef.current = window.cloudinary;

    cloudinaryRef.current.videoPlayer(videoRef.current, {
      cloud_name: "deqy8a9tz",
    });
  }, []);

  let ids = "02 - ChatGPT Conversation Conventions.mp4";
  let splittedArray = ids.split("-");
  let splittedSecondArray =  splittedArray[1].split(" ");
  if (splittedSecondArray[0] === '') {
    splittedSecondArray.shift() // 
  }
  let newsplittedSecondArray = splittedSecondArray.join(" ")
  splittedArray[1] = newsplittedSecondArray
  let newId = splittedArray.filter((name) => name !== "-").reverse();
  let pid = newId.join("_");

  const publicId = `Chat_GPT_Course_EdLernity/${pid}`;

  return (
    <>
      <div>
        <video
          ref={videoRef}
          id={id}
          className="cld-video-player cld-fluid"
          controls
          autoPlay
          // src=''
          data-cld-public-id={publicId}
          {...props}
        />
      </div>
    </>
  );
};

export default VideoPlayer;
