import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(null); // <--- 1. เพิ่ม State เก็บเบอร์โทร

  const login = (phone) => {
    setIsLoggedIn(true);
    setPhoneNumber(phone);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setPhoneNumber(null); 
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, phoneNumber, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};