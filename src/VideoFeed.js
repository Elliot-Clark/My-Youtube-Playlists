import React from 'react';
import YouTube from 'react-youtube';
//https://github.com/tjallingt/react-youtube

const VideoFeed = (props) => {
  const ready = () => {
    console.log("Ready")
  }

  const play = () => {
    console.log("Playing");
  }

  const pause = () => {
    console.log("Paused")
  }

  const end = () => {
    console.log("Ended")
  }

  const error = (err) => {
    console.log(err)
  }

  let videoWidth = window.innerWidth * props.videoWidth;
  let videoHeight = window.innerHeight * props.videoHeight;  

  let videoDimensions = {
    height: videoHeight,
    width: videoWidth,
    playerVars: {
      autoplay: props.autostart,
    },
  };

    return (
      <div className="video">
        <YouTube 
          videoId={props.videoURL}
          opts={videoDimensions}
          onReady={ready}
          onPlay={play}
          onPause={pause}
          onEnd={end}
          onError={error}
        />
      </div>
    );
  };

export default VideoFeed;