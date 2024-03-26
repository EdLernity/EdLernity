import { Media, Video } from '@vidstack/player-react';
import React from "react";
import Skeleton from "react-loading-skeleton";
import './VideoPlayer.css';
// Lazy load the YouTube player

const VideoPlayer = ({ video , isLoading ,courseBanner}) => {
  
  const folder=video.url.split("_")[0]
  const prepareVideoUrl=`https://edlernity.s3.ap-south-1.amazonaws.com/courses/${folder}/${video.url}`
  return (
    <div className="video-player-container">
      {isLoading ? (
        <Skeleton
        count={1}
        width="100%" // Set width to 100% for responsiveness
        height={410} // Responsive height based on screen size
      /> // Render skeleton component when isLoading is true
      ) : (

        <Media>
  <Video loading="visible" poster={courseBanner} controls preload="true">
    <video loading="visible" poster={courseBanner} src={prepareVideoUrl} preload="none" data-video="0" controls />
  </Video>
</Media>
      )}
    </div>
  );
};

export default VideoPlayer;
