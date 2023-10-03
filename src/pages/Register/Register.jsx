import React, { useContext, useEffect } from 'react';
import './Register.css';
import { getAuth } from "firebase/auth";
import { motion } from "framer-motion";
import Coffee1 from '../../images/coffee/coffee_1.png';
import Logo from '../../images/applogo.png';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import RegisterEmail from '../../components/EmailAuth/Register/RegisterEmail';
import { useRegisterContext } from '../../context/RegisterContext';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../../context/AuthContext';

// Register page with options for google register, facebook register, and 
// email register.
const Register = () => {
  // Auth provider objects
  const auth = getAuth();
  const { googleSignIn, facebookSignIn, currentUser } = UserAuth();

  // Context objects
  const { registerWithEmail } = useRegisterContext();
  const { setRegisterWithEmail } = useRegisterContext();

  const navigate = useNavigate();
  
  useEffect(() => {
    // Renders from the top of the page
    // window.scrollTo(0,0);
    if (currentUser != null) {
      navigate('/register/username');
    }
  }, [currentUser])

  // Handles google sign in. If successful, redirects to the 
  // login page.
  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (err) {
      // TODO: update error handling
      console.log(err);
    }
  }

  // Handles facebook sign in. If successful, redirects to the 
  // login page.
  const handleFacebookSignIn = async () => {
    try {
      await facebookSignIn();
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
              {!registerWithEmail && 
                <div className='register-form-container flex flex-c'>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1, duration: 3.0 }}
                    viewport={{ once: true }}
                  >
                  <div className='register-form-wrapper flex flex-column'>
                    <span className='title fs-16'>Join Everlearn</span>
                    <button 
                      className='register-btn flex'
                      onClick={handleGoogleSignIn}
                    >
                      <div className='register-btn-elem flex flex-sb'>
                        <GoogleIcon className='register-btn-icon'/>
                        <span className='register-btn-text fs-12'>Join with Google</span>
                      </div>
                    </button>
                    <button 
                      className='register-btn flex'
                      onClick={handleFacebookSignIn}
                    >
                      <div className='register-btn-elem flex flex-sb'>
                        <FacebookIcon className='register-btn-icon'/>
                        <span className='register-btn-text fs-12'>Join with Facebook</span>
                      </div>
                    </button>
                    <button 
                      className='register-btn flex'
                      onClick={() => {
                        // Change registerWithEmail context to true
                        setRegisterWithEmail(true);
                      }}
                    >
                      <div className='register-btn-elem flex flex-sb'>
                        <MailOutlineIcon className='register-btn-icon'/>
                        <span className='register-btn-text fs-12'>Join with email</span>
                      </div>
                    </button>
                    <p className='redirect-login' >Have an account? <Link to="/login" className='login-link'>Login</Link></p>
                  </div>
                </motion.div> 
              </div>}
              {registerWithEmail && <RegisterEmail className='register-form-container flex flex-c' />}
              <div className='register-coffee-quote flex flex-column'>
                <button className='register-coffee-img'>
                  <img src={Coffee1} alt="" />
                </button>
                <span className='register-coffee-quote-line font-zeyada fs-16 text-brown'>coffee and friends make the perfect blend.</span>
              </div>
            </div>
          </motion.div>
      </div>
    </div>
  )
}

export default Register