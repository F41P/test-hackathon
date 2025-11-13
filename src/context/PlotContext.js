import React, { createContext, useState, useContext } from 'react';

// 1. สร้าง "กล่อง"
const PlotContext = createContext();

// (ข้อมูลจำลองเริ่มต้น ให้เหมือนกับที่เราเคย Hard-code ใน HomeScreen)
const MOCK_PLOTS = [
  { id: 'plot1', name: 'ข้าวโพดหลังบ้าน' },
  { id: 'plot2', name: 'ข้าวหอมมะลิ' },
  { id: 'plot3', name: 'ขิงแปลงใหญ่' },
  { id: 'plot4', name: 'พริกข้างเทศบาล' },
];

// 2. สร้าง "ผู้ให้บริการ" ที่จะเก็บ State
export const PlotProvider = ({ children }) => {
  const [plots, setPlots] = useState(MOCK_PLOTS); // <--- เริ่มต้นด้วยข้อมูลจำลอง

  // 3. สร้างฟังก์ชันให้หน้า 'AddPlotScreen' เรียกใช้
  const addPlot = (plotData) => {
    // (ในอนาคต ตรงนี้คือจุดที่ยิง API 'POST /plots')
    
    // ตอนนี้ เราจะแค่เพิ่มข้อมูลใหม่ (แบบจำลอง) เข้าไปใน State
    const newPlot = {
      id: `plot${Math.random()}`, // สร้าง ID มั่วๆ ไปก่อน
      name: plotData.plotName, // (เราจะดึง plotName มาจากฟอร์ม)
    };
    setPlots(currentPlots => [...currentPlots, newPlot]);
  };

  return (
    // 4. ส่ง "แปลงทั้งหมด" (plots) และ "ฟังก์ชันเพิ่มแปลง" (addPlot) ออกไป
    <PlotContext.Provider value={{ plots, addPlot }}>
      {children}
    </PlotContext.Provider>
  );
};

// 5. สร้าง "ทางลัด" (Hook) ให้หน้าอื่นดึงข้อมูลไปใช้ง่ายๆ
export const usePlots = () => {
  return useContext(PlotContext);
};