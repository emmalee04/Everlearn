import React, { useContext, useEffect, useRef } from 'react'
import './ChatMessage.css';
import { AuthContext } from '../../../context/AuthContext';
import { ChatContext } from '../../../context/ChatContext';

const ChatMessage = ({message}) => {
  console.log(message); 

  const {currentUser} = useContext(AuthContext);
  const {data} = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" }); 
  }, [message]);

  return (
    <div 
      ref={ref}
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="message-info">
        <img
          className='profile-img'
            src={
              message.senderId === currentUser.uid 
                ? currentUser.photoURL
                : data.user.photoURL
            }
            alt=""
        />
      </div>
      <div className="message-content">
        <p className='message-text'>{message.text}</p>
          {message.file && <img src={message.file} alt="" />}
      </div>
    </div>
  )
}

export default ChatMessage