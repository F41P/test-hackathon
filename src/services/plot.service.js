import axios from "axios";
import { Platform } from "react-native";

const API_URL =
  Platform.OS === "android"
    ? "http://10.125.32.35:3005/api"
    : "http://10.125.32.35:3005/api";

export const getPlots = async (user_id) => {
  const res = await axios.get(`${API_URL}/plots`, {
    params: { user_id }
  });
  return res.data;
};

export const getPlotById = async (plot_id) => {
  const res = await axios.get(`${API_URL}/plots/${plot_id}`);
  return res.data;
};

export const createPlot = async (plotData) => {
  const res = await axios.post(`${API_URL}/plots`, plotData);
  return res.data;
};

export const updatePlot = async (plot_id, plotData) => {
  const res = await axios.put(`${API_URL}/plots/${plot_id}`, plotData);
  return res.data;
};

export const deletePlot = async (plot_id) => {
  const res = await axios.delete(`${API_URL}/plots/${plot_id}`);
  return res.data;
};

export const getRoundsByPlot = async (plot_id) => {
  const res = await axios.get(`${API_URL}/rounds`, {
    params: { plot_id }
  });
  return res.data;
};

export const createRound = async (roundData) => {
  const res = await axios.post(`${API_URL}/rounds`, roundData);
  return res.data;
};
