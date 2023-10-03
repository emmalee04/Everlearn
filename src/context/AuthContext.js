import { createContext, useEffect, useState, useContext } from "react";
import { onAuthStateChanged, signInWithRedirect, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { auth } from "../firebase";

export const AuthContext = createContext();

// Authentication context provider for whether or not
// the user is signed in. If so, provides the user value.
export const AuthContextProvider = ({children}) => {
  const [currentUser, setCurrentUser] = useState({});

  // Sign in with Google
  const googleSignIn = () => {
    const googleProvider = new GoogleAuthProvider();
    signInWithRedirect(auth, googleProvider);
  };

  // Sign in with Facebook
  const facebookSignIn = () => {
    const facebookProvider = new FacebookAuthProvider();
    signInWithRedirect(auth, facebookProvider);
  }
  
  useEffect(() => {
    // Get the currently signed-in user
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); 
      console.log(user);
    });
    
    // Cleanup function
    return () => {
      unsub();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ googleSignIn, facebookSignIn, currentUser }}>
      {children} 
    </AuthContext.Provider>
  )
}

export const UserAuth = () => {
  return useContext(AuthContext);
};