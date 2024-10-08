// authActions.js
import axios from 'axios';
import { login, logout } from '../store/authSlice';
import axiosInstance from '../axiosConfig/axiosConfig';

export const checkAuth = () => async (dispatch) => {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const response = await axiosInstance.post('/auth/validateMentee', null, {
        
      });

      if (response.status === 200) {
        const user = response.data.user;

        dispatch(login(user));

      } else {
        dispatch(logout()); 
      }
    } catch (error) {
      console.error('Error validating token:', error);
      
    }
  }
};
