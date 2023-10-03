import React, { useEffect, useState } from 'react';
import './Profile.css';
import Navbar from '../../components/Navbar/Navbar';
import { getAuth } from 'firebase/auth';
import { UserAuth } from '../../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import blankPfp from '../../images/blank-profile-pic.webp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
import coffeebean from '../../images/coffeebean.png';
import StreakBadge from '../../images/badges/streak-badge.png';
import XpBadge from '../../images/badges/xp-badge.png';
import ScholarBadge from '../../images/badges/scholar-badge.png';
import ConnectBadge from '../../images/badges/connect-badge.png';
import { motion } from 'framer-motion';

const Profile = () => {
  const auth = getAuth();
  const { currentUser } = UserAuth();

  const [userInfo, setUserInfo] = useState({
    fullName: "",
    displayName: "",
    bio: "",
    profileImg: null,
    joinDate: null,
    achievements: [],
    friends: [],
    points: 0,
    maxLoginStreak: 1
  });
  
  const loadData = async() => {
    
    // Get a reference to the user data and update user's full name
    const docRef = doc(db, "users", currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setUserInfo({
        ...userInfo,
        fullName: docSnap.data().fullName,
        displayName: currentUser.displayName,
        profileImg: currentUser.photoURL,
        joinDate: new Date(docSnap.data().joinDate).toLocaleDateString('en-us', { year:"numeric", month:"short"}),
        achievements: docSnap.data()?.achievements,
        friends: docSnap.data()?.friends,
        points: docSnap.data()?.points,
        maxLoginStreak: docSnap.data()?.maxLoginStreak,
        bio: docSnap.data().bio
      });
      console.log(docSnap.data());
      console.log(userInfo);
    } else {
      console.log("doc doesn't exist");
    }
  }

  // Load user data on initial render
  useEffect(() => {
    loadData();
  }, [])

  return (
    <div className='profile flex flex-column'>
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1, duration: 1.0 }}
        viewport={{ once: true }}
      >
        <div className='profile flex flex-sb'>
          <div className='profile-container flex flex-sb'>
            <div className='profile-info flex-column container'>
              <span className='fs-16'>{userInfo.displayName}</span>
              <div className='profile-info flex'>
                <AccessTimeIcon />
                <p>Joined {userInfo.joinDate || ""}</p>
              </div>
              <div className='profile-info flex'>
                <PeopleIcon />
                <p>{userInfo.friends.length} learners-in-crime</p>
              </div>
              <div className='profile-info flex'>
                <img className='coffeebean-img' src={coffeebean} alt="" />
                <span>{userInfo.points} coffee beans</span>
              </div>
              <span className='fw-5'>{userInfo.fullName}</span>
              <span>{userInfo.bio}</span>
            </div>
            <div className='profile-pfp-container'>
              <img className='profile-pfp' src={currentUser.photoURL ? currentUser.photoURL : blankPfp} alt="" /> 
              <Link className='profile-edit-btn' to={`/profile/edit`}>
                <EditIcon />
              </Link>
            </div>
          </div>
        </div>
        <div className='profile-container container flex flex-column'>
          <span className='fs-16'>Achievements</span>
          {userInfo.achievements.length == 0 && 
            <div>
              <p>You don't have achievements yet. Try keeping up a login streak, 
                connecting with friends and new people, or discovering a new 
                thing to learn!</p>
            </div>
          }
          {userInfo.achievements.length != 0 && 
            <div>
              <div className='achievement-badge container flex'>
                <img className='achievement-badge-img' src={StreakBadge} alt="" />
                <div className='flex-column'>
                  <span className='fs-12 fw-2'>Streak badge</span>
                  <p>Your max streak is {userInfo.maxLoginStreak}! Keep it going!</p>
                </div>
              </div>
              <div className='achievement-badge container flex'>
                <img className='achievement-badge-img' src={XpBadge} alt="" />
                <div className='flex-column'>
                  <span className='fs-12 fw-2'>Coffee bean badge</span>
                  <p>You have a total of {userInfo.points} beans! Bravo, you are a certified barista!</p>
                </div>
              </div>
              <div className='achievement-badge container flex'>
                <img className='achievement-badge-img' src={ScholarBadge} alt="" />
                <div className='flex-column'>
                  <span className='fs-12 fw-2'>Scholar badge</span>
                  <p>You have learned and taught over 20 things. Give yourself a pat on the back.</p>
                </div>
              </div>
              <div className='achievement-badge container flex'>
                <img className='achievement-badge-img' src={ConnectBadge} alt="" />
                <div className='flex-column'>
                  <span className='fs-12 fw-2'>Connect badge</span>
                  <p>You have made over 20 valuable connections and friends. Keep spreading your passion.</p>
                </div>
              </div>
            </div>
          }

        </div>
      </motion.div>
    </div>
  )
}

export default Profile