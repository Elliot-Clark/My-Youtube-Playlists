import React from 'react';
import './LeftBar.css';

const LeftBar = (props) => {
    return (
        <div className="leftBar">
            { props.videoURL && props.signedIn ? <button onClick={props.addVideoToPlaylist}>Add Video to Playlist</button>: ''}
            {props.signedIn ? <button onClick={props.openModal}>Playlists</button> : '' }
            { props.autostart ? <button onClick={props.toggleAutostart}>Autostart On</button> : <button onClick={props.toggleAutostart}>Autostart Off</button> }
            <button>About</button>
            
        </div>
    )
}

export default LeftBar