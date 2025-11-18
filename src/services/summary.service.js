import axios from "axios";
import { Platform } from "react-native";

const API_URL =
  Platform.OS === "android"
    ? "http://10.0.2.2:3005/api"
    : "http://localhost:3005/api";

export const getSummary = async (user_id) => {
  const res = await axios.get(`${API_URL}/dashboard/summary?user_id=${user_id}`);
  return res.data;
};
