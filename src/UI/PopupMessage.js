import React from 'react';
import './PopupMessage.css';

const Popup = (props) => {
    return (
        <div className="popup">
            <p>{props.message}</p>
        </div>
    )
}

export default Popup