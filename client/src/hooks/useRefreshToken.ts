import { useEffect } from 'react';
import axios from '../api/axios';
import useAuth from './useAuth';
import { User } from '@/models/User';

const useRefreshToken = () => {
    const { setRefreshToken } = useAuth() as any;
  

    const refresh = async () => {
      try {
        const response = await axios.get('/auth/refresh', {
          withCredentials: true
        });
  
        // Ensure the user is available before updating
        setRefreshToken((prev: any) => {
            console.log(JSON.stringify(prev));
            console.log(response.data.accessToken);
            return {
                ...prev,
                accessToken: response.data.accessToken
            }
        });


      return response.data.accessToken;
  
      } catch (error) {
        console.error(error);
        throw error;
      }
    };
  
    return refresh;
  };
  

export default useRefreshToken;
