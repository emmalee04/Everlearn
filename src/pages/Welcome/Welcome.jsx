import React from 'react';
import "./Welcome.css";
import { Link } from 'react-router-dom';
import Logo from '../../images/applogo.png';
import { motion } from "framer-motion";

const Welcome = () => {
  return (
    <div className='welcome flex flex-column flex-c'>
      <div className='welcome-upper-navbar flex flex-sb'>
        <img className="logo-img" src={Logo} alt="" />
        <Link to="/login">
          <button className='welcome-sign-in'>Sign in</button>
        </Link>
      </div>
      <div className='title-container flex flex-column flex-c'>
        <span className='title-desc-1 fs-22'>Where Knowledge Meets Creativity.</span>
        <p className='title-desc-2 fs-15'>bringing learners and educators together for everlearning</p>
        <div className='register-container flex flex-sb'>
          <Link to="/register">
            <button className='get-started fs-16'>Get Started</button>
          </Link>
        </div>
      </div>
      <div className='description flex flex-column grid'>
        <motion.div
          initial={{ opacity: 0, y: 75 }}
          whileInView={{ opacity: 1, y: 0, duration: 3.0 }}
          viewport={{ once: true }}
        >
          <div className='desc-container flex container flex-sb'>
            <div>
              <span className='fs-22'>Discover and connect</span>
              <p className='sub-desc fs-14'>Connect with your friends or discover new peers to learn together.</p>
            </div>
            <img className='desc-img' src="https://cdn.pixabay.com/photo/2016/07/07/16/46/dice-1502706_640.jpg" alt="" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 75 }}
          whileInView={{ opacity: 1, y: 0, duration: 3.0 }}
          viewport={{ once: true }}
        >
          <div className='desc-container flex container flex-sb'>
            <img className='desc-img' src="https://cdn.pixabay.com/photo/2016/07/07/16/46/dice-1502706_640.jpg" alt="" /> 
            <div>
              <span className='fs-22'>Learn anything possible</span>
              <p className='sub-desc fs-14'>Search for endless possibilities. Learn something new everyday.</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 75 }}
          whileInView={{ opacity: 1, y: 0, duration: 3.0 }}
          viewport={{ once: true }}
        >
          <div className='desc-container flex container flex-sb'>
            <div>
              <span className='fs-22'>Spread your passion</span>
              <p className='sub-desc fs-14'>Teach something you're passionate about, and make friends to share that passion with you.</p>
            </div>
            <img className='desc-img' src="https://cdn.pixabay.com/photo/2016/07/07/16/46/dice-1502706_640.jpg" alt="" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Welcome