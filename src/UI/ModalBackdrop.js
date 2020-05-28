import React from 'react';
import './ModalBackdrop.css';

const ModalBackdrop = (props) => {
    return (
        <>
            {props.modal ? <div className="modalBackdrop" onClick={props.closeModal}></div> : ''}
        </>
    )
}

export default ModalBackdrop;