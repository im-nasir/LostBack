import React, { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../Database/FirebaseConfig';

const AuthListener = ({ setCurrentUserId }) => {
  console.log("AuthListener mounted"); // Log when AuthListener is mounted
  useEffect(() => {
    console.log("AuthListener mounted"); // Log when AuthListener is mounted
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user); // Log user state changes
      console.log("Auth state changed:", user); // Log user state changes
      console.log("Auth state changed:", user); // Log user state changes
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        console.log("User is not authenticated."); // Log when user is not authenticated
        console.log("User is not authenticated."); // Log when user is not authenticated
        setCurrentUserId(null);
      }
    });

    return () => unsubscribe(); // Cleanup listener
  }, [setCurrentUserId]);

  return null; // This component does not render anything
};

export default AuthListener;
