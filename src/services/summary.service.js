import axios from "axios";
import { Platform } from "react-native";

const API_URL =
  Platform.OS === "android"
    ? "http://10.125.32.35:3005/api"
    : "http://10.125.32.35:3005/api";

export const getSummary = async (user_id) => {
  const res = await axios.get(`${API_URL}/dashboard/summary`, {
    params: { user_id }
  });
  return res.data;
};

export const getPlotsSummary = async (user_id) => {
  const res = await axios.get(`${API_URL}/dashboard/plots`, {
    params: { user_id }
  });
  return res.data;
};
