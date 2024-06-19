import { Media, Video } from '@vidstack/player-react';
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import './VideoPlayer.css';

const VideoPlayer = ({ video, courseBanner, folderName }) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(true); // State to track video loading

  useEffect(() => {
    // Show skeleton for 2 seconds when video.url changes
    setIsVideoLoaded(true);
    const timer = setTimeout(() => {
      setIsVideoLoaded(false);
    }, 2000); // 2000 milliseconds = 2 seconds
    return () => clearTimeout(timer); // Clean up the timer on unmount or when video.url changes
  }, [video.url]);
  
  const prepareVideoUrl = `https://edlernity.s3.ap-south-1.amazonaws.com/courses/${folderName}/${video.url}`;

  const handleVideoLoad = () => {
    setIsVideoLoaded(false); // Set video loading state to false when video is loaded
  };

  return (
    <div className="video-player-container">
      {isVideoLoaded ? ( // Show skeleton only when video is not loaded
        <Skeleton
          count={1}
          width="100%"
          height={410}
        />
      ):
      <Media>
        <Video
        
          loading="eager"
          poster={courseBanner}
          controls
          preload="true"
        >
          <video
            loading="visible"
            poster={courseBanner}
            src={prepareVideoUrl}
            preload="none"
            data-video="0"
            controls
            controlsList="nodownload"
             // Call handleVideoLoad when video is loaded
          />
        </Video>
      </Media>}
    </div>
  );
};

export default VideoPlayer;
