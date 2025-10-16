// Migración de auth.js handleLogin
import axiosInstance from './axios.config';
import type { LoginCredentials, AuthResponse } from '@/types/auth.types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const params = new URLSearchParams();
    params.append('user', credentials.user);
    params.append('pwd', credentials.pwd);

    const { data } = await axiosInstance.post<AuthResponse>('/auth/login', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    return data;
  }
};