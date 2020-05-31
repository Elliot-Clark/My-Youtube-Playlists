import React from 'react';
import './LeftBar.css';

const LeftBar = (props) => {
    return (
        <div className="leftBar">
            <button onClick={props.openModal}>Playlists</button>
            { props.autostart ? <button onClick={props.toggleAutostart}>Autostart On</button> : <button onClick={props.toggleAutostart}>Autostart Off</button> }
            <button>About</button>
            { props.videoURL ? <button>Add Video to Playlist</button>: ''}
        </div>
    )
}

export default LeftBar