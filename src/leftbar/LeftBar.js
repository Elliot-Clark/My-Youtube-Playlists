import React from 'react';
import './LeftBar.css';

const LeftBar = (props) => {
    return (
        <div className="leftBar">
            { props.videoURL && props.signedIn && !props.playingVideos.length ? <button onClick={props.addVideoToPlaylist}>Add to Playlist</button> : <button className="disabled">Add to Playlist</button> }
            {props.signedIn ? <button onClick={props.openModal}>Playlists</button> : <button className="disabled">Playlists</button> }
            { props.autostart ? <button onClick={props.toggleAutostart}>Autostart On</button> : <button onClick={props.toggleAutostart} className="disabled">Autostart Off</button> }
            <button>About</button>
            
        </div>
    )
}

export default LeftBar