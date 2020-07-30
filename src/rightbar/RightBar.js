import React from 'react';
import './RightBar.css';
import '../Fakedata'

//Displays alternate videos that returned from the search query
const RightBar = (props) => {
    const searchResults = props.searchResultTitles.map((item, index) => {
        return (
            <li key={index} onClick={() => props.toggleVideo(props.searchResultURLs[index], props.searchResultTitles[index])}>
                <img 
                    src={"https://i.ytimg.com/vi/" + props.searchResultURLs[index] + "/mqdefault.jpg"} 
                    alt="Video Thumbnail">
                </img>
                <br></br>
                {props.searchResultTitles[index]}
            </li>
        )
    });
    return (
        <ul className="rightBar">
            {searchResults}
        </ul>
    )
}

export default RightBar