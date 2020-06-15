import React from 'react';
import './RightBar.css';
import '../Fakedata'

const RightBar = (props) => {
    console.log(props.searchResultTitles);
    return (
        <div className="rightBar">
            <ul>
            <li>
                <img src={"https://i.ytimg.com/vi/" + props.searchResultURLs[1] + "/mqdefault.jpg"} onClick={() => props.toggleVideo(props.searchResultURLs[1])}></img>
                <br></br>
                {props.searchResultTitles[1]}
            </li>
            <li>
                <img src={"https://i.ytimg.com/vi/" + props.searchResultURLs[2] + "/mqdefault.jpg"}></img>
                <br></br>
                {props.searchResultTitles[2]}
            </li>
            <li>
                <img src={"https://i.ytimg.com/vi/" + props.searchResultURLs[3] + "/mqdefault.jpg"}></img>
                <br></br>
                {props.searchResultTitles[3]}
            </li>
            <li>
                <img src={"https://i.ytimg.com/vi/" + props.searchResultURLs[4] + "/mqdefault.jpg"}></img>
                <br></br>
                {props.searchResultTitles[4]}
            </li>
            </ul>
        </div>
    )
}

export default RightBar