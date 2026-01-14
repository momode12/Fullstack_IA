import type { RegisterData, LoginData, ApiResponse } from '../types/Auth';
import { post } from '../types/api';

export const authService = {
  register: async (userData: RegisterData): Promise<ApiResponse> => {
    try {
      const data = await post<ApiResponse>('/auth/register', userData);
      return { success: true, data };
    } catch  {
      return { success: false, data: { message: 'Erreur de connexion au serveur' } };
    }
  },

  login: async (credentials: LoginData): Promise<ApiResponse> => {
    try {
      const data = await post<ApiResponse>('/auth/login', credentials);
      return { success: true, data };
    } catch  {
      return { success: false, data: { message: 'Erreur de connexion au serveur' } };
    }
  }
};
