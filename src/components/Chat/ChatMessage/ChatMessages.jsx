import React, { useState, useEffect, useContext } from 'react';
import ChatMessage from './ChatMessage';
import './ChatMessage.css';
import { ChatContext } from '../../../context/ChatContext';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../../../firebase';

const ChatMessages = () => {
  const [messages, setMessages] = useState([]);
  const {data} = useContext(ChatContext);

  // Fetch messages data from the chats collection in firebase
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    })

    // Cleanup function
    return () => {
      unsub();
    };
  }, [data.chatId]);
  
  return (
    <div className='chat-messages'>
      {messages?.map((message) => {
        return <ChatMessage message={message} key={message.id} /> 
      })}
    </div>
  )
}

export default ChatMessages