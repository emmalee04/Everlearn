import React, { useContext, useState } from 'react';
import './ChatInput.css';
import { AuthContext } from '../../../context/AuthContext';
import { ChatContext } from '../../../context/ChatContext';
import { arrayUnion, serverTimestamp, Timestamp, doc, updateDoc } from 'firebase/firestore';
import { db, storage } from "../../../firebase";
import { v4 as uuid } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import CropOriginalIcon from '@mui/icons-material/CropOriginal';

const ChatInput = () => {
  const {currentUser} = useContext(AuthContext);
  const {data} = useContext(ChatContext);

  const [text, setText] = useState("");
  const [file, setFile] = useState(null);

  // Listens for keyboard action: Enter
  const handleKey = (e) => {
    if (e.code === "Enter") {
      handleSend();
    }
  }
  
  // Uploads messages / files to firebase chats collection.
  const handleSend = async () => {
    if (file) {
      // Upload file and metadata to the object defined with unique uuid
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        }, 
        (error) => {
          console.log(error);
        },
        () => { 
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                file: downloadURL
              }),
            });
          });
        }
      );
    } else {
      // Upload message on chats collection
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    // Update last message sent 
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    // Clear input field & file
    setText("");
    setFile(null);
  }
  
  return (
    <div className='chat-input flex flex-sb'>
        <input 
          className='chat-input-bar'
          type="text" 
          placeholder='message...' 
          onChange={(e) => setText(e.target.value)}
          value={text}
        /> 
        <div className='send flex'>
          <input 
            type="file" 
            style={{display:"none"}} 
            id='file' 
            onKeyDown={handleKey} 
            onChange={(e) => {
              setFile(e.target.files[0]);
              console.log(e.target.files[0]);
            }}
          />
          <label className='send-img flex flex-c' htmlFor="file">
            <CropOriginalIcon fontSize='large'/>
          </label>
          <button className='send_btn' onClick={handleSend}>Send</button>
        </div>
    </div>
  )
}

export default ChatInput