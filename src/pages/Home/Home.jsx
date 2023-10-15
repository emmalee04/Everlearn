import React from 'react'
import './Home.css';
import Navbar from '../../components/Navbar/Navbar';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className='home flex flex-column flex-c'>
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1, duration: 1.0 }}
        viewport={{ once: true }}
      >
        <div className='home-title-container flex flex-column flex-c'>
          <span className='title-desc-1 fs-22'>Explore topics to learn.</span>
          <span className='subtitle-desc-1 fs-14'>Connect with new people.</span>
        </div>
        <div className='hor-scroll-bar'>
          <div className='hor-scroll-elements primary flex flex-c'>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0, duration: 3.0 }}
              viewport={{ once: true }}
            >
              <button className='hor-scroll-element ls-12'>
                Art
              </button>
              <button className='hor-scroll-element ls-12'>
                Language
              </button>
              <button className='hor-scroll-element ls-12'>
                Academics
              </button>
              <button className='hor-scroll-element ls-12'>
                Sports
              </button>
            </motion.div>
          </div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0, duration: 3.0 }}
              viewport={{ once: true }}
            >
              <div className='hor-scroll-elements secondary flex flex-c'>
                <button className='hor-scroll-element ls-12'>
                  Cooking
                </button>
                <button className='hor-scroll-element ls-12'>
                  Dance
                </button>
                <button className='hor-scroll-element ls-12'>
                  Gaming
                </button>
              </div>
            </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default Home