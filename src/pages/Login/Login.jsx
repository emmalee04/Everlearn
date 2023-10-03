import React, { useEffect, useState } from 'react';
import './Login.css';
import { getAuth } from "firebase/auth";
import { motion } from "framer-motion";
import Coffee4 from '../../images/coffee/coffee_4.png';
import Logo from '../../images/applogo.png';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LoginEmail from '../../components/EmailAuth/Login/LoginEmail';
import { useLoginContext } from '../../context/LoginContext';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../../context/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const Login = () => {
  // Auth provider objects
  const auth = getAuth();
  const { googleSignIn, facebookSignIn, currentUser } = UserAuth();
  const [err, setErr] = useState(false);

  const [userInfo, setUserInfo] = useState({
    points: 0,
    lastLoginDate: Date.now(),
    loginStreak: 1,
    maxLoginStreak: 1
  });

  // Context objects
  const { loginWithEmail, setLoginWithEmail } = useLoginContext();

  const navigate = useNavigate();
  
  // If user is signed in, navigate to home page
  useEffect(() => {
    if (currentUser != null) {
      navigate('/');
    }
  }, [currentUser]);

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

  const handleUpdateStreak = async () => {
    // Update user doc
    await updateDoc(doc(db, "users", currentUser.uid), {
      points: userInfo.points,
      lastLoginDate: userInfo.lastLoginDate,
      loginStreak: userInfo.loginStreak,
      maxLoginStreak: userInfo.maxLoginStreak
    })
  }

  // Handles google sign in.
  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      loadData();
      handleUpdateStreak();
    } catch (err) {
      // TODO: update error handling
      console.log(err);
    }
  }

  // Handles facebook sign in.
  const handleFacebookSignIn = async () => {
    try {
      await facebookSignIn();
      loadData();
      handleUpdateStreak();
    } catch (err) {
      // TODO: update error handling
      console.log(err);
    }
  }

  return (
    <div className='register-form'>
      <div className='logo'>
        <img className="logo-img" src={Logo} alt="" />
      </div>
        <div className='register-form-container flex flex-c'>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1, duration: 3.0 }}
            viewport={{ once: true }}
          >
            <div className='register-form flex flex-c'>
              {!loginWithEmail && 
                <div className='register-form-container flex flex-c'>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1, duration: 3.0 }}
                    viewport={{ once: true }}
                  >
                  <div className='register-form-wrapper flex flex-column'>
                    <span className='title fs-16'>Welcome back</span>
                    <button 
                      className='register-btn flex'
                      onClick={handleGoogleSignIn}
                    >
                      <div className='register-btn-elem flex flex-sb'>
                        <GoogleIcon className='register-btn-icon'/>
                        <span className='register-btn-text fs-12'>Sign in with Google</span>
                      </div>
                    </button>
                    <button 
                      className='register-btn flex'
                      onClick={handleFacebookSignIn}
                    >
                      <div className='register-btn-elem flex flex-sb'>
                        <FacebookIcon className='register-btn-icon'/>
                        <span className='register-btn-text fs-12'>Sign in with Facebook</span>
                      </div>
                    </button>
                    <button 
                      className='register-btn flex'
                      onClick={() => {
                        // Change registerWithEmail context to true
                        setLoginWithEmail(true);
                      }}
                    >
                      <div className='register-btn-elem flex flex-sb'>
                        <MailOutlineIcon className='register-btn-icon'/>
                        <span className='register-btn-text fs-12'>Sign in with email</span>
                      </div>
                    </button>
                    <p className='redirect-login' >Don't have an account? <Link to="/register" className='login-link'>Register</Link></p>
                  </div>
                </motion.div> 
              </div>}
              {loginWithEmail && <LoginEmail className='register-form-container flex flex-c' />}
              <div className='login-coffee-quote flex flex-column'>
                <button className='login-coffee-img'>
                  <img src={Coffee4} alt="" />
                </button>
                <span className='login-coffee-quote-line font-zeyada fs-16 text-brown'>welcome back to everlearn and a cup of coffee.</span>
              </div>
            </div>
          </motion.div>
      </div>
    </div>
  )
}

export default Login