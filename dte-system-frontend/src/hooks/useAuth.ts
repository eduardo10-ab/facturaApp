import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/api/auth.api';
import { useState } from 'react';
import type { LoginCredentials } from '@/types/auth.types';
import axios from 'axios';

export const useAuth = () => {
  const { user, token, isAuthenticated, setAuth, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authApi.login(credentials);
      
      if (response.status === 'OK') {
        const { body } = response;
        setAuth(body, body.token);
        return true;
      } else {
        throw new Error(response.message || 'Error de autenticación');
      }
    } catch (err) {
      let errorMsg = 'Error de conexión';
      
      if (axios.isAxiosError(err)) {
        errorMsg = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        errorMsg = err.message;
      }
      
      setError(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout
  };
};