import React from 'react';
import YouTube from 'react-youtube';

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
    console.log("Ended");
    console.log(props);
    //Increase playcounter by 1 if in playlist playing mode
    if (props.playingVideos.length) {
      props.playCount();
    }
  }

  const error = (err) => {
    console.log(err)
  }

  console.log(window.innerWidth);
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