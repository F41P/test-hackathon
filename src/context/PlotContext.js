// import React, { createContext, useState, useContext } from 'react';

// // 1. สร้าง "กล่อง"
// const PlotContext = createContext();

// // (ข้อมูลจำลองเริ่มต้น ให้เหมือนกับที่เราเคย Hard-code ใน HomeScreen)
// const MOCK_PLOTS = [
//   { id: 'plot1', name: 'ข้าวโพดหลังบ้าน' },
//   { id: 'plot2', name: 'ข้าวหอมมะลิ' },
//   { id: 'plot3', name: 'ขิงแปลงใหญ่' },
//   { id: 'plot4', name: 'พริกข้างเทศบาล' },
// ];

// // 2. สร้าง "ผู้ให้บริการ" ที่จะเก็บ State
// export const PlotProvider = ({ children }) => {
//   const [plots, setPlots] = useState(MOCK_PLOTS); // <--- เริ่มต้นด้วยข้อมูลจำลอง

//   // 3. สร้างฟังก์ชันให้หน้า 'AddPlotScreen' เรียกใช้
//   const addPlot = (plotData) => {
//     // (ในอนาคต ตรงนี้คือจุดที่ยิง API 'POST /plots')
    
//     // ตอนนี้ เราจะแค่เพิ่มข้อมูลใหม่ (แบบจำลอง) เข้าไปใน State
//     const newPlot = {
//       id: `plot${Math.random()}`, // สร้าง ID มั่วๆ ไปก่อน
//       name: plotData.plotName, // (เราจะดึง plotName มาจากฟอร์ม)
//     };
//     setPlots(currentPlots => [...currentPlots, newPlot]);
//   };

//   return (
//     // 4. ส่ง "แปลงทั้งหมด" (plots) และ "ฟังก์ชันเพิ่มแปลง" (addPlot) ออกไป
//     <PlotContext.Provider value={{ plots, addPlot }}>
//       {children}
//     </PlotContext.Provider>
//   );
// };

// // 5. สร้าง "ทางลัด" (Hook) ให้หน้าอื่นดึงข้อมูลไปใช้ง่ายๆ
// export const usePlots = () => {
//   return useContext(PlotContext);
// };

import React, { createContext, useState, useContext } from 'react';
import axios from "axios";

const PlotContext = createContext();
const API_URL = "http://localhost:3005/api";

export const PlotProvider = ({ children }) => {
  const [plots, setPlots] = useState([]);

  // ⭐ 1) เพิ่มแปลงใหม่
  const addPlot = async (newPlot) => {
    try {
      // ส่งไป backend (ถ้าคุณมี API)
      const res = await axios.post(`${API_URL}/plots`, newPlot);

      // เอาข้อมูลที่ backend ส่งกลับมาเพิ่มใน state
      setPlots((prev) => [...prev, res.data]);

    } catch (err) {
      console.log("Add plot error:", err);
      throw err; // เผื่อไว้ให้หน้า UI handle error
    }
  };

  // ⭐ 2) โหลดแปลงทั้งหมดจาก backend
  const loadPlots = async (user_id) => {
    try {
      const res = await axios.get(`${API_URL}/plots`, {
        params: { user_id }
      });
      setPlots(res.data);
    } catch (err) {
      console.log("Load plots error:", err);
    }
  };

  return (
    <PlotContext.Provider value={{
      plots,
      setPlots,
      addPlot,     
      loadPlots    
    }}>
      {children}
    </PlotContext.Provider>
  );
};

export const usePlots = () => useContext(PlotContext);

