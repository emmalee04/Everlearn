import React, { useContext, useState } from 'react';
import './ChatSearch.css';
import { 
  collection, 
  query, 
  where, 
  doc, 
  setDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../../firebase';
import { AuthContext } from '../../../context/AuthContext';
import { ChatContext } from '../../../context/ChatContext';
import SearchIcon from '@mui/icons-material/Search';

// A search function that allows users to search up other users and create chats.
const ChatSearch = () => {
  const [username, setUsername] = useState("");
  // User searched up
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const {currentUser} = useContext(AuthContext);
  const {dispatch} = useContext(ChatContext);

  // Searches for user
  const handleSearch = async () => {
    // Create a reference to the users collection
    const usersRef = collection(db, "users");
    // Create a query against the collection;
    const q = query(usersRef, where("displayName", "==", username));

    try {
      // Execute query
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
        console.log(doc.data());
      });
    } 
    catch(err) {
      setErr(true);
    }
  }
  
  // Listens for keyboard action: Enter
  const handleKey = (e) => {
    if (e.code === "Enter") {
      handleSearch();
    }
  }

  const handleSelect = async (u) => {
    // Check if chat messages in firestore exists; if not, create a new chat
    const combinedId = 
      currentUser.uid > user.uid 
      ? currentUser.uid + user.uid 
      : user.uid + currentUser.uid;

      console.log("combinedId: " + combinedId);
      console.log("current user uid: " + currentUser.uid);
      console.log("user.uid: " + user.uid);
    try {
      const res = getDoc(doc(db, "chats", combinedId));

      // No chat exists
      if (res !== undefined) {
        // Create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        // Create user chats (for current user)
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          // Computed property name ([propertyName])
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL
          },
          // serverTimestamp over Date.now() since it calibrates timezones
          [combinedId + ".date"]: serverTimestamp()
        })

        // Create user chats (for other user)
        await updateDoc(doc(db, "userChats", user.uid), {
          // Computed property name ([propertyName])
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL
          },
          // serverTimestamp over Date.now() since it calibrates timezones
          [combinedId + ".date"]: serverTimestamp()
        })
      }

      // dispatch function to change user context to selected user
      dispatch({type: "CHANGE_USER", payload: u});

      setUser(null);
      setUsername("");
    } catch(err) {
      setUser(null);
      setUsername("");
      
      console.log(err);
      setErr(true);
    }
  }
  
  return (
    <div className='chat-search'>
      <div className="chat-searchform">
        <input 
          className='chat-user-search fs-12'
          type="text" 
          value={username || ""}
          placeholder='find a user' 
          onKeyDown={handleKey} 
          onChange={(e) => {setUsername(e.target.value)}}
        />
        <button className='chat-search-btn' onClick={handleSearch}>
          <SearchIcon />
        </button>
      </div>
      {err && <span>User not found!</span>}
      {user && <div className='chat-search-userchat flex' onClick={() => {handleSelect(user)}}>
        <img className='chat-search-profile-img' src={user.photoURL} alt="profile" />
        <div className="userchat-info">
          <span>{user.displayName}</span>
        </div>
      </div>}
    </div>
  )
}

export default ChatSearch