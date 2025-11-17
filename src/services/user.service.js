import axios from "axios";
import { Platform } from "react-native";

const API_URL =
  Platform.OS === "android"
    ? "http://10.125.32.35:3005/api"
    : "http://10.125.32.35:3005/api";

export const getUserByPhone = async (phone) => {
  try {
    const res = await axios.get(`${API_URL}/users/by-phone`, {
      params: { phone }
    });
    return res.data;
  } catch (error) {
    console.log("getUserByPhone error:", error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const res = await axios.post(`${API_URL}/users/register`, userData);
    return res.data;
  } catch (error) {
    console.log("registerUser error:", error);
    throw error;
  }
};

export const loginUser = async (phone) => {
  try {
    const res = await axios.post(`${API_URL}/users/login`, { phone });
    return res.data;
  } catch (error) {
    console.log("loginUser error:", error);
    throw error;
  }
};

export const getUserProfile = async (user_id) => {
  try {
    const res = await axios.get(`${API_URL}/users/${user_id}`);
    return res.data;
  } catch (error) {
    console.log("getUserProfile error:", error);
    throw error;
  }
};

export const updateUserProfile = async (user_id, userData) => {
  try {
    const res = await axios.put(`${API_URL}/users/${user_id}`, userData);
    return res.data;
  } catch (error) {
    console.log("updateUserProfile error:", error);
    throw error;
  }
};
