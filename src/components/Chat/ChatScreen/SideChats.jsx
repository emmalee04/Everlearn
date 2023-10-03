import React, { useState, useEffect, useContext } from 'react';
import { doc, onSnapshot } from "firebase/firestore";
import { db } from '../../../firebase';
import './ChatInfo.css';
import { AuthContext } from '../../../context/AuthContext';
import { ChatContext } from '../../../context/ChatContext';

const SideChats = () => {
  const {currentUser} = useContext(AuthContext);
  const {dispatch} = useContext(ChatContext);
  
  const [chats, setChats] = useState([]);
  
  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });
  
      return(() => {
        unsub();
      })
    }

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const handleSelect = (u) => {
    dispatch({type: "CHANGE_USER", payload: u});
  }
  
  return (
    <div className='sidechats flex-column'>
      {Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).map((chat) => {
        return (
          <div 
            className='sidechat-userchat flex' 
            key={chat[0]} 
            onClick={() => handleSelect(chat[1].userInfo)}
          >
            <img src={chat[1].userInfo.photoURL} alt="profile" />
            <div className="sidechat-userinfo">
              <span className='fs-12' >{chat[1].userInfo.displayName}</span>
              {/* change placeholder "." text to "active when ago" or "active now" */}
              <p className='fs-10' >{chat[1].lastMessage ? chat[1].lastMessage.text : ". "}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default SideChats