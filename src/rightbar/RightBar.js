import React from 'react';
import './RightBar.css';
import '../Fakedata'

const RightBar = (props) => {
    const searchResults = props.searchResultTitles.map((item, index) => {
        return (
            <li key={index} className="listVideo" id="active" onClick={() => props.toggleVideo(props.searchResultURLs[index])}>
                <img 
                    src={"https://i.ytimg.com/vi/" + props.searchResultURLs[index] + "/mqdefault.jpg"} 
                    alt="Video Thumbnail">
                </img>
                <br></br>
                {props.searchResultTitles[index]}
            </li>
        )
    });
    console.log(props.searchResultTitles);
    return (
        <ul className="rightBar">
        cdacvcv
            {searchResults}
        </ul>
    )
}

export default RightBar