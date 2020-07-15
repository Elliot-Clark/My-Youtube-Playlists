import React from 'react';
import './Modal.css';
import './ModalBackdrop';
import ModalBackdrop from './ModalBackdrop';

const Modal = (props) => {

    const convertTime = (index) => {
        //Converts inputted MM:SS time into a seconds for Youtube to understand
        //If the user enters a > 60 second value, that works too
        let inputValue = document.getElementById(index.index);
        if (inputValue.value === "") {
            return
        }
        let a = inputValue.value.split(":");
        const notANumber = () => {
            inputValue.value = ""
            inputValue.placeholder = "NaN"
        }
        if (a.length === 2) {
            let time = parseInt(a[0] * 60 + parseInt(a[1]));
            if (isNaN(time)) {
                notANumber();
            } else {
                props.changePlaylistStartTime(index.index, time);
            }
        } else {
            let time = parseInt(a[0]);
            if (isNaN(time)) {
                notANumber();
            } else {
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
    const check = (event, index) => {
        if (!reg.test(event.target.value)) {
            let input = document.getElementById(index).value.split('');
            input.pop();
            document.getElementById(index).value = input.join('');
        }
    }

    const play = (event) => {
        console.log(Indexes);
        //Filters out false values from array
        const URLs = props.playlists.videoURLs.filter(ele => ele);
        const Titles = props.playlists.videoTitles.filter(ele => ele);
        for (let x = 0; x < Indexes.length; x++) {
            Indexes[x] = props.playlists.videoStartTimes[Indexes[x]]
        }
        if (event) {
            //If shuffle was clicked, plays the videos in a random order
            //This function randomizes the order of URLs, Titles, and Start Time arrays in the same exact way. Doesn't even need to make another array!
            for (let arrayLength = URLs.length; arrayLength > 0; arrayLength--) {
                let spliceIndex = Math.floor(Math.random() * (arrayLength));
                URLs.push(URLs.splice(spliceIndex, 1).toString());
                Titles.push(Titles.splice(spliceIndex, 1).toString());
                Indexes.push(Indexes.splice(spliceIndex, 1).toString());
            }
        }
        props.resetPlayCount();
        props.playPlaylist(URLs, Titles, Indexes);
    }

    let Indexes = []

    const playlistVideos = props.playlists.videoTitles.map((item, index) => {
        if (item) {
            Indexes.push(index);
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
                            <p>Start at: <input type="text" maxLength="5" id={index} onKeyUp={(event) => check(event, index)} onBlur={() => convertTime({index})} defaultValue={unconvertTime(props.playlists.videoStartTimes[index])}></input></p>
                            <a target="_blank" rel="noopener noreferrer" href={"https://www.youtube.com/watch?v=" + props.playlists.videoURLs[index]}>Youtube Link</a>
                            <button onClick={() => props.removeVideoFromPlaylist(index)}>Remove Video</button>
                        </div>
                    </div>
                </div>
            )
        }
    });

    let playlistSelection = [];
    for (let x = 1; x <= props.numberOfPlaylists; x++) {
        playlistSelection.push(
        <div 
            title={"Go to Playlist " + x}
            //Adds a class if it is selected, allowing CSS to show this div is active
            className={`playlistSelector ${props.playlistCount === x ? 'targetPlaylistSelector': '' }`}
            onClick={() => {props.togglePlaylistCount(x)}} 
            key={x}>{x}
        </div>)
    }

    return (
        <>
            {props.modal ? 
                <div className="modal">
                    <div className="playlistName">
                            <input type="text" id="playlistNameInput" key={props.playlists.playlistTitle} defaultValue={props.playlists.playlistTitle} onBlur={() => props.changePlaylistTitle()}></input>
                            
                            <div id="playlistSelectionContainer">
                                {playlistSelection}
                                {props.numberOfPlaylists < 9 ? (
                                    <button title="Create a New Playlist" className='playlistSelector' onClick={props.createNewPlaylist}>+</button>
                                ) : (
                                    ''
                                )}
                            </div>
                            <div id="playlistNameUnderline"></div>
                    </div>

                    <div className="modalInfo">
                        <ul>

                            <li>Created: <b>{props.playlists.dateCreated}</b></li>
                            <li>{props.playlists.videoTitles.filter(Boolean).length === 1 ? 
                                "1 Video" : 
                                props.playlists.videoTitles.filter(Boolean).length + " Videos"} 
                            </li>
                            <li>
                                <div className="loop">
                                    <button onClick={() => props.toggleLoop()}>
                                    <p>Loop</p> 
                                    {props.looping ? (
                                        <img src="Loop-Animation.gif" onClick={() => props.toggleLoop()} alt="Looping On Gif" title="Loop"></img>) :
                                        (<img src="Loop-Animation.png" onClick={() => props.toggleLoop()} alt="Looping Of Png" title="Loop"></img>
                                    )}
                                    </button>
                                </div>
                            </li>
                        </ul>
                            <div className="playlistSettings">
                                {props.playlists.videoTitles.filter(Boolean).length > 0 ? (
                                    <div className="shuffle" onClick={(event) => play(event)}>
                                        <img src="/Shuffle.png" alt="Shuffle Icon" title="Shuffle"></img>
                                    </div>) : ('')
                                }

                                {props.playlists.videoTitles.filter(Boolean).length > 0 ? (
                                    <div className="play" onClick={() => play()}>
                                        <img src="/Play.png" alt="Play Icon" title="Play"></img>
                                    </div>) : ('')
                                }
                                
                            </div>

                        <div className="playlistDescription">
                            <textarea type="text" placeholder="Playlist Description..." id="playlistDescriptionInput" key={props.playlists.playlistTitle} defaultValue={props.playlists.playlistDescription} maxLength="250" onBlur={() => props.changePlaylistDescription()}></textarea>
                        </div>
                            <button id="deleteButton" onClick={props.showConfirmationWindow}>Delete Playlist</button>
                        </div>

                    <div className="playlistContainer">
                        {playlistVideos}
                    </div>
                    
                    {props.confirmationWindow ? (
                        <>
                        <div id="confirmationWindow">
                            <p>Are you sure you want to delete: {props.playlists.playlistTitle}? This action cannont be undone.</p>
                            <button onClick={() => { props.showConfirmationWindow(); props.deletePlaylist();}}>Yes, Delete it</button>
                            <button onClick={props.showConfirmationWindow}>No, Go Back</button>
                        </div>
                        <div id="confirmationWindowBackground" onClick={props.showConfirmationWindow}></div>
                        </>
                    ) : (
                        ''
                    )}

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