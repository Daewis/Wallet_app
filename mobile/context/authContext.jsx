// context/authContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth } from "../firebaseConfig";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);  
  const [loading, setLoading] = useState(true);

  // Listen to Firebase auth state - this is the single source of truth.
  // Route protection/redirects are handled declaratively in (auth)/_layout.jsx
  // and (root)/_layout.jsx based on `user` and `loading` from this context.
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsub;
  }, []);

  // AUTH FUNCTIONS
  const signIn = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(result.user);
    return result;
  };

  const signInWithGoogle = async (idToken) => {
    const credential = GoogleAuthProvider.credential(idToken);
    return await signInWithCredential(auth, credential);
  };

  const resendVerificationEmail = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
    }
  };

  const resetPassword = async (email) => {
    return await sendPasswordResetEmail(auth, email);
  };

  const signOut = async () => {
    return await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        signInWithGoogle,
        resendVerificationEmail,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}