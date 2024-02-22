import React from "react";
import ReactPlayer from "react-player/lazy";
import './VideoPlayer.css';

// Lazy load the YouTube player

const VideoPlayer = ({ videoUrl }) => {
  return (
    <ReactPlayer
      className="react-player"
      width={800}
      height={470}
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
  );
};

export default VideoPlayer;
