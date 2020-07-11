import React from 'react';
import './BottomBar.css';

const BottomBar = (props) => {
    return (
        <div className="bottomBar">
            {props.playCountState >= 1 && props.videoURL && props.playingVideos.length ? 
            (<img 
                src="/Play-Animation.png" 
                className="previous" 
                onClick={props.reversePlayCount} 
                onMouseOver={ele => (ele.currentTarget.src = "/Play-Animation.gif")} 
                onMouseOut={ele => (ele.currentTarget.src = "/Play-Animation.png")} 
                alt="Play Button">
            </img>) :
            (<img 
                src="/Play-Animation.png" 
                className="previous"
                style={{visibility: "hidden"}}
                alt="Play Button">
            </img>)
            }

            <div id="title">{props.videoTitle}</div>

            {props.playingVideos.length > 1 && props.videoURL ? 
            (<img 
                src="/Play-Animation.png" 
                className="next" 
                onClick={props.playCount} 
                onMouseOver={ele => (ele.currentTarget.src = "/Play-Animation.gif")} 
                onMouseOut={ele => (ele.currentTarget.src = "/Play-Animation.png")} 
                alt="Play Button">
            </img>) :
            (<img 
                src="/Play-Animation.png" 
                className="next"
                style={{visibility: "hidden"}}
                alt="Play Button">
            </img>)
            }
        </div>
    )
}

export default BottomBar