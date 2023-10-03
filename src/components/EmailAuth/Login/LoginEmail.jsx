import React, { useEffect, useState } from 'react';
import './LoginEmail.css';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../../firebase';
import { motion } from "framer-motion";
import { useLoginContext } from '../../../context/LoginContext';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIosNew';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { UserAuth } from '../../../context/AuthContext';

// Login component for logging in with email and password.
const LoginEmail = () => {
  const { setLoginWithEmail } = useLoginContext();
  const navigate = useNavigate();
  
  const [err, setErr] = useState(false);
  const { currentUser } = UserAuth();

  const [userInfo, setUserInfo] = useState({
    points: 0,
    lastLoginDate: Date.now(),
    loginStreak: 1,
    maxLoginStreak: 1
  });

  // Loads the current user login data.
  const loadData = async() => {
    
    // Get a reference to the user data and update user's full name
    const docRef = doc(db, "users", currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Checking login streak
      var difference_in_days = 
        (Date.now().getTime() - docSnap.data().lastLoginDate.getTime()) / (1000 * 3600 * 24);
      if (difference_in_days == 1) {
        setUserInfo({...userInfo, loginStreak: docSnap.data().loginStreak + 1});
        // Update max login streak
        if (docSnap.data().loginStreak + 1 > docSnap.data().maxLoginStreak) {
          setUserInfo({...userInfo, maxLoginStreak: docSnap.data().loginStreak});
        }
      } else if (difference_in_days > 1) {
        setUserInfo({...userInfo, loginStreak: 1})
      }
      
      // Update rest of the info
      setUserInfo({
        ...userInfo,
        points: docSnap.data().points + 20,
        lastLoginDate: Date.now(),
      });
      console.log(userInfo);

    } else {
      console.log("doc doesn't exist");
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);

      // Update user info with login streak.
      await updateDoc(doc(db, "users", currentUser.uid), {
        points: userInfo.points,
        lastLoginDate: userInfo.lastLoginDate,
        loginStreak: userInfo.loginStreak,
        maxLoginStreak: userInfo.maxLoginStreak
      })

      navigate("/");
    } catch(err) {
      console.log(err);
      setErr(true);
    }
  }
  
  return (
    <div className='login-form-container flex flex-c'>
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1, duration: 3.0 }}
            viewport={{ once: true }}
        >
          <div className='login-form-container flex flex-c'>
            <div className='login-form-wrapper flex flex-column'>
              <div className='email-login-topbar flex flex-sb'>
                <button 
                  className='email-login-back-btn'
                  onClick={() => {
                    // Change loginWithEmail to false
                    setLoginWithEmail(false);
                  }}
                >
                  <ArrowBackIosIcon />
                </button>
                <span className='email-login-title fs-16'>Sign in with email</span>
              </div>
              <form className='login-form flex flex-column' onSubmit={handleSubmit} >
                <input className="login-input fs-12" type="email" placeholder='email' />
                <input className="login-input fs-12" type="password" placeholder='password'/>
                <button className='sign-in fs-12'>Sign in</button>
                {err && <span>Something went wrong</span>}
              </form>
            </div>
          </div>
        </motion.div>
      </div>
  )
}

export default LoginEmail