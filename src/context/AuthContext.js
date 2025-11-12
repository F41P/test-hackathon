import React, { createContext, useState, useContext } from 'react';

// 1. สร้าง "กล่อง"
const AuthContext = createContext();

// 2. สร้าง "ผู้ให้บริการ" ที่จะเก็บ State
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(null);

  // 3. สร้างฟังก์ชันให้หน้าอื่นเรียกใช้
  const login = () => {
    // TODO: ตรงนี้ในอนาคตคือจุดที่เช็ค OTP กับ Backend
    // ตอนนี้แค่สั่งให้ Login สำเร็จ
    setIsLoggedIn(true);
    setPhoneNumber(phoneNumber);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setPhoneNumber(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. สร้าง "ทางลัด" (Hook) ให้หน้าอื่นดึงข้อมูลไปใช้ง่ายๆ
export const useAuth = () => {
  return useContext(AuthContext);
};