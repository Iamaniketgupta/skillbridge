import axios from 'axios';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const accessToken = cookies.get('accessToken');
if(!accessToken)
  window.location.href = '/login'
 const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
});

axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;


export default axiosInstance;
