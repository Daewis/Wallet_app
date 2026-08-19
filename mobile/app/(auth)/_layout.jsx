import { Redirect, Stack } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useEffect, useState } from "react";

export default function AuthLayout() {
  const [isSignedIn, setIsSignedIn] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setIsSignedIn(!!user);
    });

    return unsub;
  }, []);

  if (isSignedIn === null) return null; 
  if (isSignedIn) {
    return <Redirect href="/" />;
  }

  return <Stack />;
}
