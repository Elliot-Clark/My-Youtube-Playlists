import React from 'react';
import './Modal.css';
import './ModalBackdrop';
import ModalBackdrop from './ModalBackdrop';

const Modal = (props) => {

    const convertTime = (index) => {
        //Converts inputted MM:SS time into a seconds for Youtube to understand
        //If the user enters a > 60 second value, that works too
        let inputValue = document.getElementById('timeInput');
        if (inputValue.value == "") {
            return
        }
        let a = inputValue.value.split(":");
        const notANumber = () => {
            inputValue.value = ""
            inputValue.placeholder = "NaN"
        }
        if (a.length == 2) {
            let time = parseInt(a[0] * 60 + parseInt(a[1]));
            console.log(parseInt(a[1]));
            if (isNaN(time)) {
                notANumber();
            } else {
                props.changePlaylistStartTime(index.index, time);
            }
        } else {
            let time = parseInt(a[0]);
            console.log(time);
            if (isNaN(time)) {
                notANumber();
            } else {
                console.log("Storing " + time + " in database");
                props.changePlaylistStartTime(index.index, time);
            }
        }

        
    }

    const unconvertTime = (ele) => {
        //Convert start time fetched from database into MM:SS format. 90 becomes 1:30
        let minutes = Math.floor( ele / 60);
        let seconds;
        if (ele % 60 < 10 ) {
            //If seconds are only one digit, add a 0 in front of them
            seconds = "0" + ele % 60
        } else {
            seconds = ele % 60;
        }
        return minutes + ':' + seconds;
    }

    const reg = /^[\d:]+$/;
    const check = (event) => {
        if (!reg.test(event.target.value)) {
            let b = document.getElementById('timeInput').value.split('');
            b.pop();
            document.getElementById('timeInput').value = b.join('');
        }
    }

    const play = () => {
        //Filters out false values from array
        const result = props.playlists.videoURLs.filter(ele => ele);
        props.resetPlayCount();
        props.playPlaylist(result);
    }

    const playlistVideos = props.playlists.videoTitles.map((item, index) => {
        if (item) {
            return (
                <div key={index} className="listVideo" id="active">
                    <div className="listTitle">
                        {item}
                    </div>
                    <div className="listInfo">
                        <img 
                            className="thumbnail" 
                            alt="Youtube Video Thumbnail" 
                            src={"https://i.ytimg.com/vi/" + props.playlists.videoURLs[index] + "/mqdefault.jpg"}
                            onClick={() => props.toggleVideo(props.playlists.videoURLs[index],  {item}, props.playlists.videoStartTimes[index])}>
                        </img>
                        <div className="listSettings">
                            <p>Added: {props.dateCreated}</p>
                            <p>Start at: <input type="text" maxLength="5" id="timeInput" onKeyUp={check} onBlur={() => convertTime({index})} defaultValue={unconvertTime(props.playlists.videoStartTimes[index])}></input></p>
                            <a target="_blank" rel="noopener noreferrer" href={"https://www.youtube.com/watch?v=" + props.playlists.videoURLs[index]}>Youtube Link</a>
                            <button onClick={() => props.removeVideoFromPlaylist(index)}>Remove Video</button>
                        </div>
                    </div>
                </div>
            )
        }
    });
    return (
        <>
            {props.modal ? 
                <div className="modal">
                    <div className="modalTitle">
                        <p>Username's Playlist</p>
                    </div>

                    <div className="modalInfo">
                        <ul>
                            <li>Created: <b>{props.playlists.dateCreated}</b></li>
                            <li>{props.playlists.videoTitles.filter(Boolean).length === 1 ? 
                                "1 Video" : 
                                props.playlists.videoTitles.filter(Boolean).length + " Videos"} 
                            </li>
                        </ul>
                        <div className="playlistName">
                            <input type="text" id="playlistNameInput" defaultValue={props.playlists.playlistTitle} onBlur={() => props.changePlaylistTitle()}></input>
                            <div id="playlistNameUnderline"></div>
                        </div>
                        <div className="shuffle">
                            <p>Shuffle</p>
                        </div>
                        <div className="play" onClick={() => play()}>
                            <p>Play</p>
                        </div>
                    </div>

                    <div className="playlistDescription">
                        <p>Playlist Description:</p>
                        <textarea type="text" id="playlistDescriptionInput" defaultValue={props.playlists.playlistDescription} maxLength="250" onBlur={() => props.changePlaylistDescription()}></textarea>
                    </div>

                    <div className="playlistContainer">
                        {playlistVideos}
                    </div>
                    


                </div>
                : ''
            }
            
            <ModalBackdrop 
                modal={props.modal}
                closeModal={props.closeModal}
            />
        </>
    )
}

export default Modal;