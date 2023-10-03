import React from 'react'
import './Chat.css';
import ChatSidebar from '../../components/Chat/ChatSidebar/ChatSidebar'
import ChatTopbar from '../../components/Chat/ChatScreen/ChatTopbar'
import Navbar from '../../components/Navbar/Navbar';

const Chat = () => {
  return (
    <div>
      <Navbar />
      <div className='chat'>
        <div className="chat-container">
          <ChatSidebar/>
          <ChatTopbar/>
        </div>
      </div>
    </div>
  )
}

export default Chat