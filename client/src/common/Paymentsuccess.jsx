import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import axiosInstance from "../axiosConfig/axiosConfig";
const cookies = new Cookies();

const Paymentsuccess = () => {
  const [status, setStatus] = useState('loading'); 
  
  const sessionId = cookies.get('sessionId');
  useEffect(() => {
    if (sessionId) {
      axiosInstance.post('/payment/verify', { sessionId })
        .then(response => {
          if (response.data.success) {
            setStatus('success');
            cookies.remove('sessionId');
            console.log('Payment verified and status updated!');
          } else {
            setStatus('fail');
            console.log('Payment verification failed!');
          }
        })
        .catch(err => {
          console.error(err);
          setStatus('fail');
          cookies.remove('sessionId');
        });
    } 
  }, [sessionId]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {status === 'loading' ? (
        <div className="text-gray-700">Verifying your payment...</div>
      ) : status === 'success' ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative w-96" role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> Your payment was successful.</span>
        </div>
      ) : (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative w-96" role="alert">
          <strong className="font-bold">Failed!</strong>
          <span className="block sm:inline"> Payment verification failed.</span>
        </div>
      )}
      
      <Link to="/mentee/dashboard" className="mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Continue
      </Link>
    </div>
  );
};

export default Paymentsuccess;