import React from 'react';
import './Modal.css';
import './ModalBackdrop';
import ModalBackdrop from './ModalBackdrop';

const Modal = (props) => {

    const grabTime = () => {
        const inputValue = document.getElementById('timeInput');
        inputValue.onblur = (e) => {
            console.log(inputValue.value);
            if (inputValue.value >= 0 || inputValue.value === ':' ) {
                console.log("Convert!");
            } else {
                
            }
        }
    }

    const clicked = (event) => {
        console.log(event.index);
    }

    const playlistVideos = props.playlists.videoTitles.map((item, index) => {
        if (item && item !== 1) {
            return (
                <div key={index} className="listVideo" id="active" onClick={() => props.removeVideoFromPlaylist(index)}>
                    <div className="listTitle">
                        {item}
                    </div>
                    <div className="listInfo">
                        <img className="placeHolder" alt="Youtube Video Thumbnail" src={"https://i.ytimg.com/vi/" + props.playlists.videoURLs[index] + "/mqdefault.jpg"}></img>
                        <div className="listSettings">
                            <p>Added: {props.dateCreated}</p>
                            <p>Start: {props.playlists.videoStartTimes[index]}</p>
                            <a href={"https://www.youtube.com/watch?v=" + props.playlists.videoURLs[index]}>Youtube Link</a>
                            <button>Remove Video</button>
                        </div>
                    </div>
                    <textarea type="text" className="listTextInput" maxLength="2250" placeholder="Type Here..."></textarea>
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
                        <div className="play">
                            <p>Play</p>
                        </div>
                    </div>

                    <div className="playlistDescription">
                        <p>Playlist Description:</p>
                        <textarea type="text" id="playlistDescriptionInput" maxLength="250"></textarea>
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