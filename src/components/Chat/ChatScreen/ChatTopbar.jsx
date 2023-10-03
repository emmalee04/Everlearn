import React, { useContext } from 'react';
import './ChatInfo.css';
import Messages from '../ChatMessage/ChatMessages';
import Input from '../ChatInput/ChatInput';
import { ChatContext } from '../../../context/ChatContext';

const ChatTopbar = () => {
  const {data} = useContext(ChatContext);

  console.log(data.user);
  
  return (
    <div className='chat-topbar'>
      <div className="chat-topbar-info flex">
        {data.chatId != "null" && <img className='chat-topbar-profile-img' src={data.user.photoURL} alt="profile" />}
        <span className='chat-topbar-displayname flex fs-12'>{data.user?.displayName}</span>
      </div>
      <Messages/>
      <Input/>
    </div>
  )
}

export default ChatTopbar