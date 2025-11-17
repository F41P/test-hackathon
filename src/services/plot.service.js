// import api from '../api/axios';

// export const getPlots = (user_id) =>
//   api.get('/api/plots', { params: { user_id } }).then((res) => res.data);

// export const createPlot = (payload) =>
//   api.post('/api/plots', payload).then((res) => res.data);
import axios from "axios";

const API_URL = "http://localhost:3005/api";

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

export const getRoundsByPlot = async (plot_id) => {
  const res = await axios.get(`${API_URL}/rounds`, {
    params: { plot_id }
  });
  return res.data;
};
