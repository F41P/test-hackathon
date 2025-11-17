import { createContext, useState, useContext, useMemo } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
    setPhoneNumber(userData.phone);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setPhoneNumber(null);
  };

  const value = useMemo(() => ({
    isLoggedIn,
    user,
    phoneNumber,
    login,
    logout
  }), [isLoggedIn, user, phoneNumber]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
