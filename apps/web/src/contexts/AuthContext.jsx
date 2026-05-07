import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentBusiness, setCurrentBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (pb.authStore.isValid) {
        setCurrentUser(pb.authStore.model);
        try {
          const businesses = await pb.collection('businesses').getFullList({
            filter: `userId="${pb.authStore.model.id}"`,
            $autoCancel: false
          });
          if (businesses.length > 0) {
            setCurrentBusiness(businesses[0]);
          }
        } catch (error) {
          console.error("Error fetching business:", error);
        }
      }
      setLoading(false);
    };
    
    checkAuth();

    const unsubscribe = pb.authStore.onChange((token, model) => {
      setCurrentUser(model);
      if (!model) setCurrentBusiness(null);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email, password, businessName) => {
    try {
      const user = await pb.collection('users').create({
        email,
        password,
        passwordConfirm: password,
      }, { $autoCancel: false });
      
      await pb.collection('users').requestVerification(email, { $autoCancel: false });
      
      await pb.collection('users').authWithPassword(email, password, { $autoCancel: false });
      
      const business = await pb.collection('businesses').create({
        userId: user.id,
        name: businessName,
      }, { $autoCancel: false });
      
      setCurrentUser(pb.authStore.model);
      setCurrentBusiness(business);
      return { user, business };
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const authData = await pb.collection('users').authWithPassword(email, password, { $autoCancel: false });
      setCurrentUser(authData.record);
      
      const businesses = await pb.collection('businesses').getFullList({
        filter: `userId="${authData.record.id}"`,
        $autoCancel: false
      });
      if (businesses.length > 0) {
        setCurrentBusiness(businesses[0]);
      }
      return authData;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setCurrentUser(null);
    setCurrentBusiness(null);
  };

  const value = {
    currentUser,
    currentBusiness,
    signup,
    login,
    logout,
    isAuthenticated: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};