import React, { useState } from 'react';
import './RegisterEmail.css';
import { auth, db } from '../../../firebase';
import { createUserWithEmailAndPassword, updateProfile, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, collection, where, query, getCountFromServer, Timestamp } from "firebase/firestore"; 
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { Alert, Typography } from '@mui/material';
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIosNew';
import { useRegisterContext } from '../../../context/RegisterContext';

// Register component for registering with email and password.
const RegisterEmail = () => {
  const { setRegisterWithEmail } = useRegisterContext();
  
  const [values, setValues] = useState({
    email: "",
    fullName: "",
    displayName: "",
    password: ""
  });
  
  const [errors, setErrors] = useState({
    invalidEmail: "",
    invalidFullName: "",
    invalidDisplayName: "",
    invalidPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  // Validates the email input.
  const validateEmail = async () => {
    // RegExp for valid email check
    const regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    
    // Create a reference to the users collection
    const usersRef = collection(db, "users");

    // Get query for email
    const emailQ = query(usersRef, where("email", "==", values.email));
    const emailSnapshot = await getCountFromServer(emailQ);

    // Check if email input is empty
    if (!values.email) {
      setErrors({...errors, invalidEmail: "email field cannot be empty"});
      console.log("error: email field is empty");
    }
    // Check if email format is valid (contains valid domain name and @)
    else if (values.email && regEmail.test(values.email) === false) {
      setErrors({...errors, invalidEmail: "invalid email"});
      console.log("error: email is invalid");
    }
    // Check if email exists in firebase
    else if (emailSnapshot.data().count !== 0){
      setErrors({...errors, invalidEmail: "email already exists"});
      console.log("error: email already exists");
    }
    // Reset: no error
    else {
      setErrors({...errors, invalidEmail: ""});
      console.log("no email error");
    }
  }

  // Validates the full name input.
  const validateFullName = () => {
    // Check if full name input is empty
    if (values.fullName == "") {
      setErrors({...errors, invalidFullName: "name field cannot be empty"});
      console.log("error: name field is empty");
    } 
    // Reset: no error
    else {
      setErrors({...errors, invalidFullName: ""});
      console.log("no name error");
    }
  }

  // Validates the display name input.
  const validateDisplayName = async () => {
    // Create a reference to the users collection
    const usersRef = collection(db, "users");

    // Get query for username
    const displayNameQ = query(usersRef, where("displayName", "==", values.displayName));
    const displayNameSnapshot = await getCountFromServer(displayNameQ);

    // Check if username input is empty
    if (!values.displayName) {
      setErrors({...errors, invalidDisplayName: "username field cannot be empty"});
      console.log("error: username field is empty");
    }
    // Check if username exists in firebase
    else if (displayNameSnapshot.data().count !== 0){
      setErrors({...errors, invalidDisplayName: "username already exists"});
      console.log("error: username already exists");
    }
    // Reset: no error
    else {
      setErrors({...errors, invalidDisplayName: ""});
      console.log("no username error");
    }
  }

  // Validates the password input.
  const validatePassword = async () => {
    // RegExp for valid password check
    const regPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Check if password input is empty
    if (!values.password) {
      setErrors({...errors, invalidPassword: "password field cannot be empty"});
      console.log("error: password field is empty");
    }
    // Check if password is valid:
    // * 8 chars or more
    // * at least one uppercase, one lowercase, one digit 
    else if (values.password && regPassword.test(values.password) === false) {
      setErrors({...errors, invalidPassword: "password must be at minimum 8 characters with at least one uppercase letter, one lowercase letter, one number, and one special character"});
      console.log("error: password is invalid");
    } 
    // Reset: no error
    else {
      setErrors({...errors, invalidPassword: ""});
      console.log("no password error");
    }
  }

  // Given the email, full name, username, and password, creates a new user
  // profile on firebase.
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Creates a new user with the given email and password
      await createUserWithEmailAndPassword(auth, values.email, values.password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(user);

          onAuthStateChanged(auth, async (user) => {
            const uid = user.uid;
            console.log(uid);
            try {
              // Update profile with username 
              await updateProfile(user, {
                displayName: values.displayName,
                photoURL: null
              });

              // Create a new document in 'users' collection on firestore
              await setDoc(doc(db, "users", uid), {
                uid: uid,
                email: values.email,
                fullName: values.fullName,
                displayName: values.displayName,
                photoURL: null,
                joinDate: user.metadata.creationTime,
                achievements: [],
                friends: [],
                points: 0,
                lastLoginDate: user.metadata.lastSignInTime,
                loginStreak: 1,
                maxLoginStreak: 1
              });
    
              // Create empty chats for the user on firestore
              await setDoc(doc(db, "userChats", uid), {});
              navigate("/");
            } catch(err) {
              setErr(true);
              console.log(err);
            }
          });
        })
        .catch((err) => {
          setErr(true);
          console.log(err);
        });
    } catch(err) {
      setErr(true);
      console.log(err);
    }
  }
  
  return (
    <div className='email-register-form-container flex flex-c'> 
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1, duration: 3.0 }}
        viewport={{ once: true }}
      >        
        <div className='email-register-form-container flex flex-c'>
          <div className='email-register-form-wrapper flex flex-column'>
            <div className='email-register-topbar flex flex-sb'>
              <button 
                className='email-register-back-btn'
                onClick={() => {
                  // Change registerWithEmail to false
                  setRegisterWithEmail(false);
                }}
              >
                <ArrowBackIosIcon />
              </button>
              <span className='email-register-title fs-16'>Join with email</span>
            </div>
            <form className='email-register-form flex flex-column'>
              <input 
                className='email-register-input fs-12' 
                type="email" 
                placeholder='email' 
                value={values.email}
                onBlur={validateEmail}
                onChange={(e) => setValues({...values, email: e.target.value})}/>
              {errors.invalidEmail !== "" && 
                <motion.div
                  initial={{ opacity: 0.5, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Alert severity="error">
                    <Typography variant="body1">
                      {errors.invalidEmail}
                    </Typography>
                  </Alert>
                </motion.div> 
              }
              <input 
                className='email-register-input fs-12' 
                type="text" 
                placeholder='full name' 
                value={values.fullName}
                onBlur={validateFullName}
                onChange={(e) => setValues({...values, fullName: e.target.value})}/>
              {errors.invalidFullName !== "" && 
              <motion.div
                initial={{ opacity: 0.5, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Alert severity="error">
                  <Typography variant="body1">
                    {errors.invalidFullName}
                  </Typography>
                </Alert>
              </motion.div> 
              }
              <input 
                className='email-register-input fs-12' 
                type="username" 
                placeholder='username' 
                value={values.displayName}
                onBlur={validateDisplayName}
                onChange={(e) => setValues({...values, displayName: e.target.value})}/>
              {errors.invalidDisplayName !== "" && 
              <motion.div
                initial={{ opacity: 0.5, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Alert severity="error">
                  <Typography variant="body1">
                    {errors.invalidDisplayName}
                  </Typography>
                </Alert>
              </motion.div> 
              }
              <div className='email-register-password-input'>
                <input 
                  className='email-register-password-inputfield fs-12' 
                  type={showPassword ? "text" : "password"} 
                  placeholder='password' 
                  value={values.password}
                  onBlur={validatePassword}
                  onChange={(e) => setValues({...values, password: e.target.value})}
                />
                <button 
                  className='email-register-input-btn' 
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPassword(!showPassword);
                  }}
                >
                  { showPassword ? <Visibility /> : <VisibilityOff /> }
                </button>
              </div>
              {errors.invalidPassword !== "" && 
              <motion.div
                initial={{ opacity: 0.5, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Alert severity="error" style={{maxWidth: '250px'}}>
                  <Typography variant="body1">
                    {errors.invalidPassword}
                  </Typography>
                </Alert>
              </motion.div> 
              }
              {err && <span>Something went wrong</span>}
              <button className='sign-up fs-12' onClick={handleSubmit} >Sign up</button>
            </form>
          </div>
        </div>
      </motion.div>
  </div>
  )
}

export default RegisterEmail