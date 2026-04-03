import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://54.252.195.212:5001',
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
