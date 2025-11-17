import axios from "axios";
import { Platform } from "react-native";

const API_URL =
  Platform.OS === "android"
    ? "http://10.125.32.35:3005/api"
    : "http://10.125.32.35:3005/api";

export const getTransactions = async (round_id) => {
  const res = await axios.get(`${API_URL}/transactions`, {
    params: { round_id }
  });
  return res.data;
};

export const createTransaction = async (transactionData) => {
  const res = await axios.post(`${API_URL}/transactions`, transactionData);
  return res.data;
};

export const getExpenseCategories = async () => {
  const res = await axios.get(`${API_URL}/categories/expense`);
  return res.data;
};

export const getIncomeCategories = async () => {
  const res = await axios.get(`${API_URL}/categories/income`);
  return res.data;
};

export const getAllCategories = async () => {
  const res = await axios.get(`${API_URL}/categories`);
  return res.data;
};
