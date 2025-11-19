import React, { createContext, useState, useContext } from 'react';
import axios from "axios";

const PlotContext = createContext();
const API_URL = "http://localhost:3005/api";

export const PlotProvider = ({ children }) => {
  const [plots, setPlots] = useState([]);

  const addPlot = async (newPlot) => {
    try {

      const res = await axios.post(`${API_URL}/plots`, newPlot);


      setPlots((prev) => [...prev, res.data]);

    } catch (err) {
      console.log("Add plot error:", err);
      throw err; 
    }
  };


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

