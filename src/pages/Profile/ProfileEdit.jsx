import React, { useEffect, useState } from 'react';
import './Profile.css';
import Navbar from '../../components/Navbar/Navbar';
import { getAuth, updateProfile } from 'firebase/auth';
import { UserAuth } from '../../context/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../firebase';
import blankPfp from '../../images/blank-profile-pic.webp';
import { motion } from 'framer-motion';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useNavigate } from 'react-router';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const ProfileEdit = () => {
  const { currentUser } = UserAuth();
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    email: "",
    fullName: "",
    displayName: "",
    bio: "",
    gender: "",
    photoURL: null
  });
  const [isUpdated, setIsUpdated] = useState("Save");
  
  const loadData = async() => {
    
    // Get a reference to the user data and update user's full name
    const docRef = doc(db, "users", currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setUserInfo({
        ...userInfo,
        email: currentUser.email,
        fullName: docSnap.data().fullName,
        displayName: currentUser.displayName,
        bio: docSnap.data().bio,
        gender: docSnap.data().gender,
        photoURL: currentUser.photoURL
      });
      console.log(userInfo);
    } else {
      console.log("doc doesn't exist");
    }
  }

  // Load user data on initial render
  useEffect(() => {
    loadData();
  }, [])

  // Saves updated user info and uploads it on firebase.
  const handleSave = async () => {
    // Update user doc
    await updateDoc(doc(db, "users", currentUser.uid), {
      displayName: userInfo.displayName,
      fullName: userInfo.fullName,
      bio: userInfo.bio,
      gender: userInfo.gender,
      photoURL: userInfo.photoURL
    })

    //Create a unique image name
    const storageRef = ref(storage, `${userInfo.displayName}`);

    await uploadBytesResumable(storageRef, userInfo.photoURL).then(() => {
      getDownloadURL(storageRef).then(async (downloadURL) => {
        // Update profile with username 
        await updateProfile(currentUser, {
          displayName: userInfo.displayName,
          photoURL: downloadURL
        });
      
        console.log("updated");
        setIsUpdated("Saved");
      })
    });
  }

  return (
    <div className='profile flex flex-column'>
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1, duration: 1.0 }}
        viewport={{ once: true }}
      >
        <div className='profile-section flex flex-sb'>
          <div className='flex'>
            <button type = 'button' className='flex back-btn' 
              onClick={() => navigate("/profile")}>
              <ArrowBackIosNewIcon />
              <span className='fs-10'>Go back</span>
            </button>
          </div>
          <div className='profile-pfp-container container flex flex-column flex-c'>
            <label htmlFor="file">
              <img className='profile-pfp' src={currentUser.photoURL ? currentUser.photoURL : blankPfp} alt="" />  
            </label>
            <input 
              className='profile-input fs-12'
              type="file" 
              style={{display:"none"}} 
              id='file' 
              onChange={(e) => {
                setUserInfo({...userInfo, photoURL: e.target.files[0]});
                console.log("new profile image: " + e.target.files[0]);
              }}/>
            <label className='change-pfp' htmlFor="file">change photo</label>
          </div>
          <div className='profile-info container flex-column'>
            <div className='profile-info flex flex-sb'>
              <span>Username</span>
              <input 
                className='profile-input fs-12'
                type="text" 
                value={userInfo.displayName} 
                onChange={(e) => {
                  setUserInfo({...userInfo, displayName: e.target.value});
                  console.log("username changed to: " + e.target.value);
                }}
              />
            </div>
            <div className='profile-info flex flex-sb'>
              <span>Name</span>
              <input 
                className='profile-input fs-12'
                type="text" 
                value={userInfo.fullName} 
                onChange={(e) => {
                  setUserInfo({...userInfo, fullName: e.target.value});
                  console.log("full name changed to: " + e.target.value);
                }}
              />
            </div>
            <div className='profile-info flex flex-sb'>
              <span>Bio</span>
              <textarea 
                className='profile-input fs-12'
                name="bio" 
                id="bio" 
                cols="30" 
                rows="5"
                value={userInfo.bio || ""} 
                placeholder='bio... max  150 chars'
                autoCorrect='on'
                maxLength='150'
                onChange={(e) => {
                  setUserInfo({...userInfo, bio: e.target.value});
                  console.log("bio changed to: " + e.target.value);
                }}
              >
              </textarea>
            </div>
            <div className='profile-info flex flex-sb'>
              <span>Gender</span>
              <input 
                className='profile-input fs-12'
                type="text" 
                value={userInfo.gender || ""} 
                placeholder='gender...'
                onChange={(e) => {
                  setUserInfo({...userInfo, gender: e.target.value});
                  console.log("gender changed to: " + e.target.value);
                }}
              />
            </div>
            <p className='fs-10 text-brown'>*this won't be publically shown.</p>
            <button className='profile-save-btn' onClick={handleSave}>{isUpdated}</button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ProfileEdit