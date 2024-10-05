// axiosConfig.js

import axios from 'axios';

// Get the access token from cookies
const accessToken = document.cookie
  .split('; ')
  .find((row) => row.startsWith('accessToken'))
  .split('=')[1];
  
// Create an instance of axios
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
});

console.log({accessToken})
// Set the Authorization header for every request
axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

export default axiosInstance;