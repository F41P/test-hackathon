import { createContext, useState, useContext, useMemo } from 'react';
import { createPlot } from '../services/plot.service';

const PlotContext = createContext();

export const PlotProvider = ({ children }) => {
  const [plots, setPlots] = useState([]);

  const addPlot = async (newPlot) => {
    try {
      const res = await createPlot(newPlot);
      setPlots((prev) => [...prev, res]);
      return res;
    } catch (err) {
      console.log("Add plot error:", err);
      throw err;
    }
  };

  const value = useMemo(() => ({
    plots,
    setPlots,
    addPlot,
  }), [plots]);

  return (
    <PlotContext.Provider value={value}>
      {children}
    </PlotContext.Provider>
  );
};

export const usePlots = () => useContext(PlotContext);

