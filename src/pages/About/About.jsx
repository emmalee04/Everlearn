import React from 'react';
import './About.css';
import Navbar from '../../components/Navbar/Navbar';
import { motion } from "framer-motion";
import AboutImg from '../../images/about-background.png';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className='about flex flex-column flex-c'>
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1, duration: 1.0 }}
        viewport={{ once: true }}
      >
        <div className='about-container flex flex-column flex-c'>
          {/* <img className='about-img' src={AboutImg} alt="" /> */}
          <span className='fs-16'>About Everlearn</span>
          <p className='desc flex flex-c fs-12'>Everlearn is an interactive learning site where anyone 
          can learn anything they want, while spreading their interests. You can learn anything
          for free, in exchange for teaching something you are passionate about. </p>
          <span className='fs-16'>The creator</span>
          <p className='desc flex flex-c fs-12'>This project was created by Emma Lee.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default About