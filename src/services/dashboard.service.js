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

export const getExpenseBreakdown = async (user_id, plot_id = null) => {
  const params = { user_id };
  if (plot_id) {
    params.plot_id = plot_id;
  }

  const res = await axios.get(`${API_URL}/dashboard/expense-breakdown`, { params });
  return res.data;
};

export const getIncomeBreakdown = async (user_id) => {
  const res = await axios.get(`${API_URL}/dashboard/income-breakdown`, { 
    params: { user_id } 
  });
  return res.data;
};

export const getProfitByPlant = async (user_id) => {
  const res = await axios.get(`${API_URL}/dashboard/profit-by-plant`, { 
    params: { user_id } 
  });
  return res.data;
};

export const getCategories = async () => {
  const res = await axios.get(`${API_URL}/transactions/categories`);
  return res.data; 
};

