import React from 'react';
import './BottomBar.css';

const BottomBar = (props) => {
    return (
        <div className="bottomBar">
            {props.playingVideos.length && props.videoURL ? 
            (<button id="previous" onClick={props.reversePlayCount}>Previous</button>) : ''
            }

            <div id="title">{props.videoTitle}</div>

            {props.playingVideos.length && props.videoURL ? 
            (<button id="next" onClick={props.playCount}>Next</button>) : ''
            }
        </div>
    )
}

export default BottomBar