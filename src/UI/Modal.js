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

    const playlistVideos = props.playlists.pl1.videoTitles.map( (item, index) => (
        <li key={index} className="ListItem" onClick={() => clicked({index})}>
            {item}
            <p>URL: {props.playlists.pl1.videoURLs[index]}</p>
        </li>
    ) );
    return (
        <>
            <div className="modal">
                <div className="playlistInfo">
                    <p>Playlist</p>
                    <span>
                        <p>Start at:</p>
                        <input type="text" placeholder="0:00:00" id="timeInput" onBlur={grabTime}></input>
                    </span>
                    <p>{props.playlists.pl1.playlistTitle}</p>
                    <p>Created: {props.playlists.pl1.dateCreated}</p>
                </div>

                <ul>
                    {playlistVideos}
                </ul>
            </div>
            <ModalBackdrop 
                modal={props.modal}
                closeModal={props.closeModal}
            />
        </>
    )
}

export default Modal;