import React from "react";
import ReactPlayer from "react-player/lazy";
import './VideoPlayer.css';
import Skeleton from "react-loading-skeleton";

// Lazy load the YouTube player

const VideoPlayer = ({ videoUrl , isLoading }) => {
  return (
    <div className="video-player-container">
      {isLoading ? (
        <Skeleton
        count={1}
        width="100%" // Set width to 100% for responsiveness
        height={410} // Responsive height based on screen size
      /> // Render skeleton component when isLoading is true
      ) : (
        <ReactPlayer
          className="react-player"
          width="100%"
          height="auto"
          controls
          config={{
            file: {
              attributes: {
                controlsList: "nodownload",
              },
            },
          }}
          url={videoUrl}
        />
      )}
    </div>
  );
};

export default VideoPlayer;
