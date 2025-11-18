import axios from "axios";

const API_URL = "http://localhost:3005/api";

export const getTransactions = async (round_id) => {
  const res = await axios.get(`${API_URL}/transactions`, {
    params: { round_id }
  });
  return res.data;
};