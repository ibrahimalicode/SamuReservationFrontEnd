import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import toast from "react-hot-toast";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch custom user data from Firestore
        const userRef = doc(db, "Users", user.email); // Reference to the user document in Firestore
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          // If user data exists in Firestore, combine it with Firebase Auth user
          const { emailVerified } = user;
          setUser({
            emailVerified, // user from Firebase Auth (including displayName, email, etc.)
            ...userSnap.data(), // Custom data from Firestore
            // Add any other custom fields from Firestore here
          });
        }
      } else {
        // No user is signed in
        setUser(null);
      }
      toast.dismiss();
      setLoading(false);
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
