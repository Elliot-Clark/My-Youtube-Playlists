import React from 'react';
import YouTube from 'react-youtube';

const VideoFeed = (props) => {
  const ready = () => {
    //console.log("Ready")
  }

  const play = () => {
    //console.log("Playing");
  }

  const pause = () => {
    //console.log("Paused")
  }

  const end = () => {
    console.log("Ended");
    //Increase playcounter by 1 if in playlist playing mode
    if (props.playingVideos.length) {
      props.playCount();
    }
  }

  const error = (err) => {
    console.log(err)
  }
  
  let videoWidth = window.innerWidth * 0.75;
  let videoHeight = window.innerHeight * 0.75;  

  let videoDimensions = {
    height: videoHeight,
    width: videoWidth,
    playerVars: {
      start: props.startTime,
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