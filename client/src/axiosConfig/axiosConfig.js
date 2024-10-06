import axios from 'axios';
import { getCookie } from '../components/constants';

const accessToken = cookies.get('accessToken');
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
});

axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;


export default axiosInstance;