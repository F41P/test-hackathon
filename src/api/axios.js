import axios from 'axios';
import { Platform } from 'react-native';

const api = axios.create({
  baseURL:
    Platform.OS === 'android'
      ? "http://10.0.2.2:3005"
      : "http://localhost:3005",
  timeout: 10000,
});

export default api;
