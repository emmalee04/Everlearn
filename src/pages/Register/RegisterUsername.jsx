import React, { useState } from 'react';
import "./Register.css";
import { collection, doc, getCountFromServer, query, setDoc, where } from 'firebase/firestore';
import { db, storage } from '../../firebase';
import { motion } from 'framer-motion';
import { Alert, Typography } from '@mui/material';
import { getAuth, updateProfile } from 'firebase/auth';
import { UserAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

// Intermediate page after social account register
// for users to choose a username.
const RegisterUsername = () => {
  // States
  const [displayName, setDisplayName] = useState("");
  const [displayNameErr, setDisplayNameErr] = useState("");
  const [err, setErr] = useState(false);

  // Auth provider objects
  // const auth = getAuth();
  const { currentUser } = UserAuth();

  const navigate = useNavigate();

  // Validates the display name input.
  const validateDisplayName = async () => {
    // Create a reference to the users collection
    const usersRef = collection(db, "users");

    // Get query for username
    const displayNameQ = query(usersRef, where("displayName", "==", displayName));
    const displayNameSnapshot = await getCountFromServer(displayNameQ);

    // Check if username input is empty
    if (!displayName) {
      setDisplayNameErr("username field cannot be empty");
      console.log("error: username field is empty");
    }
    // Check if username exists in firebase
    else if (displayNameSnapshot.data().count !== 0){
      setDisplayNameErr("username already exists");
      console.log("error: username already exists");
    }
    // Reset: no error
    else {
      setDisplayNameErr("");
      console.log("no username error");
    }
  }

  // Given the google/facebook auth and username, creates a new user
  // profile on firebase.
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create a new document in 'users' collection on firestore
      await setDoc(doc(db, "users", currentUser.uid), {
        uid: currentUser.uid,
        email: currentUser.email,
        fullName: currentUser.displayName,
        displayName,
        photoURL: currentUser.photoURL,
        joinDate: currentUser.metadata.creationTime,
        achievements: [],
        friends: [],
        points: 0,
        lastLoginDate: currentUser.metadata.lastSignInTime,
        loginStreak: 1,
        maxLoginStreak: 1
      });

      //Create a unique image name
      const storageRef = ref(storage, `${displayName}`);

      await uploadBytesResumable(storageRef, currentUser.photoURL).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          // Update profile with username 
          await updateProfile(currentUser, {
            displayName,
            photoURL: downloadURL
          });
        })
      });

      // Create empty chats for the user on firestore
      await setDoc(doc(db, "userChats", currentUser.uid), {});
      navigate("/");
    } catch(err) {
      setErr(true);
      console.log(err);
    }
  }

  return (
    <div className='register-form-container flex flex-c'> 
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1, duration: 3.0 }}
        viewport={{ once: true }}
      >        
        <div className='register-form-container flex flex-c'>
          <div className='register-form-wrapper flex flex-column'>
            <span className='register-title fs-16'>One last step</span>
            <p>Please enter your username.</p>
            <input 
              className='email-register-input fs-12' 
              type="username" 
              placeholder='username' 
              value={displayName}
              onBlur={validateDisplayName}
              onChange={(e) => setDisplayName(e.target.value)}/>
            {displayNameErr !== "" && 
            <motion.div
              initial={{ opacity: 0.5, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Alert severity="error">
                <Typography variant="body1">
                  {displayNameErr}
                </Typography>
              </Alert>
            </motion.div> 
            }
            {err && <span>Something went wrong</span>}
            <button className='sign-up fs-12' onClick={handleSubmit} >Let's go!</button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default RegisterUsername