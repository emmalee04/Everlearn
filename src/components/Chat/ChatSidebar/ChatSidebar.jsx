import React from 'react';
import './ChatSidebar.css';
import Search from '../ChatSearch/ChatSearch';
import Chats from '../ChatScreen/SideChats';

const ChatSidebar = () => {
  return (
    <div className='chat-sidebar'>
      <Search/>
      <Chats/>
    </div>
  )
}

export default ChatSidebar