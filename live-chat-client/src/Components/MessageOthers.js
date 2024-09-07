import React from 'react'
import "./style.css"
import { useSelector } from 'react-redux';

function MessageOthers({ props }) {
    const darkMode = useSelector((state) => state.themeKey);
    return (
        <div className={'others-message-container' + (darkMode ? " dark" : "")}>
            <div className={'conversation-container' + (darkMode ? " dark" : "")}>
                <p className='con-icon'>{props.sender.name[0]}</p>
                <div className={"others-text" + (darkMode ? " dark-main" : "")}>
                    <p className='con-title'>{props.sender.name}</p>
                    <p className='con-lastMessage'>{props.content}</p>
                    <p className='con-timeStamp'>{new Date().toLocaleTimeString()}</p>
                </div>
            </div>
        </div>
    )
}

export default MessageOthers
