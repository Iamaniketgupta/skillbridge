import axios from 'axios';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const accessToken = cookies.get('accessToken');
 const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/',
});

axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;


export default axiosInstance;