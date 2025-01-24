import { db } from "../firebase";
import { useAuth } from "./AuthContext";
import { collection, onSnapshot } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }) => {
  const { user } = useAuth();
  const [usersData, setUsersData] = useState(null);
  const [facilitiesData, setFacilitiesData] = useState(null);
  const [settingsData, setSettingsData] = useState(null);
  const [userRequests, setUserRequests] = useState(null);

  // Subscribe to Firestore collections
  useEffect(() => {
    // Subscribe to Users collection
    if (user?.Auth === 0) {
      const unsubscribeUsers = onSnapshot(
        collection(db, "Users"),
        (snapshot) => {
          const users = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUsersData(users);
        },
        (error) => {
          console.error("Error fetching Users:", error);
        }
      );
      // Cleanup on unmount
      return () => {
        unsubscribeUsers();
      };
    }
  }, [user]);

  useEffect(() => {
    // Subscribe to Facilities collection
    const unsubscribeFacilities = onSnapshot(
      collection(db, "Facilities"),
      (snapshot) => {
        const facilities = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFacilitiesData(facilities);
      },
      (error) => {
        console.error("Error fetching Facilities:", error);
      }
    );

    // Subscribe to SiteSettings collection
    const unsubscribeSettings = onSnapshot(
      collection(db, "SiteSettings"),
      (snapshot) => {
        const settings = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSettingsData(settings[0]);
      },
      (error) => {
        console.error("Error fetching SiteSettings:", error);
      }
    );

    // Subscribe to UserRequests collection
    const unsubscribeUserRequests = onSnapshot(
      collection(db, "UserRequests"),
      (snapshot) => {
        const userReqsts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserRequests(userReqsts);
      },
      (error) => {
        console.error("Error fetching UserRequests:", error);
      }
    );

    // Cleanup on unmount
    return () => {
      unsubscribeFacilities();
      unsubscribeSettings();
      unsubscribeUserRequests();
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        usersData,
        setUsersData,
        facilitiesData,
        setFacilitiesData,
        settingsData,
        setSettingsData,
        userRequests,
        setUserRequests,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
