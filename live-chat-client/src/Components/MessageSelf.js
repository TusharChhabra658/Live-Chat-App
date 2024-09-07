import React from 'react'
import "./style.css"

function MessageSelf({ props }) {
    return (
        <div className='self-message-container'>
            <div className='message-box'>
                <p>{props.content}</p>
                <p className='self-timestamp'>{new Date().toLocaleTimeString()}</p>
            </div>
        </div>
    )
}

export default MessageSelf
