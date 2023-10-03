import React, { useState } from 'react';
import './Settings.css';
import Navbar from '../../components/Navbar/Navbar';
import { getAuth, sendEmailVerification, signOut, updatePassword, updateProfile } from 'firebase/auth';
import { UserAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';

const Settings = () => {
  const auth = getAuth();
  const { currentUser } = UserAuth();
  
  const [saved, isSaved] = useState("Save")
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    email: currentUser.email,
    password: currentUser.password
  });

  // Save button; on click, updates email and password.
  const handleSave = async () => {
    
    await updateProfile(currentUser, {
      email: userInfo.email
    });
    console.log("email update successful");
    
    await updatePassword(currentUser, userInfo.password).then(() => {
      console.log("password update successful");
    }).catch((err) => {
      setErr(true);
    });

    console.log("saved");
    isSaved("Saved");
  }

  const verifyEmail = async () => {
    await sendEmailVerification(currentUser)
      .then(async () => {
        // Email verification sent; update profile with emailVerified = true
        await updateProfile(currentUser, {
          emailVerified: true
        });
        console.log("email verified");
      });
  }

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/welcome");
  }
  
  return (
    <div className='setting flex flex-column'>
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1, duration: 1.0 }}
        viewport={{ once: true }}
      >
        <div className='setting-section flex flex-sb'>
          <div className='setting-info container flex-column'>
            <div className='setting-title flex flex-c fs-16 fw-2'>Settings</div>
            {currentUser.emailVerified 
              ? <button className='setting-verify-email noHover'>Email verified</button>
              : <button className='setting-verify-email' onClick={verifyEmail}>Verify email address</button>
            }
            <div className='setting-info flex flex-sb'>
              <span>Email</span>
              <input 
                className='setting-input fs-12'
                type="text" 
                value={currentUser.email} 
                onChange={(e) => {
                  setUserInfo({...userInfo, email: e.target.value});
                  console.log("email changed to: " + e.target.value);
                }}
                />
            </div>
            <div className='setting-info flex flex-sb'>
              <span>Password</span>
              <input 
                className='setting-input fs-12'
                type="password" 
                onChange={(e) => {
                  setUserInfo({...userInfo, password: e.target.value});
                }}
                />
            </div>
            <button className='setting-save-btn' onClick={handleSave}>{saved}</button>
            <button className='container setting-logout flex flex-c' onClick={handleSignOut}>Logout</button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Settings