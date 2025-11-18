// import React, { createContext, useState, useContext } from 'react';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [phoneNumber, setPhoneNumber] = useState(null);
//   const [user, setUser] = useState(null); // เก็บ user object ทั้งตัว เช่น { user_id, firstName }

//   const login = (userData) => {
//   setUser(userData);              // สำคัญที่สุด!
//   setPhoneNumber(userData.phone); // หรือ userData.phone_number
//   setIsLoggedIn(true);
// };

//   const logout = () => {
//     setIsLoggedIn(false);
//     setUser(null);
//     setPhoneNumber(null);
//   };

//   return (
//     <AuthContext.Provider value={{ isLoggedIn, user, setUser, phoneNumber, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState(null);
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData); 
    setEmail(userData.email);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setEmail(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, setUser, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
