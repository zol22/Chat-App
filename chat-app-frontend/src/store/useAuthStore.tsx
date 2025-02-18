import { create } from 'zustand'
import { axiosInstance  } from '../lib/axios.tsx'
import { AxiosError } from 'axios';

interface AuthState {
  authUser: any; // Replace 'any' with a specific type if available
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('/auth/check');
      set({ authUser: res.data });
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error in checkAuth:', error.message);
      } else {
        console.error('Unexpected error in checkAuth:', error);
      }
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));
